/* =========================================================
   SECURITY PORTFOLIO: PROJECTS (slideshow + cards + README viewer)
   Data:      js/projects-data.js
   Markdown:  js/writeups-markdown.js (shared renderer, same one the Writeups page uses)
   README + images can live in this site (assets/projects/...) OR be loaded from GitHub (see projects-data.js)
   Sections:  1 Catalogue  2 Cards + filters  3 Slideshow  4 README viewer  5 Shared menu + clock
   ========================================================= */
(function () {
    'use strict';
    const cfg = window.PROJECTS_CONFIG;
    const grid = document.getElementById('pj-grid');
    if (!grid || window.__pjInit) return;
    window.__pjInit = true;
    const $ = id => document.getElementById(id);
    if (!cfg) { grid.textContent = 'Projects catalogue (js/projects-data.js) failed to load.'; return; }
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

    function el(tag, attrs, ...kids) {                        // safe DOM builder: text only goes through text nodes
        const n = document.createElement(tag);
        for (const [k, v] of Object.entries(attrs || {})) if (v != null && v !== false) n.setAttribute(k, v === true ? '' : v);
        kids.flat().forEach(k => { if (k != null && k !== false) n.append(k.nodeType ? k : document.createTextNode(String(k))); });
        return n;
    }
    function icon(svg) { const t = document.createElement('template'); t.innerHTML = svg; return t.content.firstChild; }   // static strings only
    const STAR = '<svg class="pj-star" viewBox="0 0 24 24" role="img" aria-label="Featured project"><polygon points="12 2 15.1 8.6 22 9.3 16.8 14 18.2 21 12 17.5 5.8 21 7.2 14 2 9.3 8.9 8.6 12 2"/></svg>';
    const CHEV = '<svg class="pj-chev" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
    const GH = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>';

    /* ---------- 1. CATALOGUE (validated: files must live inside basePath) ---------- */
    const ID_RE = /^[a-z0-9][a-z0-9-]*$/;
    const MD_RE = /^[a-z0-9][a-z0-9._-]*(?:\/[a-z0-9][a-z0-9._-]*)*\.md$/i;
    const IMG_RE = /^[a-z0-9][a-z0-9._-]*(?:\/[a-z0-9][a-z0-9._-]*)*\.(?:png|jpe?g|webp|gif|svg|avif)$/i;
    const BASE = new URL(cfg.basePath, location.href);
    const SITE_ROOT = new URL(cfg.siteRoot || '../', location.href);
    const cats = new Map(cfg.categories.map(c => [c.id, c.label]));
    function inBase(rel, re) {
        if (typeof rel !== 'string' || !re.test(rel) || rel.includes('..')) return null;
        const u = new URL(rel, BASE);
        return u.origin === BASE.origin && u.pathname.startsWith(BASE.pathname) ? u : null;
    }
    /* GitHub support: "readme" and "image" may be GitHub links (blob, raw or raw.githubusercontent).
       Only owners listed in githubOwners are accepted. Links are converted to raw.githubusercontent.com. */
    const MD_EXT = /\.md$/i, IMG_EXT = /\.(?:png|jpe?g|webp|gif|svg|avif)$/i;
    const OWNERS = (cfg.githubOwners || []).map(o => String(o).toLowerCase());
    function githubFile(link, extRe) {
        let u; try { u = new URL(link); } catch (e) { return null; }
        if (u.protocol !== 'https:') return null;
        const seg = u.pathname.split('/').filter(Boolean);
        let owner, repo, ref, rest;
        if (u.hostname === 'raw.githubusercontent.com') {                  // /owner/repo/ref/path  (or /owner/repo/refs/heads/ref/path)
            [owner, repo] = seg;
            if (seg[2] === 'refs' && seg[3] === 'heads') { ref = seg[4]; rest = seg.slice(5); } else { ref = seg[2]; rest = seg.slice(3); }
        } else if (u.hostname === 'github.com' && (seg[2] === 'blob' || seg[2] === 'raw')) {   // /owner/repo/blob/ref/path
            [owner, repo, , ref] = seg; rest = seg.slice(4);
        } else return null;
        if (!owner || !repo || !ref || !rest.length || !OWNERS.includes(owner.toLowerCase())) return null;
        let decoded; try { decoded = decodeURIComponent(rest.join('/')); } catch (e) { return null; }
        const parts = decoded.split('/');
        if (parts.some(p => !p || p === '.' || p === '..') || !extRe.test(parts[parts.length - 1])) return null;
        const tail = rest.join('/');
        return { url: new URL('https://raw.githubusercontent.com/' + owner + '/' + repo + '/' + ref + '/' + tail),
                 rawBase: 'https://raw.githubusercontent.com/' + owner + '/' + repo + '/' + ref + '/',
                 blobBase: 'https://github.com/' + owner + '/' + repo + '/blob/' + ref + '/',
                 blobFile: 'https://github.com/' + owner + '/' + repo + '/blob/' + ref + '/' + tail,
                 label: owner + '/' + repo + '/' + decoded };
    }
    function resolveFile(rel, extRe, localRe) {                           // GitHub link -> remote, anything else -> inside basePath
        if (typeof rel !== 'string') return null;
        if (/^https?:\/\//i.test(rel)) { const g = githubFile(rel, extRe); return g ? { url: g.url, remote: true, gh: g } : null; }
        const u = inBase(rel, localRe); return u ? { url: u, remote: false, gh: null } : null;
    }
    const seen = new Set();
    const items = cfg.items.filter(it => {
        const bad = m => { console.warn('[projects] skipped "' + (it && it.id) + '": ' + m); return false; };
        if (!it || !ID_RE.test(it.id || '')) return bad('invalid id');
        if (seen.has(it.id)) return bad('duplicate id');
        if (!cats.has(it.category)) return bad('unknown category');
        const rd = resolveFile(it.readme, MD_EXT, MD_RE);
        if (!rd) return bad('readme must be a .md file inside basePath, or a GitHub link (blob/raw) from an owner listed in githubOwners');
        it.readmeUrl = rd.url; it.remote = rd.remote; it.gh = rd.gh;
        const im = it.image ? resolveFile(it.image, IMG_EXT, IMG_RE) : null;
        it.imageUrl = im ? im.url : null;
        if (it.github) { try { const u = new URL(it.github); if (u.protocol !== 'https:' || u.hostname !== 'github.com') throw 0; it.ghHref = u.href; } catch (e) { return bad('github must be an https://github.com link'); } }
        else if (it.gh) it.ghHref = it.gh.blobFile;                       // no repo link given: use the README's own GitHub page
        else return bad('github link is required for READMEs stored on this site');
        it.skills = Array.isArray(it.skills) ? it.skills : [];
        it.haystack = [it.title, it.summary, cats.get(it.category), it.skills.join(' ')].join(' ').toLowerCase();
        seen.add(it.id); return true;
    });
    const byId = new Map(items.map(i => [i.id, i]));

    /* ---------- 2. CARDS + FILTERS + SEARCH ---------- */
    function setOpen(it, open) {
        it.card.classList.toggle('is-open', open);
        it.toggle.setAttribute('aria-expanded', String(open));
    }
    items.forEach(it => {
        const detailId = 'pj-d-' + it.id;
        const img = it.imageUrl ? el('img', { class: 'pj-img', src: it.imageUrl.href, alt: it.title + ' preview', loading: 'lazy', decoding: 'async' }) : null;
        if (img) img.addEventListener('error', () => img.remove());
        it.toggle = el('button', { type: 'button', class: 'pj-toggle', 'aria-expanded': 'false', 'aria-controls': detailId },
            el('span', { class: 'pj-name' }, it.title, it.featured || cfg.starAll ? icon(STAR) : null),   // star sits right after the title text
            icon(CHEV));
        it.toggle.addEventListener('click', () => setOpen(it, !it.card.classList.contains('is-open')));
        it.card = el('article', { class: 'pj-card', id: 'project-' + it.id, 'data-cat': it.category },
            el('span', { class: 'pj-cat' }, cats.get(it.category)),
            el('h3', { class: 'pj-title' }, it.toggle),
            el('ul', { class: 'pj-skills' }, it.skills.map(s => el('li', null, s))),
            el('div', { class: 'pj-detail', id: detailId, role: 'region', 'aria-label': it.title + ' details' },
                el('div', { class: 'pj-detail-inner' }, img, el('p', { class: 'pj-desc' }, it.summary))),
            el('div', { class: 'pj-foot' },
                el('button', { type: 'button', class: 'wr-more', 'data-readme': it.id, 'aria-label': 'View more: ' + it.title }, 'View More'),
                el('a', { class: 'pj-gh', href: it.ghHref, target: '_blank', rel: 'noopener noreferrer', 'aria-label': it.title + ' on GitHub (opens in a new tab)', title: 'View on GitHub' }, icon(GH))));
        grid.append(it.card);
    });

    const state = { cat: 'all', q: '' };
    const filterBox = $('pj-filters'), search = $('pj-search'), countEl = $('pj-count'), emptyEl = $('pj-empty');
    const btns = [{ id: 'all', label: 'All' }, ...cfg.categories].map(c => {
        const n = c.id === 'all' ? items.length : items.filter(i => i.category === c.id).length;
        const b = el('button', { type: 'button', class: 'wr-filter', 'data-cat': c.id, 'aria-pressed': String(c.id === 'all') }, c.label, ' ', el('span', { class: 'wr-filter-n' }, '(' + n + ')'));
        filterBox.append(b); return b;
    });
    function apply() {
        const terms = state.q.toLowerCase().split(/\s+/).filter(Boolean);
        let shown = 0;
        items.forEach(it => {
            const ok = (state.cat === 'all' || it.category === state.cat) && terms.every(t => it.haystack.includes(t));
            it.card.hidden = !ok; if (ok) shown++;
        });
        countEl.textContent = 'Showing ' + shown + ' of ' + items.length + ' projects';
        emptyEl.hidden = shown > 0;
    }
    function reset() { state.cat = 'all'; state.q = ''; search.value = ''; btns.forEach(x => x.setAttribute('aria-pressed', String(x.dataset.cat === 'all'))); apply(); }
    filterBox.addEventListener('click', e => {
        const b = e.target.closest('.wr-filter'); if (!b) return;
        state.cat = b.dataset.cat; btns.forEach(x => x.setAttribute('aria-pressed', String(x === b))); apply();
    });
    let t;
    search.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { state.q = search.value; apply(); }, 120); });
    search.addEventListener('keydown', e => { if (e.key === 'Escape' && search.value) { search.value = ''; state.q = ''; apply(); } });
    $('pj-clear').addEventListener('click', () => { reset(); search.focus(); });
    apply();

    /* slideshow "Read More": jump to the card, open it, highlight it */
    function goToProject(id) {
        const it = byId.get(id); if (!it) return;
        if (it.card.hidden) reset();
        setOpen(it, true);
        requestAnimationFrame(() => {
            it.card.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
            it.card.classList.remove('is-flash'); void it.card.offsetWidth; it.card.classList.add('is-flash');
            it.toggle.focus({ preventScroll: true });
        });
    }

    /* ---------- 3. SLIDESHOW (featured projects) ---------- */
    const feat = items.filter(i => i.featured);
    const ssSection = $('featured');
    if (!feat.length) { if (ssSection) ssSection.hidden = true; }
    else {
        const stage = $('ss-stage'), dotsBox = $('ss-dots');
        const slides = feat.map((it, i) => {
            const s = el('figure', { class: 'ss-slide', 'aria-roledescription': 'slide', 'aria-label': (i + 1) + ' of ' + feat.length },
                el('span', { class: 'ss-initial', 'aria-hidden': 'true' }, it.title.charAt(0)),
                el('figcaption', { class: 'ss-caption' },
                    el('div', null, el('span', { class: 'pj-cat' }, cats.get(it.category)), el('h3', { class: 'ss-title' }, it.title, icon(STAR))),
                    el('button', { type: 'button', class: 'wr-more', 'data-goto': it.id, 'aria-label': 'Read more: ' + it.title }, 'Read More')));
            if (it.imageUrl) {
                const img = el('img', { src: it.imageUrl.href, alt: it.title + ' preview', decoding: 'async', draggable: 'false' });
                img.addEventListener('error', () => img.remove());
                s.prepend(img);
            }
            stage.append(s); return s;
        });
        const dots = feat.map((it, i) => { const d = el('button', { type: 'button', 'aria-label': 'Show project ' + (i + 1) + ': ' + it.title }); d.addEventListener('click', () => show(i)); dotsBox.append(d); return d; });
        const AUTOPLAY_MS = 6000, SWIPE_PX = 50;
        let idx = 0, timer = null, visible = false, hovering = false, dragged = false;
        const schedule = () => { clearTimeout(timer); if (!reduced && feat.length > 1 && visible && !hovering) timer = setTimeout(() => show(idx + 1), AUTOPLAY_MS); };
        function show(i) {
            idx = (i + feat.length) % feat.length;
            slides.forEach((s, k) => { const on = k === idx; s.classList.toggle('is-active', on); s.setAttribute('aria-hidden', String(!on)); s.querySelector('button').tabIndex = on ? 0 : -1; });
            dots.forEach((d, k) => d.classList.toggle('is-active', k === idx));
            schedule();
        }
        $('ss-prev').addEventListener('click', () => show(idx - 1));
        $('ss-next').addEventListener('click', () => show(idx + 1));
        stage.addEventListener('click', e => {
            if (dragged) { dragged = false; return; }
            const g = e.target.closest('[data-goto]'); if (g) goToProject(g.dataset.goto);
        });
        let sx = null;
        stage.addEventListener('pointerdown', e => { sx = e.clientX; dragged = false; });
        stage.addEventListener('pointerup', e => { if (sx === null) return; const dx = e.clientX - sx; sx = null; if (Math.abs(dx) > SWIPE_PX) { dragged = true; show(idx + (dx < 0 ? 1 : -1)); } });
        stage.addEventListener('pointercancel', () => { sx = null; });
        stage.addEventListener('keydown', e => { if (e.key === 'ArrowRight') show(idx + 1); if (e.key === 'ArrowLeft') show(idx - 1); });
        const wrap = $('ss-wrap');
        wrap.addEventListener('mouseenter', () => { hovering = true; schedule(); });
        wrap.addEventListener('mouseleave', () => { hovering = false; schedule(); });
        wrap.addEventListener('focusin', () => { hovering = true; schedule(); });
        wrap.addEventListener('focusout', () => { hovering = false; schedule(); });
        new IntersectionObserver(en => { visible = en[0].isIntersecting; schedule(); }, { threshold: 0.3 }).observe(ssSection);
        if (feat.length < 2) wrap.classList.add('single');
        show(0);
    }

    /* ---------- 4. README VIEWER (same renderer + styles as the Writeups page) ---------- */
    const ov = $('pv'), dlg = ov.querySelector('.wv-dialog'), body = $('pv-body'), lb = $('pv-lightbox');
    const cache = new Map();
    let current = null, opener = null, token = 0, ctrl = null, lbOpener = null;
    class LoadError extends Error { constructor(kind, status) { super(kind); this.kind = kind; this.status = status; } }
    const ERR = {
        'file-protocol': 'This page was opened directly from your files (file://). Browsers block loading Markdown that way. Start a local server (for example "python -m http.server 8000" in the project folder) and open http://localhost:8000/html/portfolio.html.',
        'not-found': 'The README file could not be found. Check that the file exists and that "readme" in projects-data.js is correct. For GitHub links, check the branch and file name, and that the repository is public.',
        'libs': 'The Markdown libraries (marked / DOMPurify) did not load. Check your internet connection and the script tags in the page.',
        'empty': 'The README file is empty.', 'too-large': 'The README file is too large to display.',
        'http': 'The server returned an error while loading the README.', 'network': 'The README could not be loaded. Check your connection and try again.',
        'render': 'The README was loaded but could not be displayed.'
    };
    function showState(kind, it, err) {
        body.setAttribute('aria-busy', String(kind === 'loading'));
        body.replaceChildren(kind === 'loading'
            ? el('div', { class: 'wv-state', role: 'status' }, el('div', { class: 'wv-spinner', 'aria-hidden': 'true' }), el('p', null, 'Loading README\u2026'))
            : el('div', { class: 'wv-state wv-error', role: 'alert' }, el('h3', null, 'Could not open this README'), el('p', null, ERR[err.kind] || ERR.network),
                err.status ? el('p', { class: 'wv-error-detail' }, 'HTTP status: ' + err.status) : null,
                el('p', { class: 'wv-error-detail' }, 'File: ' + (it.gh ? it.gh.label : it.readme)),
                el('button', { type: 'button', class: 'wr-more', 'data-retry': '1' }, 'Try again')));
    }
    async function load(it) {
        const my = ++token; if (ctrl) ctrl.abort();
        showState('loading', it);
        try {
            let text = cache.get(it.id);
            if (text === undefined) {
                if (location.protocol === 'file:' && !it.remote) throw new LoadError('file-protocol');   // GitHub READMEs do not need a local server
                ctrl = new AbortController();
                const res = await fetch(it.readmeUrl.href, { signal: ctrl.signal });
                if (!res.ok) throw new LoadError(res.status === 404 ? 'not-found' : 'http', res.status);
                text = await res.text();
                if (!text.trim()) throw new LoadError('empty');
                if (/^\s*<(!doctype|html)/i.test(text)) throw new LoadError('not-found');
                if (text.length > 2 * 1024 * 1024) throw new LoadError('too-large');
                cache.set(it.id, text);
            }
            if (my !== token) return;
            if (!window.WriteupRenderer || !window.WriteupRenderer.ready()) throw new LoadError('libs');
            let out;
            try { out = window.WriteupRenderer.render(text, { reportUrl: it.readmeUrl, siteRoot: it.remote ? new URL('.', it.readmeUrl) : SITE_ROOT, hideLeadingH1: true, toc: true }); }
            catch (e) { console.error(e); throw new LoadError('render'); }
            if (my !== token) return;
            if (it.gh) fixGithubLinks(out.article, it.gh);
            body.replaceChildren(...[out.toc, out.article].filter(Boolean));
            body.setAttribute('aria-busy', 'false'); body.scrollTop = 0;
        } catch (e) {
            if (my !== token || e.name === 'AbortError') return;
            showState('error', it, e instanceof LoadError ? e : new LoadError('network'));
        }
    }
    /* relative links inside a GitHub README (e.g. docs/SETUP.md) would open the raw text file: send them to the normal GitHub page instead */
    function fixGithubLinks(root, gh) {
        root.querySelectorAll('a[href^="' + gh.rawBase + '"]').forEach(a => {
            if (a.querySelector('img')) return;                                // linked images stay as they are
            a.setAttribute('href', gh.blobBase + a.getAttribute('href').slice(gh.rawBase.length));
        });
    }
    const setInert = on => document.querySelectorAll('header.site-header, main').forEach(n => { n.inert = on; });
    function openReadme(it, from) {
        current = it; opener = from || document.activeElement;
        $('pv-title').textContent = it.title; $('pv-cat').textContent = cats.get(it.category);
        $('pv-tags').replaceChildren(...it.skills.map(s => el('li', null, s)));
        $('pv-path').textContent = it.gh ? it.gh.label : it.readme; $('pv-gh').href = it.ghHref;
        ov.hidden = false; document.documentElement.classList.add('wv-lock'); setInert(true);
        dlg.focus({ preventScroll: true });
        load(it);
    }
    function closeReadme() {
        if (ov.hidden) return;
        closeLightbox(true); token++; if (ctrl) ctrl.abort();
        ov.hidden = true; document.documentElement.classList.remove('wv-lock'); setInert(false);
        const back = opener && document.contains(opener) && !opener.closest('[hidden]') ? opener : null;
        (back || search).focus({ preventScroll: true }); current = null; opener = null;
    }
    function openLightbox(btn) {
        const img = btn.querySelector('img'); if (!img) return;
        const cap = btn.parentElement.querySelector('figcaption');
        lb.querySelector('img').src = img.currentSrc || img.src; lb.querySelector('img').alt = img.alt;
        $('pv-lb-cap').textContent = cap ? cap.textContent : img.alt;
        lbOpener = btn; lb.hidden = false; lb.querySelector('.wv-lb-close').focus();
    }
    function closeLightbox(silent) {
        if (lb.hidden) return;
        lb.hidden = true; lb.querySelector('img').removeAttribute('src');
        if (!silent && lbOpener) lbOpener.focus({ preventScroll: true }); lbOpener = null;
    }
    grid.addEventListener('click', e => { const b = e.target.closest('[data-readme]'); if (b) openReadme(byId.get(b.dataset.readme), b); });
    $('pv-close').addEventListener('click', closeReadme);
    ov.addEventListener('click', e => { if (e.target === ov) closeReadme(); });
    lb.addEventListener('click', () => closeLightbox());
    body.addEventListener('click', e => {
        const zoom = e.target.closest('.wr-zoom'); if (zoom) { openLightbox(zoom); return; }
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
            const tg = body.querySelector('#' + CSS.escape(a.getAttribute('href').slice(1)));
            if (tg) { body.scrollTo({ top: tg.getBoundingClientRect().top - body.getBoundingClientRect().top + body.scrollTop - 12, behavior: reduced ? 'auto' : 'smooth' }); tg.focus({ preventScroll: true }); }
            return;
        }
        if (e.target.closest('[data-retry]') && current) load(current);
    });
    document.addEventListener('keydown', e => {
        if (ov.hidden) return;
        if (e.key === 'Escape') { e.preventDefault(); lb.hidden ? closeReadme() : closeLightbox(); return; }
        if (e.key === 'Tab') {                                           // keep keyboard focus inside the viewer
            const root = lb.hidden ? dlg : lb;
            const f = [...root.querySelectorAll('button:not([disabled]), a[href], summary, [tabindex]:not([tabindex="-1"])')].filter(n => n.offsetParent !== null);
            if (!f.length) return;
            const first = f[0], last = f[f.length - 1];
            if (!root.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
            else if (e.shiftKey && (document.activeElement === first || document.activeElement === root)) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
    });
    if (byId.has(location.hash.slice(1))) goToProject(location.hash.slice(1));      // portfolio.html#<id> opens that project card
})();

/* =========================================================
   5. SHARED: hamburger menu + live clock
   (safe even if main.js or another script also contains the menu code)
   ========================================================= */
(function () {
    const getToggle = () => document.querySelector('.menu-toggle');
    const getNav = () => document.querySelector('.main-nav');
    function setMenu(open) {
        const toggle = getToggle(), nav = getNav();
        if (!toggle || !nav) return;
        nav.classList.toggle('is-open', open); toggle.classList.toggle('is-active', open);
        toggle.setAttribute('aria-expanded', String(open)); document.body.style.overflow = open ? 'hidden' : '';
    }
    document.addEventListener('click', event => {
        const nav = getNav(); if (!nav) return;
        if (event.target.closest('.menu-toggle')) { event.stopImmediatePropagation(); setMenu(!nav.classList.contains('is-open')); return; }
        if (event.target.closest('.main-nav .nav-link')) setMenu(false);
    }, true);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
    window.addEventListener('resize', () => { if (window.innerWidth > 950) setMenu(false); });
    const clock = document.getElementById('live-clock');
    function tick() { if (clock) clock.textContent = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }); }
    tick(); setInterval(tick, 1000);
})();
