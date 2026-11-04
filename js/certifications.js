/* =========================================================
   CERTIFICATIONS PAGE SCRIPT (only this page)
   EDIT ONLY the CERTS list below.
     status:   "completed"  -> shows in the Completed filter, has View Details + working Verify link
               "pursuing"   -> shows in the Pursuing filter, Verify shows an "in progress" popup + Also doesnt mention the organization
     image:    certificate picture (if missing, a placeholder box is shown)
     title / organization / date   (for pursuing cards the date is shown as "Expected")
     desc:     SHORT text shown on the card
     details:  LONGER text shown in the popup (completed cards only)
     skills:   a few round tags, shown ONLY in the popup (completed cards only, keep it to 3-4)
     verify:   link of the "Verify" button (completed cards only)
   If no card is marked "pursuing", the Pursuing filter shows "No certification in process."
   ========================================================= */
(function () {
    const CERTS = [
        { status: "pursuing", image: "../assets/certs/sec+.png", title: "CompTia Security+ Certification", date: "N/A",
          desc: "Cover the basics of cybersecurity, including network security, threats and vulnerabilities, access control, identity management, cryptography, and risk management.",
          details: "Write a few lines here about what this certification covered, what you practised and how it applies to SOC work.",
          skills: ["Microsoft Sentinel", "Defender XDR", "KQL", "Threat Hunting"], verify: "#" },
        { status: "completed", image: "../assets/certs/sc-200.png", title: "Microsoft SC-200: Security Operations Analyst", organization:"Microsoft", date: "September 2026",
          desc: "Threat hunting, incident response and managing a security operations environment on Microsoft's security stack.",
          details: "Write a few lines here about what this certification covered, what you practised and how it applies to SOC work.",
          skills: ["Microsoft Sentinel", "Defender XDR", "KQL", "Threat Hunting"], verify: "#" },
        { status: "completed", image: "../assets/certs/az-900.png", title: "Microsoft AZ-900: Azure Fundamentals", organization:"Microsoft", date: "February 2026",
          desc: "Core cloud concepts, Azure architecture and services, plus management and governance.",
          details: "Write a few lines here about what this certification covered and what you took away from it.",
          skills: ["Azure", "Cloud Concepts", "Governance"], verify: "#" },
        { status: "completed", image: "../assets/certs/google-cyber.png", title: "Google Cybersecurity Professional", organization:"Coursera", date: "2023",
          desc: "Short description of this certification.",
          details: "Longer description of this certification and what you learned.",
          skills: ["Cyber Security", "SIEM"], verify: "#" },
        { status: "completed", image: "../assets/certs/intro-cyber.png", title: "Introduction to Cybersecurity", date: "2021", organization:"Cisco Networking Academy",
          desc: "Short description of this certification.",
          details: "Longer description of this certification and what you learned.",
          skills: ["Fundamentals"], verify: "#" },
        { status: "pursuing", image: "../assets/certs/cert-5.png", title: "TryHackMe SAL1", date: "Month Year",
          desc: "Short description of this certification.",
          details: "Longer description of this certification and what you learned.",
          skills: ["Skill 1", "Skill 2"], verify: "#" }
    ];

    const DEFAULT_FILTER = "completed";      // which filter is active when the page loads
    const PROGRESS_TITLE = "Certification In Progress";
    const PROGRESS_TEXT  = "is still under progress. It will be accessible and verifiable here later, so please check back soon.";

    const grid = document.getElementById("cert-grid");
    if (!grid) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isPursuing = c => c.status === "pursuing";       // anything else counts as completed

    const SHIELD = '<svg viewBox="0 0 24 24"><path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5l8-3z"/><path d="M9 12l2 2 4-4"/></svg>';
    const HOURGLASS = '<svg viewBox="0 0 24 24"><path d="M6 2h12M6 22h12"/><path d="M7 2c0 5 3 6 5 10-2 4-5 5-5 10M17 2c0 5-3 6-5 10 2 4 5 5 5 10"/></svg>';
    const imgTag = (c, cls) => `<img class="${cls || ""}" src="${c.image}" alt="${c.title} certificate" draggable="false">`;

    let filter = DEFAULT_FILTER;
    let list = [];                 // certifications shown by the current filter
    let cards = [];                // their card elements
    let current = 0, opener = null, closing = false;

    /* ---------- DETAILS POPUP (completed only; built once, filled on open) ---------- */
    const overlay = document.createElement("div");
    overlay.className = "cm-overlay";
    overlay.innerHTML = `
        <button type="button" class="cm-arrow cm-prev" aria-label="Previous certification">&lt;</button>
        <div class="cm-dialog" role="dialog" aria-modal="true" aria-label="Certification details" tabindex="-1">
            <button type="button" class="cm-close" aria-label="Close">&times;</button>
            <div class="cm-content"></div>
        </div>
        <button type="button" class="cm-arrow cm-next" aria-label="Next certification">&gt;</button>`;
    document.body.appendChild(overlay);
    const dialog = overlay.querySelector(".cm-dialog");
    const content = overlay.querySelector(".cm-content");

    /* ---------- "IN PROGRESS" NOTICE (pursuing cards: Verify button) ---------- */
    const notice = document.createElement("div");
    notice.className = "cn-overlay";
    notice.innerHTML = `
        <div class="cn-dialog" role="alertdialog" aria-modal="true" aria-labelledby="cn-title" tabindex="-1">
            <div class="cn-icon">${HOURGLASS}</div>
            <h3 id="cn-title">${PROGRESS_TITLE}</h3>
            <p class="cn-msg"></p>
            <button type="button" class="cert-btn primary cn-ok">Got it</button>
        </div>`;
    document.body.appendChild(notice);
    const noticeDialog = notice.querySelector(".cn-dialog");
    const noticeMsg = notice.querySelector(".cn-msg");
    let noticeOpener = null;

    function showNotice(c, btn) {
        noticeOpener = btn || null;
        noticeMsg.innerHTML = "<b></b> " + PROGRESS_TEXT;
        noticeMsg.querySelector("b").textContent = c.title;
        notice.classList.add("is-open");
        document.body.style.overflow = "hidden";
        noticeDialog.focus({ preventScroll: true });
        if (reduced) return;
        notice.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 250 });
        noticeDialog.animate([{ transform: "scale(.9)", opacity: 0 }, { transform: "none", opacity: 1 }],
            { duration: 280, easing: "cubic-bezier(.2,.8,.2,1)" });
    }
    function closeNotice() {
        notice.classList.remove("is-open");
        document.body.style.overflow = "";
        if (noticeOpener) noticeOpener.focus({ preventScroll: true });
    }

    /* ---------- DETAILS POPUP FUNCTIONS ---------- */
    function fill() {
        const c = list[current];
        content.innerHTML = `
            <div class="cm-media">${imgTag(c)}</div>
            <div class="cm-info">
                <p class="cm-count">${current + 1} / ${list.length}</p>
                <h3 class="cm-title">${c.title}</h3>
                ${c.organization ? `<p class="cm-org"><b>Issued by:</b> <span>${c.organization}</span></p>` : ""}
                <p class="cm-date"><b>Date:</b> ${c.date}</p>
                <p class="cm-details">${c.details || ""}</p>
                <div class="cm-skills">${(c.skills || []).map(s => `<span>${s}</span>`).join("")}</div>
                <a class="cert-btn primary" href="${c.verify}" target="_blank" rel="noopener noreferrer">${SHIELD} Verify</a>
            </div>`;
        content.querySelector("img").addEventListener("error", e => e.target.remove());
        cards.forEach((el, i) => el.classList.toggle("is-active", i === current));
    }

    function open(i, btn) {
        current = i; opener = btn || null; closing = false;
        fill();
        overlay.classList.toggle("single", list.length < 2);       // hide arrows if there is only one card
        overlay.classList.add("is-open");
        document.body.style.overflow = "hidden";
        dialog.focus({ preventScroll: true });
        if (reduced) return;
        // the card grows from where it sits on the page
        const from = cards[i].getBoundingClientRect(), to = dialog.getBoundingClientRect();
        overlay.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300 });
        dialog.animate([
            { transform: `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width}, ${from.height / to.height})`, opacity: .3 },
            { transform: "none", opacity: 1 }
        ], { duration: 450, easing: "cubic-bezier(.2,.8,.2,1)" });
    }

    function close() {
        if (closing || !overlay.classList.contains("is-open")) return;
        closing = true;
        const finish = () => {
            overlay.classList.remove("is-open");
            document.body.style.overflow = "";
            cards.forEach(el => el.classList.remove("is-active"));
            closing = false;
            if (opener) opener.focus({ preventScroll: true });
        };
        if (reduced) return finish();
        const from = cards[current].getBoundingClientRect(), to = dialog.getBoundingClientRect();
        overlay.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 280 });
        dialog.animate([
            { transform: "none", opacity: 1 },
            { transform: `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width}, ${from.height / to.height})`, opacity: 0 }
        ], { duration: 320, easing: "ease-in" }).finished.then(finish, finish);
    }

    function step(dir) {            // dir: +1 next, -1 previous (only cycles through the current filter)
        if (list.length < 2) return;
        current = (current + dir + list.length) % list.length;
        fill();
        cards[current].scrollIntoView({ block: "center", behavior: reduced ? "auto" : "smooth" });
        if (!reduced) content.animate(
            [{ opacity: 0, transform: `translateX(${dir * 40}px)` }, { opacity: 1, transform: "none" }],
            { duration: 320, easing: "ease-out" });
    }

    /* ---------- CARDS + FILTER ---------- */
    function cardHTML(c, i) {
        const p = isPursuing(c);
        return `
        <article class="cert-card ${p ? "is-pursuing" : ""}" data-i="${i}">
            <div class="cert-media" ${p ? `data-progress="${i}"` : `data-open="${i}"`}>
                <span class="cert-noimg">CERTIFICATE IMAGE</span>${imgTag(c)}
                <span class="cert-status ${p ? "pursuing" : "done"}">${p ? "IN PROGRESS" : "COMPLETED"}</span>
            </div>
            <div class="cert-body">
                <h3 class="cert-title">${c.title}</h3>
                ${c.organization ? `<p class="cert-org"><b>Issued by:</b> <span>${c.organization}</span></p>` : ""}
                <p class="cert-date"><b>${p ? "Expected" : "Date"}:</b> ${c.date}</p>
                <p class="cert-desc">${c.desc}</p>
                <div class="cert-actions">
                    ${p
                        ? `<button type="button" class="cert-btn" data-progress="${i}">${SHIELD} Verify</button>`
                        : `<a class="cert-btn" href="${c.verify}" target="_blank" rel="noopener noreferrer">${SHIELD} Verify</a>
                           <button type="button" class="cert-btn primary" data-open="${i}">View Details</button>`}
                </div>
            </div>
        </article>`;
    }

    function renderGrid() {
        const wantPursuing = filter === "pursuing";
        list = CERTS.filter(c => isPursuing(c) === wantPursuing);
        if (!list.length) {
            cards = [];
            grid.innerHTML = `<div class="cert-empty">${wantPursuing ? "No certification in process." : "No completed certifications yet."}</div>`;
        } else {
            grid.innerHTML = list.map(cardHTML).join("");
            cards = [...grid.querySelectorAll(".cert-card")];
            grid.querySelectorAll(".cert-media img").forEach(img => img.addEventListener("error", () => img.remove()));
        }
        if (!reduced) grid.animate([{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }], { duration: 300, easing: "ease-out" });
    }

    const filterBtns = [...document.querySelectorAll(".cf-btn")];
    filterBtns.forEach(b => {                                     // show how many are in each filter
        const count = CERTS.filter(c => isPursuing(c) === (b.dataset.filter === "pursuing")).length;
        const s = b.querySelector(".cf-count");
        if (s) s.textContent = "(" + count + ")";
        b.addEventListener("click", () => setFilter(b.dataset.filter));
    });
    function setFilter(f) {
        filter = f;
        filterBtns.forEach(b => {
            const on = b.dataset.filter === f;
            b.classList.toggle("is-active", on);
            b.setAttribute("aria-pressed", String(on));
        });
        renderGrid();
    }

    /* ---------- EVENTS ---------- */
    grid.addEventListener("click", e => {
        const p = e.target.closest("[data-progress]");            // pursuing card: Verify / image
        if (p) { showNotice(list[+p.dataset.progress], p.matches("button") ? p : null); return; }
        const t = e.target.closest("[data-open]");                // completed card: View Details / image
        if (t) open(+t.dataset.open, t.matches("button") ? t : null);
    });
    overlay.querySelector(".cm-next").addEventListener("click", () => step(1));
    overlay.querySelector(".cm-prev").addEventListener("click", () => step(-1));
    overlay.querySelector(".cm-close").addEventListener("click", close);
    overlay.addEventListener("click", e => { if (e.target === overlay) close(); });      // click the grey area
    notice.querySelector(".cn-ok").addEventListener("click", closeNotice);
    notice.addEventListener("click", e => { if (e.target === notice) closeNotice(); });
    document.addEventListener("keydown", e => {
        if (notice.classList.contains("is-open")) { if (e.key === "Escape") closeNotice(); return; }
        if (!overlay.classList.contains("is-open")) return;
        if (e.key === "Escape") close();
        if (e.key === "ArrowRight") step(1);
        if (e.key === "ArrowLeft") step(-1);
    });
    // phone swipe inside the details popup
    let sx = 0, sy = 0;
    dialog.addEventListener("touchstart", e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    dialog.addEventListener("touchend", e => {
        const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
        if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1);
    }, { passive: true });

    setFilter(DEFAULT_FILTER);
})();

/* =========================================================
   SHARED: hamburger menu + live clock
   (this page does not load home.js, so the menu code lives here too;
    it is safe even if main.js or home.js also contain it)
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
    document.addEventListener("click", event => {
        const nav = getNav();
        if (!nav) return;
        if (event.target.closest(".menu-toggle")) {
            event.stopImmediatePropagation();
            setMenu(!nav.classList.contains("is-open"));
            return;
        }
        if (event.target.closest(".main-nav .nav-link")) setMenu(false);
    }, true);
    document.addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });
    window.addEventListener("resize", () => { if (window.innerWidth > 950) setMenu(false); });

    const clock = document.getElementById("live-clock");
    function tick() {
        if (clock) clock.textContent = new Date().toLocaleTimeString("en-US",
            { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });
    }
    tick(); setInterval(tick, 1000);
})();
