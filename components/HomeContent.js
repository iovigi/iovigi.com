'use client';

import { useLanguage } from '@/context/LanguageContext';
import { dictionary } from '@/lib/dictionary';
import Link from 'next/link';

export default function HomeContent({ posts, aboutMePage }) {
    const { locale } = useLanguage();
    const t = dictionary[locale] || dictionary.en;

    // Filter and map posts based on locale
    const visiblePosts = posts.filter(post => {
        // Fallback to true if isVisible is missing (migration safety), but prefer check
        const visible = post.isVisible?.[locale] ?? (locale === 'en'); // default en=true, bg=false if undefined
        return visible;
    });

    const aboutTitle = aboutMePage?.title?.[locale] || (locale === 'bg' ? 'За Мен' : 'About Me');
    // Sanitize or unsafe HTML? The content is from RichTextEditor usually, so we need dangerouslySetInnerHTML or existing parser if any.
    // Looking at previous code, user was just outputting text in <p>. 
    // The previous code: <p>{locale === 'bg' ? 'Добре дошли...' : 'Welcome...'}</p>
    // The DB content has <p> tags from my seed script.
    // If we use simple rendering, it might escape HTML. 
    // Let's assume standard React behavior (escaped) unless we use dangerouslySetInnerHTML.
    // Given it's a "RichTextEditor" in admin, we should probably use dangerouslySetInnerHTML for the content.

    // However, if the seed was simple text, I'd just show it.
    // My seed used '<p>...</p>'.
    // `HomeContent` existing code `post.content` usages:
    // It creates excerpt by stripping tags: `content.replace(/<[^>]*>?/gm, '')`
    // But interestingly, the post list doesn't show full content.
    // The About Me section in the sidebar was just a <p> with text.
    // I will use dangerouslySetInnerHTML for the content to support the RichTextEditor future usage.

    const aboutContent = aboutMePage?.content?.[locale] || (locale === 'bg' ? '<p>Добре дошли в личния блог на Илия Неделчев</p>' : '<p>Welcome to my personal blog of Iliya Nedelchev</p>');


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
                                                            <li className="date">{new Date(post.createdAt).toLocaleDateString(locale)}</li>
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
                                        <span>{aboutTitle}</span>
                                        <div className="line"></div>
                                    </div>
                                    <div className="widget-item">
                                        <div dangerouslySetInnerHTML={{ __html: aboutContent }} />
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
