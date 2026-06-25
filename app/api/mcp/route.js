import crypto from 'crypto';
import dbConnect from '@/lib/db';
import Post from '@/models/Post';
import { verifyAuth } from '@/lib/auth';
import { NextResponse } from 'next/server';

// Persist sessions in global scope during dev hot-reloads
if (!global.mcpSessions) {
    global.mcpSessions = new Map();
}
const sessions = global.mcpSessions;

export async function OPTIONS(request) {
    const origin = request.headers.get('origin') || '*';
    return new NextResponse(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': origin,
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key, Mcp-Session-Id',
            'Access-Control-Expose-Headers': 'Mcp-Session-Id, X-Request-Id',
            'Access-Control-Max-Age': '86400'
        }
    });
}

export async function GET(request) {
    const origin = request.headers.get('origin') || '*';
    const corsHeaders = {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key, Mcp-Session-Id',
        'Access-Control-Expose-Headers': 'Mcp-Session-Id, X-Request-Id'
    };

    const auth = await verifyAuth(request);
    if (!auth) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
    }

    const sessionId = crypto.randomUUID();

    const responseStream = new ReadableStream({
        start(controller) {
            // Keep connection alive with periodic comments
            const keepAliveInterval = setInterval(() => {
                try {
                    controller.enqueue(new TextEncoder().encode(': keep-alive\n\n'));
                } catch (e) {
                    clearInterval(keepAliveInterval);
                }
            }, 30000);

            // Send the client the initial endpoint event so they know where to POST messages
            // Construct the absolute endpoint URL to avoid relative path resolution bugs in clients
            const requestUrl = new URL(request.url);
            const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || requestUrl.host;
            const proto = request.headers.get('x-forwarded-proto') || (requestUrl.protocol.startsWith('https') ? 'https' : 'http');
            
            const endpointUrl = new URL('/api/mcp', `${proto}://${host}`);
            endpointUrl.searchParams.set('sessionId', sessionId);
            
            const apiKey = request.headers.get('x-api-key') || 
                           request.headers.get('authorization')?.replace('Bearer ', '') ||
                           requestUrl.searchParams.get('apiKey');
            if (apiKey) {
                endpointUrl.searchParams.set('apiKey', apiKey);
            }

            const endpointEvent = `event: endpoint\ndata: ${endpointUrl.toString()}\n\n`;
            controller.enqueue(new TextEncoder().encode(endpointEvent));

            // Cache connection
            sessions.set(sessionId, {
                controller,
                user: auth.user,
                keepAliveInterval
            });
        },
        cancel(reason) {
            // Cleanup on client disconnect
            const session = sessions.get(sessionId);
            if (session) {
                clearInterval(session.keepAliveInterval);
                sessions.delete(sessionId);
            }
        }
    });

    return new NextResponse(responseStream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
            'X-Accel-Buffering': 'no', // Prevent buffering in IIS / Nginx proxies
            ...corsHeaders
        }
    });
}

export async function POST(request) {
    const origin = request.headers.get('origin') || '*';
    const corsHeaders = {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key, Mcp-Session-Id',
        'Access-Control-Expose-Headers': 'Mcp-Session-Id, X-Request-Id'
    };

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
        return NextResponse.json({ error: 'Missing sessionId parameter' }, { status: 400, headers: corsHeaders });
    }

    const session = sessions.get(sessionId);
    if (!session) {
        return NextResponse.json({ error: 'Session not found or expired' }, { status: 404, headers: corsHeaders });
    }

    try {
        const message = await request.json();
        
        // Execute the MCP JSON-RPC message asynchronously
        // and stream the output back to the SSE client
        await handleMcpMessage(message, session.controller, session.user);

        return new NextResponse(null, { status: 202, headers: corsHeaders }); // 202 Accepted
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
    }
}

async function handleMcpMessage(msg, controller, user) {
    if (msg.jsonrpc !== '2.0') return;

    const sendResponse = (result) => {
        controller.enqueue(new TextEncoder().encode(
            `event: message\ndata: ${JSON.stringify({ jsonrpc: '2.0', id: msg.id, result })}\n\n`
        ));
    };

    const sendError = (code, message, data = null) => {
        controller.enqueue(new TextEncoder().encode(
            `event: message\ndata: ${JSON.stringify({ jsonrpc: '2.0', id: msg.id, error: { code, message, data } })}\n\n`
        ));
    };

    if (msg.method === 'initialize') {
        sendResponse({
            protocolVersion: '2024-11-05',
            capabilities: {
                tools: {}
            },
            serverInfo: {
                name: 'iovigi-blog-mcp-sse',
                version: '1.0.0'
            }
        });
        return;
    }

    if (msg.method === 'initialized') {
        // Notification, no reply
        return;
    }

    if (msg.method === 'tools/list') {
        sendResponse({
            tools: [
                {
                    name: 'create_post',
                    description: 'Create a new blog post on iovigi.com. Supports both English and Bulgarian content.',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            title_en: { type: 'string', description: 'Title in English' },
                            title_bg: { type: 'string', description: 'Title in Bulgarian (optional)' },
                            content_en: { type: 'string', description: 'HTML or text content in English (optional)' },
                            content_bg: { type: 'string', description: 'HTML or text content in Bulgarian (optional)' },
                            excerpt_en: { type: 'string', description: 'Excerpt/summary in English (optional)' },
                            excerpt_bg: { type: 'string', description: 'Excerpt/summary in Bulgarian (optional)' },
                            slug: { type: 'string', description: 'Unique URL slug (e.g., hello-world)' },
                            image: { type: 'string', description: 'Image URL or path (optional)' },
                            isVisible_en: { type: 'boolean', description: 'Is visible in English (default: true)', default: true },
                            isVisible_bg: { type: 'boolean', description: 'Is visible in Bulgarian (default: false)', default: false },
                            scheduledAt: { type: 'string', description: 'ISO string date to schedule publication (optional)' },
                            author: { type: 'string', description: 'Author name (optional, default Admin)' }
                        },
                        required: ['title_en', 'slug']
                    }
                },
                {
                    name: 'list_posts',
                    description: 'List blog posts from the website.',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            public: { type: 'boolean', description: 'Only list public, visible posts (default: false)' }
                        }
                    }
                }
            ]
        });
        return;
    }

    if (msg.method === 'tools/call') {
        const { name, arguments: args } = msg.params || {};

        if (name === 'create_post') {
            await dbConnect();
            try {
                const body = {
                    title: { en: args.title_en, bg: args.title_bg || '' },
                    slug: args.slug,
                    content: { en: args.content_en || '', bg: args.content_bg || '' },
                    excerpt: { en: args.excerpt_en || '', bg: args.excerpt_bg || '' },
                    image: args.image || '',
                    isVisible: { en: args.isVisible_en !== false, bg: !!args.isVisible_bg },
                    scheduledAt: args.scheduledAt || null,
                    author: args.author || user.username || 'Admin'
                };

                const post = await Post.create(body);
                sendResponse({
                    content: [
                        {
                            type: 'text',
                            text: `Successfully created post "${args.title_en}"!\nSlug: ${args.slug}\nDatabase ID: ${post._id}`
                        }
                    ]
                });
            } catch (err) {
                sendResponse({
                    isError: true,
                    content: [
                        {
                            type: 'text',
                            text: `Error creating post: ${err.message}`
                        }
                    ]
                });
            }
            return;
        }

        if (name === 'list_posts') {
            await dbConnect();
            try {
                const isPublic = !!args.public;
                const schedulingFilter = isPublic
                    ? { $or: [{ scheduledAt: null }, { scheduledAt: { $lte: new Date() } }] }
                    : {};

                const posts = await Post.find(schedulingFilter).sort({ createdAt: -1 });
                const list = posts.map(p => `- ${p.title?.en || 'No title'} (slug: ${p.slug}) [ID: ${p._id}]`).join('\n');
                sendResponse({
                    content: [
                        {
                            type: 'text',
                            text: `Posts retrieved successfully:\n\n${list || 'No posts found.'}`
                        }
                    ]
                });
            } catch (err) {
                sendResponse({
                    isError: true,
                    content: [
                        {
                            type: 'text',
                            text: `Error listing posts: ${err.message}`
                        }
                    ]
                });
            }
            return;
        }

        sendError(-32601, `Method not found: ${name}`);
        return;
    }

    if (msg.id !== undefined) {
        sendError(-32601, `Method not found: ${msg.method}`);
    }
}
