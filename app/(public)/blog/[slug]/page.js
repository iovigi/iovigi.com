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
    return {
        title: post.title,
    }
}

export default async function SinglePost({ params }) {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
        notFound();
    }

    const comments = await getComments(post._id);

    return (
        <section id="content">
            <div className="container">
                <div className="row">
                    <div className="col-md-8">
                        <div className="primary">
                            <div className="blog-post">
                                {post.image && (
                                    <div className="thum-item">
                                        <img src={post.image} alt={post.title} />
                                    </div>
                                )}
                                <div className="post">
                                    <div className="blog-title">
                                        <h2>{post.title}</h2>
                                    </div>
                                    <div className="meta">
                                        <ul>
                                            <li className="author">By {post.author}</li>
                                            <li className="date">{new Date(post.createdAt).toLocaleDateString()}</li>
                                            <li className="comment">{comments.length} Comments</li>
                                        </ul>
                                    </div>
                                    <div className="content" dangerouslySetInnerHTML={{ __html: post.content }}></div>
                                </div>
                            </div>

                            {/* Comments Section */}
                            <div className="comments-area">
                                <h3>Comments ({comments.length})</h3>
                                <ul className="comment-list">
                                    {comments.map(comment => (
                                        <li key={comment._id} className="comment">
                                            <div className="comment-body">
                                                <div className="comment-meta">
                                                    <div className="comment-author">
                                                        <span className="author">{comment.author}</span>
                                                    </div>
                                                    <div className="comment-metadata">
                                                        <span className="date">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                                <div className="comment-content">
                                                    <p>{comment.content}</p>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Comment Form */}
                            <div className="comment-respond">
                                <CommentForm postId={post._id} />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="sidebar">
                            <div className="widget-box">
                                <div className="widget-title">
                                    <span>Recent Post</span>
                                    <div className="line"></div>
                                </div>
                                <div className="widget-item">
                                    <p>Sidebar content here...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
