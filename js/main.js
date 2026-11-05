/* Shared JavaScript. Intro behavior only runs on landing.html. */

/* Change the Countdown to 5 seconds later*/
const CONFIG = 
{ terminalLines: 
    ["Initializing secure environment...", "Loading threat detection modules...", "Starting log monitoring services...", "Validating credentials...", "Access granted..."], 
    welcomeMessage: "Welcome, User", 
    loadingMessage: "..............Loading..............", 
    typingSpeedMs: 34, 
    linePauseMs: 170, 
    loadingTypingSpeedMs: 42, 
    buttonDelayAfterWelcomeMs: 2000, 
    countdownSeconds: 5 
};


/* ==========================================
   0. Mobile Hamburger Menu Toggle Functionality
   ========================================== 
*/

// Mobile Hamburger Menu Toggle Functionality
(function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (!menuToggle || !mainNav) return;

    function setMenu(open) {
        mainNav.classList.toggle('is-open', open);
        menuToggle.classList.toggle('is-active', open);
        menuToggle.setAttribute('aria-expanded', String(open));
        document.body.style.overflow = open ? 'hidden' : '';        // lock the page behind the full-screen menu
        if (open) mainNav.scrollTop = 0;                             // always start at the top of the menu
    }

    menuToggle.addEventListener('click', () => setMenu(!mainNav.classList.contains('is-open')));

    // Close the menu (and unlock scrolling) when a link is clicked
    mainNav.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', () => setMenu(false)));

    // Escape closes it, and so does turning the phone / resizing to a wide screen
    // (otherwise the page could stay locked with overflow:hidden)
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
    window.addEventListener('resize', () => { if (window.innerWidth > 950) setMenu(false); });
})();



const currentPage = document.body.dataset.page; 
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll('.nav-link').forEach(link => { if (link.dataset.section === currentPage) link.classList.add('active') });

function typeText(el, text, speed) { return new Promise(resolve => { let i = 0; function step() { if (i >= text.length) { resolve(); return } el.textContent += text.charAt(i++); window.setTimeout(step, reducedMotion ? 0 : speed) } step() }) }

const pause = ms => new Promise(resolve => window.setTimeout(resolve, reducedMotion ? 0 : ms));


/* ==========================================
   1. Landing Page Intro Animation (only runs on landing.html)
   ========================================== 
*/
if (currentPage === 'landing') 
    {
    const lines = document.getElementById('terminal-lines'), 
    loading = document.getElementById('loading-text'), 
    welcome = document.getElementById('terminal-welcome'), 
    welcomeText = document.getElementById('welcome-text'), 
    button = document.getElementById('open-profile'), 
    hint = document.getElementById('landing-hint'), 
    skip = document.getElementById('skip-intro');
    
    let skipped = false, redirectInterval = null, redirectTimeout = null, navigated = false;
    
    function goHome() 
    { if (navigated) return; navigated = true; window.location.href = 'html/home.html' }
    async function runIntro() 
    {
        for (const message of CONFIG.terminalLines) 
            { const line = document.createElement('p'); line.className = 'terminal-line'; 
            const prompt = document.createElement('span'); prompt.className = 'prompt'; prompt.textContent = '> '; 
            const typed = document.createElement('span'); line.append(prompt, typed); lines.appendChild(line); if (skipped) typed.textContent = message; else await typeText(typed, message, CONFIG.typingSpeedMs); await pause(CONFIG.linePauseMs) }
        loading.parentElement.classList.add('visible'); if (skipped) loading.textContent = CONFIG.loadingMessage; else await typeText(loading, CONFIG.loadingMessage, CONFIG.loadingTypingSpeedMs); await pause(250); welcome.classList.add('visible'); if (skipped) welcomeText.textContent = CONFIG.welcomeMessage; else await typeText(welcomeText, CONFIG.welcomeMessage, CONFIG.typingSpeedMs); await pause(CONFIG.buttonDelayAfterWelcomeMs); button.classList.add('visible'); startCountdown();
    }
    function startCountdown() { let seconds = CONFIG.countdownSeconds; hint.textContent = `Redirecting to Home in ${seconds}...`; redirectInterval = window.setInterval(() => { seconds--; if (seconds > 0) hint.textContent = `Redirecting to Home in ${seconds}...`; else { window.clearInterval(redirectInterval); hint.textContent = 'Opening Home...'; redirectTimeout = window.setTimeout(goHome, 250) } }, 1000) }
    button.addEventListener('click', () => { window.clearInterval(redirectInterval); window.clearTimeout(redirectTimeout); window.location.href = 'html/home.html' });
    skip.addEventListener('click', () => { if (skipped) { goHome(); return } skipped = true; skip.textContent = 'Skip to Home' });
    runIntro();
}


/* ==========================================
   2. Live Clock (top-right corner of page)
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



