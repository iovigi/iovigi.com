export const dynamic = 'force-dynamic';

import Link from 'next/link';
import dbConnect from '@/lib/db';
import Comment from '@/models/Comment';
import Post from '@/models/Post'; // Ensure model is registered for population

async function getComments() {
    await dbConnect();
    // Ensure Post model is loaded for population
    const comments = await Comment.find({}).populate('post', 'title slug').sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(comments));
}

export default async function CommentList() {
    const comments = await getComments();

    return (
        <div className="content">
            <div className="container-fluid">
                <div className="row mb-2 mt-2">
                    <div className="col-sm-6">
                        <h1>Comments</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">All Comments</h3>
                            </div>
                            <div className="card-body">
                                <table className="table table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th>Author</th>
                                            <th>Content</th>
                                            <th>Post</th>
                                            <th>Locale</th>
                                            <th>Date</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {comments.map((comment) => (
                                            <tr key={comment._id}>
                                                <td>{comment.author}</td>
                                                <td>{comment.content.substring(0, 50)}...</td>
                                                <td>
                                                    {comment.post ? (
                                                        <Link href={`/blog/${comment.post.slug}`} target="_blank">
                                                            {comment.post.title?.en || (typeof comment.post.title === 'string' ? comment.post.title : "Untitled")}
                                                        </Link>
                                                    ) : "Deleted Post"}
                                                </td>
                                                <td>
                                                    <span className={`badge badge-${comment.locale === 'bg' ? 'info' : 'primary'}`}>
                                                        {(comment.locale || 'en').toUpperCase()}
                                                    </span>
                                                </td>
                                                <td>{new Date(comment.createdAt).toLocaleDateString()}</td>
                                                <td>
                                                    <Link href={`/admin/comments/${comment._id}`} className="btn btn-primary btn-sm mr-2"><i className="fas fa-edit"></i> Edit</Link>
                                                </td>
                                            </tr>
                                        ))}
                                        {comments.length === 0 && (
                                            <tr>
                                                <td colSpan="6" className="text-center">No comments found.</td>
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
