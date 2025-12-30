'use client';

import Script from 'next/script';

export default function SmartMenusLoader() {
    const handleSmartMenusLoad = () => {
        // Function to load bootstrap addon after main plugin is confirmed loaded
        function loadBootstrapAddon() {
            if (typeof window !== 'undefined' && window.jQuery && window.jQuery.fn.smartmenus) {
                // Check if already loaded
                if (document.querySelector('script[src="/js/jquery.smartmenus.bootstrap.min.js"]')) {
                    return;
                }
                const script = document.createElement('script');
                script.src = '/js/jquery.smartmenus.bootstrap.min.js';
                script.async = false;
                document.body.appendChild(script);
            } else {
                // Retry if not immediately available
                setTimeout(loadBootstrapAddon, 50);
            }
        }

        // Small delay to ensure the plugin is fully registered
        setTimeout(loadBootstrapAddon, 10);
    };

    return (
        <Script 
            src="/js/jquery.smartmenus.min.js" 
            strategy="afterInteractive"
            id="smartmenus-main"
            onLoad={handleSmartMenusLoad}
        />
    );
}

