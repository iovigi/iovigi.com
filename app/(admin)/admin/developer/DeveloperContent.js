'use client';

import { useState, useEffect, useRef } from 'react';
import Script from 'next/script';

export default function DeveloperContent({ projectPath }) {
    const [apiKey, setApiKey] = useState(null);
    const [showKey, setShowKey] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [swaggerLoaded, setSwaggerLoaded] = useState(false);
    const isSwaggerInit = useRef(false);
    
    // Get host URL dynamically in browser
    const [hostUrl, setHostUrl] = useState('http://localhost:3000');
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setHostUrl(window.location.origin);
        }
    }, []);

    // Load initial API key
    useEffect(() => {
        const fetchApiKey = async () => {
            try {
                const res = await fetch('/api/auth/apikey');
                if (res.ok) {
                    const data = await res.json();
                    if (data.success && data.apiKey) {
                        setApiKey(data.apiKey);
                    }
                }
            } catch (err) {
                console.error('Failed to load API key:', err);
            }
        };
        fetchApiKey();
    }, []);

    // Load Swagger UI from CDN client-side
    useEffect(() => {
        if (swaggerLoaded && !isSwaggerInit.current) {
            isSwaggerInit.current = true;
            
            // Inject Swagger CSS
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = 'https://unpkg.com/swagger-ui-dist@5.18.2/swagger-ui.css';
            document.head.appendChild(link);

            // Wait brief moment for the unpkg script to be ready
            const initSwagger = () => {
                if (window.SwaggerUIBundle) {
                    window.SwaggerUIBundle({
                        url: '/api/openapi.json',
                        dom_id: '#swagger-ui',
                        deepLinking: true,
                        presets: [
                            window.SwaggerUIBundle.presets.apis,
                            window.SwaggerUIBundle.SwaggerUIStandalonePreset
                        ],
                        layout: "BaseLayout",
                        configs: {
                            preAuthorizeApiKey: {
                                ApiKeyAuth: apiKey || ''
                            }
                        }
                    });
                } else {
                    setTimeout(initSwagger, 100);
                }
            };
            initSwagger();
        }
    }, [swaggerLoaded, apiKey]);

    const handleGenerateKey = async () => {
        if (apiKey && !confirm('Are you sure you want to regenerate your API Key? Any application currently using the old key will lose access immediately.\n\nСигурни ли сте, че искате да прегенерирате API ключа? Всички приложения, използващи стария ключ, ще загубят достъп веднага.')) {
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const res = await fetch('/api/auth/apikey', {
                method: 'POST',
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data.error || 'Failed to generate API Key');
            }
            setApiKey(data.apiKey);
            setShowKey(true);
            setSuccess('API Key generated successfully! / API ключът е генериран успешно!');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text, type) => {
        navigator.clipboard.writeText(text);
        alert(`${type} copied to clipboard! / ${type} е копиран в клипборда!`);
    };

    const sseMcpUrl = `${hostUrl}/api/mcp?apiKey=${apiKey || 'YOUR_API_KEY_HERE'}`;

    // Construct Claude Desktop config snippet using SSE
    const mcpConfigJson = JSON.stringify({
        mcpServers: {
            "iovigi-blog": {
                "url": sseMcpUrl
            }
        }
    }, null, 2);

    return (
        <div className="row">
            {/* Load Swagger bundle script via Next.js Script */}
            <Script 
                src="https://unpkg.com/swagger-ui-dist@5.18.2/swagger-ui-bundle.js" 
                strategy="afterInteractive"
                onLoad={() => setSwaggerLoaded(true)}
            />

            <div className="col-md-12">
                {/* 1. API Key Card */}
                <div className="card card-primary card-outline shadow-sm mb-4">
                    <div className="card-header d-flex align-items-center">
                        <h3 className="card-title mb-0">
                            <i className="fas fa-key mr-2 text-primary"></i>
                            API Key Authentication / API ключ за удостоверяване
                        </h3>
                    </div>
                    <div className="card-body">
                        {error && <div className="alert alert-danger">{error}</div>}
                        {success && <div className="alert alert-success">{success}</div>}

                        <p className="text-muted">
                            <strong>EN:</strong> Use this API key to authorize third-party services and integrations (like the MCP server) to write to your blog. Keep this key secret!
                            <br />
                            <strong>BG:</strong> Използвайте този API ключ за оторизиране на външни услуги и интеграции (като MCP сървъра), които добавят съдържание в блога. Пазете този ключ в тайна!
                        </p>

                        <div className="form-group mt-3">
                            <label className="text-secondary font-weight-bold">Active API Key / Активен API ключ</label>
                            {apiKey ? (
                                <div className="input-group">
                                    <input
                                        type={showKey ? "text" : "password"}
                                        className="form-control"
                                        value={apiKey}
                                        readOnly
                                        style={{ fontFamily: 'monospace', letterSpacing: showKey ? 'normal' : '0.2em' }}
                                    />
                                    <div className="input-group-append">
                                        <button 
                                            className="btn btn-outline-secondary" 
                                            type="button" 
                                            onClick={() => setShowKey(!showKey)}
                                            title={showKey ? "Hide / Скрий" : "Show / Покажи"}
                                        >
                                            <i className={showKey ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                                        </button>
                                        <button 
                                            className="btn btn-outline-primary" 
                                            type="button" 
                                            onClick={() => copyToClipboard(apiKey, 'API Key')}
                                            title="Copy / Копирай"
                                        >
                                            <i className="fas fa-copy"></i> Copy
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-3 bg-light rounded text-center border border-warning">
                                    <i className="fas fa-exclamation-triangle text-warning mr-2"></i>
                                    No API key generated yet. Generate one below to begin.
                                    <br />
                                    <small className="text-muted">Все още нямате генериран API ключ. Генерирайте от бутона по-долу.</small>
                                </div>
                            )}
                        </div>

                        <div className="mt-3">
                            <button 
                                className={`btn ${apiKey ? 'btn-danger' : 'btn-success'}`}
                                onClick={handleGenerateKey}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin mr-1"></i> Generating...
                                    </>
                                ) : (
                                    <>
                                        <i className={`fas ${apiKey ? 'fas-sync-alt' : 'fas-plus'} mr-1`}></i>
                                        {apiKey ? 'Regenerate API Key / Прегенерирай API ключ' : 'Generate API Key / Генерирай API ключ'}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* 2. MCP Integration Card */}
                <div className="card card-info card-outline shadow-sm mb-4">
                    <div className="card-header">
                        <h3 className="card-title">
                            <i className="fas fa-robot mr-2 text-info"></i>
                            Model Context Protocol (MCP) Integration / Интеграция с MCP
                        </h3>
                    </div>
                    <div className="card-body">
                        <p className="text-muted">
                            <strong>EN:</strong> This website runs a live, web-hosted MCP server using Server-Sent Events (SSE). 
                            You can connect both the **web version** of Claude (claude.ai) and the **desktop version** of Claude to this server.
                            <br />
                            <strong>BG:</strong> Този сайт поддържа уеб-базиран MCP сървър в реално време, работещ през Server-Sent Events (SSE). 
                            Можете да свържете както **уеб версията** на Claude (claude.ai), така и **десктоп версията** на Claude към този сървър.
                        </p>

                        <hr />

                        {/* Claude.ai Web Version Instructions */}
                        <h5 className="font-weight-bold text-dark"><i className="fas fa-globe text-primary mr-2"></i> 1. Connecting Claude Web Version (claude.ai)</h5>
                        <p className="text-muted">
                            Claude.ai supports connecting to remote SSE MCP servers:
                        </p>
                        <ol className="pl-4 text-muted">
                            <li>Open **Claude.ai** in your browser and go to your **Settings** or your active **Project Settings**.</li>
                            <li>Navigate to the **MCP Servers** or **Developer** section.</li>
                            <li>Click **Add MCP Server** (Choose **SSE** transport type).</li>
                            <li>Enter the following details:
                                <ul>
                                    <li><strong>Name / Име:</strong> <code className="bg-light px-1 rounded">iovigi-blog</code></li>
                                    <li><strong>SSE Connection URL / SSE Адрес:</strong> 
                                        <div className="input-group mt-1" style={{ maxWidth: '600px' }}>
                                            <input type="text" className="form-control form-control-sm font-weight-bold bg-light" value={sseMcpUrl} readOnly />
                                            <div className="input-group-append">
                                                <button className="btn btn-sm btn-primary" type="button" onClick={() => copyToClipboard(sseMcpUrl, 'SSE Connection URL')}>Copy</button>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </li>
                        </ol>

                        <hr />

                        {/* Claude Desktop Instructions */}
                        <h5 className="font-weight-bold text-dark"><i className="fas fa-desktop text-primary mr-2"></i> 2. Connecting Claude Desktop App</h5>
                        <p className="text-muted">
                            Add the following JSON configuration snippet to your Claude Desktop config file:
                        </p>
                        <ul>
                            <li>
                                <strong>Windows Configuration File:</strong><br />
                                <code className="bg-light px-2 py-1 rounded" style={{ fontSize: '0.85rem' }}>
                                    %APPDATA%\Claude\claude_desktop_config.json
                                </code>
                            </li>
                            <li className="mt-2">
                                <strong>macOS Configuration File:</strong><br />
                                <code className="bg-light px-2 py-1 rounded" style={{ fontSize: '0.85rem' }}>
                                    ~/Library/Application Support/Claude/claude_desktop_config.json
                                </code>
                            </li>
                        </ul>

                        <div className="form-group mt-3">
                            <label className="text-secondary font-weight-bold">Copy JSON Config for Claude Desktop</label>
                            <div className="position-relative">
                                <pre className="bg-dark text-light p-3 rounded" style={{ fontSize: '13px', overflowX: 'auto', fontFamily: 'monospace' }}>
                                    {mcpConfigJson}
                                </pre>
                                <button
                                    className="btn btn-sm btn-outline-light position-absolute"
                                    style={{ top: '10px', right: '10px' }}
                                    onClick={() => copyToClipboard(mcpConfigJson, 'Claude configuration')}
                                >
                                    <i className="fas fa-copy mr-1"></i> Copy Config
                                </button>
                            </div>
                        </div>

                        <div className="alert alert-info bg-light border-info mt-3">
                            <h5><i className="icon fas fa-info-circle text-info"></i> How to use / Как се използва:</h5>
                            <p className="mb-0">
                                Once connected, Claude will automatically gain access to tools to create and check posts on your blog. 
                                Simply ask Claude: <br />
                                <em>"Слушай, провери публикациите в блога ми и напиши нов пост за предимствата на MCP сървърите."</em>
                            </p>
                        </div>
                    </div>
                </div>

                {/* 3. Swagger UI Card */}
                <div className="card card-dark card-outline shadow-sm mb-4">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h3 className="card-title mb-0">
                            <i className="fas fa-book mr-2 text-warning"></i>
                            Interactive API Reference (Swagger) / Интерактивна документация
                        </h3>
                        {apiKey && (
                            <small className="text-success font-weight-bold float-right">
                                <i className="fas fa-check-circle mr-1"></i> API Key auto-auth ready / Автоматично удостоверен
                            </small>
                        )}
                    </div>
                    <div className="card-body p-0 bg-light">
                        <div className="p-3 border-bottom bg-white text-muted">
                            <strong>EN:</strong> You can test the API endpoints below directly from your browser. Click <strong>"Try it out"</strong> on any endpoint, enter the payload and execute.
                            <br />
                            <strong>BG:</strong> Можете да тествате API методите директно от браузъра си. Натиснете <strong>"Try it out"</strong>, въведете данните и изпълнете заявката.
                        </div>
                        <div id="swagger-ui" style={{ minHeight: '500px' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
