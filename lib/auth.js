import { jwtVerify } from 'jose';
import dbConnect from '@/lib/db';
import User from '@/models/User';

/**
 * Verifies whether a request is authenticated, checking first for
 * an API key (header: x-api-key or Authorization: Bearer <key>) and
 * falling back to the admin_token cookie.
 * 
 * Returns the authenticated user object and authentication method, or null.
 */
function normalizeId(id) {
    if (!id) return id;
    if (typeof id === 'string') return id;
    if (typeof id === 'object') {
        if (id.buffer) {
            const data = id.buffer.data || Object.values(id.buffer);
            return Buffer.from(data).toString('hex');
        }
        return id.toString();
    }
    return id;
}

export async function verifyAuth(request) {
    try {
        // 1. Check for API key in headers or query parameters
        const { searchParams } = new URL(request.url);
        const apiKey = request.headers.get('x-api-key') || 
                       request.headers.get('authorization')?.replace('Bearer ', '') ||
                       searchParams.get('apiKey');
        if (apiKey) {
            await dbConnect();
            const user = await User.findOne({ apiKey });
            if (user) {
                return { user, method: 'apikey' };
            }
            return null;
        }

        // 2. Check for admin token cookie
        const token = request.cookies.get('admin_token')?.value;
        if (token) {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET);
            const { payload } = await jwtVerify(token, secret);
            
            await dbConnect();
            const userId = normalizeId(payload.id);
            const user = await User.findById(userId);
            if (user) {
                return { user, method: 'token' };
            }
        }
    } catch (error) {
        console.error('Auth verification helper error:', error);
    }
    
    return null;
}
