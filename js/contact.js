/* =========================================================
   CONTACT PAGE SCRIPT (only html/contact.html): hamburger menu + live clock.
   (The form logic is in js/contact-form.js, shared with the home page.)
   Safe even if main.js or another script also contains the menu code.
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
