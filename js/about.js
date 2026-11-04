/* =========================================================
   ABOUT ME PAGE SCRIPT (only this page)
   0. If assets/about/me.jpg is missing the bubble shows the text only.
   1. The bubble changes colour by itself: blue -> red -> purple -> every colour (click it, or a
      colour card below, to jump to a colour). 2. The bubble drifts slightly with the mouse.
   Edit the PHASES list (labels / timing) here. The story text lives in html/about.html.
   ========================================================= */
(function () {
    const PHASES = [
        { id: 'blue',    label: 'blue' },
        { id: 'red',     label: 'red' },
        { id: 'purple',  label: 'purple' },
        { id: 'rainbow', label: 'every colour' }
    ];
    const CHANGE_EVERY_MS = 3800;

    const bubble = document.getElementById('ab-bubble');
    if (!bubble) return;
    const stage = document.getElementById('ab-stage');
    const label = document.getElementById('ab-phase');
    const steps = [...document.querySelectorAll('.ab-step')];
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let index = 0, timer = null, paused = false;

    /* if the photo file is missing, fall back to the text-only bubble instead of a broken image */
    const photo = bubble.querySelector('.ab-photo');
    if (photo) {
        const noPhoto = () => bubble.classList.add('no-photo');
        photo.addEventListener('error', noPhoto);
        if (photo.complete && photo.naturalWidth === 0) noPhoto();
    }

    function setPhase(i) {
        index = (i + PHASES.length) % PHASES.length;
        const p = PHASES[index];
        bubble.dataset.phase = p.id;
        label.textContent = p.label;
        steps.forEach(s => s.classList.toggle('is-active', s.dataset.phase === p.id));
        schedule();
    }
    function schedule() {
        clearTimeout(timer);
        if (reduced || paused) return;
        timer = setTimeout(() => setPhase(index + 1), CHANGE_EVERY_MS);
    }

    bubble.addEventListener('click', () => setPhase(index + 1));
    bubble.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setPhase(index + 1); } });
    steps.forEach(s => s.addEventListener('click', () => setPhase(PHASES.findIndex(p => p.id === s.dataset.phase))));
    [bubble, ...steps].forEach(n => {                           // pause while the visitor is pointing at a colour
        n.addEventListener('mouseenter', () => { paused = true; clearTimeout(timer); });
        n.addEventListener('mouseleave', () => { paused = false; schedule(); });
    });
    document.addEventListener('visibilitychange', () => { if (document.hidden) clearTimeout(timer); else schedule(); });

    /* the bubble leans towards the mouse a little */
    if (!reduced && matchMedia('(hover: hover)').matches) {
        window.addEventListener('pointermove', e => {
            const r = stage.getBoundingClientRect();
            const nx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2)));
            const ny = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2)));
            stage.style.setProperty('--px', nx.toFixed(3)); stage.style.setProperty('--py', ny.toFixed(3));
        }, { passive: true });
    }
    setPhase(0);
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
