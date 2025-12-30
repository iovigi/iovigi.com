import dbConnect from '@/lib/db';
import Comment from '@/models/Comment';
import { NextResponse } from 'next/server';

export async function GET(request) {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    try {
        const query = postId ? { post: postId } : {};
        const comments = await Comment.find(query).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: comments });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function POST(request) {
    await dbConnect();
    try {
        const body = await request.json();
        const comment = await Comment.create(body);
        return NextResponse.json({ success: true, data: comment }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
