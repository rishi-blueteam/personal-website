/* =========================================================
   CONTACT FORM (Forminit Integration)
   ========================================================= */
(function () {
    'use strict';
    
    const FORM_ID = '70d4swln1lb'; // TODO: Replace with your actual Form ID from Forminit dashboard
    const SETTINGS = {
        directEmail: 'rishabshorey2@gmail.com',
        maxMessages: 10,
        windowHours: 24,
        minFillMs: 3000,
        maxMessageLength: 2000
    };

    const forms = document.querySelectorAll('form[data-contact-form]');
    if (!forms.length) return;
    
    // Check if Forminit SDK is loaded
    if (typeof Forminit === 'undefined') {
        console.error('Forminit SDK script is not loaded.');
        return;
    }
    const forminit = new Forminit();
    const loadedAt = Date.now();
    const WINDOW_MS = SETTINGS.windowHours * 3600 * 1000;
    const KEY = 'rlgnd_contact_log', COOKIE = 'rlgnd_cm';

    /* ---------- message counter ---------- */
    function readLog() {
        let a = [], b = [];
        try { a = JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { /* storage blocked */ }
        const m = document.cookie.match(new RegExp('(?:^|; )' + COOKIE + '=([^;]*)'));
        if (m && m[1]) b = m[1].split(',').map(Number);
        const cutoff = Date.now() - WINDOW_MS;
        return [...new Set([...a, ...b].filter(t => Number.isFinite(t) && t > cutoff && t <= Date.now() + 60000))].sort((x, y) => x - y);
    }
    function writeLog(list) {
        try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) { /* ignore */ }
        document.cookie = COOKIE + '=' + list.join(',') + '; max-age=' + Math.floor(WINDOW_MS / 1000) + '; path=/; SameSite=Lax';
    }
    const limitReached = () => readLog().length >= SETTINGS.maxMessages;
    function waitText() {
        const log = readLog(); if (!log.length) return 'later';
        const ms = Math.max(0, log[0] + WINDOW_MS - Date.now()), h = Math.floor(ms / 3600000), m = Math.ceil((ms % 3600000) / 60000);
        return h ? h + ' h ' + m + ' min' : m + ' min';
    }

    /* ---------- validation ---------- */
    const NAME_RE = /^[\p{L}\p{M}][\p{L}\p{M}\s.'-]{0,59}$/u;
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const RULES = {
        'fi-sender-firstName': v => !v ? 'Please enter your first name.' : !NAME_RE.test(v) ? 'Please use letters only (max 60 characters).' : '',
        'fi-sender-lastName':  v => !v ? 'Please enter your last name.'  : !NAME_RE.test(v) ? 'Please use letters only (max 60 characters).' : '',
        'fi-sender-phone':     v => !v ? '' : (!/^\+?[\d\s().-]{7,20}$/.test(v) || v.replace(/\D/g, '').length < 7 || v.replace(/\D/g, '').length > 15) ? 'Please enter a valid phone number, or leave it empty.' : '',
        'fi-sender-email':     v => !v ? 'Please enter your email address.' : (v.length > 254 || !EMAIL_RE.test(v)) ? 'Please enter a valid email address.' : '',
        'fi-text-message':     v => !v ? 'Please write a message before sending.' : v.length > SETTINGS.maxMessageLength ? 'Please keep the message under ' + SETTINGS.maxMessageLength + ' characters.' : ''
    };

    forms.forEach(form => {
        form.noValidate = true;
        const btn = form.querySelector('button[type="submit"]');
        const status = form.querySelector('.ct-status');
        const field = n => form.elements[n];
        const errBox = n => {
            const el = field(n);
            return el ? form.querySelector('#' + el.id + '-err') : null;
        };
        let busy = false;

        function show(msg, kind, html) {
            status.className = 'ct-status' + (kind ? ' is-' + kind : '');
            status.replaceChildren(msg);
            if (html) status.append(' ', html);
        }
        const mailLink = () => { const a = document.createElement('a'); a.href = 'mailto:' + SETTINGS.directEmail; a.textContent = SETTINGS.directEmail; return a; };
        
        function check(name) {
            const inputEl = field(name);
            if (!inputEl) return true;
            const msg = RULES[name](inputEl.value.trim());
            inputEl.setAttribute('aria-invalid', String(!!msg));
            const box = errBox(name);
            if (box) box.textContent = msg;
            return !msg;
        }

        function applyLimitState() {
            const blocked = limitReached();
            btn.disabled = blocked || busy;
            if (blocked) show('You have reached the limit of ' + SETTINGS.maxMessages + ' messages for now. Please try again in ' + waitText() + ', or email me directly at', 'warn', mailLink());
            return blocked;
        }

        Object.keys(RULES).forEach(n => {
            const el = field(n);
            if (el) {
                el.addEventListener('blur', () => check(n));
                el.addEventListener('input', () => { if (el.getAttribute('aria-invalid') === 'true') check(n); });
            }
        });
        
        const counter = form.querySelector('.ct-count');
        const msgField = field('fi-text-message');
        if (counter && msgField) {
            msgField.addEventListener('input', () => { counter.textContent = msgField.value.length + ' / ' + SETTINGS.maxMessageLength; });
        }

        form.addEventListener('submit', async e => {
            e.preventDefault();
            if (busy) return;
            if (applyLimitState()) return;

            const names = Object.keys(RULES);
            const bad = names.filter(n => !check(n));
            if (bad.length) { 
                show('Please fix the highlighted fields.', 'err'); 
                const firstBadEl = field(bad[0]);
                if (firstBadEl) firstBadEl.focus(); 
                return; 
            }
            if (Date.now() - loadedAt < SETTINGS.minFillMs) { 
                show('That was very quick. Please wait a moment and press Send again.', 'warn'); 
                return; 
            }

            busy = true; 
            btn.disabled = true; 
            btn.textContent = 'Sending...'; 
            form.setAttribute('aria-busy', 'true'); 
            show('Sending your message...', '');

            try {
                const formData = new FormData(form);
                const { data, error } = await forminit.submit(FORM_ID, formData);

                if (error) {
                    throw new Error(error.message || 'The message service refused the submission.');
                }

                const log = readLog(); 
                log.push(Date.now()); 
                writeLog(log);
                
                form.reset(); 
                names.forEach(n => { 
                    const el = field(n);
                    if (el) el.removeAttribute('aria-invalid'); 
                    const box = errBox(n);
                    if (box) box.textContent = ''; 
                });
                if (counter && msgField) counter.textContent = '0 / ' + SETTINGS.maxMessageLength;
                
                show('Message sent successfully! Thank you.', 'ok');
            } catch (err) {
                show((err.message || 'Sorry, the message could not be sent.') + ' Please try again, or email me directly at', 'err', mailLink());
            } finally {
                busy = false; 
                btn.textContent = 'Send'; 
                form.removeAttribute('aria-busy');
                btn.disabled = limitReached();
                if (limitReached() && status.classList.contains('is-ok')) status.append(' You have used all your messages for now.');
            }
        });
        applyLimitState();
    });
})();