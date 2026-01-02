import dbConnect from '@/lib/db';
import Post from '@/models/Post';
import Widget from '@/models/Widget';
import HomeContent from '@/components/HomeContent';

export const dynamic = 'force-dynamic';

async function getData() {
    try {
        await dbConnect();
        const posts = await Post.find({}).sort({ createdAt: -1 });
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
