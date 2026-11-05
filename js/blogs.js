/* =========================================================
   WRITEUPS PAGE  (cards, filters, search, report viewer)
   Data:      js/writeups-data.js      (catalogue, edit this to add writeups)
   Markdown:  js/writeups-markdown.js  (renderer)
   Sections:  1 Catalogue  2 Cards  3 Filters + search  4 Report viewer  5 Shared menu + clock
   ========================================================= */
(function () {
    'use strict';

    function initWriteups() {
        const cfg = window.WRITEUPS_CONFIG;
        const grid = document.getElementById('wr-grid');
        if (!grid || window.__wrInit) return;
        window.__wrInit = true;
        const $ = id => document.getElementById(id);
        if (!cfg) { grid.textContent = 'Writeups catalogue (js/writeups-data.js) failed to load.'; return; }

        /* ---------- helpers ---------- */
        function el(tag, attrs, ...kids) {                      
            const n = document.createElement(tag);
            for (const [k, v] of Object.entries(attrs || {})) if (v != null && v !== false) n.setAttribute(k, v === true ? '' : v);
            kids.flat().forEach(k => { if (k != null && k !== false) n.append(k.nodeType ? k : document.createTextNode(String(k))); });
            return n;
        }
        function icon(svg) { const t = document.createElement('template'); t.innerHTML = svg; return t.content.firstChild; }
        const EYE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>';
        const OUT = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>';
        const fmtViews = n => n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1).replace('.0', '') + 'k' : String(n);
        const fmtDate = s => {
            const m = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/.exec(s || ''); if (!m) return '';
            const d = new Date(Date.UTC(+m[1], +m[2] - 1, +(m[3] || 1)));
            return d.toLocaleDateString('en-US', m[3] ? { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' } : { year: 'numeric', month: 'short', timeZone: 'UTC' });
        };

        /* ---------- 1. CATALOGUE (Updated to support path, url, or github readme) ---------- */
        const ID_RE = /^[a-z0-9][a-z0-9-]*$/;
        const MD_RE = /^[a-z0-9][a-z0-9._-\s]*(?:\/[a-z0-9][a-z0-9._-\s]*)*\.md$/i;
        const IMG_RE = /^[a-z0-9][a-z0-9._-\s]*(?:\/[a-z0-9][a-z0-9._-\s]*)*\.(?:png|jpe?g|webp|gif|svg|avif)$/i;
        
        const BASE = new URL(cfg.basePath, location.href);
        const SITE_ROOT = new URL(cfg.siteRoot || '../', location.href);
        const cats = new Map(cfg.categories.map(c => [c.id, c.label]));

        function inBase(rel, re) {
            if (typeof rel !== 'string' || !re.test(rel) || rel.includes('..')) return null;
            const u = new URL(rel, BASE);
            return u.origin === BASE.origin && u.pathname.startsWith(BASE.pathname) ? u : null;
        }
        
        const seen = new Set();
        const items = (cfg.items || []).filter(it => {
            const bad = msg => { console.warn('[writeups] skipped "' + (it && it.id) + '": ' + msg); return false; };
            if (!it || !ID_RE.test(it.id || '')) return bad('invalid id');
            if (seen.has(it.id)) return bad('duplicate id');
            if (!cats.has(it.category)) return bad('unknown category');
            
            // Ensure exactly one valid source exists (path, url, or readme)
            const sources = [it.path, it.url, it.readme].filter(Boolean).length;
            if (sources !== 1) return bad('needs exactly one of "path", "url", or "readme"');

            if (it.path) {
                it.mdUrl = inBase(it.path, MD_RE); 
                if (!it.mdUrl) return bad('path must be a .md file inside basePath');
            } else if (it.readme) {
                if (it.readme.startsWith('http')) {
                    // Convert GitHub blob URL to raw GitHub URL (just like projects)
                    const rawUrl = it.readme.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
                    try {
                        it.mdUrl = new URL(rawUrl);
                    } catch (e) {
                        return bad('invalid readme github link');
                    }
                } else {
                    it.mdUrl = inBase(it.readme, MD_RE);
                    if (!it.mdUrl) return bad('readme path must be a valid .md file inside basePath');
                }
                it.path = it.readme; // Treat readme as a valid report path for the viewer
            } else { 
                try { 
                    const u = new URL(it.url); 
                    if (u.protocol !== 'https:') throw 0; 
                    it.href = u.href; 
                } catch (e) { 
                    return bad('url must be a valid https link'); 
                } 
            }

            it.thumbUrl = it.thumbnail ? inBase(it.thumbnail, IMG_RE) : null;
            it.tags = Array.isArray(it.tags) ? it.tags : [];
            it.haystack = [it.title, it.summary, it.platform, cats.get(it.category), it.tags.join(' ')].join(' ').toLowerCase();
            seen.add(it.id); return true;
        }).sort((a, b) => (b.date || '').localeCompare(a.date || ''));
        const byId = new Map(items.map(i => [i.id, i]));

        /* ---------- 2. CARDS ---------- */
        items.forEach(it => {
            const thumb = el('div', { class: 'wr-thumb' }, el('span', { class: 'wr-initial', 'aria-hidden': 'true' }, cats.get(it.category).charAt(0)));
            if (it.thumbUrl) {
                const img = el('img', { src: it.thumbUrl.href, alt: '', loading: 'lazy', decoding: 'async' });
                img.addEventListener('error', () => img.remove());
                thumb.append(img);
            }
            thumb.append(el('span', { class: 'wr-badge' }, cats.get(it.category)));
            const date = fmtDate(it.date);
            const views = el('span', { class: 'wr-views', 'aria-label': (it.views || 0) + ' views', title: (it.views || 0) + ' views' }, icon(EYE), el('span', { class: 'wr-views-n' }, fmtViews(it.views || 0)));
            
            // Support opening via modal if it uses path or readme
            const more = (it.path || it.readme)
                ? el('button', { type: 'button', class: 'wr-more', 'data-open': it.id, 'aria-label': 'Read more: ' + it.title }, 'Read More')
                : el('a', { class: 'wr-more', href: it.href, target: '_blank', rel: 'noopener noreferrer', 'aria-label': 'Read more: ' + it.title + ' (opens in a new tab)' }, 'Read More ', icon(OUT));
            
            it.viewsEl = views.querySelector('.wr-views-n');
            it.card = el('article', { class: 'wr-card', 'data-cat': it.category },
                thumb,
                el('div', { class: 'wr-body' },
                    el('h3', { class: 'wr-title' }, it.title),
                    el('p', { class: 'wr-meta' }, it.platform || '', it.platform && date ? ' \u2022 ' : '', date ? el('time', { datetime: it.date }, date) : null),
                    el('p', { class: 'wr-summary' }, it.summary),
                    it.tags.length ? el('ul', { class: 'wr-tags' }, it.tags.map(t => el('li', null, t))) : null,
                    el('div', { class: 'wr-foot' }, views, more)));
            grid.append(it.card);
        });

        if (cfg.viewsProvider && typeof cfg.viewsProvider.get === 'function')
            items.forEach(it => Promise.resolve(cfg.viewsProvider.get(it.id)).then(n => { if (Number.isFinite(n)) it.viewsEl.textContent = fmtViews(n); }).catch(() => {}));

        /* ---------- 3. FILTERS + SEARCH ---------- */
        const state = { cat: 'all', q: '' };
        const filterBox = $('wr-filters'), search = $('wr-search'), countEl = $('wr-count'), emptyEl = $('wr-empty');
        if (!filterBox || !search) return;

        const filterBtns = [{ id: 'all', label: 'All' }, ...cfg.categories].map(c => {
            const n = c.id === 'all' ? items.length : items.filter(i => i.category === c.id).length;
            const b = el('button', { type: 'button', class: 'wr-filter', 'data-cat': c.id, 'aria-pressed': String(c.id === 'all') }, c.label, ' ', el('span', { class: 'wr-filter-n' }, '(' + n + ')'));
            filterBox.append(b); return b;
        });

        function applyFilters() {
            const terms = state.q.toLowerCase().split(/\s+/).filter(Boolean);
            let shown = 0;
            items.forEach(it => {
                const ok = (state.cat === 'all' || it.category === state.cat) && terms.every(t => it.haystack.includes(t));
                it.card.hidden = !ok; if (ok) shown++;
            });
            countEl.textContent = 'Showing ' + shown + ' of ' + items.length + ' writeups';
            emptyEl.hidden = shown > 0;
        }

        filterBox.addEventListener('click', e => {
            const b = e.target.closest('.wr-filter'); if (!b) return;
            state.cat = b.dataset.cat;
            filterBtns.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
            applyFilters();
        });

        let timer;
        search.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(() => { state.q = search.value; applyFilters(); }, 120); });
        search.addEventListener('keydown', e => { if (e.key === 'Escape' && search.value) { search.value = ''; state.q = ''; applyFilters(); } });
        
        const clearBtn = $('wr-clear');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                state.cat = 'all'; state.q = ''; search.value = '';
                filterBtns.forEach(x => x.setAttribute('aria-pressed', String(x.dataset.cat === 'all')));
                applyFilters(); search.focus();
            });
        }
        applyFilters();

        /* ---------- 4. REPORT VIEWER ---------- */
        const ov = $('wv'), dlg = ov.querySelector('.wv-dialog'), body = $('wv-body'), lb = $('wv-lightbox');
        const MAX_BYTES = 2 * 1024 * 1024;
        const cache = new Map();
        let current = null, navList = [], opener = null, token = 0, ctrl = null, lbOpener = null;
        const reports = () => items.filter(i => i.path);
        const visibleReports = () => reports().filter(i => !i.card.hidden);

        class LoadError extends Error { constructor(kind, status) { super(kind); this.kind = kind; this.status = status; } }
        const ERRORS = {
            'file-protocol': 'This page was opened directly from your files (file://). Start a local server (python -m http.server 8000) and open http://localhost:8000/html/blogs.html.',
            'not-found': 'The report file could not be found. Check that the file exists and that the path in writeups-data.js is correct.',
            'libs': 'The Markdown libraries did not load correctly.',
            'empty': 'The report file is empty.',
            'too-large': 'The report file is too large to display.',
            'http': 'The server returned an error while loading the report.',
            'network': 'The report could not be loaded. Check your connection.',
            'render': 'The report was loaded but could not be displayed.'
        };

        function setHeader(it) {
            $('wv-title').textContent = it.title;
            $('wv-cat').textContent = cats.get(it.category);
            $('wv-platform').textContent = it.platform || '';
            $('wv-platform').hidden = !it.platform;
            const d = fmtDate(it.date); $('wv-date').textContent = d; $('wv-date').hidden = !d;
            const tags = $('wv-tags'); tags.replaceChildren(...it.tags.map(t => el('li', null, t)));
            const i = navList.indexOf(it), multi = navList.length > 1;
            $('wv-nav').hidden = !multi;
            $('wv-pos').textContent = (i + 1) + ' / ' + navList.length;
            if (multi) {
                const prev = navList[(i - 1 + navList.length) % navList.length], next = navList[(i + 1) % navList.length];
                $('wv-prev').setAttribute('aria-label', 'Previous writeup: ' + prev.title); $('wv-prev').title = prev.title;
                $('wv-next').setAttribute('aria-label', 'Next writeup: ' + next.title); $('wv-next').title = next.title;
            }
        }

        function showState(kind, it, err) {
            body.setAttribute('aria-busy', String(kind === 'loading'));
            if (kind === 'loading') {
                body.replaceChildren(el('div', { class: 'wv-state', role: 'status' }, el('div', { class: 'wv-spinner', 'aria-hidden': 'true' }), el('p', null, 'Loading report\u2026')));
            } else {
                body.replaceChildren(el('div', { class: 'wv-state wv-error', role: 'alert' },
                    el('h3', null, 'Could not open this report'),
                    el('p', null, ERRORS[err.kind] || ERRORS.network),
                    err.status ? el('p', { class: 'wv-error-detail' }, 'HTTP status: ' + err.status) : null,
                    it.path ? el('p', { class: 'wv-error-detail' }, 'File / URL: ' + it.path) : null,
                    el('button', { type: 'button', class: 'wr-more', 'data-retry': '1' }, 'Try again')));
            }
        }

        async function load(it) {
            const my = ++token; if (ctrl) ctrl.abort();
            showState('loading', it);
            try {
                let text = cache.get(it.id);
                if (text === undefined) {
                    if (location.protocol === 'file:') throw new LoadError('file-protocol');
                    ctrl = new AbortController();
                    const res = await fetch(it.mdUrl.href, { signal: ctrl.signal });
                    if (!res.ok) throw new LoadError(res.status === 404 ? 'not-found' : 'http', res.status);
                    text = await res.text();
                    if (!text.trim()) throw new LoadError('empty');
                    if (/^\s*<(!doctype|html)/i.test(text)) throw new LoadError('not-found');
                    if (text.length > MAX_BYTES) throw new LoadError('too-large');
                    cache.set(it.id, text);
                }
                if (my !== token) return;
                if (!window.WriteupRenderer || !window.WriteupRenderer.ready()) throw new LoadError('libs');
                let out;
                try { out = window.WriteupRenderer.render(text, { reportUrl: it.mdUrl, siteRoot: SITE_ROOT, toc: it.toc }); }
                catch (e) { console.error(e); throw new LoadError('render'); }
                if (my !== token) return;
                body.replaceChildren(...[out.toc, out.article].filter(Boolean));
                body.setAttribute('aria-busy', 'false'); body.scrollTop = 0;
            } catch (e) {
                if (my !== token || e.name === 'AbortError') return;
                showState('error', it, e instanceof LoadError ? e : new LoadError('network'));
            }
        }

        function setInert(on) { document.querySelectorAll('header.site-header, main').forEach(n => { n.inert = on; }); }
        function openReport(it, from, fromHash) {
            const wasOpen = !ov.hidden;
            current = it;
            const vis = visibleReports();
            navList = vis.includes(it) ? vis : reports();
            if (!wasOpen) opener = from || document.activeElement;
            setHeader(it);
            if (!wasOpen) {
                ov.hidden = false; document.documentElement.classList.add('wv-lock'); setInert(true);
                dlg.focus({ preventScroll: true });
            }
            if (!fromHash) { try { history.replaceState(null, '', '#' + it.id); } catch (e) {} }
            if (cfg.viewsProvider && typeof cfg.viewsProvider.hit === 'function') try { cfg.viewsProvider.hit(it.id); } catch (e) {}
            load(it);
        }

        function closeReport(fromHash) {
            if (ov.hidden) return;
            closeLightbox(true);
            token++; if (ctrl) ctrl.abort();
            ov.hidden = true; document.documentElement.classList.remove('wv-lock'); setInert(false);
            if (!fromHash) { try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {} }
            const back = opener && document.contains(opener) && !opener.closest('[hidden]') ? opener : null;
            (back || search).focus({ preventScroll: true });
            current = null; opener = null;
        }

        function step(dir) {
            if (!current || navList.length < 2) return;
            openReport(navList[(navList.indexOf(current) + dir + navList.length) % navList.length], opener);
            dlg.focus({ preventScroll: true });
        }

        function openLightbox(btn) {
            const img = btn.querySelector('img'); if (!img) return;
            const cap = btn.parentElement.querySelector('figcaption');
            lb.querySelector('img').src = img.currentSrc || img.src; lb.querySelector('img').alt = img.alt;
            $('wv-lb-cap').textContent = cap ? cap.textContent : img.alt;
            lbOpener = btn; lb.hidden = false; lb.querySelector('.wv-lb-close').focus();
        }
        function closeLightbox(silent) {
            if (lb.hidden) return;
            lb.hidden = true; lb.querySelector('img').removeAttribute('src');
            if (!silent && lbOpener) lbOpener.focus({ preventScroll: true });
            lbOpener = null;
        }

        grid.addEventListener('click', e => {
            const b = e.target.closest('[data-open]'); if (!b) return;
            const it = byId.get(b.dataset.open); if (it) openReport(it, b);
        });
        $('wv-close').addEventListener('click', () => closeReport());
        $('wv-prev').addEventListener('click', () => step(-1));
        $('wv-next').addEventListener('click', () => step(1));
        ov.addEventListener('click', e => { if (e.target === ov) closeReport(); });
        lb.addEventListener('click', () => closeLightbox());
        
        body.addEventListener('click', e => {
            const zoom = e.target.closest('.wr-zoom');
            if (zoom) { openLightbox(zoom); return; }
            const copy = e.target.closest('.wr-copy');
            if (copy) {
                const code = copy.closest('.wr-code').querySelector('code');
                const done = ok => { copy.textContent = ok ? 'Copied!' : 'Press Ctrl+C'; setTimeout(() => { copy.textContent = 'Copy'; }, 1600); };
                if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(code.textContent).then(() => done(true), () => done(false));
                else { const r = document.createRange(); r.selectNodeContents(code); const s = getSelection(); s.removeAllRanges(); s.addRange(r); done(false); }
                return;
            }
            const a = e.target.closest('a[href^="#rep-"]');
            if (a) {
                e.preventDefault();
                const t = body.querySelector('#' + CSS.escape(a.getAttribute('href').slice(1)));
                if (t) { body.scrollTo({ top: t.getBoundingClientRect().top - body.getBoundingClientRect().top + body.scrollTop - 12, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); t.focus({ preventScroll: true }); }
                return;
            }
            if (e.target.closest('[data-retry]') && current) load(current);
        });

        document.addEventListener('keydown', e => {
            if (ov.hidden) return;
            if (e.key === 'Escape') { e.preventDefault(); lb.hidden ? closeReport() : closeLightbox(); return; }
            if (e.key === 'Tab') {
                const root = lb.hidden ? dlg : lb;
                const f = [...root.querySelectorAll('button:not([disabled]), a[href], summary, [tabindex]:not([tabindex="-1"])')].filter(n => n.offsetParent !== null);
                if (!f.length) return;
                const first = f[0], last = f[f.length - 1];
                if (!root.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
                else if (e.shiftKey && (document.activeElement === first || document.activeElement === root)) { e.preventDefault(); last.focus(); }
                else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
                return;
            }
            if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && lb.hidden && !e.altKey && !e.ctrlKey && !e.metaKey && !e.target.closest('.wr-code pre, .wr-table, input, textarea'))
                step(e.key === 'ArrowRight' ? 1 : -1);
        });

        function fromHash() {
            const it = byId.get(location.hash.slice(1));
            if (it && it.path) { if (!current || current.id !== it.id) openReport(it, null, true); }
            else if (!location.hash && !ov.hidden) closeReport(true);
        }
        window.addEventListener('hashchange', fromHash);
        fromHash();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWriteups);
    } else {
        initWriteups();
    }
})();

/* =========================================================
   5. SHARED: hamburger menu + live clock
   ========================================================= */
(function () {
    const getToggle = () => document.querySelector('.menu-toggle');
    const getNav = () => document.querySelector('.main-nav');
    function setMenu(open) {
        const toggle = getToggle(), nav = getNav();
        if (!toggle || !nav) return;
        nav.classList.toggle('is-open', open);
        toggle.classList.toggle('is-active', open);
        toggle.setAttribute('aria-expanded', String(open));
        document.body.style.overflow = open ? 'hidden' : '';
    }
    document.addEventListener('click', event => {
        const nav = getNav();
        if (!nav) return;
        if (event.target.closest('.menu-toggle')) { event.stopImmediatePropagation(); setMenu(!nav.classList.contains('is-open')); return; }
        if (event.target.closest('.main-nav .nav-link')) setMenu(false);
    }, true);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
    window.addEventListener('resize', () => { if (window.innerWidth > 950) setMenu(false); });
    const clock = document.getElementById('live-clock');
    function tick() { if (clock) clock.textContent = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }); }
    tick(); setInterval(tick, 1000);
})();