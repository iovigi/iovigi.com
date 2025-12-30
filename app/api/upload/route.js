import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ error: 'No file received.' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = Date.now() + '_' + file.name.replace(/\s/g, '_');

        // Save to public/uploads
        // Note: In production you might want to use S3 or similar, but local fs works for this request
        const relativePath = '/uploads/' + filename;
        const uploadDir = join(process.cwd(), 'public', 'uploads');
        // Ensure directory exists (basic check, though 'write_to_file' tool handles this if I used it, but here it is runtime code)
        // We'll rely on the directory being created or existing. 'public/uploads' is standard.
        // Actually, to be safe, I should ensure the directory exists in the code or manually create it. 
        // I will add a check in the code:
        const fs = require('fs');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const path = join(uploadDir, filename);
        await writeFile(path, buffer);

        return NextResponse.json({ success: true, url: relativePath });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Upload failed.' }, { status: 500 });
    }
}
