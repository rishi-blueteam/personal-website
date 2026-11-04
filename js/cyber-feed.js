/* =========================================================
   LIVE CYBER FEED BAR (home page only)
   Shows one security headline at a time (auto-rotates, arrows to move, click opens the article).
   Where the headlines come from:
     1) LIVE: public security RSS feeds, read through the free rss2json.com service (browsers cannot read those feeds directly).
        The result is cached in the visitor's browser for CACHE_MINUTES.
     2) FALLBACK: if the live feeds cannot be loaded, a short list of permanent security resources (RESOURCES below)
        is shown instead, and the label changes from "LIVE CYBER FEED" to "CYBER RESOURCES", so nothing fake is ever called live.
   Edit the SETTINGS and FEEDS below.
   ========================================================= */
(function () {
    'use strict';
    const bar = document.getElementById('cyber-feed');
    if (!bar || window.__cyfInit) return;
    window.__cyfInit = true;

    const SETTINGS = {
        live: true,            // false = never contact any feed, always show RESOURCES
        rotateMs: 6500,        // time each headline stays
        maxItems: 12,          // how many headlines to rotate through
        maxAgeDays: 14,        // ignore news older than this
        cacheMinutes: 30,      // how long a loaded feed is reused before asking again
        timeoutMs: 7000        // give up on a feed after this long
    };
    const FEEDS = [            // add / remove feeds: { name: label shown on the bar, url: RSS address }
        { name: 'CISA',             url: 'https://www.cisa.gov/cybersecurity-advisories/all.xml' },
        { name: 'The Hacker News',  url: 'https://feeds.feedburner.com/TheHackersNews' },
        { name: 'BleepingComputer', url: 'https://www.bleepingcomputer.com/feed/' }
    ];
    const proxy = u => 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(u);
    const RESOURCES = [        // permanent pages, shown only when live news is unavailable
        { title: 'Known Exploited Vulnerabilities catalog: patch what attackers are already using', source: 'CISA', url: 'https://www.cisa.gov/known-exploited-vulnerabilities-catalog' },
        { title: 'MITRE ATT&CK: browse adversary tactics and techniques', source: 'MITRE', url: 'https://attack.mitre.org/' },
        { title: 'Cybersecurity advisories and alerts', source: 'CISA', url: 'https://www.cisa.gov/news-events/cybersecurity-advisories' },
        { title: 'Search the National Vulnerability Database', source: 'NIST NVD', url: 'https://nvd.nist.gov/vuln/search' },
        { title: 'Check whether your email appeared in a data breach', source: 'Have I Been Pwned', url: 'https://haveibeenpwned.com/' }
    ];

    const $ = id => document.getElementById(id);
    const track = bar.querySelector('.cyf-track'), titleEl = $('cyf-title'), srcEl = $('cyf-source'), timeEl = $('cyf-time'), labelEl = $('cyf-label');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const CACHE_KEY = 'rlgnd_cyber_feed';
    let items = [], idx = 0, timer = null, hovering = false;

    /* ---------- helpers ---------- */
    const decode = s => new DOMParser().parseFromString(String(s || ''), 'text/html').documentElement.textContent.replace(/\s+/g, ' ').trim();   // turns &amp; into &, never runs code
    const safeUrl = u => { try { const x = new URL(u); return (x.protocol === 'https:' || x.protocol === 'http:') ? x.href : ''; } catch (e) { return ''; } };
    function ago(ms) {
        const m = Math.max(1, Math.round((Date.now() - ms) / 60000));
        return m < 60 ? m + 'm ago' : m < 1440 ? Math.floor(m / 60) + 'h ago' : Math.floor(m / 1440) + 'd ago';
    }

    /* ---------- show one headline ---------- */
    function draw(it) {
        titleEl.textContent = it.title;
        if (it.url) { titleEl.setAttribute('href', it.url); titleEl.setAttribute('target', '_blank'); titleEl.setAttribute('rel', 'noopener noreferrer'); titleEl.title = it.title; }
        else { titleEl.removeAttribute('href'); titleEl.removeAttribute('target'); titleEl.removeAttribute('rel'); }
        srcEl.textContent = it.source;
        timeEl.textContent = it.time ? ' - ' + ago(it.time) : '';
    }
    function show(i, instant) {
        if (!items.length) return;
        idx = (i + items.length) % items.length;
        clearTimeout(timer);
        if (reduced || instant) draw(items[idx]);
        else { track.classList.add('is-changing'); setTimeout(() => { draw(items[idx]); track.classList.remove('is-changing'); }, 200); }
        schedule();
    }
    function schedule() {
        clearTimeout(timer);
        if (reduced || items.length < 2 || hovering || document.hidden) return;
        timer = setTimeout(() => show(idx + 1), SETTINGS.rotateMs);
    }
    function setMode(mode) {                                           // 'live' | 'fallback' | 'loading'
        bar.classList.toggle('is-loading', mode === 'loading');
        bar.classList.toggle('is-fallback', mode === 'fallback');
        labelEl.textContent = mode === 'live' ? 'LIVE CYBER FEED' : mode === 'fallback' ? 'CYBER RESOURCES' : 'CYBER FEED';
    }
    function useItems(list, mode) { items = list; idx = 0; setMode(mode); show(0, true); }

    /* ---------- loading the live feeds ---------- */
    async function loadFeed(f) {
        const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), SETTINGS.timeoutMs);
        try {
            const res = await fetch(proxy(f.url), { signal: ctl.signal });
            if (!res.ok) throw new Error('HTTP ' + res.status);
            const data = await res.json();
            if (data.status !== 'ok' || !Array.isArray(data.items)) throw new Error('bad feed');
            return data.items.map(x => ({
                title: decode(x.title), source: f.name, url: safeUrl(x.link),
                time: Date.parse(String(x.pubDate || '').replace(' ', 'T') + (/[zZ]|[+-]\d\d:?\d\d$/.test(x.pubDate || '') ? '' : 'Z'))   // rss2json gives UTC without a zone
            }));
        } finally { clearTimeout(t); }
    }
    async function getLive() {
        const results = await Promise.allSettled(FEEDS.map(loadFeed));
        const cutoff = Date.now() - SETTINGS.maxAgeDays * 86400000, seen = new Set();
        return results.filter(r => r.status === 'fulfilled').flatMap(r => r.value)
            .filter(x => x.title && Number.isFinite(x.time) && x.time >= cutoff && x.time <= Date.now() + 3600000)
            .sort((a, b) => b.time - a.time)
            .filter(x => { const k = x.title.toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true; })
            .slice(0, SETTINGS.maxItems);
    }
    function readCache() {
        try { const c = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null'); if (c && Array.isArray(c.items) && c.items.length) return c; } catch (e) { /* ignore */ }
        return null;
    }

    async function init() {
        setMode('loading'); titleEl.textContent = 'Loading the latest security news...';
        if (!SETTINGS.live) { useItems(RESOURCES, 'fallback'); return; }
        const cache = readCache(), fresh = cache && (Date.now() - cache.t) < SETTINGS.cacheMinutes * 60000;
        if (fresh) { useItems(cache.items, 'live'); return; }
        try {
            const live = await getLive();
            if (!live.length) throw new Error('no recent items');
            try { localStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), items: live })); } catch (e) { /* storage blocked */ }
            useItems(live, 'live');
        } catch (e) {
            const stale = cache && cache.items.filter(x => x.time >= Date.now() - SETTINGS.maxAgeDays * 86400000);
            if (stale && stale.length) useItems(stale, 'live'); else useItems(RESOURCES, 'fallback');
        }
    }

    /* ---------- controls ---------- */
    $('cyf-prev').addEventListener('click', () => show(idx - 1));
    $('cyf-next').addEventListener('click', () => show(idx + 1));
    bar.addEventListener('mouseenter', () => { hovering = true; clearTimeout(timer); });
    bar.addEventListener('mouseleave', () => { hovering = false; schedule(); });
    bar.addEventListener('focusin', () => { hovering = true; clearTimeout(timer); });
    bar.addEventListener('focusout', () => { hovering = false; schedule(); });
    document.addEventListener('visibilitychange', () => { if (document.hidden) clearTimeout(timer); else schedule(); });
    init();
})();
