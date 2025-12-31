'use client';

import { useLanguage } from '@/context/LanguageContext';
import CommentForm from '@/app/components/public/CommentForm';
import { dictionary } from '@/lib/dictionary';

export default function SinglePostContent({ post, comments }) {
    const { locale } = useLanguage();
    const t = dictionary[locale] || dictionary.en;

    const title = post.title?.[locale] || post.title?.en || (typeof post.title === 'string' ? post.title : 'Untitled');
    const content = post.content?.[locale] || post.content?.en || (typeof post.content === 'string' ? post.content : '');

    const visibleComments = comments.filter(comment => (comment.locale || 'en') === locale);

    return (
        <section id="content">
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="primary">
                            <div className="blog-post">
                                {post.image && (
                                    <div className="thum-item">
                                        <img src={post.image} alt={title} />
                                    </div>
                                )}
                                <div className="post">
                                    <div className="blog-title">
                                        <h2>{title}</h2>
                                    </div>
                                    <div className="meta">
                                        <ul>
                                            <li className="date">{new Date(post.createdAt).toLocaleDateString()}</li>
                                            <li className="comment">{visibleComments.length} {t.comments}</li>
                                        </ul>
                                    </div>
                                    <div className="content" dangerouslySetInnerHTML={{ __html: content }}></div>
                                </div>
                            </div>

                            {/* Comments Section */}
                            <div className="comments-area">
                                <h3>{t.comments} ({visibleComments.length})</h3>
                                <ul className="comment-list">
                                    {visibleComments.map(comment => (
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
                </div>
            </div>
        </section>
    );
}
