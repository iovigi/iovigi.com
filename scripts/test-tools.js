const url = 'https://iovigi.com/api/mcp?apiKey=iov_aff99919835c31e8622b7c5796835399018349056818a1d4';

async function run() {
    try {
        console.log('1. Connecting to SSE GET endpoint:', url);
        const res = await fetch(url, { headers: { 'Accept': 'text/event-stream' } });
        if (res.status !== 200) {
            console.error('Failed to connect:', res.status, res.statusText);
            process.exit(1);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let endpointUrl = '';

        // Helper to read SSE events
        const readSSE = async () => {
            const { value, done } = await reader.read();
            if (done) return null;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n\n');
            buffer = lines.pop(); // Keep incomplete event in buffer
            const events = [];
            for (const line of lines) {
                if (!line.trim()) continue;
                const event = {};
                for (const part of line.split('\n')) {
                    if (part.startsWith('event: ')) {
                        event.event = part.substring(7).trim();
                    } else if (part.startsWith('data: ')) {
                        event.data = part.substring(6).trim();
                    }
                }
                events.push(event);
            }
            return events;
        };

        // 2. Read the initial endpoint event
        console.log('2. Waiting for "endpoint" event...');
        const initialEvents = await readSSE();
        console.log('Received events:', initialEvents);
        const endpointEvent = initialEvents.find(e => e.event === 'endpoint');
        if (!endpointEvent) {
            console.error('No endpoint event received.');
            process.exit(1);
        }
        endpointUrl = endpointEvent.data;
        console.log('Endpoint POST URL is:', endpointUrl);

        // Start listening to the SSE stream in background
        let initResponseReceived = false;
        let toolsResponseReceived = false;

        const sseListener = async () => {
            try {
                while (true) {
                    const events = await readSSE();
                    if (!events) break;
                    for (const e of events) {
                        console.log(`SSE Stream Event: [${e.event}] - Data:`, e.data);
                        if (e.data.includes('"result"') || e.data.includes('"error"')) {
                            const payload = JSON.parse(e.data);
                            if (payload.id === 1) {
                                initResponseReceived = true;
                                console.log('--> Initialize Response:', JSON.stringify(payload, null, 2));
                            } else if (payload.id === 2) {
                                toolsResponseReceived = true;
                                console.log('--> Tools List Response:', JSON.stringify(payload, null, 2));
                            }
                        }
                    }
                }
            } catch (err) {
                console.error('SSE listener error:', err);
            }
        };
        sseListener();

        // 3. Send initialize message
        console.log('3. Sending "initialize" JSON-RPC to POST endpoint...');
        const initRes = await fetch(endpointUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 1,
                method: 'initialize',
                params: {
                    protocolVersion: '2024-11-05',
                    capabilities: {},
                    clientInfo: { name: 'test-client', version: '1.0.0' }
                }
            })
        });
        console.log('Initialize POST response status:', initRes.status, initRes.statusText);

        // Wait a bit
        await new Promise(r => setTimeout(r, 2000));

        // 4. Send tools/list message
        console.log('4. Sending "tools/list" JSON-RPC to POST endpoint...');
        const toolsRes = await fetch(endpointUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 2,
                method: 'tools/list'
            })
        });
        console.log('Tools/list POST response status:', toolsRes.status, toolsRes.statusText);

        // Wait for response to be printed
        await new Promise(r => setTimeout(r, 3000));
        
        console.log('Done.');
        process.exit(0);
    } catch (e) {
        console.error('Error:', e);
        process.exit(1);
    }
}

run();
