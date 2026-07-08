import dbConnect from '@/lib/db';
import Post from '@/models/Post';
import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';

export async function GET(request) {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const isPublic = searchParams.get('public') === 'true';
    const locale = searchParams.get('locale') || 'en';
    const page = parseInt(searchParams.get('page') || '0', 10);
    const limit = parseInt(searchParams.get('limit') || '0', 10);

    try {
        if (slug) {
            const schedulingFilter = isPublic
                ? { $or: [{ scheduledAt: null }, { scheduledAt: { $lte: new Date() } }] }
                : {};
            const post = await Post.findOne({ slug, ...schedulingFilter });
            if (!post) {
                return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
            }
            return NextResponse.json({ success: true, data: post });
        }

        let query = {};
        if (isPublic) {
            const now = new Date();
            if (locale === 'bg') {
                query = {
                    $and: [
                        { $or: [{ scheduledAt: null }, { scheduledAt: { $lte: now } }] },
                        { 'isVisible.bg': true }
                    ]
                };
            } else {
                query = {
                    $and: [
                        { $or: [{ scheduledAt: null }, { scheduledAt: { $lte: now } }] },
                        {
                            $or: [
                                { 'isVisible.en': true },
                                { 'isVisible.en': { $exists: false } },
                                { isVisible: { $exists: false } }
                            ]
                        }
                    ]
                };
            }
        }

        let dbQuery = Post.find(query).sort({ createdAt: -1 });

        if (page > 0 && limit > 0) {
            const skip = (page - 1) * limit;
            dbQuery = dbQuery.skip(skip).limit(limit);
        }

        const posts = await dbQuery;

        let hasMore = false;
        if (page > 0 && limit > 0) {
            const totalCount = await Post.countDocuments(query);
            hasMore = (page * limit) < totalCount;
        }

        return NextResponse.json({ success: true, data: posts, hasMore });
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

