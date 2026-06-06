import dbConnect from '@/lib/db';
import Setting from '@/models/Setting';
import { NextResponse } from 'next/server';

export async function GET(request) {
    await dbConnect();
    try {
        const settings = await Setting.find({});
        const settingsObj = {};
        settings.forEach(s => {
            settingsObj[s.key] = s.value;
        });
        return NextResponse.json({ success: true, data: settingsObj });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function POST(request) {
    await dbConnect();
    try {
        const body = await request.json();
        
        for (const [key, value] of Object.entries(body)) {
            await Setting.findOneAndUpdate(
                { key },
                { key, value: value !== undefined && value !== null ? String(value) : '' },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
        }
        
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

// Support PUT as well for consistency
export async function PUT(request) {
    return POST(request);
}
