import Script from 'next/script';
import dbConnect from '@/lib/db';
import Page from '@/models/Page';
import SmartMenusLoader from '@/app/components/SmartMenusLoader';
import '../globals.css';
import ClientLayout from '../ClientLayout';
import PublicNavbar from '@/components/PublicNavbar';
import PublicFooter from '@/components/PublicFooter';

export const metadata = {
    title: {
        template: "%s | iovigi's blog",
        default: "iovigi's blog",
    },
    description: 'Personal Blog',
    icons: {
        icon: '/assets/icon.png',
    },
}

async function getMenuPages() {
    try {
        await dbConnect();
        const pages = await Page.find({ showInMenu: true }).sort({ sortOrder: 1 });
        return JSON.parse(JSON.stringify(pages));
    } catch (error) {
        console.error('Error fetching menu pages:', error);
        return [];
    }
}

export default async function RootLayout({ children }) {
    const pages = await getMenuPages();

    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link href="/css/bootstrap.min.css" rel="stylesheet" />
                <link href="/css/font-awesome.min.css" rel="stylesheet" />
                <link href="/style.css" rel="stylesheet" />
                <link href="/css/responsive.css" rel="stylesheet" />
                <link href="/css/stars.css" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;700&display=swap" rel="stylesheet" />
            </head>
            <body suppressHydrationWarning={true}>
                <ClientLayout>
                    <div id="space-background" style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: -1,
                        backgroundImage: 'radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%)',
                        backgroundSize: '100% 100%',
                        backgroundAttachment: 'fixed',
                        overflow: 'hidden'
                    }}>
                        <div className="stars"></div>
                        <div className="stars2"></div>
                        <div className="stars3"></div></div>
                    <div id="preloader">
                        <div id="status">&nbsp;</div>
                    </div>

                    <PublicNavbar pages={pages} />

                    <main id="main-content">
                        {children}
                    </main>

                    <PublicFooter pages={pages} />
                </ClientLayout>

                <Script src="/js/jquery-1.11.3.min.js" strategy="afterInteractive" />
                <Script src="/js/bootstrap.min.js" strategy="afterInteractive" />
                <Script src="/js/masonry.pkgd.min.js" strategy="afterInteractive" />
                <SmartMenusLoader />
                <Script src="/js/custom.js" strategy="afterInteractive" />
            </body>
        </html>
    )
}
