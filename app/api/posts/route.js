import dbConnect from '@/lib/db';
import Post from '@/models/Post';
import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';

export async function GET(request) {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const isPublic = searchParams.get('public') === 'true';

    // Filter applied when fetching posts for the public front-end:
    // only include posts whose scheduledAt is null or has already passed.
    const schedulingFilter = isPublic
        ? { $or: [{ scheduledAt: null }, { scheduledAt: { $lte: new Date() } }] }
        : {};

    try {
        if (slug) {
            const post = await Post.findOne({ slug, ...schedulingFilter });
            if (!post) {
                return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
            }
            return NextResponse.json({ success: true, data: post });
        }

        const posts = await Post.find(schedulingFilter).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: posts });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function POST(request) {
    const auth = await verifyAuth(request);
    if (!auth) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    try {
        const body = await request.json();
        const post = await Post.create(body);
        return NextResponse.json({ success: true, data: post }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

