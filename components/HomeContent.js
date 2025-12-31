'use client';

import { useLanguage } from '@/context/LanguageContext';
import { dictionary } from '@/lib/dictionary';
import Link from 'next/link';

export default function HomeContent({ posts }) {
    const { locale } = useLanguage();
    const t = dictionary[locale] || dictionary.en;

    // Filter and map posts based on locale
    const visiblePosts = posts.filter(post => {
        // Fallback to true if isVisible is missing (migration safety), but prefer check
        const visible = post.isVisible?.[locale] ?? (locale === 'en'); // default en=true, bg=false if undefined
        return visible;
    });

    return (
        <>
            <section id="slider" style={{ marginTop: '100px' }}>
                <div className="container">
                    <div className="glass-card" style={{ padding: '60px', textAlign: 'center', marginBottom: '40px' }}>
                        <h1 style={{ fontSize: '3rem', fontWeight: '300' }}>{t.welcomeTitle}</h1>
                        <p style={{ fontSize: '1.2rem', marginTop: '10px' }}>{t.welcomeText}</p>
                    </div>
                </div>
            </section>
            <section id="content">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8">
                            {visiblePosts.length === 0 ? <p>{locale === 'bg' ? 'Няма публикации.' : 'No posts found.'}</p> : (
                                <div className="primary">
                                    {visiblePosts.map(post => {
                                        const title = post.title?.[locale] || post.title?.en || "Untitled";
                                        const excerpt = post.excerpt?.[locale] || post.excerpt?.en || "";
                                        const content = post.content?.[locale] || post.content?.en || "";

                                        // Plain text fallback for excerpt
                                        const displayExcerpt = excerpt || (content.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...');

                                        return (
                                            <div className="blog-post" key={post._id}>
                                                {post.image && (
                                                    <div className="thum-item">
                                                        <img src={post.image} alt={title} />
                                                    </div>
                                                )}
                                                <div className="post">
                                                    <div className="blog-title">
                                                        <h2><Link href={`/blog/${post.slug}`}>{title}</Link></h2>
                                                    </div>
                                                    <div className="meta">
                                                        <ul>
                                                            <li className="date">{new Date(post.createdAt).toLocaleDateString()}</li>
                                                        </ul>
                                                    </div>
                                                    <div className="content">
                                                        <p>{displayExcerpt}</p>
                                                    </div>
                                                    <div className="line"></div>
                                                    <div className="share">
                                                        <div className="post-bottom">
                                                            <div className="continue">
                                                                <Link href={`/blog/${post.slug}`}>{t.readMore} <span><i className="fa fa-long-arrow-right"></i></span></Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                        <div className="col-md-4">
                            <div className="sidebar">
                                <div className="widget-box">
                                    <div className="widget-title">
                                        <span>{locale === 'bg' ? 'За Мен' : 'About Me'}</span>
                                        <div className="line"></div>
                                    </div>
                                    <div className="widget-item">
                                        <p>{locale === 'bg' ? 'Добре дошли в личния блог на Илия Неделчев' : 'Welcome to my personal blog of Iliya Nedelchev'}</p>
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
