import crypto from 'crypto';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { jwtVerify } from 'jose';
import { NextResponse } from 'next/server';

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

export async function GET(request) {
    await dbConnect();
    const token = request.cookies.get('admin_token')?.value;
    if (!token) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        const userId = normalizeId(payload.id);
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, apiKey: user.apiKey || null });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    await dbConnect();
    const token = request.cookies.get('admin_token')?.value;
    if (!token) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        
        // Generate secure API key starting with 'iov_'
        const newApiKey = 'iov_' + crypto.randomBytes(24).toString('hex');
        
        const userId = normalizeId(payload.id);
        const user = await User.findByIdAndUpdate(userId, { apiKey: newApiKey }, { new: true });
        if (!user) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, apiKey: newApiKey });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
