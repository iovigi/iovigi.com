import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function proxy(request) {
    const { pathname } = request.nextUrl;

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

    return NextResponse.next();
}

export const config = {
    matcher: '/admin/:path*',
};
