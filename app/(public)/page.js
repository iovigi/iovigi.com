import dbConnect from '@/lib/db';
import Post from '@/models/Post';
import Widget from '@/models/Widget';
import HomeContent from '@/components/HomeContent';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

async function getData(locale) {
    try {
        await dbConnect();
        // Only fetch posts that are ready to be published and visible in the active locale
        const now = new Date();
        let query = {};
        if (locale === 'bg') {
            query = {
                $and: [
                    { $or: [{ scheduledAt: null }, { scheduledAt: { $lte: now } }] },
                    { 'isVisible.bg': true }
                ]
            };
        } else {
            // Default 'en'
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

        const posts = await Post.find(query)
            .sort({ createdAt: -1 })
            .limit(5);

        const totalCount = await Post.countDocuments(query);
        const aboutMeWidget = await Widget.findOne({ key: 'about-me' });

        return {
            posts: JSON.parse(JSON.stringify(posts)),
            hasMore: totalCount > 5,
            aboutMePage: aboutMeWidget ? JSON.parse(JSON.stringify(aboutMeWidget)) : null
        };
    } catch (error) {
        console.error('Error fetching data:', error);
        return { posts: [], hasMore: false, aboutMePage: null };
    }
}

export default async function Home() {
    const cookieStore = await cookies();
    const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';
    const { posts, hasMore, aboutMePage } = await getData(locale);

    return <HomeContent posts={posts} hasMore={hasMore} aboutMePage={aboutMePage} />;
}
