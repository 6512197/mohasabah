/* =========================================================
   Mohasaba — shared app script
   ========================================================= */

// ============================================================
// 1. GLOBALS (shared across pages)
// ============================================================
const STORAGE_KEYS = {
    USER: 'moh_user',
    USERS: 'moh_users',
    ENTRIES: 'moh_entries',
    DRAFT_PREFIX: 'moh_draft_'
};

// Helper functions
function getTodayKey() {
    return new Date().toISOString().split('T')[0];
}

function getUser() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || 'null');
    } catch {
        return null;
    }
}

function getEntries() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.ENTRIES) || '{}');
    } catch {
        return {};
    }
}

function saveEntries(entries) {
    localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(entries));
}

function showToast(message, duration = 2600) {
    const t = document.getElementById('toast');
    if (!t) {
        console.log('Toast:', message);
        return;
    }
    t.textContent = message;
    t.style.display = 'block';
    setTimeout(() => t.style.display = 'none', duration);
}

function redirectTo(page) {
    window.location.href = page;
}

function requireAuth() {
    const user = getUser();
    if (!user) {
        redirectTo('01-login.html');
        return false;
    }
    return true;
}

// ============================================================
// 2. PAGE INITIALIZATION
// ============================================================
function initPage() {
    const body = document.body;
    const page = body.getAttribute('data-page') || body.className.match(/page-(\w+)/)?.[1];

    console.log('Initializing page:', page);

    if (!page) {
        console.warn('No page detected, using URL detection');
        const path = window.location.pathname;
        if (path.includes('login')) initLogin();
        else if (path.includes('morning')) initMorning();
        else if (path.includes('home')) initHome();
        else if (path.includes('daily-form')) initDaily();
        else if (path.includes('weekly-tracker')) initWeekly();
        else if (path.includes('reports')) initReports();
        return;
    }

    switch(page) {
        case 'login':
            initLogin();
            break;
        case 'morning':
            initMorning();
            break;
        case 'home':
            initHome();
            break;
        case 'daily':
            initDaily();
            break;
        case 'weekly':
            initWeekly();
            break;
        case 'reports':
            initReports();
            break;
        default:
            console.warn('Unknown page:', page);
    }
}

// ============================================================
// 3. LOGIN PAGE
// ============================================================
function initLogin() {
    console.log('Login page initialized');

    // Check if already logged in
    if (getUser()) {
        redirectTo('03-home.html');
        return;
    }

    const welcomeSub = document.getElementById('welcomeSub');
    if (!welcomeSub) return;

    const copy = {
        login: 'how are you today?',
        register: "let's set your journal up",
    };

    // EXPOSE FUNCTIONS TO GLOBAL SCOPE
    window.switchMode = function(mode) {
        console.log('switchMode called with:', mode);
        const isLogin = mode === 'login';

        const loginPanel = document.getElementById('login-panel');
        const registerPanel = document.getElementById('register-panel');
        const tabLogin = document.getElementById('tab-login');
        const tabRegister = document.getElementById('tab-register');
        const switchLink = document.getElementById('switch-link');

        if (loginPanel) loginPanel.style.display = isLogin ? 'block' : 'none';
        if (registerPanel) registerPanel.style.display = isLogin ? 'none' : 'block';
        if (tabLogin) tabLogin.classList.toggle('active', isLogin);
        if (tabRegister) tabRegister.classList.toggle('active', !isLogin);
        if (welcomeSub) welcomeSub.textContent = copy[mode];
        if (switchLink) {
            switchLink.innerHTML = isLogin
                ? 'New here? <a href="#" onclick="switchMode(\'register\'); return false;">Create a free account</a>'
                : 'Already have an account? <a href="#" onclick="switchMode(\'login\'); return false;">Sign in</a>';
        }

        showError('');
    };

    window.togglePw = function(id, btn) {
        const inp = document.getElementById(id);
        if (!inp) return;
        const hidden = inp.type === 'password';
        inp.type = hidden ? 'text' : 'password';
        btn.textContent = hidden ? '🙈' : '👁';
    };

    function showError(msg) {
        const el = document.getElementById('error-box');
        if (!el) return;
        el.textContent = msg;
        el.style.display = msg ? 'block' : 'none';
    }

    window.handleLogin = function() {
        console.log('handleLogin called');
        const email = document.getElementById('login-email')?.value.trim();
        const pw = document.getElementById('login-pw')?.value;

        if (!email || !pw) {
            showError('Enter your email and password.');
            return;
        }

        try {
            const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
            const found = users.find(u => u.email === email && u.password === pw);

            if (!found) {
                showError('Email or password is incorrect.');
                return;
            }

            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(found));
            redirectTo('03-home.html');
        } catch (e) {
            showError('An error occurred. Please try again.');
            console.error(e);
        }
    };

    window.handleRegister = function() {
        console.log('handleRegister called');
        const first = document.getElementById('reg-first')?.value.trim();
        const last = document.getElementById('reg-last')?.value.trim();
        const dob = document.getElementById('reg-dob')?.value;
        const email = document.getElementById('reg-email')?.value.trim();
        const email2 = document.getElementById('reg-email2')?.value.trim();
        const pw = document.getElementById('reg-pw')?.value;
        const pw2 = document.getElementById('reg-pw2')?.value;

        if (!first || !last || !dob || !email || !pw) {
            showError('All fields are required.');
            return;
        }

        if (email !== email2) {
            showError("Emails don't match.");
            return;
        }

        if (pw !== pw2) {
            showError("Passwords don't match.");
            return;
        }

        if (pw.length < 6) {
            showError('Password must be at least 6 characters.');
            return;
        }

        try {
            const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');

            if (users.find(u => u.email === email)) {
                showError('An account with this email already exists.');
                return;
            }

            const newUser = {
                firstName: first,
                lastName: last,
                dob: dob,
                email: email,
                password: pw,
                id: Date.now()
            };

            users.push(newUser);
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
            redirectTo('03-home.html');
        } catch (e) {
            showError('An error occurred. Please try again.');
            console.error(e);
        }
    };

    // Set initial state
    window.switchMode('login');
}

// ============================================================
// 4. MORNING PROMPT PAGE
// ============================================================
function initMorning() {
    console.log('Morning page initialized');
    if (!requireAuth()) return;

    const user = getUser();
    const userNameEl = document.getElementById('user-name');
    if (userNameEl && user) {
        userNameEl.textContent = user.firstName || 'Friend';
    }

    // Dynamic time label
    const hour = new Date().getHours();
    const timeEl = document.getElementById('time-label');
    if (timeEl) {
        if (hour < 12) timeEl.textContent = 'Good morning';
        else if (hour < 17) timeEl.textContent = 'Good afternoon';
        else timeEl.textContent = 'Good evening';
    }

    // Show yesterday's pledge
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yKey = yesterday.toISOString().split('T')[0];
    const entries = getEntries();
    const yEntry = entries[yKey];

    const yesterdayBox = document.getElementById('yesterday-box');
    const yesterdayText = document.getElementById('yesterday-text');
    if (yEntry && yEntry[40] && yesterdayBox && yesterdayText) {
        yesterdayBox.style.display = 'block';
        yesterdayText.textContent = '"' + yEntry[40] + '"';
    }

    // Pre-fill if already answered today
    const todayKey = getTodayKey();
    const draft = JSON.parse(localStorage.getItem(STORAGE_KEYS.DRAFT_PREFIX + todayKey) || '{}');
    const morningAnswer = document.getElementById('morning-answer');
    if (morningAnswer && draft.sleepReflection) {
        morningAnswer.value = draft.sleepReflection;
        updateCount(morningAnswer);
    }

    window.updateCount = function(el) {
        const countEl = document.getElementById('char-count');
        if (countEl) countEl.textContent = el.value.length;
    };

    window.saveMorning = function() {
        const answer = document.getElementById('morning-answer')?.value.trim();
        if (!answer) {
            showToast('Write your intention first.');
            return;
        }

        const todayKey = getTodayKey();
        const draft = JSON.parse(localStorage.getItem(STORAGE_KEYS.DRAFT_PREFIX + todayKey) || '{}');
        draft.sleepReflection = answer;
        localStorage.setItem(STORAGE_KEYS.DRAFT_PREFIX + todayKey, JSON.stringify(draft));
        showToast('Morning intention set ✓');
        setTimeout(() => redirectTo('03-home.html'), 900);
    };

    window.skipMorning = function() {
        redirectTo('03-home.html');
    };
}

// ============================================================
// 5. HOME PAGE
// ============================================================
function initHome() {
    console.log('Home page initialized');
    if (!requireAuth()) return;

    const user = getUser();
    const entries = getEntries();
    const todayKey = getTodayKey();

    // Set user name
    const userNameEl = document.getElementById('user-name');
    if (userNameEl && user) {
        userNameEl.textContent = user.firstName || 'Friend';
    }

    // Greeting
    const hour = new Date().getHours();
    const greet = hour < 12 ? 'Good morning,' : hour < 17 ? 'Good afternoon,' : 'Good evening,';
    const greetingLine = document.getElementById('greeting-line');
    if (greetingLine) {
        greetingLine.innerHTML = `${greet} <em>${user?.firstName || 'Friend'}</em>`;
    }

    // Date
    const todayDate = document.getElementById('today-date');
    if (todayDate) {
        todayDate.textContent = new Date().toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }

    // Sunday banner
    const sundayBanner = document.getElementById('sunday-banner');
    if (sundayBanner && new Date().getDay() === 0) {
        sundayBanner.style.display = 'block';
    }

    // Progress from draft
    const TOTAL_QS = new Date().getDay() === 0 ? 41 : 40;
    const draft = JSON.parse(localStorage.getItem(STORAGE_KEYS.DRAFT_PREFIX + todayKey) || '{}');
    const answered = Object.entries(draft).filter(([k, v]) => !isNaN(k) && String(v).trim()).length;
    const pct = Math.round((answered / TOTAL_QS) * 100);

    const progPct = document.getElementById('prog-pct');
    const progFill = document.getElementById('prog-fill');
    const progSub = document.getElementById('prog-sub');
    const completedBadge = document.getElementById('completed-badge');

    if (progPct) progPct.textContent = pct + '%';
    if (progFill) progFill.style.width = pct + '%';
    if (progSub) progSub.textContent = `${answered} of ${TOTAL_QS} questions answered`;

    if (entries[todayKey]?.completed) {
        if (completedBadge) completedBadge.style.display = 'block';
        if (progFill) progFill.style.background = '#7B9E87';
    }

    // CTA text
    const ctaBtn = document.getElementById('cta-btn');
    if (ctaBtn) {
        if (answered > 0) ctaBtn.textContent = 'Continue today\'s reflection →';
        if (entries[todayKey]?.completed) ctaBtn.textContent = 'View today\'s entry →';
    }

    // Week count
    const today = new Date();
    const dow = today.getDay() === 0 ? 6 : today.getDay() - 1;
    let weekDone = 0;
    for (let i = 0; i <= dow; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() - dow + i);
        const k = d.toISOString().split('T')[0];
        if (entries[k]?.completed) weekDone++;
    }

    const weekCount = document.getElementById('week-count');
    if (weekCount) weekCount.innerHTML = weekDone + '<span>/7</span>';

    const totalCount = document.getElementById('total-count');
    if (totalCount) totalCount.textContent = Object.keys(entries).length;

    window.logout = function() {
        localStorage.removeItem(STORAGE_KEYS.USER);
        redirectTo('01-login.html');
    };
}

// ============================================================
// 6. DAILY FORM PAGE
// ============================================================
function initDaily() {
    console.log('Daily form page initialized');
    if (!requireAuth()) return;

    // ... (rest of daily form code)
    // Make sure to expose all functions to window
}

// ============================================================
// 7. WEEKLY TRACKER PAGE
// ============================================================
function initWeekly() {
    console.log('Weekly tracker page initialized');
    if (!requireAuth()) return;
    // ... (rest of weekly code)
}

// ============================================================
// 8. REPORTS PAGE
// ============================================================
function initReports() {
    console.log('Reports page initialized');
    if (!requireAuth()) return;
    // ... (rest of reports code)
}

// ============================================================
// 9. INITIALIZE
// ============================================================
// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPage);
} else {
    initPage();
}