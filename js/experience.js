/* =========================================================
   EXPERIENCE PAGE SCRIPT (only this page)
   Data:  js/experience-data.js (edit your roles there)
   - vertical timeline, newest first
   - filters: All (default) / Technical / Management. The other type collapses and turns grey.
   - the Skills card on the right follows the role you click or scroll to
   - experience.html#<id> (the "View More" link on the home page) opens that role
   ========================================================= */
(function () {
    'use strict';
    const cfg = window.EXPERIENCE_CONFIG;
    const timeline = document.getElementById('xp-timeline');
    if (!timeline || window.__xpInit) return;
    window.__xpInit = true;
    if (!cfg) { timeline.textContent = 'Experience data (js/experience-data.js) failed to load.'; return; }
    const $ = id => document.getElementById(id);
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* sections shown in each card, in this order (a section is skipped when it has no content) */
    const SECTIONS = {
        technical:  [['problem', 'Problem Statement'], ['achievements', 'Achievements'], ['responsibilities', 'Responsibilities'], ['learnings', 'Learnings and Takeaways']],
        management: [['aim', 'Project Aim'],           ['achievements', 'Achievements'], ['responsibilities', 'Responsibilities'], ['learnings', 'Learnings and Takeaways']]
    };
    const TYPE_LABEL = { technical: 'Technical', management: 'Management' };

    function el(tag, attrs, ...kids) {                              // safe DOM builder: text only goes through text nodes
        const n = document.createElement(tag);
        for (const [k, v] of Object.entries(attrs || {})) if (v != null && v !== false) n.setAttribute(k, v === true ? '' : v);
        kids.flat().forEach(k => { if (k != null && k !== false) n.append(k.nodeType ? k : document.createTextNode(String(k))); });
        return n;
    }
    function logo(src, name, cls) {                                  // missing logo file -> first letter of the name
        const img = el('img', { class: cls, src, alt: name + ' logo', loading: 'lazy', decoding: 'async' });
        img.addEventListener('error', () => img.replaceWith(el('div', { class: 'xp-fallback', 'aria-hidden': 'true' }, name.charAt(0))));
        return img;
    }

    /* ---------- dates + totals ---------- */
    const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const parse = s => { if (s === 'present') return { y: now.getFullYear(), m: now.getMonth(), label: 'Present' }; const [y, m] = s.split('-').map(Number); return { y, m: m - 1, label: MONTHS[m - 1] + ' ' + y }; };
    const items = cfg.items.filter(it => it && /^[a-z0-9][a-z0-9-]*$/.test(it.id || '') && SECTIONS[it.type]).map(it => {
        const s = parse(it.start), f = parse(it.end);
        return Object.assign({}, it, { s, f, months: (f.y - s.y) * 12 + (f.m - s.m) + 1 });
    }).sort((a, b) => (b.s.y * 12 + b.s.m) - (a.s.y * 12 + a.s.m));                      // newest first
    const byId = new Map(items.map(i => [i.id, i]));
    const total = items.reduce((n, i) => n + i.months, 0), yrs = Math.floor(total / 12), mos = total % 12;
    $('xp-total').textContent = (yrs ? yrs + (yrs === 1 ? ' yr ' : ' yrs ') : '') + (mos ? mos + (mos === 1 ? ' mo' : ' mos') : (yrs ? '' : '0 mos')) +
        '  \u2022  ' + items.length + ' roles (' + items.filter(i => i.type === 'technical').length + ' technical, ' + items.filter(i => i.type === 'management').length + ' management)';

    /* ---------- timeline cards ---------- */
    const listOrText = v => Array.isArray(v) ? el('ul', null, v.map(x => el('li', null, x))) : el('p', null, v);
    const chips = (cls, arr) => el('ul', { class: 'xp-pills ' + cls }, (arr || []).map(x => el('li', null, x)));
    items.forEach(it => {
        const body = el('div', { class: 'xp-body-pad' });
        SECTIONS[it.type].forEach(([key, title]) => {
            const v = it[key];
            if (!v || (Array.isArray(v) && !v.length)) return;
            body.append(el('div', { class: 'xp-sec' + (key === 'achievements' ? ' ach' : '') }, el('h4', null, key === 'achievements' ? '\u2605 ' + title : title), listOrText(v)));
        });
        body.append(el('div', { class: 'xp-sec xp-inline-skills' }, el('h4', null, 'Skills and concepts'), chips('tools', it.tools), chips('concepts', it.concepts)));
        it.dot = el('span', { class: 'xp-dot', 'aria-hidden': 'true' });
        it.card = el('article', { class: 'xp-card', tabindex: '0', 'aria-label': it.company + ', ' + it.role },
            el('div', { class: 'xp-top' }, logo(it.logo, it.company, 'xp-logo'),
                el('div', { class: 'xp-who' }, el('h3', { class: 'xp-company' }, it.company), el('p', { class: 'xp-role' }, it.role),
                    el('p', { class: 'xp-dur' }, it.s.label + ' \u2013 ' + it.f.label + ' \u00b7 ' + it.months + (it.months === 1 ? ' mo' : ' mos'))),
                el('span', { class: 'xp-type' }, TYPE_LABEL[it.type])),
            el('div', { class: 'xp-body' }, el('div', { class: 'xp-body-in' }, body)));
        it.el = el('div', { class: 'xp-item', id: 'role-' + it.id, 'data-type': it.type },
            it.dot, el('p', { class: 'xp-when' }, it.s.label + ' \u2013 ' + it.f.label), it.card);
        timeline.append(it.el);
    });

    /* ---------- education ---------- */
    const ed = cfg.education;
    if (ed) $('xp-edu').append(el('div', { class: 'terminal-frame' }, el('div', { class: 'term-window' },
        el('div', { class: 'term-bar' }, el('span', { class: 'dot dot-red' }), el('span', { class: 'dot dot-yellow' }), el('span', { class: 'dot dot-green' }), el('span', { class: 'term-status' }, 'EDUCATION.sh')),
        el('div', { class: 'term-body' },
            el('p', { class: 'term-cmd' }, el('span', { class: 'term-prompt' }, '$'), ' ./education.sh'),
            el('div', { class: 'xp-edu-head' }, logo(ed.logo, ed.school, 'xp-edu-logo'), el('div', null, el('h3', { class: 'xp-edu-uni' }, ed.school), el('p', { class: 'xp-edu-course' }, ed.course))),
            el('p', { class: 'xp-edu-dur' }, ed.duration), el('p', { class: 'xp-edu-desc' }, ed.desc)))));

    /* ---------- skills card (follows the active role) ---------- */
    const panel = $('xp-skills');
    let active = null, fadeTimer = null;
    function drawSkills(it) {
        panel.replaceChildren(el('h3', null, 'Skills and Concepts'), el('p', { class: 'for' }, it.company + ' \u00b7 ' + it.role),
            el('h5', null, 'Skills and tools used'), chips('tools', it.tools),
            (it.concepts && it.concepts.length) ? el('h5', null, 'Concepts learned') : null, (it.concepts && it.concepts.length) ? chips('concepts', it.concepts) : null);
    }
    function setActive(it, instant) {
        if (!it || it === active) return;
        active = it;
        items.forEach(x => x.el.classList.toggle('is-active', x === it));
        clearTimeout(fadeTimer);
        if (reduced || instant) { drawSkills(it); panel.classList.remove('is-fading'); return; }
        panel.classList.add('is-fading');
        fadeTimer = setTimeout(() => { drawSkills(it); panel.classList.remove('is-fading'); }, 200);
    }

    /* ---------- filters ---------- */
    let filter = 'all';
    const btns = [...document.querySelectorAll('.xp-filter')];
    btns.forEach(b => { const t = b.dataset.filter; b.querySelector('.n').textContent = '(' + (t === 'all' ? items.length : items.filter(i => i.type === t).length) + ')'; });
    const visible = () => items.filter(i => filter === 'all' || i.type === filter);
    let lockUntil = 0;
    function scrollToItem(it) {
        lockUntil = Date.now() + 900;                                // do not let scroll-spy fight a deliberate scroll
        const top = it.el.getBoundingClientRect().top + scrollY - 140;     // leave room for the menu + sticky filter bar
        scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
    }
    function setFilter(f, moveTo) {
        filter = f;
        btns.forEach(b => { const on = b.dataset.filter === f; b.setAttribute('aria-pressed', String(on)); b.classList.toggle('is-active', on); });
        items.forEach(it => {
            const collapsed = f !== 'all' && it.type !== f;
            it.el.classList.toggle('is-collapsed', collapsed);
            it.card.setAttribute('aria-expanded', String(!collapsed));
            it.card.title = collapsed ? 'Show ' + TYPE_LABEL[it.type] + ' roles' : '';
        });
        const first = visible().find(i => i === moveTo) || visible()[0];
        if (first) { setActive(first); setTimeout(() => scrollToItem(first), 80); }
    }
    btns.forEach(b => b.addEventListener('click', () => setFilter(b.dataset.filter)));

    /* clicking a card makes it the active role; clicking a collapsed card switches to its type */
    items.forEach(it => {
        const open = () => {
            lockUntil = Date.now() + 700;                                // a click wins over a pending scroll-spy update
            if (it.el.classList.contains('is-collapsed')) setFilter(it.type, it); else setActive(it);
        };
        it.card.addEventListener('click', open);
        it.card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
    });

    /* ---------- scroll-spy: the role you are reading becomes the active one ---------- */
    let ticking = false;
    function spy() {
        ticking = false;
        if (Date.now() < lockUntil) return;
        const line = innerHeight * 0.4; let best = null, bd = Infinity;
        visible().forEach(it => {
            const r = it.el.getBoundingClientRect();
            if (r.bottom < 130 || r.top > innerHeight) return;
            const d = (r.top <= line && r.bottom >= line) ? 0 : Math.min(Math.abs(r.top - line), Math.abs(r.bottom - line));
            if (d < bd) { bd = d; best = it; }
        });
        if (best) setActive(best);
    }
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(spy); } }, { passive: true });

    /* ---------- deep link: experience.html#<id> ---------- */
    function fromHash(instant) {
        const it = byId.get(location.hash.slice(1));
        if (!it) return false;
        if (filter !== 'all' && it.type !== filter) setFilter('all');
        active = null; setActive(it, instant === true); setTimeout(() => scrollToItem(it), 150);
        return true;
    }
    addEventListener('hashchange', () => fromHash());
    if (!fromHash(true)) setActive(items[0], true);
})();

/* =========================================================
   SHARED: hamburger menu + live clock
   (this page does not load home.js, so the menu code lives here too;
    it is safe even if main.js or another script also contains it)
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
