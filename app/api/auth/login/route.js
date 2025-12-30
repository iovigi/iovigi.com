import { SignJWT } from 'jose';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request) {
    try {
        await dbConnect();

        const { username, password } = await request.json();

        // 1. Find user in DB
        const user = await User.findOne({ username });
        if (!user) {
            return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
        }

        // 2. Compare password hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
        }

        // 3. Issue Token
        const jwtSecret = process.env.JWT_SECRET;
        const secret = new TextEncoder().encode(jwtSecret);
        const token = await new SignJWT({ username: user.username, id: user._id })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('24h')
            .sign(secret);

        const response = NextResponse.json({ success: true });

        response.cookies.set('admin_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60 * 24, // 24 hours
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
