'use client';

import { LanguageProvider } from '@/context/LanguageContext';

export default function ClientLayout({ children }) {
    return (
        <LanguageProvider>
            {children}
        </LanguageProvider>
    );
}
