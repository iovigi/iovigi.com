import dbConnect from '@/lib/db';
import Page from '@/models/Page';
import { NextResponse } from 'next/server';

export async function GET() {
    await dbConnect();
    try {
        const pages = await Page.find({}).sort({ sortOrder: 1 });
        return NextResponse.json({ success: true, data: pages });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function POST(request) {
    await dbConnect();
    try {
        const body = await request.json();
        const page = await Page.create(body);
        return NextResponse.json({ success: true, data: page }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
