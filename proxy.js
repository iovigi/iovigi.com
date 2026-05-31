import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function proxy(request) {
    const { pathname } = request.nextUrl;
    const { method } = request;

    // Check if the path starts with /admin
    if (pathname.startsWith('/admin')) {
        // Exclude /admin/login and static assets or API routes if needed (though API auth is usually handled differently, here we protect Admin pages)
        if (pathname === '/admin/login' || pathname.startsWith('/admin/dist') || pathname.startsWith('/admin/plugins')) {
            return NextResponse.next();
        }

        const token = request.cookies.get('admin_token')?.value;

        if (!token) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET);
            await jwtVerify(token, secret);
            return NextResponse.next();
        } catch (error) {
            // Token invalid or expired
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    // Check if the path starts with /api
    if (pathname.startsWith('/api')) {
        // Exclude public API endpoints
        if (pathname === '/api/auth/login') {
            return NextResponse.next();
        }
        // Allow public comment submissions
        if (pathname === '/api/comments' && method === 'POST') {
            return NextResponse.next();
        }
        // Allow public read actions
        if (method === 'GET') {
            return NextResponse.next();
        }

        const token = request.cookies.get('admin_token')?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized: Missing admin token' },
                { status: 401 }
            );
        }

        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET);
            await jwtVerify(token, secret);
            return NextResponse.next();
        } catch (error) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized: Invalid admin token' },
                { status: 401 }
            );
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/api/:path*'],
};
