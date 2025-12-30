import dbConnect from '@/lib/db';
import Post from '@/models/Post';
import Link from 'next/link';

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

    return (
        <>
            <section id="slider">
                <div className="slider">
                    <div className="container">
                        <div style={{ padding: '100px 0', textAlign: 'center' }}>
                            <h1>Welcome to My Blog</h1>
                        </div>
                    </div>
                </div>
            </section>
            <section id="content">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8">
                            {posts.length === 0 ? <p>No posts found.</p> : (
                                <div className="primary">
                                    {posts.map(post => (
                                        <div className="blog-post" key={post._id}>
                                            {post.image && (
                                                <div className="thum-item">
                                                    <img src={post.image} alt={post.title} />
                                                </div>
                                            )}
                                            <div className="post">
                                                <div className="blog-title">
                                                    <h2><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2>
                                                </div>
                                                <div className="meta">
                                                    <ul>
                                                        <li className="author">By {post.author}</li>
                                                        <li className="date">{new Date(post.createdAt).toLocaleDateString()}</li>
                                                    </ul>
                                                </div>
                                                <div className="content">
                                                    <p>{post.excerpt || (post.content.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...')}</p>
                                                </div>
                                                <div className="line"></div>
                                                <div className="share">
                                                    <div className="post-bottom">
                                                        <div className="continue">
                                                            <Link href={`/blog/${post.slug}`}>Continue Reading <span><i className="fa fa-long-arrow-right"></i></span></Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="col-md-4">
                            <div className="sidebar">
                                <div className="widget-box">
                                    <div className="widget-title">
                                        <span>About Me</span>
                                        <div className="line"></div>
                                    </div>
                                    <div className="widget-item">
                                        <p>Welcome to my personal blog of Iliya Nedelchev</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
