import Script from 'next/script';
import dbConnect from '@/lib/db';
import Page from '@/models/Page';
import SmartMenusLoader from '../components/SmartMenusLoader';

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
                <link href='http://fonts.googleapis.com/css?family=Roboto:400,100,700' rel='stylesheet' type='text/css' />
                <link href='http://fonts.googleapis.com/css?family=Droid+Sans' rel='stylesheet' type='text/css' />
            </head>
            <body>
                <div id="preloader">
                    <div id="status">&nbsp;</div>
                </div>

                <header id="header" className="header navbar-fixed-top">
                    <div className="container">
                        <div className="navbar" role="navigation">
                            <div className="navbar-header">
                                <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                                    <span className="sr-only">Toggle navigation</span>
                                    <span className="icon-bar"></span>
                                    <span className="icon-bar"></span>
                                    <span className="icon-bar"></span>
                                </button>
                                <a className="navbar-brand" href="/"><img src="/images/logo.png" alt="logo" /></a>
                            </div>
                            <div className="navbar-collapse collapse">
                                <ul className="nav navbar-nav right">
                                    <li className="active"><a href="/">Home</a></li>
                                    {pages.map(page => (
                                        <li key={page._id}><a href={`/${page.slug}`}>{page.title}</a></li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </header>

                {children}

                <footer id="footer" className="footer">
                    <div className="container">
                        <div className="footer-nav">
                            <ul className="nav navbar-nav">
                                <li><a href="/">Home</a></li>
                                {pages.map(page => (
                                    <li key={page._id}><a href={`/${page.slug}`}>{page.title}</a></li>
                                ))}
                            </ul>
                        </div>
                        <div className="copyright">
                            <span></span>
                        </div>
                    </div>
                </footer>

                <Script src="/js/jquery-1.11.3.min.js" strategy="afterInteractive" />
                <Script src="/js/bootstrap.min.js" strategy="afterInteractive" />
                <Script src="/js/masonry.pkgd.min.js" strategy="afterInteractive" />
                <SmartMenusLoader />
                <Script src="/js/custom.js" strategy="afterInteractive" />
            </body>
        </html>
    )
}
