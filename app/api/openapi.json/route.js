import { NextResponse } from 'next/server';

export async function GET() {
    const openapiSpec = {
        openapi: "3.0.0",
        info: {
            title: "iovigi.com Blog API",
            description: "API for managing blog posts on iovigi.com. Authorize using your X-API-Key.",
            version: "1.0.0"
        },
        servers: [
            {
                url: "/api",
                description: "Local server"
            }
        ],
        components: {
            securitySchemes: {
                ApiKeyAuth: {
                    type: "apiKey",
                    in: "header",
                    name: "x-api-key"
                }
            },
            schemas: {
                LocalizedField: {
                    type: "object",
                    properties: {
                        en: { type: "string" },
                        bg: { type: "string" }
                    },
                    required: ["en"]
                },
                LocalizedBoolean: {
                    type: "object",
                    properties: {
                        en: { type: "boolean", default: true },
                        bg: { type: "boolean", default: false }
                    }
                },
                PostInput: {
                    type: "object",
                    required: ["title", "slug"],
                    properties: {
                        title: { $ref: "#/components/schemas/LocalizedField" },
                        slug: { type: "string", example: "my-first-post" },
                        content: { $ref: "#/components/schemas/LocalizedField" },
                        excerpt: { $ref: "#/components/schemas/LocalizedField" },
                        image: { type: "string", example: "/uploads/my-image.jpg" },
                        isVisible: { $ref: "#/components/schemas/LocalizedBoolean" },
                        scheduledAt: { type: "string", format: "date-time", nullable: true, example: "2026-07-25T16:00:00.000Z" },
                        author: { type: "string", default: "Admin" }
                    }
                },
                PostResponse: {
                    type: "object",
                    properties: {
                        success: { type: "boolean" },
                        data: {
                            type: "object",
                            properties: {
                                _id: { type: "string" },
                                title: { $ref: "#/components/schemas/LocalizedField" },
                                slug: { type: "string" },
                                content: { $ref: "#/components/schemas/LocalizedField" },
                                excerpt: { $ref: "#/components/schemas/LocalizedField" },
                                image: { type: "string" },
                                isVisible: { $ref: "#/components/schemas/LocalizedBoolean" },
                                scheduledAt: { type: "string", format: "date-time", nullable: true },
                                author: { type: "string" },
                                createdAt: { type: "string", format: "date-time" },
                                updatedAt: { type: "string", format: "date-time" }
                            }
                        }
                    }
                }
            }
        },
        security: [
            {
                ApiKeyAuth: []
            }
        ],
        paths: {
            "/mcp": {
                "get": {
                    "summary": "Initiate SSE stream for MCP",
                    "description": "Establish a persistent connection for Model Context Protocol. Provide 'apiKey' as query parameter or 'X-API-Key' in headers.",
                    "parameters": [
                        {
                            "name": "apiKey",
                            "in": "query",
                            "required": false,
                            "schema": { "type": "string" },
                            "description": "API Key authentication"
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "Established SSE Event Stream"
                        },
                        "401": {
                            "description": "Unauthorized"
                        }
                    }
                },
                "post": {
                    "summary": "Send JSON-RPC message to MCP session",
                    "description": "Send tool listings or tool execution commands for a running session.",
                    "parameters": [
                        {
                            "name": "sessionId",
                            "in": "query",
                            "required": true,
                            "schema": { "type": "string" },
                            "description": "The active SSE session UUID"
                        }
                    ],
                    "requestBody": {
                        "required": true,
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "jsonrpc": { "type": "string", "example": "2.0" },
                                        "id": { "type": "integer", "example": 1 },
                                        "method": { "type": "string", "example": "tools/list" },
                                        "params": { "type": "object" }
                                    }
                                }
                            }
                        }
                    },
                    "responses": {
                        "200": {
                            "description": "Message accepted and processed"
                        },
                        "400": {
                            "description": "Missing session ID"
                        },
                        "404": {
                            "description": "Session not found"
                        }
                    }
                }
            },
            "/posts": {
                "get": {
                    "summary": "Retrieve all posts",
                    "description": "Returns a list of blog posts. Public endpoints don't strictly require API key, but it's supported.",
                    "parameters": [
                        {
                            "name": "slug",
                            "in": "query",
                            "required": false,
                            "schema": { "type": "string" },
                            "description": "Filter by slug"
                        },
                        {
                            "name": "public",
                            "in": "query",
                            "required": false,
                            "schema": { "type": "boolean" },
                            "description": "If true, returns only published and currently visible posts (skips scheduled in future)"
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "Success",
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "type": "object",
                                        "properties": {
                                            "success": { "type": "boolean" },
                                            "data": {
                                                "type": "array",
                                                "items": { $ref: "#/components/schemas/PostResponse/properties/data" }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                "post": {
                    "summary": "Create a new post",
                    "description": "Creates a new blog post. Requires X-API-Key header authentication.",
                    "requestBody": {
                        "required": true,
                        "content": {
                            "application/json": {
                                "schema": { "$ref": "#/components/schemas/PostInput" }
                            }
                        }
                    },
                    "responses": {
                        "201": {
                            "description": "Post created successfully",
                            "content": {
                                "application/json": {
                                    "schema": { "$ref": "#/components/schemas/PostResponse" }
                                }
                            }
                        },
                        "400": {
                            "description": "Validation or duplicate key error"
                        },
                        "401": {
                            "description": "Unauthorized (missing or invalid API key)"
                        }
                    }
                }
            },
            "/posts/{id}": {
                "get": {
                    "summary": "Get post details by ID",
                    "parameters": [
                        {
                            "name": "id",
                            "in": "path",
                            "required": true,
                            "schema": { "type": "string" }
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "Success",
                            "content": {
                                "application/json": {
                                    "schema": { "$ref": "#/components/schemas/PostResponse" }
                                }
                            }
                        },
                        "404": {
                            "description": "Post not found"
                        }
                    }
                },
                "put": {
                    "summary": "Update a post",
                    "parameters": [
                        {
                            "name": "id",
                            "in": "path",
                            "required": true,
                            "schema": { "type": "string" }
                        }
                    ],
                    "requestBody": {
                        "required": true,
                        "content": {
                            "application/json": {
                                "schema": { "$ref": "#/components/schemas/PostInput" }
                            }
                        }
                    },
                    "responses": {
                        "200": {
                            "description": "Post updated successfully",
                            "content": {
                                "application/json": {
                                    "schema": { "$ref": "#/components/schemas/PostResponse" }
                                }
                            }
                        },
                        "401": {
                            "description": "Unauthorized"
                        },
                        "404": {
                            "description": "Post not found"
                        }
                    }
                },
                "delete": {
                    "summary": "Delete a post",
                    "parameters": [
                        {
                            "name": "id",
                            "in": "path",
                            "required": true,
                            "schema": { "type": "string" }
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "Post deleted successfully"
                        },
                        "401": {
                            "description": "Unauthorized"
                        },
                        "404": {
                            "description": "Post not found"
                        }
                    }
                }
            }
        }
    };

    return NextResponse.json(openapiSpec);
}
