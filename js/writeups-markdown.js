/* =========================================================
   WRITEUP RENDERER  (Markdown text -> sanitized, styled DOM)
   Needs: marked + DOMPurify (required), highlight.js (optional).
   Pipeline: marked.parse -> DOMPurify (returns a DOM fragment) -> post-processing
   (heading ids + table of contents, safe links, images -> figures with zoom/fallback,
   code blocks with language label + copy button + highlighting, scrollable tables).
   Markdown HTML is never inserted without going through DOMPurify.
   ========================================================= */
(function () {
    'use strict';

    const LINK_PROTOCOLS = ['http:', 'https:', 'mailto:'];
    const IMG_PROTOCOLS = ['http:', 'https:'];
    const ALIASES = { sh: 'bash', shell: 'bash', zsh: 'bash', console: 'bash', ps1: 'powershell', pwsh: 'powershell',
        ps: 'powershell', js: 'javascript', node: 'javascript', py: 'python', yml: 'yaml', kusto: 'kql', csl: 'kql',
        text: 'plaintext', txt: 'plaintext' };
    const LABELS = { bash: 'Bash', powershell: 'PowerShell', python: 'Python', javascript: 'JavaScript', json: 'JSON',
        yaml: 'YAML', kql: 'KQL', sql: 'SQL', xml: 'XML', plaintext: 'Text' };
    const SANITIZE = {
        USE_PROFILES: { html: true },
        FORBID_TAGS: ['style', 'script', 'iframe', 'object', 'embed', 'form', 'textarea', 'select', 'button', 'link', 'meta', 'base'],
        FORBID_ATTR: ['style', 'srcset', 'formaction'],
        ALLOW_DATA_ATTR: false,
        RETURN_DOM_FRAGMENT: true
    };

    const ready = () => !!(window.marked && typeof window.marked.parse === 'function' && window.DOMPurify);

    /* KQL is not bundled with highlight.js, so a small definition is registered here. */
    function registerKql() {
        if (!window.hljs || window.hljs.getLanguage('kql')) return;
        try {
            window.hljs.registerLanguage('kql', h => ({
                name: 'KQL', aliases: ['kusto', 'csl'], case_insensitive: true,
                keywords: {
                    keyword: 'where project extend summarize join union let take limit top sort order by asc desc distinct count render parse evaluate lookup on kind inner outer leftouter rightouter fullouter leftanti leftsemi as with in has has_any has_all contains startswith endswith matches regex and or not between mvexpand',
                    built_in: 'ago now datetime timespan bin dcount sum avg min max make_set make_list tostring toint tolong todouble strlen substring split strcat iff iif case isempty isnotempty isnull isnotnull extract parse_json todynamic format_datetime startofday endofday array_length bag_pack arg_max arg_min',
                    literal: 'true false null'
                },
                contains: [
                    h.COMMENT('//', '$'),
                    { className: 'string', begin: /@?"/, end: /"/, contains: [{ begin: /\\./ }] },
                    { className: 'string', begin: /@?'/, end: /'/, contains: [{ begin: /\\./ }] },
                    { className: 'number', begin: /\b\d+(\.\d+)?(ms|s|m|h|d)?\b/ },
                    { className: 'operator', begin: /\|/ },
                    { className: 'title function_', begin: /\b[A-Za-z_]\w*(?=\()/ }
                ]
            }));
        } catch (e) { console.warn('KQL highlighting unavailable:', e); }
    }
    registerKql();

    const slug = t => (t.toLowerCase().trim().replace(/[^\p{L}\p{N}\s_-]/gu, '').replace(/\s+/g, '-')) || 'section';
    const fileName = u => { try { return decodeURIComponent(u.pathname.split('/').pop()); } catch (e) { return u.pathname.split('/').pop(); } };

    /* Resolve a path found in the Markdown. "assets/..." -> from the site root, everything else -> relative to the .md file. */
    function resolve(raw, opts, protocols) {
        raw = (raw || '').trim();
        if (!raw) return null;
        try {
            const url = /^assets\//i.test(raw) ? new URL(raw, opts.siteRoot) : new URL(raw, opts.reportUrl);
            return protocols.includes(url.protocol) ? url : null;
        } catch (e) { return null; }
    }

    function missingImage(alt, name) {
        const d = document.createElement('span');
        d.className = 'wr-img-missing';
        d.setAttribute('role', 'img');
        d.setAttribute('aria-label', 'Image unavailable: ' + alt);
        d.textContent = 'Image unavailable: ' + alt + (name ? ' (' + name + ')' : '');
        return d;
    }

    /* opts: { reportUrl: URL, siteRoot: URL, toc: true (show when 2+ entries) | false (never) | undefined (automatic, tocMin entries), tocMin: 4, hideLeadingH1: true } */
    function render(markdown, opts) {
        if (!ready()) throw new Error('libs');
        opts = Object.assign({ tocMin: 4, hideLeadingH1: true }, opts);
        const md = String(markdown).replace(/^\uFEFF?---\r?\n[\s\S]*?\r?\n---[ \t]*(\r?\n|$)/, '');   // optional front matter
        const html = window.marked.parse(md, { gfm: true, breaks: false });
        if (typeof html !== 'string') throw new Error('Unexpected Markdown parser output');
        const clean = window.DOMPurify.sanitize(html, SANITIZE);
        const root = document.createElement('div');
        if (typeof clean === 'string') root.innerHTML = clean; else root.appendChild(clean);

        /* headings + ids + table of contents */
        if (opts.hideLeadingH1 && root.firstElementChild && root.firstElementChild.tagName === 'H1') root.firstElementChild.remove();
        const used = new Set(), idBySlug = new Map(), allHeads = [];
        root.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach(h => {
            const base = slug(h.textContent); let id = 'rep-' + base, i = 2;
            while (used.has(id)) id = 'rep-' + base + '-' + i++;
            used.add(id); h.id = id; h.tabIndex = -1;
            if (!idBySlug.has(base)) idBySlug.set(base, id);
            const text = h.textContent.trim();
            if (text) allHeads.push({ id, text, level: +h.tagName.charAt(1) });
        });
        /* table of contents: uses the TOP TWO heading levels the document really uses (h1+h2, h2+h3 or h3+h4),
           and a single h1 is treated as the document title, so READMEs written with any heading style get an index */
        const h1Count = allHeads.filter(x => x.level === 1).length;
        const levels = [...new Set(allHeads.filter(x => x.level <= 4 && !(x.level === 1 && h1Count === 1)).map(x => x.level))].sort((a, b) => a - b).slice(0, 2);
        const tocItems = allHeads.filter(x => levels.includes(x.level)).map(x => ({ id: x.id, text: x.text, level: x.level === levels[0] ? 2 : 3 }));

        /* links */
        root.querySelectorAll('a').forEach(a => {
            const href = a.getAttribute('href');
            if (href === null) return;
            if (href.startsWith('#')) {
                let key = href.slice(1); try { key = decodeURIComponent(key); } catch (e) { /* keep raw */ }
                const id = idBySlug.get(slug(key));
                if (id) a.setAttribute('href', '#' + id); else a.removeAttribute('href');
                return;
            }
            const url = resolve(href, opts, LINK_PROTOCOLS);
            if (!url) { a.removeAttribute('href'); a.classList.add('wr-badlink'); return; }
            a.setAttribute('href', url.href);
            if (url.protocol !== 'mailto:') { a.target = '_blank'; a.rel = 'noopener noreferrer nofollow'; }
        });

        /* images: resolve path, alt text, lazy loading, zoom button, caption, graceful failure */
        root.querySelectorAll('img').forEach(img => {
            const url = resolve(img.getAttribute('src'), opts, IMG_PROTOCOLS);
            const alt = (img.getAttribute('alt') || '').trim() ||
                (url ? fileName(url).replace(/\.[a-z0-9]+$/i, '').replace(/[-_]+/g, ' ') : 'image');
            if (!url) { img.replaceWith(missingImage(alt, 'blocked or invalid path')); return; }
            const title = (img.getAttribute('title') || '').trim();
            img.removeAttribute('title'); img.removeAttribute('srcset');
            img.src = url.href; img.alt = alt; img.loading = 'lazy'; img.decoding = 'async'; img.className = 'wr-img';
            img.addEventListener('error', () => (img.closest('.wr-zoom') || img).replaceWith(missingImage(alt, fileName(url))));
            if (img.closest('a')) return;                                   // linked images stay plain links
            const btn = document.createElement('button');
            btn.type = 'button'; btn.className = 'wr-zoom';
            btn.setAttribute('aria-label', 'View larger image: ' + alt);
            img.replaceWith(btn); btn.appendChild(img);
            const p = btn.parentElement;
            const solo = p && p.tagName === 'P' && [...p.childNodes].every(n => n === btn || (n.nodeType === 3 && !n.textContent.trim()));
            if (solo) {
                const fig = document.createElement('figure'); fig.className = 'wr-figure';
                p.replaceWith(fig); fig.appendChild(btn);
                if (title) { const c = document.createElement('figcaption'); c.textContent = title; fig.appendChild(c); }
            }
        });

        /* code blocks */
        root.querySelectorAll('pre > code').forEach(code => {
            const pre = code.parentElement;
            const m = /(?:^|\s)language-([\w+#-]+)/.exec(code.className || '');
            let lang = m ? m[1].toLowerCase() : ''; lang = ALIASES[lang] || lang;
            const wrap = document.createElement('div'); wrap.className = 'wr-code';
            const head = document.createElement('div'); head.className = 'wr-code-head';
            const label = document.createElement('span'); label.textContent = LABELS[lang] || (lang ? lang : 'Code');
            const copy = document.createElement('button'); copy.type = 'button'; copy.className = 'wr-copy'; copy.textContent = 'Copy';
            copy.setAttribute('aria-label', 'Copy code to clipboard');
            head.append(label, copy);
            pre.replaceWith(wrap); wrap.append(head, pre);
            pre.tabIndex = 0;
            if (lang && lang !== 'plaintext' && window.hljs && window.hljs.getLanguage(lang)) {
                code.className = 'language-' + lang;
                try { window.hljs.highlightElement(code); } catch (e) { /* leave plain */ }
            }
        });

        /* tables scroll sideways instead of breaking the layout */
        root.querySelectorAll('table').forEach(t => {
            const w = document.createElement('div'); w.className = 'wr-table'; w.tabIndex = 0;
            w.setAttribute('role', 'region'); w.setAttribute('aria-label', 'Table (scrollable)');
            t.replaceWith(w); w.appendChild(t);
        });

        /* task-list checkboxes stay read-only; any other input is removed */
        root.querySelectorAll('input').forEach(i => {
            if (i.getAttribute('type') === 'checkbox') i.disabled = true; else i.remove();
        });

        const article = document.createElement('div');
        article.className = 'wr-article';
        while (root.firstChild) article.appendChild(root.firstChild);

        let toc = null;
        if (opts.toc !== false && tocItems.length >= (opts.toc === true ? 2 : opts.tocMin)) {
            toc = document.createElement('nav'); toc.className = 'wr-toc'; toc.setAttribute('aria-label', 'Table of contents');
            const det = document.createElement('details'); det.open = true;
            const sum = document.createElement('summary'); sum.textContent = 'Table of contents';
            const ol = document.createElement('ol');
            tocItems.forEach(t => {
                const li = document.createElement('li'); li.className = 'lvl' + t.level;
                const a = document.createElement('a'); a.href = '#' + t.id; a.textContent = t.text;
                li.appendChild(a); ol.appendChild(li);
            });
            det.append(sum, ol); toc.appendChild(det);
        }
        return { article, toc };
    }

    window.WriteupRenderer = { render, ready };
})();
