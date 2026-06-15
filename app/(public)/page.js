import dbConnect from '@/lib/db';
import Post from '@/models/Post';
import Widget from '@/models/Widget';
import HomeContent from '@/components/HomeContent';

export const dynamic = 'force-dynamic';

async function getData() {
    try {
        await dbConnect();
        // Only fetch posts that are ready to be published:
        // scheduledAt is null (no schedule set) or scheduledAt has already passed.
        const now = new Date();
        const posts = await Post.find({
            $or: [{ scheduledAt: null }, { scheduledAt: { $lte: now } }]
        }).sort({ createdAt: -1 });
        const aboutMeWidget = await Widget.findOne({ key: 'about-me' });

        return {
            posts: JSON.parse(JSON.stringify(posts)),
            aboutMePage: aboutMeWidget ? JSON.parse(JSON.stringify(aboutMeWidget)) : null
        };
    } catch (error) {
        console.error('Error fetching data:', error);
        return { posts: [], aboutMePage: null };
    }
}

export default async function Home() {
    const { posts, aboutMePage } = await getData();

    return <HomeContent posts={posts} aboutMePage={aboutMePage} />;
}
