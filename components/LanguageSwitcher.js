'use client';
import { useLanguage } from '@/context/LanguageContext';
import { dictionary } from '@/lib/dictionary';

export function LanguageSwitcher() {
    const { locale, changeLanguage, loading } = useLanguage();

    if (loading) return null;

    return (
        <li className="dropdown">
            <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                {locale === 'en' ? 'EN' : 'BG'} <span className="caret"></span>
            </a>
            <ul className="dropdown-menu">
                <li><a href="#" onClick={(e) => { e.preventDefault(); changeLanguage('en'); }}>English</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); changeLanguage('bg'); }}>Български</a></li>
            </ul>
        </li>
    );
}
