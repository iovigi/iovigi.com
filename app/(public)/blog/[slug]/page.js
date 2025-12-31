import dbConnect from '@/lib/db';
import Post from '@/models/Post';
import Comment from '@/models/Comment';
import { notFound } from 'next/navigation';
import CommentForm from '@/app/components/public/CommentForm';

async function getPost(slug) {
    await dbConnect();
    const post = await Post.findOne({ slug });
    if (!post) return null;
    return JSON.parse(JSON.stringify(post));
}

async function getComments(postId) {
    await dbConnect();
    const comments = await Comment.find({ post: postId }).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(comments));
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const post = await getPost(slug);
    if (!post) {
        return {
            title: 'Post Not Found',
        }
    }
    const title = post.title?.en || (typeof post.title === 'string' ? post.title : 'Untitled');
    return {
        title: title,
    }
}

import SinglePostContent from '@/components/SinglePostContent';

export default async function SinglePost({ params }) {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
        notFound();
    }

    const comments = await getComments(post._id);

    return <SinglePostContent post={post} comments={comments} />;
}
