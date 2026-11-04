/* =========================================================
   HOME PAGE SCRIPT (only this page). Menu highlight is in main.js.
   Terminal sequence:
   1. "./Intro.sh" is typed after the $
   2. the summary paragraph types out inside the terminal
   3. the Download CV button appears
   Edit the speeds below. Edit the summary text in html/home.html (#intro-text).
   ========================================================= */
(function () {
    const SETTINGS = {
        commandSpeedMs: 70,      // typing speed of ./Intro.sh
        textSpeedMs: 14,         // typing speed of the paragraph
        pauseAfterCommandMs: 500
    };

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cmdEl = document.getElementById('typed-cmd');
    const textEl = document.getElementById('intro-text');
    const cursor = document.getElementById('cmd-cursor');
    const button = document.getElementById('cv-btn');
    if (!cmdEl || !textEl || !button || reduced) return;   // reduced motion: show everything instantly

    const wait = ms => new Promise(r => setTimeout(r, ms));
    async function type(el, text, speed) {
        el.textContent = '';
        for (const ch of text) { el.textContent += ch; await wait(speed); }
    }

    const command = cmdEl.textContent;
    const paragraph = textEl.textContent.trim();
    cmdEl.textContent = '';
    textEl.textContent = '';
    button.classList.add('is-hidden');

    (async function run() {
        await type(cmdEl, command, SETTINGS.commandSpeedMs);
        await wait(SETTINGS.pauseAfterCommandMs);
        cursor.style.display = 'none';                     // cursor moves to the end of the paragraph
        const tail = document.createElement('span');
        tail.className = 'terminal-cursor';
        tail.textContent = '_';
        textEl.after(tail); tail.style.display = 'none';
        await type(textEl, paragraph, SETTINGS.textSpeedMs);
        button.classList.remove('is-hidden');
    })();
})();



/* =========================================================
   SHARED NAVIGATION (hamburger menu)
   Capture-phase handler: works even if main.js also has menu code,
   because it stops that second handler from toggling the menu back.
   ========================================================= */
(function () {
    const getToggle = () => document.querySelector(".menu-toggle");
    const getNav = () => document.querySelector(".main-nav");

    function setMenu(open) {
        const toggle = getToggle(), nav = getNav();
        if (!toggle || !nav) return;
        nav.classList.toggle("is-open", open);
        toggle.classList.toggle("is-active", open);
        toggle.setAttribute("aria-expanded", String(open));
        document.body.style.overflow = open ? "hidden" : "";
    }

    // 'true' = capture phase, so this runs before any other click handler
    document.addEventListener("click", event => {
        const nav = getNav();
        if (!nav) return;

        if (event.target.closest(".menu-toggle")) {
            event.stopImmediatePropagation();          // blocks duplicate handlers elsewhere
            setMenu(!nav.classList.contains("is-open"));
            return;
        }
        if (event.target.closest(".main-nav .nav-link")) setMenu(false);   // close after choosing a link
    }, true);

    document.addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });
    window.addEventListener("resize", () => { if (window.innerWidth > 950) setMenu(false); });
})();


/* ==========================================
   1. Live Clock (top-right corner of page)
   ========================================== 
*/
(function() {
    function updateClock() {
        const clockEl = document.getElementById('live-clock');
        if (clockEl) {
            const now = new Date();
            clockEl.textContent = now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            });
        }
    }
    updateClock();
    setInterval(updateClock, 1000);
})();


/* ==========================================
   2. Certifications Section (terminal typing + button reveal)
   ========================================== 
*/
// Certifications: type command -> list lines appear one by one -> button appears
(function () {
    const box = document.getElementById('cert-terminal');
    const cmd = document.getElementById('cert-cmd');
    const btn = document.getElementById('verify-btn');
    if (!box || !cmd || !btn) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const items = box.querySelectorAll('.cert-done li');
    const wait = ms => new Promise(r => setTimeout(r, ms));
    const text = cmd.textContent;
    cmd.textContent = '';
    items.forEach(li => li.classList.add('is-hidden'));
    btn.classList.add('is-hidden');

    let started = false;
    const observer = new IntersectionObserver(async (entries) => {
        if (!entries[0].isIntersecting || started) return;
        started = true;
        observer.disconnect();
        for (const ch of text) { cmd.textContent += ch; await wait(70); }
        await wait(400);
        for (const li of items) { li.classList.remove('is-hidden'); await wait(350); }
        await wait(200);
        btn.classList.remove('is-hidden');
    }, { threshold: 0.4 });
    observer.observe(box);
})();



// Fade-in on scroll for sections below the hero
(function () {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const sections = document.querySelectorAll('.home-section');
    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
        });
    }, { threshold: 0.15 });
    sections.forEach(s => { s.classList.add('reveal'); io.observe(s); });
})();


/* ==========================================
   3. Experience timeline (data-driven)
   EDIT ONLY the EXPERIENCE list below.
   type:  "technical" | "management"   (decides what is highlighted / greyed out)
   start / end:  "YYYY-MM"  (use end: "present" for a current role)
   ========================================== */
(function () {
    const EXPERIENCE = [
        { id: "Arista Networks", type: "technical",  company: "Arista Networks", logo: "../assets/logos/company1.png",
          role: "Wi-Fi R&D Intern", start: "2025-08", end: "2026-08",
          tools: ["WIPS","API", "Wireshark","Python", "Automation", "WPA3"],
          summary: "Contributed to a multi-OS WPA3 client prevention mechanism pipeline for WIPS" },
        { id: "Prajna Self Care Pvt. Ltd.", type: "management", company: "Prajna Self Care Pvt. Ltd.", logo: "../assets/logos/company2.png",
          role: "Product Management Intern", start: "2024-05", end: "2024-09",
          tools: ["Google Sheets", "Google Docs", "Figma", "Canvas"],
          summary: "Proposed strategic changes on end-to-end product development" },
        { id: "Techmihirnaik Pvt. Ltd.", type: "technical",  company: "Techmihirnaik Pvt. Ltd.", logo: "../assets/logos/company3.png",
          role: "Cybersecurity Intern", start: "2023-05", end: "2023-07",
          tools: ["Burpsuite", "NMap","Gobuster","Networking Ports"],
          summary: "Performing web application security to  identify a key vulnerability." },
        { id: "Campus-Corporate", type: "management", company: "Campus-Corporate", logo: "../assets/logos/company4.png",
          role: "HR Executive", start: "2021-05", end: "2021-07",
          tools: ["Google Sheets", "Networking", "Communication"],
          summary: "Filttered, shortlisted, communicated with candidates to analyze their fit for the role." },
        { id: "MyCaptain", type: "management", company: "MyCaptain", logo: "../assets/logos/company5.png",
          role: "Sales and Business Development Intern", start: "2020-11", end: "2020-12",
          tools: ["Excel", "Communication"],
          summary: "Involved in telephone-based sales to sell educational services." }
    ];
    const DETAIL_PAGE = "experience.html";      // "View More" goes to experience.html#<id>
    const DEFAULT_FILTER = "technical";         // highlighted on page load

    const line = document.getElementById("timeline");
    if (!line) return;

    const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const now = new Date();
    const parse = s => {
        if (s === "present") return { y: now.getFullYear(), m: now.getMonth(), label: "Present" };
        const [y, m] = s.split("-").map(Number);
        return { y, m: m - 1, label: MONTHS[m - 1] + " " + y };
    };
    const monthsBetween = (a, b) => (b.y - a.y) * 12 + (b.m - a.m) + 1;   // inclusive

    // newest first (left) -> oldest last (right)
    const items = EXPERIENCE.map(e => {
        const s = parse(e.start), f = parse(e.end);
        return { ...e, s, f, months: monthsBetween(s, f) };
    }).sort((a, b) => (b.s.y * 12 + b.s.m) - (a.s.y * 12 + a.s.m));

    // total experience = sum of every internship's duration
    const total = items.reduce((n, e) => n + e.months, 0);
    const yrs = Math.floor(total / 12), mos = total % 12;
    document.getElementById("exp-total").textContent =
        (yrs ? yrs + (yrs === 1 ? " yr " : " yrs ") : "") + (mos ? mos + (mos === 1 ? " mo" : " mos") : (yrs ? "" : "0 mos"));
    const nTech = items.filter(e => e.type === "technical").length;
    document.getElementById("exp-sub").textContent =
        items.length + " internships (" + nTech + " technical, " + (items.length - nTech) + " management) \u2022 " +
        Math.min(...items.map(e => e.s.y)) + " \u2013 " + Math.max(...items.map(e => e.f.y));

    const fmt = e => e.s.label + " \u2013 " + e.f.label + " \u00b7 " + e.months + (e.months === 1 ? " mo" : " mos");
    line.innerHTML = items.map(e => `
        <div class="tl-item" data-type="${e.type}">
            <span class="tl-dot"></span><span class="tl-year">${e.s.y}</span>
            <article class="exp-card">
                <div class="exp-top">
                    <img class="exp-logo" src="${e.logo}" alt="${e.company} logo">
                    <div><h4 class="exp-company">${e.company}</h4><p class="exp-role">${e.role}</p></div>
                </div>
                <p class="exp-dur">${fmt(e)}</p>
                <div class="exp-tools">${e.tools.map(t => `<span>${t}</span>`).join("")}</div>
                <p class="exp-desc">${e.summary}</p>
                <a class="exp-more" href="${DETAIL_PAGE}#${e.id}">View More &gt;</a>
            </article>
        </div>`).join("");

    // if a logo file is missing, show the company's first letter instead
    line.querySelectorAll(".exp-logo").forEach(img => img.addEventListener("error", () => {
        const f = document.createElement("div");
        f.className = "logo-fallback"; f.textContent = (img.alt || "?").charAt(0);
        img.replaceWith(f);
    }));

    // filter: highlight the chosen type, grey out the rest (nothing is removed)
    function applyFilter(type) {
        line.querySelectorAll(".tl-item").forEach(el => {
            const on = el.dataset.type === type;
            el.classList.toggle("is-active", on);
            el.classList.toggle("is-dim", !on);
        });
        document.querySelectorAll(".filter-btn").forEach(b => b.classList.toggle("is-active", b.dataset.filter === type));
    }
    document.querySelectorAll(".filter-btn").forEach(b => b.addEventListener("click", () => applyFilter(b.dataset.filter)));
    applyFilter(DEFAULT_FILTER);
})();


/* ==========================================
   4. Writeups carousel (data-driven)
   EDIT ONLY the WRITEUPS list below.
   tag:   the label shown on the card (Challenge, CTF, SOC Simulator, Security Tool, anything you like)
   image: small preview picture (if the file is missing, a gradient is shown instead)
   link:  where the "Read Writeup" button goes (your writeup page, the .md file, GitHub...)
   Use at least 4 cards so the loop looks smooth.
   ========================================== */
(function () {
    const WRITEUPS = [
        { tag: "THM-Challenge", title: "J&Y Enterprise Tech Recipie Attack", image: "../assets/writeups/image2.png",
          desc: "J&Y Enterprise famous coffee recipie 'Shot4j' digital safe under attack. J.A.V.A. recommends Rishab to detect, and mitigate the attack.",
          link: "blogs.html#snort-live-attack" },
        { tag: "THM-Fundamental", title: "Snort Challenge Room", image: "../assets/writeups/image1.png", 
          desc: "Understanding configuration of Snort rules for insecure open ports and services. The room was about capturing HTTP,FTP,Log4j and other network traffic.",
          link: "blogs.html#snort-fundamental-challenge-room" },
        { tag: "THM-Challenge", title: "PicoSecure Internal Team Training", image: "../assets/writeups/image3.png",
          desc: "Mini description: what the room or challenge was about and the approach you took.",
          link: "blogs.html#pico-secure-internal-challenges" },
        { tag: "Article", title: "When Trust Becomes the Target for Attackers", image: "../assets/writeups/image4.png",
          desc: "Mini description: what the room or challenge was about and the approach you took.",
          link: "https://www.linkedin.com/pulse/inside-business-modern-scams-when-trust-becomes-target-rishab-shorey-itzzf/" },
        { tag: "Article", title: "Operation Epic Fury", image: "../assets/writeups/image5.png",
          desc: "Mini description: what the room or challenge was about and the approach you took.",
          link: "https://www.linkedin.com/pulse/inside-business-modern-scams-when-trust-becomes-target-rishab-shorey-itzzf/" }
    ];
    const AUTOPLAY_MS = 5000;     // auto-swipe every 5 seconds (right to left)
    const SWIPE_PX = 50;          // how far you drag before it counts as a swipe

    const stage = document.getElementById("wr-stage");
    if (!stage) return;
    const dotsBox = document.getElementById("wr-dots");
    const n = WRITEUPS.length;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    stage.innerHTML = WRITEUPS.map((w, i) => `
        <div class="wr-slide" data-i="${i}">
            <article class="wr-card">
                <div class="wr-preview"><img src="${w.image}" alt="" draggable="false"></div>
                <div class="wr-body">
                    <h3 class="wr-title">${w.title}</h3>
                    <span class="wr-tag"><b>Tag:</b> ${w.tag}</span>
                    <p class="wr-desc">${w.desc}</p>
                    <a class="cv-btn" href="${w.link}">Read Writeup <span class="btn-arrow">&gt;</span></a>
                </div>
            </article>
        </div>`).join("");
    dotsBox.innerHTML = WRITEUPS.map((w, i) => `<button type="button" aria-label="Go to writeup ${i + 1}" data-i="${i}"></button>`).join("");

    stage.querySelectorAll(".wr-preview img").forEach(img => img.addEventListener("error", () => img.remove()));

    const slides = [...stage.querySelectorAll(".wr-slide")];
    const dots = [...dotsBox.children];
    const half = Math.floor(n / 2);
    let active = 0, timer = null, visible = false, hovering = false;
    const prevOff = new Array(n).fill(null);

    function render() {
        const jumpers = [];
        slides.forEach((s, i) => {
            const off = ((i - active + n + half) % n) - half;          // ... -2 -1 0 +1 +2 ...
            if (prevOff[i] !== null && Math.abs(off - prevOff[i]) > 1) jumpers.push(s);
            prevOff[i] = off;
            s.style.setProperty("--off", off);
            const on = off === 0;
            s.classList.toggle("is-active", on);
            s.classList.toggle("is-near", Math.abs(off) === 1);
            s.setAttribute("aria-hidden", String(!on));
            s.querySelectorAll("a").forEach(a => a.tabIndex = on ? 0 : -1);
        });
        // cards that wrap around the loop jump to the other side without sliding across the screen
        jumpers.forEach(s => s.classList.add("no-anim"));
        void stage.offsetWidth;
        requestAnimationFrame(() => jumpers.forEach(s => s.classList.remove("no-anim")));
        dots.forEach((d, i) => d.classList.toggle("is-active", i === active));
    }

    function schedule() {
        clearTimeout(timer);
        if (reduced || n < 2 || !visible || hovering) return;
        timer = setTimeout(next, AUTOPLAY_MS);
    }
    function go(i) { active = (i + n) % n; render(); schedule(); }
    function next() { go(active + 1); }       // cards move right -> left
    function prev() { go(active - 1); }

    document.getElementById("wr-next").addEventListener("click", next);
    document.getElementById("wr-prev").addEventListener("click", prev);
    dots.forEach(d => d.addEventListener("click", () => go(+d.dataset.i)));
    stage.addEventListener("keydown", e => {
        if (e.key === "ArrowRight") next();
        if (e.key === "ArrowLeft") prev();
    });

    // swipe (finger) and drag (mouse)
    let startX = null, dragged = false;
    stage.addEventListener("pointerdown", e => { startX = e.clientX; dragged = false; });
    stage.addEventListener("pointerup", e => {
        if (startX === null) return;
        const dx = e.clientX - startX; startX = null;
        if (Math.abs(dx) > SWIPE_PX) { dragged = true; dx < 0 ? next() : prev(); }
    });
    stage.addEventListener("pointercancel", () => { startX = null; });

    // clicking a greyed side card brings it to the centre; a drag never opens a link
    stage.addEventListener("click", e => {
        if (dragged) { e.preventDefault(); dragged = false; return; }
        const s = e.target.closest(".wr-slide");
        if (s && !s.classList.contains("is-active")) { e.preventDefault(); go(+s.dataset.i); }
    }, true);

    // pause while the user hovers / focuses; only run while the section is on screen
    const wrap = document.getElementById("wr-wrap");
    wrap.addEventListener("mouseenter", () => { hovering = true; schedule(); });
    wrap.addEventListener("mouseleave", () => { hovering = false; schedule(); });
    wrap.addEventListener("focusin", () => { hovering = true; schedule(); });
    wrap.addEventListener("focusout", () => { hovering = false; schedule(); });
    new IntersectionObserver(entries => { visible = entries[0].isIntersecting; schedule(); }, { threshold: 0.3 })
        .observe(document.getElementById("writeups"));

    render();
})();


