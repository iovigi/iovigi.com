import dbConnect from '@/lib/db';
import Post from '@/models/Post';
import EditPostForm from './EditPostForm';
import { notFound } from 'next/navigation';

async function getPost(id) {
    await dbConnect();
    const post = await Post.findById(id);
    if (!post) return null;
    return JSON.parse(JSON.stringify(post));
}

export default async function EditPostPage({ params }) {
    const { id } = await params;
    const post = await getPost(id);

    if (!post) {
        notFound();
    }

    return (
        <div className="content">
            <div className="container-fluid">
                <div className="row mb-2 mt-2">
                    <div className="col-sm-6">
                        <h1>Edit Post</h1>
                    </div>
                </div>
                <EditPostForm post={post} />
            </div>
        </div>
    );
}
