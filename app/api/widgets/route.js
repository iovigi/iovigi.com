import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Widget from '@/models/Widget';

export async function GET() {
    try {
        await dbConnect();
        const widgets = await Widget.find({}).sort({ key: 1 });
        return NextResponse.json(widgets);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch widgets' }, { status: 500 });
    }
}
