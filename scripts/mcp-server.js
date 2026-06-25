#!/usr/bin/env node

/**
 * Model Context Protocol (MCP) STDIO Server for iovigi.com
 * Implements standard JSON-RPC 2.0 messages to expose tools to LLM assistants.
 * 
 * Configured via environment variables:
 * - IOVIGI_API_KEY: The API key generated in the admin panel.
 * - IOVIGI_API_URL: The URL of the Next.js API (e.g. http://localhost:3000/api).
 */

const readline = require('readline');

const API_KEY = process.env.IOVIGI_API_KEY;
const API_URL = process.env.IOVIGI_API_URL || 'http://localhost:3000/api';

if (!API_KEY) {
    console.error('Error: IOVIGI_API_KEY environment variable is required.');
    process.exit(1);
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

function sendResponse(id, result) {
    console.log(JSON.stringify({
        jsonrpc: '2.0',
        id,
        result
    }));
}

function sendError(id, code, message, data = null) {
    console.log(JSON.stringify({
        jsonrpc: '2.0',
        id,
        error: {
            code,
            message,
            data
        }
    }));
}

rl.on('line', async (line) => {
    try {
        const msg = JSON.parse(line);
        if (msg.jsonrpc !== '2.0') return;

        if (msg.method === 'initialize') {
            sendResponse(msg.id, {
                protocolVersion: '2024-11-05',
                capabilities: {
                    tools: {}
                },
                serverInfo: {
                    name: 'iovigi-blog-mcp',
                    version: '1.0.0'
                }
            });
        } else if (msg.method === 'initialized') {
            // Initialization notification, no reply required
        } else if (msg.method === 'tools/list') {
            sendResponse(msg.id, {
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
        } else if (msg.method === 'tools/call') {
            const { name, arguments: args } = msg.params || {};
            
            if (name === 'create_post') {
                const body = {
                    title: { en: args.title_en, bg: args.title_bg || '' },
                    slug: args.slug,
                    content: { en: args.content_en || '', bg: args.content_bg || '' },
                    excerpt: { en: args.excerpt_en || '', bg: args.excerpt_bg || '' },
                    image: args.image || '',
                    isVisible: { en: args.isVisible_en !== false, bg: !!args.isVisible_bg },
                    scheduledAt: args.scheduledAt || '',
                    author: args.author || 'Admin'
                };

                try {
                    const response = await fetch(`${API_URL}/posts`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-API-Key': API_KEY
                        },
                        body: JSON.stringify(body)
                    });

                    const data = await response.json();
                    if (response.ok && data.success) {
                        sendResponse(msg.id, {
                            content: [
                                {
                                    type: 'text',
                                    text: `Successfully created post "${args.title_en}"!\nSlug: ${args.slug}\nDatabase ID: ${data.data._id}`
                                }
                            ]
                        });
                    } else {
                        sendResponse(msg.id, {
                            isError: true,
                            content: [
                                {
                                    type: 'text',
                                    text: `Error creating post: ${data.error || response.statusText}`
                                }
                            ]
                        });
                    }
                } catch (err) {
                    sendResponse(msg.id, {
                        isError: true,
                        content: [
                            {
                                type: 'text',
                                text: `Failed to make request to API: ${err.message}`
                            }
                        ]
                    });
                }
            } else if (name === 'list_posts') {
                try {
                    const isPublic = !!args.public;
                    const response = await fetch(`${API_URL}/posts?public=${isPublic}`, {
                        headers: {
                            'X-API-Key': API_KEY
                        }
                    });
                    const data = await response.json();
                    if (response.ok && data.success) {
                        const list = data.data.map(p => `- ${p.title?.en || 'No title'} (slug: ${p.slug}) [ID: ${p._id}]`).join('\n');
                        sendResponse(msg.id, {
                            content: [
                                {
                                    type: 'text',
                                    text: `Posts retrieved successfully:\n\n${list || 'No posts found.'}`
                                }
                            ]
                        });
                    } else {
                        sendResponse(msg.id, {
                            isError: true,
                            content: [
                                {
                                    type: 'text',
                                    text: `Error listing posts: ${data.error || response.statusText}`
                                }
                            ]
                        });
                    }
                } catch (err) {
                    sendResponse(msg.id, {
                        isError: true,
                        content: [
                            {
                                type: 'text',
                                text: `Failed to make request to API: ${err.message}`
                            }
                        ]
                    });
                }
            } else {
                sendError(msg.id, -32601, `Method not found: ${name}`);
            }
        } else {
            if (msg.id !== undefined) {
                sendError(msg.id, -32601, `Method not found: ${msg.method}`);
            }
        }
    } catch (e) {
        // Parse errors are ignored or logged silently
    }
});
