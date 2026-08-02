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

    const QUESTIONS = [
        { id:1,  cat:"Gratitude",      text:"What are three things you're grateful for today?",                                                    type:"textarea" },
        { id:2,  cat:"Mood",           text:"How would you rate your overall mood right now?",                                                      type:"rating" },
        { id:3,  cat:"Intention",      text:"What is one clear intention you're setting for today?",                                               type:"textarea" },
        { id:4,  cat:"Energy",         text:"How is your energy level this morning?",                                                              type:"rating" },
        { id:5,  cat:"Focus",          text:"What is the most important thing you must accomplish today?",                                         type:"textarea" },
        { id:6,  cat:"Challenge",      text:"What challenge might you face today and how will you handle it?",                                     type:"textarea" },
        { id:7,  cat:"Connection",     text:"Who is one person you want to reach out to or appreciate today?",                                     type:"text" },
        { id:8,  cat:"Body",           text:"How does your body feel today — any tension, fatigue, or vitality?",                                 type:"textarea" },
        { id:9,  cat:"Mind",           text:"What thoughts keep returning to your mind this morning?",                                             type:"textarea" },
        { id:10, cat:"Growth",         text:"What is one skill or habit you're working on this week?",                                             type:"text" },
        { id:11, cat:"Values",         text:"Which of your core values do you want to honor most today?",                                         type:"text" },
        { id:12, cat:"Fear",           text:"Is there anything you've been avoiding that needs your attention?",                                   type:"textarea" },
        { id:13, cat:"Joy",            text:"What brought you genuine joy or laughter recently?",                                                  type:"textarea" },
        { id:14, cat:"Learning",       text:"What did you learn yesterday that still stays with you?",                                             type:"textarea" },
        { id:15, cat:"Relationships",  text:"How are your most important relationships feeling right now?",                                        type:"rating" },
        { id:16, cat:"Work",           text:"What one work or project task deserves your deepest focus today?",                                    type:"textarea" },
        { id:17, cat:"Rest",           text:"How did you sleep last night — truly?",                                                               type:"rating" },
        { id:18, cat:"Nourishment",    text:"Are you taking care of your body through food, water, and movement?",                                type:"choice", options:["Doing well","Could improve","Need to restart"] },
        { id:19, cat:"Prayer",         text:"How was your spiritual practice or moment of stillness today?",                                       type:"choice", options:["Present and focused","Partially there","Missed it today"] },
        { id:20, cat:"Patience",       text:"Is there a situation where you need to practice more patience?",                                      type:"textarea" },
        { id:21, cat:"Forgiveness",    text:"Is there anyone — including yourself — you need to forgive today?",                                  type:"textarea" },
        { id:22, cat:"Boundaries",     text:"Are your boundaries with others healthy and respected right now?",                                    type:"choice", options:["Yes, balanced","Somewhat","Need work"] },
        { id:23, cat:"Creativity",     text:"Did you express any creativity yesterday — in any form?",                                             type:"choice", options:["Yes","A little","Not yet"] },
        { id:24, cat:"Simplicity",     text:"What can you remove or simplify in your life right now?",                                            type:"textarea" },
        { id:25, cat:"Contribution",   text:"How did you contribute something positive to someone else today?",                                    type:"textarea" },
        { id:26, cat:"Distraction",    text:"What is your biggest distraction and what will you do about it?",                                     type:"textarea" },
        { id:27, cat:"Courage",        text:"What is one brave action you could take today?",                                                      type:"textarea" },
        { id:28, cat:"Kindness",       text:"How kind were you to yourself and others yesterday?",                                                 type:"rating" },
        { id:29, cat:"Purpose",        text:"Does what you're doing today connect to your bigger purpose?",                                        type:"choice", options:["Strongly yes","Somewhat","Not really"] },
        { id:30, cat:"Emotion",        text:"Name an emotion you're carrying right now without judgment.",                                         type:"text" },
        { id:31, cat:"Surprise",       text:"What surprised you yesterday — good or otherwise?",                                                   type:"textarea" },
        { id:32, cat:"Worry",          text:"What worry can you acknowledge and then consciously let go of today?",                               type:"textarea" },
        { id:33, cat:"Curiosity",      text:"What are you genuinely curious about right now?",                                                     type:"text" },
        { id:34, cat:"Balance",        text:"How balanced does your life feel between work, rest, and play?",                                      type:"rating" },
        { id:35, cat:"Memory",         text:"What is one positive memory that came to mind this week?",                                            type:"textarea" },
        { id:36, cat:"Tomorrow",       text:"What do you want tomorrow to feel like?",                                                             type:"textarea" },
        { id:37, cat:"Accountability", text:"Did you keep the promise you made to yourself yesterday?",                                            type:"choice", options:["Yes, fully","Partly","No — I'll try again"] },
        { id:38, cat:"Affirmation",    text:"Write one true and kind thing about yourself right now.",                                             type:"textarea" },
        { id:39, cat:"Evening",        text:"How do you want to close this day — what feeling or action?",                                        type:"textarea" },
        { id:40, cat:"Tomorrow's Pledge", text:"What one thing will you do differently tomorrow based on today?",                                 type:"textarea" },
        { id:41, cat:"Weekly Lesson",  text:"What is one key lesson you learned this week, and what will you do differently next week to apply it?", type:"textarea", sundayOnly:true },
    ];

    const isSunday = new Date().getDay() === 0;
    const questions = QUESTIONS.filter(q => !q.sundayOnly || isSunday);
    const todayKey = getTodayKey();
    let current = 0;
    let answers = JSON.parse(localStorage.getItem(STORAGE_KEYS.DRAFT_PREFIX + todayKey) || '{}');

    function saveDraft() {
        localStorage.setItem(STORAGE_KEYS.DRAFT_PREFIX + todayKey, JSON.stringify(answers));
    }

    function getAnswer() {
        const q = questions[current];
        if (q.type === 'rating') {
            const filled = document.querySelectorAll('.star.filled');
            return filled ? filled.length.toString() : '';
        } else if (q.type === 'choice') {
            const sel = document.querySelector('.choice-btn.selected');
            return sel ? sel.textContent : '';
        } else {
            const el = document.getElementById('ans-input');
            return el ? el.value : '';
        }
    }

    // EXPOSE FUNCTIONS TO GLOBAL SCOPE
    window.saveCurrentAnswer = function() {
        const q = questions[current];
        const val = getAnswer();
        if (val) answers[q.id] = val;
        else delete answers[q.id];
        saveDraft();
    };

    window.renderQuestion = function() {
        const q = questions[current];
        const total = questions.length;

        const qNum = document.getElementById('q-num');
        const progFill = document.getElementById('prog-fill');
        const qCat = document.getElementById('q-cat');
        const qText = document.getElementById('q-text');
        const qInput = document.getElementById('q-input');
        const backBtn = document.getElementById('btn-back');
        const nextBtn = document.getElementById('btn-next');

        if (qNum) qNum.textContent = `Q ${current + 1} of ${total}`;
        if (progFill) progFill.style.width = `${((current + 1) / total) * 100}%`;
        if (qCat) {
            qCat.textContent = q.cat + (q.sundayOnly ? ' · Sunday only' : '');
            qCat.className = 'q-cat' + (q.sundayOnly ? ' sunday' : '');
        }
        if (qText) qText.textContent = q.text;

        const saved = answers[q.id] || '';
        let html = '';

        if (q.type === 'textarea') {
            html = `<textarea id="ans-input" placeholder="Write your reflection…" oninput="saveCurrentAnswer()">${saved}</textarea>`;
        } else if (q.type === 'text') {
            html = `<input type="text" id="ans-input" placeholder="Your answer…" value="${saved.replace(/"/g,'&quot;')}" oninput="saveCurrentAnswer()">`;
        } else if (q.type === 'rating') {
            const val = parseInt(saved) || 0;
            html = `<div class="star-row" id="star-row">`;
            for (let i = 1; i <= 5; i++) {
                html += `<span class="star ${i <= val ? 'filled' : ''}" data-val="${i}" onclick="setRating(${i})">★</span>`;
            }
            html += `<span class="star-val" id="star-val">${val > 0 ? val + '/5' : ''}</span></div>`;
        } else if (q.type === 'choice') {
            html = `<div class="choice-row">`;
            q.options.forEach(opt => {
                html += `<button class="choice-btn ${saved === opt ? 'selected' : ''}" onclick="setChoice(this)">${opt}</button>`;
            });
            html += `</div>`;
        }

        if (qInput) qInput.innerHTML = html;
        if (backBtn) backBtn.disabled = current === 0;

        if (nextBtn) {
            if (current === total - 1) {
                nextBtn.textContent = 'Submit day ✓';
                nextBtn.className = 'btn-next submit';
            } else {
                nextBtn.textContent = 'Next →';
                nextBtn.className = 'btn-next';
            }
        }

        renderDots();

        // Animate card
        const card = document.getElementById('q-card');
        if (card) {
            card.style.opacity = '0';
            card.style.transform = 'translateY(8px)';
            requestAnimationFrame(() => {
                card.style.transition = 'opacity 0.22s, transform 0.22s';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            });
        }
    };

    window.setRating = function(val) {
        document.querySelectorAll('.star').forEach((s, i) => {
            s.classList.toggle('filled', i < val);
        });
        const starVal = document.getElementById('star-val');
        if (starVal) starVal.textContent = val + '/5';
        answers[questions[current].id] = val.toString();
        saveDraft();
        renderDots();
    };

    window.setChoice = function(btn) {
        document.querySelectorAll('.choice-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        answers[questions[current].id] = btn.textContent;
        saveDraft();
        renderDots();
    };

    window.navigate = function(dir) {
        saveCurrentAnswer();
        if (dir === 1 && current === questions.length - 1) {
            submitDay();
            return;
        }
        current = Math.max(0, Math.min(questions.length - 1, current + dir));
        renderQuestion();
        window.scrollTo(0, 0);
    };

    window.jumpTo = function(idx) {
        saveCurrentAnswer();
        current = idx;
        renderQuestion();
        window.scrollTo(0, 0);
    };

    function renderDots() {
        const container = document.getElementById('dot-nav');
        if (!container) return;
        container.innerHTML = '';
        questions.forEach((q, i) => {
            const dot = document.createElement('button');
            dot.className = 'dot' + (i === current ? ' current' : answers[q.id] ? ' answered' : '');
            dot.textContent = i + 1;
            dot.onclick = () => jumpTo(i);
            container.appendChild(dot);
        });
    }

    function submitDay() {
        const entries = getEntries();
        entries[todayKey] = { ...answers, date: todayKey, completed: true, timestamp: Date.now() };
        saveEntries(entries);
        showToast('Day submitted ✓ Generating your report…');
        setTimeout(() => redirectTo('06-reports.html'), 1200);
    }

    // Initialize
    renderQuestion();
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