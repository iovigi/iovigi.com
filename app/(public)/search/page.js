import dbConnect from '@/lib/db';
import Post from '@/models/Post';
import Page from '@/models/Page';
import Widget from '@/models/Widget';
import { cookies } from 'next/headers';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const searchDictionary = {
    en: {
        searchResults: "Search Results",
        resultsFor: "Results for",
        noResults: "No results found matching your query.",
        posts: "Blog Posts",
        pages: "Pages",
        readMore: "Read More",
        searchPlaceholder: "Search..."
    },
    bg: {
        searchResults: "Резултати от търсенето",
        resultsFor: "Резултати за",
        noResults: "Няма намерени резултати, съвпадащи с вашето търсене.",
        posts: "Публикации",
        pages: "Страници",
        readMore: "Прочети още",
        searchPlaceholder: "Търсене..."
    }
};

async function performSearch(query, locale) {
    await dbConnect();
    if (!query) {
        return { posts: [], pages: [] };
    }

    const regex = new RegExp(query, 'i');
    const now = new Date();

    // 1. Search posts: published/visible, scheduled check, content/title match
    const posts = await Post.find({
        $and: [
            { [`isVisible.${locale}`]: true },
            { $or: [{ scheduledAt: null }, { scheduledAt: { $lte: now } }] },
            {
                $or: [
                    { 'title.en': regex },
                    { 'title.bg': regex },
                    { 'content.en': regex },
                    { 'content.bg': regex },
                    { 'excerpt.en': regex },
                    { 'excerpt.bg': regex }
                ]
            }
        ]
    }).sort({ createdAt: -1 });

    // 2. Search pages: visible, content/title match
    const pages = await Page.find({
        $and: [
            { [`isVisible.${locale}`]: true },
            {
                $or: [
                    { 'title.en': regex },
                    { 'title.bg': regex },
                    { 'content.en': regex },
                    { 'content.bg': regex }
                ]
            }
        ]
    }).sort({ sortOrder: 1 });

    return {
        posts: JSON.parse(JSON.stringify(posts)),
        pages: JSON.parse(JSON.stringify(pages))
    };
}

async function getAboutMe(locale) {
    try {
        await dbConnect();
        const aboutMeWidget = await Widget.findOne({ key: 'about-me' });
        return aboutMeWidget ? JSON.parse(JSON.stringify(aboutMeWidget)) : null;
    } catch (e) {
        return null;
    }
}

export async function generateMetadata({ searchParams }) {
    const { q } = await searchParams;
    const cookieStore = await cookies();
    const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';
    const t = searchDictionary[locale] || searchDictionary.en;

    return {
        title: q ? `${t.searchResults}: "${q}"` : t.searchResults,
    };
}

export default async function SearchPage({ searchParams }) {
    const { q } = await searchParams;
    const cookieStore = await cookies();
    const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';
    const t = searchDictionary[locale] || searchDictionary.en;

    const queryStr = typeof q === 'string' ? q.trim() : '';
    const { posts, pages } = await performSearch(queryStr, locale);
    const aboutMeWidget = await getAboutMe(locale);

    const aboutTitle = aboutMeWidget?.title?.[locale] || (locale === 'bg' ? 'За Мен' : 'About Me');
    const aboutContent = aboutMeWidget?.content?.[locale] || (locale === 'bg' ? '<p>Добре дошли в личния блог на Илия Неделчев</p>' : '<p>Welcome to my personal blog of Iliya Nedelchev</p>');

    const totalResults = posts.length + pages.length;

    return (
        <>
            <section id="slider" style={{ marginTop: '100px' }}>
                <div className="container">
                    <div className="glass-card" style={{ padding: '40px 60px', textAlign: 'center', marginBottom: '40px' }}>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '300', margin: 0 }}>
                            {t.searchResults}
                        </h1>
                        {queryStr && (
                            <p style={{ fontSize: '1.2rem', marginTop: '10px', color: '#00d4ff' }}>
                                {t.resultsFor}: &ldquo;{queryStr}&rdquo; ({totalResults})
                            </p>
                        )}
                    </div>
                </div>
            </section>

            <section id="content">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8">
                            {totalResults === 0 ? (
                                <div className="glass-card" style={{ padding: '30px', textAlign: 'center', marginBottom: '30px' }}>
                                    <p style={{ fontSize: '1.1rem', margin: 0 }}>{t.noResults}</p>
                                </div>
                            ) : (
                                <div className="primary">
                                    {/* Pages Search Results */}
                                    {pages.length > 0 && (
                                        <div className="search-section" style={{ marginBottom: '40px' }}>
                                            <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginBottom: '20px' }}>
                                                <i className="fa fa-file-text-o mr-2 text-info" style={{ marginRight: '10px' }}></i>
                                                {t.pages} ({pages.length})
                                            </h3>
                                            {pages.map(page => {
                                                const title = page.title?.[locale] || page.title?.en || "Untitled Page";
                                                const contentSnippet = page.content?.[locale] || page.content?.en || "";
                                                const displaySnippet = contentSnippet.replace(/<[^>]*>?/gm, '').substring(0, 200) + '...';

                                                return (
                                                    <div className="blog-post" key={page._id} style={{ padding: '20px' }}>
                                                        <div className="post" style={{ padding: 0 }}>
                                                            <div className="blog-title">
                                                                <h2 style={{ fontSize: '1.8rem', margin: '0 0 10px 0' }}>
                                                                    <Link href={`/${page.slug}`}>{title}</Link>
                                                                </h2>
                                                            </div>
                                                            <div className="content" style={{ marginTop: '10px' }}>
                                                                <p>{displaySnippet}</p>
                                                            </div>
                                                            <div className="continue" style={{ marginTop: '15px' }}>
                                                                <Link href={`/${page.slug}`} style={{ color: '#00d4ff', fontWeight: '500' }}>
                                                                    {t.readMore} <span><i className="fa fa-long-arrow-right"></i></span>
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* Posts Search Results */}
                                    {posts.length > 0 && (
                                        <div className="search-section">
                                            <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginBottom: '20px' }}>
                                                <i className="fa fa-newspaper-o mr-2 text-primary" style={{ marginRight: '10px' }}></i>
                                                {t.posts} ({posts.length})
                                            </h3>
                                            {posts.map(post => {
                                                const title = post.title?.[locale] || post.title?.en || "Untitled Post";
                                                const excerpt = post.excerpt?.[locale] || post.excerpt?.en || "";
                                                const content = post.content?.[locale] || post.content?.en || "";
                                                const displayExcerpt = excerpt || (content.replace(/<[^>]*>?/gm, '').substring(0, 180) + '...');

                                                return (
                                                    <div className="blog-post" key={post._id} style={{ padding: '20px' }}>
                                                        {post.image && (
                                                            <div className="thum-item" style={{ marginBottom: '15px' }}>
                                                                <img src={post.image} alt={title} style={{ borderRadius: '8px', maxWidth: '100%', height: 'auto' }} />
                                                            </div>
                                                        )}
                                                        <div className="post" style={{ padding: 0 }}>
                                                            <div className="blog-title">
                                                                <h2 style={{ fontSize: '1.8rem', margin: '0 0 10px 0' }}>
                                                                    <Link href={`/blog/${post.slug}`}>{title}</Link>
                                                                </h2>
                                                            </div>
                                                            <div className="meta" style={{ marginBottom: '10px' }}>
                                                                <ul>
                                                                    <li className="date" style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                                                                        {new Date(post.createdAt).toLocaleDateString(locale)}
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                            <div className="content">
                                                                <p>{displayExcerpt}</p>
                                                            </div>
                                                            <div className="continue" style={{ marginTop: '15px' }}>
                                                                <Link href={`/blog/${post.slug}`} style={{ color: '#00d4ff', fontWeight: '500' }}>
                                                                    {t.readMore} <span><i className="fa fa-long-arrow-right"></i></span>
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
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
