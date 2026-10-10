/* ==========================================================================
   SolderJoint.in — shared behaviour
   No dependencies other than the locally vendored QR library.
   Every enhancement here is non-essential: pages stay usable without JS.
   ========================================================================== */
(function () {
    'use strict';

    var GA_WHATSAPP_EVENT = 'whatsapp_click';
    var DESKTOP_NAV_MIN_WIDTH = 780;

    function closest(el, selector) {
        while (el && el.nodeType === 1) {
            if (el.matches && el.matches(selector)) { return el; }
            el = el.parentElement;
        }
        return null;
    }

    /* ---------------------------------------------------------------------
       Analytics — report WhatsApp CTA taps so the owner can see which
       product pages and which CTA positions actually convert.
       --------------------------------------------------------------------- */
    function trackWhatsAppClick(anchor) {
        if (typeof window.gtag !== 'function') { return; }
        var payload = {
            cta_location: anchor.getAttribute('data-wa-location') || 'unknown',
            link_url: anchor.href,
            transport_type: 'beacon'
        };
        var product = anchor.getAttribute('data-wa-product');
        if (product) { payload.product_name = product; }
        window.gtag('event', GA_WHATSAPP_EVENT, payload);
    }

    function initClickTracking() {
        document.addEventListener('click', function (event) {
            var anchor = closest(event.target, 'a[href]');
            if (!anchor) { return; }
            if (anchor.getAttribute('data-wa-location') || /(^|\.)wa\.me$/.test(anchor.hostname)) {
                trackWhatsAppClick(anchor);
            }
        }, true);
    }

    /* ---------------------------------------------------------------------
       Mobile navigation
       --------------------------------------------------------------------- */
    function initNavigation() {
        var toggle = document.querySelector('.nav-toggle');
        var nav = document.getElementById('site-nav');
        if (!toggle || !nav) { return; }

        function setOpen(open) {
            nav.classList.toggle('is-open', open);
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        }

        toggle.addEventListener('click', function () {
            setOpen(toggle.getAttribute('aria-expanded') !== 'true');
        });

        nav.addEventListener('click', function (event) {
            if (closest(event.target, 'a')) { setOpen(false); }
        });

        document.addEventListener('click', function (event) {
            if (closest(event.target, '.site-header')) { return; }
            setOpen(false);
        });

        document.addEventListener('keydown', function (event) {
            if (event.key !== 'Escape' && event.key !== 'Esc') { return; }
            if (toggle.getAttribute('aria-expanded') !== 'true') { return; }
            setOpen(false);
            toggle.focus();
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth >= DESKTOP_NAV_MIN_WIDTH) { setOpen(false); }
        });
    }

    /* ---------------------------------------------------------------------
       Mark the current section in the navigation
       --------------------------------------------------------------------- */
    function normalizePath(pathname) {
        var path = pathname.replace(/index\.html$/, '');
        if (path.length > 1) { path = path.replace(/\/+$/, ''); }
        return path === '' ? '/' : path;
    }

    function initActiveNav() {
        var links = document.querySelectorAll('.site-nav__link');
        if (!links.length) { return; }

        var here = normalizePath(window.location.pathname);

        Array.prototype.forEach.call(links, function (link) {
            var href = link.getAttribute('href');
            if (!href) { return; }

            var target = normalizePath(new URL(href, window.location.href).pathname);
            var isCurrent;

            if (target === '/') {
                isCurrent = here === '/';
            } else {
                var section = target.replace(/\.html$/, '');
                isCurrent = here === target || here === section ||
                            here.indexOf(section + '/') === 0;
            }

            if (isCurrent) { link.setAttribute('aria-current', 'page'); }
            else { link.removeAttribute('aria-current'); }
        });
    }

    /* ---------------------------------------------------------------------
       WhatsApp QR code, with a button fallback if the library is missing
       --------------------------------------------------------------------- */
    function renderQrFallback(host, panel, url) {
        var hint = panel && panel.querySelector('.qr-panel__hint');
        if (hint) { hint.textContent = 'Open WhatsApp to start a chat.'; }

        var frame = host.parentElement;
        if (!frame) { return; }

        var link = document.createElement('a');
        link.className = 'btn btn--accent btn--block';
        link.href = url;
        link.setAttribute('data-wa-location', 'qr_fallback');
        link.textContent = 'Chat on WhatsApp';
        frame.innerHTML = '';
        frame.appendChild(link);
    }

    function initQrCode() {
        var host = document.getElementById('qrcode');
        if (!host) { return; }

        var url = host.getAttribute('data-qr-url');
        if (!url) { return; }

        var panel = closest(host, '.qr-panel');

        if (typeof window.QRCode !== 'function') {
            renderQrFallback(host, panel, url);
            return;
        }

        try {
            var options = {
                text: url,
                width: 512,
                height: 512,
                colorDark: '#1d2c3b',
                colorLight: '#ffffff'
            };
            if (window.QRCode.CorrectLevel) {
                options.correctLevel = window.QRCode.CorrectLevel.H;
            }
            new window.QRCode(host, options);
        } catch (error) {
            renderQrFallback(host, panel, url);
        }
    }

    /* ---------------------------------------------------------------------
       Category filter on the products page (all cards show without JS)
       --------------------------------------------------------------------- */
    function initCategoryFilter() {
        var chips = document.querySelectorAll('[data-filter]');
        var blocks = document.querySelectorAll('.category-block[data-category]');
        if (!chips.length || !blocks.length) { return; }

        var empty = document.getElementById('filter-empty');

        function applyFilter(value) {
            var shown = 0;

            Array.prototype.forEach.call(chips, function (chip) {
                chip.setAttribute('aria-pressed',
                    chip.getAttribute('data-filter') === value ? 'true' : 'false');
            });

            Array.prototype.forEach.call(blocks, function (block) {
                var match = value === 'all' || block.getAttribute('data-category') === value;
                if (match) { block.removeAttribute('hidden'); shown++; }
                else { block.setAttribute('hidden', ''); }
            });

            if (empty) {
                if (shown) { empty.setAttribute('hidden', ''); }
                else { empty.removeAttribute('hidden'); }
            }
        }

        Array.prototype.forEach.call(chips, function (chip) {
            chip.addEventListener('click', function () {
                applyFilter(chip.getAttribute('data-filter'));
            });
        });
    }

    /* ---------------------------------------------------------------------
       Footer copyright year
       --------------------------------------------------------------------- */
    function initYear() {
        var year = String(new Date().getFullYear());
        Array.prototype.forEach.call(document.querySelectorAll('[data-year]'), function (el) {
            el.textContent = year;
        });
    }

    function init() {
        initNavigation();
        initActiveNav();
        initQrCode();
        initCategoryFilter();
        initYear();
        initClickTracking();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
