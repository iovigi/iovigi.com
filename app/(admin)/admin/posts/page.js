export const dynamic = 'force-dynamic';

import Link from 'next/link';
import dbConnect from '@/lib/db';
import Post from '@/models/Post';

async function getPosts() {
    await dbConnect();
    const posts = await Post.find({}).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(posts));
}

export default async function PostList() {
    const posts = await getPosts();

    return (
        <div className="content">
            <div className="container-fluid">
                <div className="row mb-2 mt-2">
                    <div className="col-sm-6">
                        <h1>Posts</h1>
                    </div>
                    <div className="col-sm-6">
                        <Link href="/admin/posts/create" className="btn btn-success float-sm-right">Add New Post</Link>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">All Posts</h3>
                            </div>
                            <div className="card-body">
                                <table className="table table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th>Title</th>
                                            <th>Slug</th>
                                            <th>Author</th>
                                            <th>Date</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {posts.map((post) => (
                                            <tr key={post._id}>
                                                <td>{post.title}</td>
                                                <td>{post.slug}</td>
                                                <td>{post.author}</td>
                                                <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                                                <td>
                                                    <Link href={`/admin/posts/${post._id}`} className="btn btn-primary btn-sm mr-2"><i className="fas fa-edit"></i> Edit</Link>
                                                </td>
                                            </tr>
                                        ))}
                                        {posts.length === 0 && (
                                            <tr>
                                                <td colSpan="5" className="text-center">No posts found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
