export const dynamic = 'force-dynamic';

import Link from 'next/link';
import dbConnect from '@/lib/db';
import Post from '@/models/Post';

async function getPosts() {
    await dbConnect();
    const posts = await Post.find({}).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(posts));
}

/** Returns a status badge object based on scheduledAt and isVisible fields. */
function getPostStatus(post) {
    const now = new Date();
    const scheduledAt = post.scheduledAt ? new Date(post.scheduledAt) : null;
    const isPublished = post.isVisible?.en || post.isVisible?.bg;

    if (scheduledAt && scheduledAt > now) {
        // Scheduled — still in the future
        return {
            label: 'Scheduled',
            badge: 'badge-warning',
            icon: 'fas fa-hourglass-half',
            detail: scheduledAt.toLocaleString()
        };
    }
    if (isPublished || (scheduledAt && scheduledAt <= now)) {
        // Published — either visible or schedule already passed
        return {
            label: 'Published',
            badge: 'badge-success',
            icon: 'fas fa-eye',
            detail: null
        };
    }
    // Draft — hidden and no schedule
    return {
        label: 'Draft',
        badge: 'badge-secondary',
        icon: 'fas fa-eye-slash',
        detail: null
    };
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
                                            <th>Status</th>
                                            <th>Date</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {posts.map((post) => {
                                            const status = getPostStatus(post);
                                            return (
                                                <tr key={post._id}>
                                                    <td>
                                                        {post.title?.en || "No Title"}
                                                        <br />
                                                        <small className="text-muted">
                                                            {post.isVisible?.en ? <span className="badge badge-success mr-1">EN</span> : <span className="badge badge-secondary mr-1">EN</span>}
                                                            {post.isVisible?.bg ? <span className="badge badge-success">BG</span> : <span className="badge badge-secondary">BG</span>}
                                                        </small>
                                                    </td>
                                                    <td>{post.slug}</td>
                                                    <td>{post.author}</td>
                                                    <td>
                                                        {/* Status badge */}
                                                        <span className={`badge ${status.badge}`}>
                                                            <i className={`${status.icon} mr-1`}></i>
                                                            {status.label}
                                                        </span>
                                                        {/* Show scheduled datetime below if applicable */}
                                                        {status.detail && (
                                                            <div>
                                                                <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                                                                    {status.detail}
                                                                </small>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                                                    <td>
                                                        <Link href={`/admin/posts/${post._id}`} className="btn btn-primary btn-sm mr-2"><i className="fas fa-edit"></i> Edit</Link>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {posts.length === 0 && (
                                            <tr>
                                                <td colSpan="6" className="text-center">No posts found.</td>
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

