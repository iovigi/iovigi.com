import Script from 'next/script';

export const metadata = {
    title: 'Admin Login',
    description: 'Login to Admin Panel',
}

export default function AuthLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>Admin Login</title>
                <link rel="stylesheet" href="/admin/plugins/fontawesome-free/css/all.min.css" />
                <link rel="stylesheet" href="/admin/dist/css/adminlte.min.css" />
                <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700" rel="stylesheet" />
            </head>
            <body className="hold-transition login-page">
                {children}

                <Script src="/admin/plugins/jquery/jquery.min.js" strategy="beforeInteractive" />
                <Script src="/admin/plugins/bootstrap/js/bootstrap.bundle.min.js" strategy="afterInteractive" />
                <Script src="/admin/dist/js/adminlte.min.js" strategy="lazyOnload" />
            </body>
        </html>
    )
}
