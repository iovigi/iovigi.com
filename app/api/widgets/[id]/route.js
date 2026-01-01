import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Widget from '@/models/Widget';

export async function GET(request, { params }) {
    try {
        const { id } = await params;
        await dbConnect();
        const widget = await Widget.findById(id);
        if (!widget) {
            return NextResponse.json({ error: 'Widget not found' }, { status: 404 });
        }
        return NextResponse.json(widget);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch widget' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const body = await request.json();
        await dbConnect();

        const widget = await Widget.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        if (!widget) {
            return NextResponse.json({ error: 'Widget not found' }, { status: 404 });
        }

        return NextResponse.json(widget);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update widget' }, { status: 500 });
    }
}
