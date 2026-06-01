import dbConnect from '@/lib/db';
import Post from '@/models/Post';
import Page from '@/models/Page';
import Widget from '@/models/Widget';
import Comment from '@/models/Comment';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getDashboardData() {
    await dbConnect();

    // Query counts
    const totalPosts = await Post.countDocuments();
    const totalPages = await Page.countDocuments();
    const totalWidgets = await Widget.countDocuments();
    const totalComments = await Comment.countDocuments();

    // Fetch recent records
    const recentPosts = await Post.find({})
        .sort({ createdAt: -1 })
        .limit(5);

    const recentComments = await Comment.find({})
        .populate('post', 'title slug')
        .sort({ createdAt: -1 })
        .limit(5);

    return {
        stats: {
            totalPosts,
            totalPages,
            totalWidgets,
            totalComments
        },
        recentPosts: JSON.parse(JSON.stringify(recentPosts)),
        recentComments: JSON.parse(JSON.stringify(recentComments))
    };
}

export default async function AdminDashboard() {
    const { stats, recentPosts, recentComments } = await getDashboardData();

    return (
        <div className="content pt-3">
            <div className="container-fluid">
                {/* Header */}
                <div className="row mb-4">
                    <div className="col-sm-6">
                        <h1 className="m-0 text-dark">Dashboard</h1>
                    </div>
                </div>

                {/* Small Boxes Stats Grid */}
                <div className="row">
                    {/* Posts Box */}
                    <div className="col-lg-3 col-6">
                        <div className="small-box bg-info">
                            <div className="inner">
                                <h3>{stats.totalPosts}</h3>
                                <p>Total Posts</p>
                            </div>
                            <div className="icon">
                                <i className="fas fa-pen"></i>
                            </div>
                            <Link href="/admin/posts" className="small-box-footer">
                                Manage Posts <i className="fas fa-arrow-circle-right ml-1"></i>
                            </Link>
                        </div>
                    </div>

                    {/* Pages Box */}
                    <div className="col-lg-3 col-6">
                        <div className="small-box bg-success">
                            <div className="inner">
                                <h3>{stats.totalPages}</h3>
                                <p>Pages</p>
                            </div>
                            <div className="icon">
                                <i className="fas fa-file"></i>
                            </div>
                            <Link href="/admin/pages" className="small-box-footer">
                                Manage Pages <i className="fas fa-arrow-circle-right ml-1"></i>
                            </Link>
                        </div>
                    </div>

                    {/* Widgets Box */}
                    <div className="col-lg-3 col-6">
                        <div className="small-box bg-warning">
                            <div className="inner">
                                <h3>{stats.totalWidgets}</h3>
                                <p>Widgets</p>
                            </div>
                            <div className="icon">
                                <i className="fas fa-th"></i>
                            </div>
                            <Link href="/admin/widgets" className="small-box-footer">
                                Manage Widgets <i className="fas fa-arrow-circle-right ml-1"></i>
                            </Link>
                        </div>
                    </div>

                    {/* Comments Box */}
                    <div className="col-lg-3 col-6">
                        <div className="small-box bg-danger">
                            <div className="inner">
                                <h3>{stats.totalComments}</h3>
                                <p>Comments</p>
                            </div>
                            <div className="icon">
                                <i className="fas fa-comments"></i>
                            </div>
                            <Link href="/admin/comments" className="small-box-footer">
                                Manage Comments <i className="fas fa-arrow-circle-right ml-1"></i>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Recent Items Rows */}
                <div className="row mt-3">
                    {/* Recent Posts Card */}
                    <div className="col-md-6">
                        <div className="card card-outline card-primary">
                            <div className="card-header">
                                <h3 className="card-title">
                                    <i className="fas fa-pencil-alt mr-2 text-primary"></i>
                                    Recent Posts
                                </h3>
                            </div>
                            <div className="card-body p-0">
                                <table className="table table-striped table-valign-middle mb-0">
                                    <thead>
                                        <tr>
                                            <th>Title</th>
                                            <th>Date</th>
                                            <th>Visibility</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentPosts.map((post) => {
                                            const title = post.title?.en || (typeof post.title === 'string' ? post.title : 'Untitled');
                                            return (
                                                <tr key={post._id}>
                                                    <td>
                                                        <Link href={`/blog/${post.slug}`} target="_blank" className="text-dark font-weight-bold">
                                                            {title.length > 30 ? title.substring(0, 30) + '...' : title}
                                                        </Link>
                                                    </td>
                                                    <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                                                    <td>
                                                        <span className={`badge ${post.isVisible?.en ? 'badge-success' : 'badge-secondary'} mr-1`}>EN</span>
                                                        <span className={`badge ${post.isVisible?.bg ? 'badge-success' : 'badge-secondary'}`}>BG</span>
                                                    </td>
                                                    <td>
                                                        <Link href={`/admin/posts/${post._id}`} className="text-muted">
                                                            <i className="fas fa-edit mr-1"></i>Edit
                                                        </Link>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {recentPosts.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="text-center text-muted py-3">No posts found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="card-footer text-center">
                                <Link href="/admin/posts" className="uppercase font-weight-bold small">
                                    View All Posts
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Recent Comments Card */}
                    <div className="col-md-6">
                        <div className="card card-outline card-danger">
                            <div className="card-header">
                                <h3 className="card-title">
                                    <i className="fas fa-comments mr-2 text-danger"></i>
                                    Recent Comments
                                </h3>
                            </div>
                            <div className="card-body p-0">
                                <table className="table table-striped table-valign-middle mb-0">
                                    <thead>
                                        <tr>
                                            <th>Author</th>
                                            <th>Comment</th>
                                            <th>On Post</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentComments.map((comment) => {
                                            const postTitle = comment.post?.title?.en || (typeof comment.post?.title === 'string' ? comment.post.title : 'Deleted Post');
                                            return (
                                                <tr key={comment._id}>
                                                    <td className="font-weight-bold">{comment.author}</td>
                                                    <td className="text-muted">
                                                        {comment.content.length > 30 ? comment.content.substring(0, 30) + '...' : comment.content}
                                                    </td>
                                                    <td>
                                                        {comment.post ? (
                                                            <Link href={`/blog/${comment.post.slug}`} target="_blank" className="text-info">
                                                                {postTitle.length > 20 ? postTitle.substring(0, 20) + '...' : postTitle}
                                                            </Link>
                                                        ) : (
                                                            <span className="text-muted">Deleted Post</span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <Link href={`/admin/comments/${comment._id}`} className="text-muted">
                                                            <i className="fas fa-edit mr-1"></i>Edit
                                                        </Link>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {recentComments.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="text-center text-muted py-3">No comments found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="card-footer text-center">
                                <Link href="/admin/comments" className="uppercase font-weight-bold small">
                                    View All Comments
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
