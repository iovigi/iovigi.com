import Script from 'next/script';

export const metadata = {
    title: 'Admin Panel',
    description: 'Blog Admin',
}

export default function AdminLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>AdminLTE 3 | Dashboard</title>
                <link rel="stylesheet" href="/admin/plugins/fontawesome-free/css/all.min.css" />
                <link rel="stylesheet" href="/admin/dist/css/adminlte.min.css" />
                <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700" rel="stylesheet" />
            </head>
            <body className="hold-transition sidebar-mini">
                <div className="wrapper">
                    {/* Navbar */}
                    <nav className="main-header navbar navbar-expand navbar-white navbar-light">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <a className="nav-link" data-widget="pushmenu" href="#" role="button"><i className="fas fa-bars"></i></a>
                            </li>
                            <li className="nav-item d-none d-sm-inline-block">
                                <a href="/admin" className="nav-link">Home</a>
                            </li>
                            <li className="nav-item d-none d-sm-inline-block">
                                <a href="/" className="nav-link">Public Site</a>
                            </li>
                        </ul>
                    </nav>

                    {/* Main Sidebar Container */}
                    <aside className="main-sidebar sidebar-dark-primary elevation-4">
                        <a href="/admin" className="brand-link">
                            <img src="/admin/dist/img/AdminLTELogo.png" alt="AdminLTE Logo" className="brand-image img-circle elevation-3" style={{ opacity: .8 }} />
                            <span className="brand-text font-weight-light">Admin Panel</span>
                        </a>
                        <div className="sidebar">
                            <nav className="mt-2">
                                <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                                    <li className="nav-item">
                                        <a href="/admin" className="nav-link">
                                            <i className="nav-icon fas fa-tachometer-alt"></i>
                                            <p>Dashboard</p>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a href="/admin/posts" className="nav-link">
                                            <i className="nav-icon fas fa-pen"></i>
                                            <p>Posts</p>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a href="/admin/pages" className="nav-link">
                                            <i className="nav-icon fas fa-file"></i>
                                            <p>Pages</p>
                                        </a>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </aside>

                    {/* Content Wrapper */}
                    <div className="content-wrapper">
                        {children}
                    </div>

                    {/* Footer */}
                    <footer className="main-footer">
                        <div className="float-right d-none d-sm-inline">
                            v1.0
                        </div>
                        <strong>Copyright &copy; 2025.</strong> All rights reserved.
                    </footer>
                </div>

                <Script src="/admin/plugins/jquery/jquery.min.js" strategy="beforeInteractive" />
                <Script src="/admin/plugins/bootstrap/js/bootstrap.bundle.min.js" strategy="afterInteractive" />
                <Script src="/admin/dist/js/adminlte.min.js" strategy="lazyOnload" />
            </body>
        </html>
    )
}
