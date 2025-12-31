'use client';

import { useLanguage } from '@/context/LanguageContext';
import { dictionary } from '@/lib/dictionary';
import { LanguageSwitcher } from './LanguageSwitcher';

export default function PublicNavbar({ pages }) {
    const { locale } = useLanguage();
    const t = dictionary[locale] || dictionary.en;

    return (
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
                            <li className="active"><a href="/">{t.home}</a></li>
                            {pages.map(page => {
                                // Filter based on visibility and get localized title
                                const isVisible = page.isVisible?.[locale] ?? (locale === 'en' ? true : false);
                                if (!isVisible) return null;

                                const title = page.title?.[locale] || page.title?.en || "Untitled";
                                return (
                                    <li key={page._id}><a href={`/${page.slug}`}>{title}</a></li>
                                );
                            })}
                            <LanguageSwitcher />
                        </ul>
                    </div>
                </div>
            </div>
        </header>
    );
}
