import dbConnect from '@/lib/db';
import Post from '@/models/Post';
import HomeContent from '@/components/HomeContent';

async function getPosts() {
    try {
        await dbConnect();
        const posts = await Post.find({}).sort({ createdAt: -1 });
        return JSON.parse(JSON.stringify(posts));
    } catch (error) {
        console.error('Error fetching posts:', error);
        return [];
    }
}

export default async function Home() {
    const posts = await getPosts();

    return <HomeContent posts={posts} />;
}
