import dbConnect from '@/lib/db';
import Visit from '@/models/Visit';
import Post from '@/models/Post';
import Page from '@/models/Page';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function POST(request) {
    await dbConnect();
    try {
        const { path } = await request.json();
        if (!path) {
            return NextResponse.json({ success: false, error: 'Path is required' }, { status: 400 });
        }

        const headersList = await headers();
        const userAgent = headersList.get('user-agent') || '';
        
        // Exclude search bots, spiders, and testing crawlers
        const isBot = /bot|crawler|spider|crawling|slurp|lighthouse|chrome-lighthouse|googlebot|bingbot|yandex|baidu/i.test(userAgent);
        if (isBot) {
            return NextResponse.json({ success: true, skipped: 'bot' });
        }

        // Extract client IP address
        const xForwardedFor = headersList.get('x-forwarded-for');
        const xRealIp = headersList.get('x-real-ip');
        let ip = '127.0.0.1';
        if (xForwardedFor) {
            ip = xForwardedFor.split(',')[0].trim();
        } else if (xRealIp) {
            ip = xRealIp;
        }

        // Resolve page type and reference ID
        let type = 'other';
        let referenceId = null;
        let refModel = null;

        if (path === '/') {
            type = 'home';
        } else if (path.startsWith('/blog/')) {
            const cleanPath = path.split('?')[0].split('#')[0];
            const slug = cleanPath.replace(/^\/blog\//, '').split('/')[0];
            if (slug) {
                const post = await Post.findOne({ slug });
                if (post) {
                    type = 'post';
                    referenceId = post._id;
                    refModel = 'Post';
                }
            }
        } else {
            const cleanPath = path.split('?')[0].split('#')[0];
            const slug = cleanPath.replace(/^\//, '').split('/')[0];
            
            // Avoid resolving system, asset or admin routes as pages
            const isExcluded = !slug || 
                slug.startsWith('admin') || 
                slug.startsWith('api') || 
                slug.startsWith('assets') || 
                slug.startsWith('css') || 
                slug.startsWith('js') || 
                slug.startsWith('favicon.ico');

            if (!isExcluded) {
                const page = await Page.findOne({ slug });
                if (page) {
                    type = 'page';
                    referenceId = page._id;
                    refModel = 'Page';
                }
            }
        }

        // Exclude system admin / API hits
        const cleanPathForFilter = path.split('?')[0].split('#')[0];
        if (cleanPathForFilter.startsWith('/admin') || cleanPathForFilter.startsWith('/api')) {
            return NextResponse.json({ success: true, skipped: 'admin_or_api' });
        }

        // Determine location info with IP lookup and caching
        let country = 'Unknown';
        let countryCode = 'XX';
        let city = 'Unknown';

        // Check if IP is local or private range
        const isLocal = ip === '127.0.0.1' || 
            ip === '::1' || 
            ip.startsWith('192.168.') || 
            ip.startsWith('10.') || 
            /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(ip) ||
            ip.startsWith('::ffff:127.0.0.1') ||
            ip.startsWith('fe80:');

        if (isLocal) {
            country = 'Local Network';
            countryCode = 'LCL';
            city = 'Local';
        } else {
            // Check cache (last 24 hours) for the same IP to save API requests
            const cacheTime = new Date(Date.now() - 24 * 60 * 60 * 1000);
            const cachedGeo = await Visit.findOne({
                ip,
                country: { $ne: 'Unknown' },
                createdAt: { $gte: cacheTime }
            }).sort({ createdAt: -1 });

            if (cachedGeo) {
                country = cachedGeo.country;
                countryCode = cachedGeo.countryCode;
                city = cachedGeo.city;
            } else {
                // Fetch from IP geolocator API
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 seconds timeout
                    const geoResponse = await fetch(`http://ip-api.com/json/${ip}`, { signal: controller.signal });
                    clearTimeout(timeoutId);
                    
                    const geo = await geoResponse.json();
                    if (geo && geo.status === 'success') {
                        country = geo.country || 'Unknown';
                        countryCode = geo.countryCode || 'XX';
                        city = geo.city || 'Unknown';
                    }
                } catch (err) {
                    console.error(`IP lookup error for ${ip}:`, err);
                }
            }
        }

        // Record the visit
        const newVisit = await Visit.create({
            ip,
            path,
            type,
            referenceId,
            refModel,
            country,
            countryCode,
            city,
            userAgent
        });

        return NextResponse.json({ success: true, data: { id: newVisit._id } });
    } catch (error) {
        console.error('Tracking endpoint error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
