'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    const [locale, setLocale] = useState('en');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Check Cookie
        const savedLocale = Cookies.get('NEXT_LOCALE');
        if (savedLocale) {
            setLocale(savedLocale);
            setLoading(false);
            return;
        }

        // 2. Auto-detect Bulgaria
        const isBulgaria = () => {
            try {
                // Check Timezone
                const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                if (timezone === 'Europe/Sofia') return true;

                // Check Navigator Language
                const navLang = navigator.language || navigator.userLanguage;
                if (navLang && (navLang.toLowerCase() === 'bg' || navLang.toLowerCase() === 'bg-bg')) {
                    return true;
                }
            } catch (e) {
                console.warn('Locale detection failed', e);
            }
            return false;
        };

        if (isBulgaria()) {
            setLocale('bg');
            Cookies.set('NEXT_LOCALE', 'bg', { expires: 365 });
        } else {
            setLocale('en'); // Default
            Cookies.set('NEXT_LOCALE', 'en', { expires: 365 });
        }
        setLoading(false);
    }, []);

    const changeLanguage = (lang) => {
        setLocale(lang);
        Cookies.set('NEXT_LOCALE', lang, { expires: 365 });
        // Reload to refresh server components/data fetching if needed
        // window.location.reload(); 
        // OR just updating context is enough for client components. 
        // For hybrid Next.js, refreshing often ensures Server Components re-fetch data in new lang.
        // For now, we will just update state and let components react, but typically a reload is safer for full switch.
        window.location.reload();
    };

    return (
        <LanguageContext.Provider value={{ locale, changeLanguage, loading }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}
