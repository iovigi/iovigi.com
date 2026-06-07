import dbConnect from '@/lib/db';
import Visit from '@/models/Visit';
import Post from '@/models/Post';
import Page from '@/models/Page';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

function getFlagEmoji(countryCode) {
    if (!countryCode || countryCode === 'XX' || countryCode === 'LCL') return '🏳️';
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt(0));
    try {
        return String.fromCodePoint(...codePoints);
    } catch (e) {
        return '🏳️';
    }
}

function parseUA(ua) {
    if (!ua) return 'Unknown';
    if (/mobile|android|iphone|ipad|phone/i.test(ua)) {
        if (/iphone|ipad/i.test(ua)) return '📱 iOS';
        return '📱 Android';
    }
    if (/windows/i.test(ua)) return '💻 Windows';
    if (/macintosh|mac os x/i.test(ua)) return '💻 macOS';
    if (/linux/i.test(ua)) return '💻 Linux';
    return '💻 Desktop';
}

async function getStatsData() {
    await dbConnect();

    // 1. Total Metrics
    const totalViews = await Visit.countDocuments();
    const uniqueIps = await Visit.distinct('ip');
    const totalUniqueVisitors = uniqueIps.length;
    const totalPosts = await Post.countDocuments();
    const totalPages = await Page.countDocuments();

    // 2. Country Breakdown
    const countryStatsRaw = await Visit.aggregate([
        {
            $group: {
                _id: '$country',
                countryCode: { $first: '$countryCode' },
                totalViews: { $sum: 1 },
                uniqueVisitors: { $addToSet: '$ip' }
            }
        },
        {
            $project: {
                country: '$_id',
                countryCode: 1,
                totalViews: 1,
                uniqueCount: { $size: '$uniqueVisitors' }
            }
        },
        { $sort: { uniqueCount: -1, totalViews: -1 } }
    ]);

    // 3. Post Breakdown
    const postStatsRaw = await Visit.aggregate([
        { $match: { type: 'post' } },
        {
            $group: {
                _id: '$referenceId',
                totalViews: { $sum: 1 },
                uniqueVisitors: { $addToSet: '$ip' }
            }
        }
    ]);
    const posts = await Post.find({}, 'title slug');
    const postsWithStats = posts.map(post => {
        const titleText = post.title?.en || post.title?.bg || (typeof post.title === 'string' ? post.title : 'Untitled');
        const stat = postStatsRaw.find(s => s._id && s._id.toString() === post._id.toString());
        return {
            _id: post._id,
            title: titleText,
            slug: post.slug,
            totalViews: stat ? stat.totalViews : 0,
            uniqueCount: stat ? stat.uniqueVisitors.length : 0
        };
    }).sort((a, b) => b.uniqueCount - a.uniqueCount || b.totalViews - a.totalViews);

    // 4. Page Breakdown
    const pageStatsRaw = await Visit.aggregate([
        { $match: { type: 'page' } },
        {
            $group: {
                _id: '$referenceId',
                totalViews: { $sum: 1 },
                uniqueVisitors: { $addToSet: '$ip' }
            }
        }
    ]);
    const pages = await Page.find({}, 'title slug');
    const pagesWithStats = pages.map(page => {
        const titleText = page.title?.en || page.title?.bg || (typeof page.title === 'string' ? page.title : 'Untitled');
        const stat = pageStatsRaw.find(s => s._id && s._id.toString() === page._id.toString());
        return {
            _id: page._id,
            title: titleText,
            slug: page.slug,
            totalViews: stat ? stat.totalViews : 0,
            uniqueCount: stat ? stat.uniqueVisitors.length : 0
        };
    }).sort((a, b) => b.uniqueCount - a.uniqueCount || b.totalViews - a.totalViews);

    // 5. Special Pages (Home & Others)
    const homeStatsRaw = await Visit.aggregate([
        { $match: { type: 'home' } },
        {
            $group: {
                _id: null,
                totalViews: { $sum: 1 },
                uniqueVisitors: { $addToSet: '$ip' }
            }
        }
    ]);
    const homeStats = {
        title: 'Homepage',
        slug: '/',
        totalViews: homeStatsRaw[0]?.totalViews || 0,
        uniqueCount: homeStatsRaw[0]?.uniqueVisitors?.length || 0
    };

    const otherStatsRaw = await Visit.aggregate([
        { $match: { type: 'other' } },
        {
            $group: {
                _id: null,
                totalViews: { $sum: 1 },
                uniqueVisitors: { $addToSet: '$ip' }
            }
        }
    ]);
    const otherStats = {
        title: 'Other / Non-resolved Paths',
        slug: 'N/A',
        totalViews: otherStatsRaw[0]?.totalViews || 0,
        uniqueCount: otherStatsRaw[0]?.uniqueVisitors?.length || 0
    };

    // 6. Recent 15 Visits
    const recentVisits = await Visit.find({})
        .populate('referenceId')
        .sort({ createdAt: -1 })
        .limit(15);

    return {
        metrics: {
            totalViews,
            totalUniqueVisitors,
            totalPosts,
            totalPages
        },
        countryStats: JSON.parse(JSON.stringify(countryStatsRaw)),
        postsStats: JSON.parse(JSON.stringify(postsWithStats)),
        pagesStats: JSON.parse(JSON.stringify(pagesWithStats)),
        homeStats,
        otherStats,
        recentVisits: JSON.parse(JSON.stringify(recentVisits))
    };
}

export default async function StatisticsDashboard() {
    const data = await getStatsData();

    return (
        <div className="content pt-3">
            <div className="container-fluid">
                {/* Header */}
                <div className="row mb-4">
                    <div className="col-sm-6">
                        <h1 className="m-0 text-dark">
                            <i className="fas fa-chart-bar mr-2 text-primary"></i>
                            User Statistics
                        </h1>
                    </div>
                </div>

                {/* Counters */}
                <div className="row">
                    <div className="col-lg-3 col-6">
                        <div className="small-box bg-primary">
                            <div className="inner">
                                <h3>{data.metrics.totalViews}</h3>
                                <p>Total Page Views</p>
                            </div>
                            <div className="icon">
                                <i className="fas fa-eye"></i>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-3 col-6">
                        <div className="small-box bg-purple" style={{ backgroundColor: '#6f42c1' }}>
                            <div className="inner text-white">
                                <h3>{data.metrics.totalUniqueVisitors}</h3>
                                <p>Unique Visitors (IPs)</p>
                            </div>
                            <div className="icon">
                                <i className="fas fa-users"></i>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-3 col-6">
                        <div className="small-box bg-info">
                            <div className="inner">
                                <h3>{data.metrics.totalPosts}</h3>
                                <p>Total Posts</p>
                            </div>
                            <div className="icon">
                                <i className="fas fa-pen"></i>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-3 col-6">
                        <div className="small-box bg-success">
                            <div className="inner">
                                <h3>{data.metrics.totalPages}</h3>
                                <p>Total Pages</p>
                            </div>
                            <div className="icon">
                                <i className="fas fa-file"></i>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Second Row: Country stats & General Paths */}
                <div className="row mt-3">
                    {/* Countries */}
                    <div className="col-md-6">
                        <div className="card card-outline card-primary">
                            <div className="card-header">
                                <h3 className="card-title">
                                    <i className="fas fa-globe mr-2 text-primary"></i>
                                    Visitors by Country (IP Lookup)
                                </h3>
                            </div>
                            <div className="card-body p-0" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                <table className="table table-striped table-valign-middle mb-0">
                                    <thead>
                                        <tr>
                                            <th>Country</th>
                                            <th className="text-center">Unique Visitors</th>
                                            <th className="text-center">Total Views</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.countryStats.map((stat, i) => (
                                            <tr key={i}>
                                                <td>
                                                    <span className="mr-2" style={{ fontSize: '1.2rem' }}>
                                                        {getFlagEmoji(stat.countryCode)}
                                                    </span>
                                                    {stat.country === 'Local Network' ? <strong>{stat.country}</strong> : stat.country}
                                                    {stat.countryCode && stat.countryCode !== 'XX' && ` (${stat.countryCode})`}
                                                </td>
                                                <td className="text-center font-weight-bold text-purple">{stat.uniqueCount}</td>
                                                <td className="text-center text-muted">{stat.totalViews}</td>
                                            </tr>
                                        ))}
                                        {data.countryStats.length === 0 && (
                                            <tr>
                                                <td colSpan="3" className="text-center text-muted py-3">No country statistics available.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* General Paths Overview */}
                    <div className="col-md-6">
                        <div className="card card-outline card-secondary">
                            <div className="card-header">
                                <h3 className="card-title">
                                    <i className="fas fa-route mr-2 text-secondary"></i>
                                    System Entry Points Overview
                                </h3>
                            </div>
                            <div className="card-body p-0">
                                <table className="table table-striped table-valign-middle mb-0">
                                    <thead>
                                        <tr>
                                            <th>Location</th>
                                            <th>Path</th>
                                            <th className="text-center">Unique Visitors</th>
                                            <th className="text-center">Total Views</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="font-weight-bold">
                                                <i className="fas fa-home mr-1 text-primary"></i> Homepage
                                            </td>
                                            <td><code>/</code></td>
                                            <td className="text-center font-weight-bold text-purple">{data.homeStats.uniqueCount}</td>
                                            <td className="text-center text-muted">{data.homeStats.totalViews}</td>
                                        </tr>
                                        <tr>
                                            <td className="font-weight-bold text-muted">
                                                <i className="fas fa-question-circle mr-1 text-muted"></i> Unresolved Paths
                                            </td>
                                            <td><code>*</code></td>
                                            <td className="text-center font-weight-bold text-purple">{data.otherStats.uniqueCount}</td>
                                            <td className="text-center text-muted">{data.otherStats.totalViews}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Third Row: Posts and Pages breakdown */}
                <div className="row mt-3">
                    {/* Posts stats */}
                    <div className="col-md-6">
                        <div className="card card-outline card-info">
                            <div className="card-header">
                                <h3 className="card-title">
                                    <i className="fas fa-pencil-alt mr-2 text-info"></i>
                                    Statistics by Post
                                </h3>
                            </div>
                            <div className="card-body p-0" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                <table className="table table-striped table-valign-middle mb-0">
                                    <thead>
                                        <tr>
                                            <th>Post Title</th>
                                            <th className="text-center">Unique Visitors</th>
                                            <th className="text-center">Total Views</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.postsStats.map((post) => (
                                            <tr key={post._id}>
                                                <td>
                                                    <Link href={`/blog/${post.slug}`} target="_blank" className="font-weight-bold text-dark">
                                                        {post.title}
                                                    </Link>
                                                    <div className="small text-muted">/blog/{post.slug}</div>
                                                </td>
                                                <td className="text-center font-weight-bold text-purple">{post.uniqueCount}</td>
                                                <td className="text-center text-muted">{post.totalViews}</td>
                                            </tr>
                                        ))}
                                        {data.postsStats.length === 0 && (
                                            <tr>
                                                <td colSpan="3" className="text-center text-muted py-3">No posts stats found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Pages stats */}
                    <div className="col-md-6">
                        <div className="card card-outline card-success">
                            <div className="card-header">
                                <h3 className="card-title">
                                    <i className="fas fa-file-alt mr-2 text-success"></i>
                                    Statistics by Page
                                </h3>
                            </div>
                            <div className="card-body p-0" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                <table className="table table-striped table-valign-middle mb-0">
                                    <thead>
                                        <tr>
                                            <th>Page Title</th>
                                            <th className="text-center">Unique Visitors</th>
                                            <th className="text-center">Total Views</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.pagesStats.map((page) => (
                                            <tr key={page._id}>
                                                <td>
                                                    <Link href={`/${page.slug}`} target="_blank" className="font-weight-bold text-dark">
                                                        {page.title}
                                                    </Link>
                                                    <div className="small text-muted">/{page.slug}</div>
                                                </td>
                                                <td className="text-center font-weight-bold text-purple">{page.uniqueCount}</td>
                                                <td className="text-center text-muted">{page.totalViews}</td>
                                            </tr>
                                        ))}
                                        {data.pagesStats.length === 0 && (
                                            <tr>
                                                <td colSpan="3" className="text-center text-muted py-3">No pages stats found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Fourth Row: Recent Activity Log */}
                <div className="row mt-3 mb-5">
                    <div className="col-12">
                        <div className="card card-outline card-dark">
                            <div className="card-header">
                                <h3 className="card-title">
                                    <i className="fas fa-history mr-2 text-dark"></i>
                                    Recent Visits Log (Real-time Stream)
                                </h3>
                            </div>
                            <div className="card-body p-0">
                                <table className="table table-striped table-valign-middle mb-0">
                                    <thead>
                                        <tr>
                                            <th>Time</th>
                                            <th>IP Address</th>
                                            <th>Location</th>
                                            <th>Visited Page / Path</th>
                                            <th>Device / OS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.recentVisits.map((visit) => {
                                            let displayPath = visit.path;
                                            if (visit.type === 'home') {
                                                displayPath = <span className="badge badge-primary">Homepage (/)</span>;
                                            } else if (visit.type === 'post') {
                                                const title = visit.referenceId?.title?.en || visit.referenceId?.title?.bg || 'Post';
                                                displayPath = (
                                                    <span>
                                                        <span className="badge badge-info mr-1">Post</span> 
                                                        <Link href={`/blog/${visit.referenceId?.slug || ''}`} target="_blank" className="text-dark font-weight-bold">
                                                            {title}
                                                        </Link>
                                                    </span>
                                                );
                                            } else if (visit.type === 'page') {
                                                const title = visit.referenceId?.title?.en || visit.referenceId?.title?.bg || 'Page';
                                                displayPath = (
                                                    <span>
                                                        <span className="badge badge-success mr-1">Page</span> 
                                                        <Link href={`/${visit.referenceId?.slug || ''}`} target="_blank" className="text-dark font-weight-bold">
                                                            {title}
                                                        </Link>
                                                    </span>
                                                );
                                            } else {
                                                displayPath = <span className="badge badge-secondary">{visit.path}</span>;
                                            }

                                            return (
                                                <tr key={visit._id}>
                                                    <td className="text-muted small">
                                                        {new Date(visit.createdAt).toLocaleString()}
                                                    </td>
                                                    <td>
                                                        <code>{visit.ip}</code>
                                                    </td>
                                                    <td>
                                                        <span className="mr-1" style={{ fontSize: '1.1rem' }}>
                                                            {getFlagEmoji(visit.countryCode)}
                                                        </span>
                                                        {visit.city !== 'Unknown' ? `${visit.city}, ` : ''}{visit.country}
                                                    </td>
                                                    <td>
                                                        {displayPath}
                                                    </td>
                                                    <td>
                                                        <span className="small">{parseUA(visit.userAgent)}</span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {data.recentVisits.length === 0 && (
                                            <tr>
                                                <td colSpan="5" className="text-center text-muted py-3">No activity logs recorded yet.</td>
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
