import dbConnect from '@/lib/db';
import Page from '@/models/Page';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    await dbConnect();
    try {
        const { id } = await params;
        const page = await Page.findById(id);
        if (!page) {
            return NextResponse.json({ success: false, error: 'Page not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: page });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function PUT(request, { params }) {
    await dbConnect();
    try {
        const { id } = await params;
        const body = await request.json();
        const page = await Page.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        if (!page) {
            return NextResponse.json({ success: false, error: 'Page not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: page });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function DELETE(request, { params }) {
    await dbConnect();
    try {
        const { id } = await params;
        const page = await Page.findByIdAndDelete(id);
        if (!page) {
            return NextResponse.json({ success: false, error: 'Page not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: {} });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
