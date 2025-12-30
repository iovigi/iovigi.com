import dbConnect from '@/lib/db';
import Post from '@/models/Post';
import { NextResponse } from 'next/server';

export async function GET(request) {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    try {
        if (slug) {
            const post = await Post.findOne({ slug });
            if (!post) {
                return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
            }
            return NextResponse.json({ success: true, data: post });
        }

        const posts = await Post.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: posts });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function POST(request) {
    await dbConnect();
    try {
        const body = await request.json();
        const post = await Post.create(body);
        return NextResponse.json({ success: true, data: post }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
