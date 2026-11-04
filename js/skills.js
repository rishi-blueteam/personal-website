/* =========================================================
   SKILLS PAGE SCRIPT (only this page)
   EDIT ONLY the SKILLS list below: title, description, skills (the blue pills), link.
     icon / mark   which small icon (top-left tile / faint corner icon) to use: see ICONS
     link          where "View Evidence / View Projects" goes (your Writeups page for now)
     linkLabel     text of that link
   Add, remove or reorder cards by editing the list: the grid adapts.
   ========================================================= */
(function () {
    const SKILLS = [
        { title: "Programming Languages", desc: "Building automation, analysis tools and scripts.",
          skills: ["Python", "PowerShell", "SQL", "KQL", "HTML & CSS"],
          icon: "code", mark: "code", link: "blogs.html", linkLabel: "View Projects" },
        { title: "Network Security", desc: "Analyzing and securing networks.",
          skills: ["WIPS", "Network Traffic Analysis", "Packet Analysis", "TCP/IP", "Firewall", "IPS/IDS", "VPN"],
          icon: "network", mark: "network", link: "blogs.html", linkLabel: "View Evidence" },
        { title: "SOC Operations", desc: "Detecting, investigating and responding to threats.",
          skills: ["Security Alert Analysis", "Log Analysis", "Incident Escalation", "Threat Detection", "SIEM"],
          icon: "shield", mark: "radar", link: "blogs.html", linkLabel: "View Evidence" },
        { title: "Security Tools & SIEM Platforms", desc: "Tools used for threat detection and analysis.",
          skills: ["Wireshark", "Snort", "Tcpdump", "VirusTotal", "Wazuh", "Elastic Search", "Splunk", "Microsoft Sentinel"],
          icon: "wrench", mark: "monitor", link: "blogs.html", linkLabel: "View Evidence" },
        { title: "Cyber Frameworks", desc: "Following industry standards and frameworks.",
          skills: ["NIST", "Pyramid of Pain", "MITRE ATT&CK"],
          icon: "layers", mark: "columns", link: "blogs.html", linkLabel: "View Evidence" },
        { title: "Soft Skills", desc: "Collaborating, communicating and problem solving.",
          skills: ["Communication", "Critical Thinking", "SLA Management"],
          icon: "chat", mark: "people", link: "blogs.html", linkLabel: "View Evidence" }
    ];

    /* icon artwork (24x24 line icons). Use any of these names for "icon" and "mark". */
    const ICONS = {
        code:    '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/><line x1="14" y1="4" x2="10" y2="20"/>',
        network: '<circle cx="12" cy="5" r="2.5"/><circle cx="5" cy="19" r="2.5"/><circle cx="19" cy="19" r="2.5"/><path d="M12 7.5v4M12 11.5l-5.5 5.5M12 11.5l5.5 5.5"/>',
        shield:  '<path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5l8-3z"/><path d="M9 12l2 2 4-4"/>',
        wrench:  '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.4 2.4-2.6-.6-.6-2.6z"/>',
        layers:  '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
        chat:    '<path d="M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-6.4A8 8 0 1 1 21 12z"/>',
        radar:   '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/><path d="M12 12 19 5"/>',
        monitor: '<rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/><polyline points="5 13 9 9 12 12 17 7"/>',
        columns: '<path d="M3 21h18M5 21V10M9 21V10M15 21V10M19 21V10M2 10l10-7 10 7z"/>',
        people:  '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14c3 0 5 2 5 5"/>'
    };
    const EXTERNAL = '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>';

    const grid = document.getElementById('sk-grid');
    if (!grid) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

    function el(tag, attrs, ...kids) {                          // safe DOM builder: text only goes through text nodes
        const n = document.createElement(tag);
        for (const [k, v] of Object.entries(attrs || {})) if (v != null && v !== false) n.setAttribute(k, v === true ? '' : v);
        kids.flat().forEach(k => { if (k != null && k !== false) n.append(k.nodeType ? k : document.createTextNode(String(k))); });
        return n;
    }
    function svg(cls, inner) {                                  // inner comes from the ICONS list above (static)
        const t = document.createElement('template');
        t.innerHTML = '<svg class="' + cls + '" viewBox="0 0 24 24" aria-hidden="true">' + inner + '</svg>';
        return t.content.firstChild;
    }

    const cards = SKILLS.map(s => {
        const card = el('article', { class: 'sk-card' },
            svg('sk-mark', ICONS[s.mark] || ''),
            el('div', { class: 'sk-top' },
                el('span', { class: 'sk-tile' }, svg('', ICONS[s.icon] || '')),
                el('div', null, el('h2', { class: 'sk-title' }, s.title), el('p', { class: 'sk-sub' }, s.desc))),
            el('ul', { class: 'sk-chips', 'aria-label': s.title + ' skills' }, s.skills.map(k => el('li', null, k))),
            el('a', { class: 'sk-link', href: s.link || 'blogs.html' },
                svg('', EXTERNAL), s.linkLabel || 'View Evidence', el('span', { class: 'arrow', 'aria-hidden': 'true' }, '\u2192')));
        grid.append(card); return card;
    });

    /* cards fade up one after another when they scroll into view */
    if (!reduced && 'IntersectionObserver' in window) {
        cards.forEach(c => c.classList.add('is-pending'));
        const io = new IntersectionObserver(entries => entries.forEach(e => {
            if (!e.isIntersecting) return;
            const i = cards.indexOf(e.target);
            setTimeout(() => e.target.classList.remove('is-pending'), (i % 3) * 120);
            io.unobserve(e.target);
        }), { threshold: 0.12 });
        cards.forEach(c => io.observe(c));
    }
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
