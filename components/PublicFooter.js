'use client';

import { useLanguage } from '@/context/LanguageContext';
import { dictionary } from '@/lib/dictionary';

export default function PublicFooter({ pages }) {
    const { locale } = useLanguage();
    const t = dictionary[locale] || dictionary.en;

    return (
        <footer id="footer" className="footer">
            <div className="container">
                <div className="footer-nav">
                    <ul className="nav navbar-nav">
                        <li><a href="/">{t.home}</a></li>
                        {pages.map(page => {
                            // Filter based on visibility and get localized title
                            const isVisible = page.isVisible?.[locale] ?? (locale === 'en' ? true : false);
                            if (!isVisible) return null;

                            const title = page.title?.[locale] || page.title?.en || "Untitled";
                            return (
                                <li key={page._id}><a href={`/${page.slug}`}>{title}</a></li>
                            );
                        })}
                    </ul>
                </div>
                <div className="copyright">
                    <p>
                        <a href="https://github.com/iovigi/iovigi.com" target="_blank" rel="noopener noreferrer" style={{ color: '#fff' }}>
                            {t.sourceCode}
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
