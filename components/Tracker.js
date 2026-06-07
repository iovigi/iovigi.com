'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function Tracker() {
    const pathname = usePathname();
    const lastTrackedPath = useRef(null);

    useEffect(() => {
        // Prevent double tracking in React StrictMode/hot reloads if the path hasn't changed
        if (lastTrackedPath.current === pathname) {
            return;
        }

        // Only track public visits, exclude admin dashboard and API calls
        if (pathname.startsWith('/admin') || pathname.startsWith('/api')) {
            return;
        }

        lastTrackedPath.current = pathname;

        const recordVisit = async () => {
            try {
                await fetch('/api/track', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ path: pathname }),
                });
            } catch (error) {
                console.error('Failed to log page visit:', error);
            }
        };

        recordVisit();
    }, [pathname]);

    return null;
}
