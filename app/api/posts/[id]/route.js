import dbConnect from '@/lib/db';
import Post from '@/models/Post';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    await dbConnect();
    try {
        const { id } = await params;
        const post = await Post.findById(id);
        if (!post) {
            return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: post });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function PUT(request, { params }) {
    await dbConnect();
    try {
        const { id } = await params;
        const body = await request.json();
        const post = await Post.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        if (!post) {
            return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: post });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function DELETE(request, { params }) {
    await dbConnect();
    try {
        const { id } = await params;
        const post = await Post.findByIdAndDelete(id);
        if (!post) {
            return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: {} });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
