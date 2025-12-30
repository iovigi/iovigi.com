// Wrapper script that waits for SmartMenus plugin to be available before loading bootstrap addon
(function() {
    function loadBootstrapAddon() {
        if (typeof window !== 'undefined' && window.jQuery && window.jQuery.fn && window.jQuery.fn.smartmenus) {
            // Check if already loaded
            if (document.querySelector('script[src="/js/jquery.smartmenus.bootstrap.min.js"]')) {
                return;
            }
            var script = document.createElement('script');
            script.src = '/js/jquery.smartmenus.bootstrap.min.js';
            script.async = false;
            document.body.appendChild(script);
        } else {
            // Retry if not immediately available
            setTimeout(loadBootstrapAddon, 50);
        }
    }
    
    // Start checking when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(loadBootstrapAddon, 100);
        });
    } else {
        setTimeout(loadBootstrapAddon, 100);
    }
})();

