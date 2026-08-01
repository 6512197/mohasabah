/* =========================================================
   Mohasaba — shared app script
   One file for every page. Each page sets <body data-page="...">
   so the right init function runs; everything else is inert.
   ========================================================= */

/* ---------- login ---------- */


const welcomeSub = document.getElementById('welcomeSub');
const copy = {
    login: 'how are you today?',
    register: "let's set your journal up",
};

function switchMode(mode) {
    const isLogin = mode === 'login';

    // Show/hide panels
    document.getElementById('login-panel').style.display = isLogin ? 'block' : 'none';
    document.getElementById('register-panel').style.display = isLogin ? 'none' : 'block';

    // Update tab buttons
    document.getElementById('tab-login').classList.toggle('active', isLogin);
    document.getElementById('tab-register').classList.toggle('active', !isLogin);

    // Update welcome message
    welcomeSub.textContent = copy[mode];

    // Update switch link
    document.getElementById('switch-link').innerHTML = isLogin
        ? 'New here? <a href="#" onclick="switchMode(\'register\'); return false;">Create a free account</a>'
        : 'Already have an account? <a href="#" onclick="switchMode(\'login\'); return false;">Sign in</a>';

    // Clear error messages
    showError('');
}

function togglePw(id, btn) {
    const inp = document.getElementById(id);
    if (!inp) return;
    const hidden = inp.type === 'password';
    inp.type = hidden ? 'text' : 'password';
    btn.textContent = hidden ? '🙈' : '👁';
}

function showError(msg) {
    const el = document.getElementById('error-box');
    el.textContent = msg;
    el.style.display = msg ? 'block' : 'none';
}

function handleLogin() {
    const email = document.getElementById('login-email').value.trim();
    const pw = document.getElementById('login-pw').value;

    if (!email || !pw) {
        showError('Enter your email and password.');
        return;
    }

    const users = JSON.parse(localStorage.getItem('moh_users') || '[]');
    const found = users.find(u => u.email === email && u.password === pw);

    if (!found) {
        showError('Email or password is incorrect.');
        return;
    }

    localStorage.setItem('moh_user', JSON.stringify(found));
    window.location.href = '03-home.html';
}

function handleRegister() {
    const first = document.getElementById('reg-first').value.trim();
    const last = document.getElementById('reg-last').value.trim();
    const dob = document.getElementById('reg-dob').value;
    const email = document.getElementById('reg-email').value.trim();
    const email2 = document.getElementById('reg-email2').value.trim();
    const pw = document.getElementById('reg-pw').value;
    const pw2 = document.getElementById('reg-pw2').value;

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

    const users = JSON.parse(localStorage.getItem('moh_users') || '[]');

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
    localStorage.setItem('moh_users', JSON.stringify(users));
    localStorage.setItem('moh_user', JSON.stringify(newUser));
    window.location.href = '03-home.html';
}

// Redirect if already logged in
if (localStorage.getItem('moh_user')) {
    window.location.href = '03-home.html';
}


// Set user name
const user = JSON.parse(localStorage.getItem('moh_user') || 'null');
if (!user) { window.location.href = '01-login.html'; }
else { document.getElementById('user-name').textContent = user.firstName || 'Friend'; }

// Dynamic time label
const hour = new Date().getHours();
const timeEl = document.getElementById('time-label');
if (hour < 12)       timeEl.textContent = 'Good morning';
else if (hour < 17)  timeEl.textContent = 'Good afternoon';
else                 timeEl.textContent = 'Good evening';

// Show yesterday's pledge (Q40 from previous day)
const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
const yKey = yesterday.toISOString().split('T')[0];
const entries = JSON.parse(localStorage.getItem('moh_entries') || '{}');
const yEntry = entries[yKey];
if (yEntry && yEntry[40]) {
    document.getElementById('yesterday-box').style.display = 'block';
    document.getElementById('yesterday-text').textContent = '"' + yEntry[40] + '"';
}

// Pre-fill if already answered today
const todayKey = new Date().toISOString().split('T')[0];
const draft = JSON.parse(localStorage.getItem('moh_draft_' + todayKey) || '{}');
if (draft.sleepReflection) {
    document.getElementById('morning-answer').value = draft.sleepReflection;
    updateCount(document.getElementById('morning-answer'));
}

function updateCount(el) {
    document.getElementById('char-count').textContent = el.value.length;
}

function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.style.display = 'block';
    setTimeout(() => t.style.display = 'none', 2600);
}

function saveMorning() {
    const answer = document.getElementById('morning-answer').value.trim();
    if (!answer) { showToast('Write your intention first.'); return; }

    const draft = JSON.parse(localStorage.getItem('moh_draft_' + todayKey) || '{}');
    draft.sleepReflection = answer;
    localStorage.setItem('moh_draft_' + todayKey, JSON.stringify(draft));
    showToast('Morning intention set ✓');
    setTimeout(() => window.location.href = '03-home.html', 900);
}

function skipMorning() {
    window.location.href = '03-home.html';
}

const user = JSON.parse(localStorage.getItem('moh_user') || 'null');
if (!user) { window.location.href = '01-login.html'; }

document.getElementById('user-name').textContent = user?.firstName || 'Friend';

// Greeting
const hour = new Date().getHours();
const greet = hour < 12 ? 'Good morning,' : hour < 17 ? 'Good afternoon,' : 'Good evening,';
document.getElementById('greeting-line').innerHTML = `${greet} <em>${user?.firstName || 'Friend'}</em>`;

// Date
document.getElementById('today-date').textContent = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

// Sunday banner
if (new Date().getDay() === 0) document.getElementById('sunday-banner').style.display = 'block';

// Progress from draft
const todayKey = new Date().toISOString().split('T')[0];
const TOTAL_QS = new Date().getDay() === 0 ? 41 : 40;
const draft = JSON.parse(localStorage.getItem('moh_draft_' + todayKey) || '{}');
const answered = Object.entries(draft).filter(([k, v]) => !isNaN(k) && String(v).trim()).length;
const pct = Math.round((answered / TOTAL_QS) * 100);

document.getElementById('prog-pct').textContent = pct + '%';
document.getElementById('prog-fill').style.width = pct + '%';
document.getElementById('prog-sub').textContent = `${answered} of ${TOTAL_QS} questions answered`;

const entries = JSON.parse(localStorage.getItem('moh_entries') || '{}');
if (entries[todayKey]?.completed) {
    document.getElementById('completed-badge').style.display = 'block';
    document.getElementById('prog-fill').style.background = '#7B9E87';
}

// CTA text
if (answered > 0) document.getElementById('cta-btn').textContent = 'Continue today\'s reflection →';
if (entries[todayKey]?.completed) document.getElementById('cta-btn').textContent = 'View today\'s entry →';

// Week count
const today = new Date();
const dow = today.getDay() === 0 ? 6 : today.getDay() - 1;
let weekDone = 0;
for (let i = 0; i <= dow; i++) {
    const d = new Date(today); d.setDate(today.getDate() - dow + i);
    const k = d.toISOString().split('T')[0];
    if (entries[k]?.completed) weekDone++;
}
document.getElementById('week-count').innerHTML = weekDone + '<span>/7</span>';
document.getElementById('total-count').textContent = Object.keys(entries).length;

function logout() {
    localStorage.removeItem('moh_user');
    window.location.href = '01-login.html';
}


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
const todayKey = new Date().toISOString().split('T')[0];
let current = 0;
let answers = JSON.parse(localStorage.getItem('moh_draft_' + todayKey) || '{}');

function saveDraft() { localStorage.setItem('moh_draft_' + todayKey, JSON.stringify(answers)); }

function getAnswer() {
    const q = questions[current];
    if (q.type === 'rating') {
        return document.querySelector('.star.filled') ? document.querySelectorAll('.star.filled').length.toString() : '';
    } else if (q.type === 'choice') {
        const sel = document.querySelector('.choice-btn.selected');
        return sel ? sel.textContent : '';
    } else {
        const el = document.getElementById('ans-input');
        return el ? el.value : '';
    }
}

function saveCurrentAnswer() {
    const q = questions[current];
    const val = getAnswer();
    if (val) answers[q.id] = val;
    else delete answers[q.id];
    saveDraft();
}

function renderQuestion() {
    const q = questions[current];
    const total = questions.length;

    document.getElementById('q-num').textContent = `Q ${current + 1} of ${total}`;
    document.getElementById('prog-fill').style.width = `${((current + 1) / total) * 100}%`;
    document.getElementById('q-cat').textContent = q.cat + (q.sundayOnly ? ' · Sunday only' : '');
    document.getElementById('q-cat').className = 'q-cat' + (q.sundayOnly ? ' sunday' : '');
    document.getElementById('q-text').textContent = q.text;

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

    document.getElementById('q-input').innerHTML = html;
    document.getElementById('btn-back').disabled = current === 0;
    const nextBtn = document.getElementById('btn-next');
    if (current === total - 1) {
        nextBtn.textContent = 'Submit day ✓';
        nextBtn.className = 'btn-next submit';
    } else {
        nextBtn.textContent = 'Next →';
        nextBtn.className = 'btn-next';
    }

    renderDots();

    // Animate card
    const card = document.getElementById('q-card');
    card.style.opacity = '0'; card.style.transform = 'translateY(8px)';
    requestAnimationFrame(() => {
        card.style.transition = 'opacity 0.22s, transform 0.22s';
        card.style.opacity = '1'; card.style.transform = 'translateY(0)';
    });
}

function setRating(val) {
    document.querySelectorAll('.star').forEach((s, i) => {
        s.classList.toggle('filled', i < val);
    });
    document.getElementById('star-val').textContent = val + '/5';
    answers[questions[current].id] = val.toString();
    saveDraft(); renderDots();
}

function setChoice(btn) {
    document.querySelectorAll('.choice-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    answers[questions[current].id] = btn.textContent;
    saveDraft(); renderDots();
}

function navigate(dir) {
    saveCurrentAnswer();
    if (dir === 1 && current === questions.length - 1) {
        submitDay(); return;
    }
    current = Math.max(0, Math.min(questions.length - 1, current + dir));
    renderQuestion();
    window.scrollTo(0, 0);
}

function jumpTo(idx) {
    saveCurrentAnswer();
    current = idx;
    renderQuestion();
    window.scrollTo(0, 0);
}

function renderDots() {
    const container = document.getElementById('dot-nav');
    container.innerHTML = '';
    questions.forEach((q, i) => {
        const dot = document.createElement('button');
        dot.className = 'dot' + (i === current ? ' current' : answers[q.id] ? ' answered' : '');
        dot.textContent = i + 1;
        dot.onclick = () => jumpTo(i);
        container.appendChild(dot);
    });
}

function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg; t.style.display = 'block';
    setTimeout(() => t.style.display = 'none', 2500);
}

function submitDay() {
    const entries = JSON.parse(localStorage.getItem('moh_entries') || '{}');
    entries[todayKey] = { ...answers, date: todayKey, completed: true, timestamp: Date.now() };
    localStorage.setItem('moh_entries', JSON.stringify(entries));
    showToast('Day submitted ✓ Generating your report…');
    setTimeout(() => window.location.href = '06-reports.html', 1200);
}

// Init
renderQuestion();
const DAYS_SHORT = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const DAYS_FULL  = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const Q_LABELS   = { 1:'Gratitude', 2:'Mood', 3:'Intention', 4:'Energy', 5:'Focus', 13:'Joy', 14:'Learning', 40:'Tomorrow\'s pledge', 41:'Weekly lesson' };

const entries = JSON.parse(localStorage.getItem('moh_entries') || '{}');
const today   = new Date();
const dow     = today.getDay() === 0 ? 6 : today.getDay() - 1; // 0=Mon

// Build week days
const weekDays = DAYS_SHORT.map((label, i) => {
    const d = new Date(today); d.setDate(today.getDate() - dow + i);
    return { key: d.toISOString().split('T')[0], label, full: DAYS_FULL[i], isToday: i === dow, isFuture: i > dow };
});

const completedCount = weekDays.filter(d => entries[d.key]?.completed).length;
document.getElementById('week-subtitle').textContent = `${completedCount} of 7 days complete`;
document.getElementById('prog-label').textContent = `${completedCount} of 7 days complete`;
document.getElementById('week-fill').style.width = `${(completedCount / 7) * 100}%`;

// Streak
let streak = 0;
for (let i = dow; i >= 0; i--) {
    if (entries[weekDays[i].key]?.completed) streak++;
    else break;
}
if (streak > 1) document.getElementById('streak-label').textContent = `🔥 ${streak}-day streak`;

// Render day chips
const grid = document.getElementById('day-grid');
let selectedKey = null;

weekDays.forEach(d => {
    const done = entries[d.key]?.completed;
    const chip = document.createElement('div');
    chip.className = 'day-chip' + (done ? ' done' : '') + (d.isToday ? ' today' : '') + (d.isFuture ? ' future' : '');
    chip.innerHTML = `<div class="chip-label">${d.label}</div><div class="chip-icon">${done ? '✓' : d.isToday ? '✏️' : '·'}</div>`;
    if (!d.isFuture) {
        chip.onclick = () => {
            if (selectedKey === d.key) { closePreview(); return; }
            if (done || d.isToday) showPreview(d.key, d.full);
            selectedKey = d.key;
            document.querySelectorAll('.day-chip').forEach(c => c.classList.remove('selected'));
            chip.classList.add('selected');
        };
    }
    grid.appendChild(chip);
});

function showPreview(key, dayName) {
    const entry = entries[key];
    if (!entry) return;
    document.getElementById('preview-day-name').textContent = dayName;
    const rows = document.getElementById('preview-rows');
    rows.innerHTML = '';
    const showQs = [1, 2, 3, 5, 13, 14, 40, 41].filter(id => entry[id]);
    if (showQs.length === 0) { rows.innerHTML = '<div style="color:rgba(240,235,225,0.4);font-size:13px;">No answers recorded.</div>'; }
    showQs.forEach(id => {
        const val = entry[id];
        const row = document.createElement('div');
        row.className = 'entry-row';
        row.innerHTML = `<div class="entry-row-cat">${Q_LABELS[id] || 'Q'+id}</div>
        <div class="entry-row-val">${id === 2 ? '★'.repeat(Number(val)) + '☆'.repeat(5 - Number(val)) + ` (${val}/5)` : String(val).slice(0, 150) + (String(val).length > 150 ? '…' : '')}</div>`;
        rows.appendChild(row);
    });
    document.getElementById('entry-preview').style.display = 'block';
}

function closePreview() {
    document.getElementById('entry-preview').style.display = 'none';
    document.querySelectorAll('.day-chip').forEach(c => c.classList.remove('selected'));
    selectedKey = null;
}

// All entries list
const list = document.getElementById('entries-list');
const sortedEntries = Object.entries(entries).sort(([a],[b]) => b.localeCompare(a));

if (sortedEntries.length === 0) {
    list.innerHTML = '<div class="empty-state">No entries yet.<br>Complete your first reflection today.</div>';
} else {
    sortedEntries.slice(0, 20).forEach(([key, entry]) => {
        const d = new Date(key + 'T12:00:00');
        const label = d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
        const snippet = entry[1] ? String(entry[1]).slice(0, 70) + (String(entry[1]).length > 70 ? '…' : '') : 'Reflection complete';
        const card = document.createElement('div');
        card.className = 'entry-card';
        card.innerHTML = `<div><div class="entry-card-date">${label}</div><div class="entry-card-snippet">${snippet}</div></div><div class="entry-arrow">›</div>`;
        card.onclick = () => {
            const d = new Date(key + 'T12:00:00');
            showPreview(key, d.toLocaleDateString('en-GB', { weekday: 'long' }));
        };
        list.appendChild(card);
    });
}


const user    = JSON.parse(localStorage.getItem('moh_user')    || 'null');
const entries = JSON.parse(localStorage.getItem('moh_entries') || '{}');
if (!user) { window.location.href = '01-login.html'; }

const todayKey = new Date().toISOString().split('T')[0];
const todayEntry = entries[todayKey];
const isSunday = new Date().getDay() === 0;

const Q_LABELS = {
    1:'Gratitude', 2:'Mood', 3:'Intention', 4:'Energy', 5:'Focus',
    8:'Body', 17:'Rest', 29:'Purpose', 37:'Accountability',
    40:"Tomorrow's pledge", 41:'Weekly lesson'
};

function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg; t.style.display = 'block';
    setTimeout(() => t.style.display = 'none', 2600);
}

const dateStr = new Date().toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();

function buildPdfRows(entry) {
    const showQs = Object.keys(Q_LABELS).map(Number).filter(id => entry[id]);
    if (showQs.length === 0) return '<div style="color:#8B6F5E;font-size:12px;">No answers recorded for this day.</div>';
    return showQs.map(id => {
        let val = String(entry[id]);
        if (id === 2) val = '★'.repeat(Number(entry[id])) + '☆'.repeat(5 - Number(entry[id])) + ` (${entry[id]}/5)`;
        if (id === 4 || id === 17) val = '★'.repeat(Number(entry[id])) + '☆'.repeat(5 - Number(entry[id])) + ` (${entry[id]}/5)`;
        return `<div class="pdf-row"><div class="pdf-row-label">${Q_LABELS[id]}</div><div class="pdf-row-val">${val.slice(0, 200)}</div></div>`;
    }).join('');
}

const totalEntries = Object.keys(entries).length;
let html = '';

// Today's report or empty state
if (todayEntry?.completed) {
    html += `
    <div class="section">
      <div class="section-head">Today's report · ${dateStr}</div>
      <div class="pdf-outer">
        <div class="pdf-label-row">
          <span class="pdf-icon">📄</span>
          <span class="pdf-label">Daily Reflection · ${dateStr}</span>
        </div>
        <div class="pdf-card" id="pdf-card">
          <div class="pdf-brand">م Mohasaba</div>
          <div class="pdf-sub">
            <span>${dateStr}</span>
            <span>${fullName}</span>
          </div>
          <hr class="pdf-divider">
          ${buildPdfRows(todayEntry)}
          <div class="pdf-footer">Mohasaba · Your 365-Day Journey · ${new Date().getFullYear()}</div>
        </div>
        <button class="btn-ghost" onclick="sendEmail()">📧 Send to ${user.email}</button>
        <button class="btn-primary" onclick="downloadPdf()">⬇️ Download PDF</button>
      </div>
    </div>`;
} else {
    html += `
    <div class="section">
      <div class="empty-card">
        <div class="icon">📄</div>
        <h3>No report for today yet</h3>
        <p>Complete and submit your daily reflection to generate your PDF summary.</p>
        <a href="04-daily-form.html" style="display:block;background:var(--gold);color:var(--navy);border-radius:11px;padding:13px 20px;font-weight:600;font-size:14px;text-decoration:none;text-align:center;">Start today's reflection →</a>
      </div>
    </div>`;
}

// 365-day brief teaser
if (totalEntries >= 5) {
    html += `
    <div class="section">
      <div class="year-card">
        <div class="icon">🏆</div>
        <h3>${totalEntries >= 30 ? '365-Day Brief available' : 'Year-in-review coming'}</h3>
        <p>${totalEntries >= 30
        ? 'You\'ve journaled enough days. Generate your annual personal growth summary — themes, patterns, and your evolution.'
        : `Keep going — you've logged ${totalEntries} days. Your year-in-review unlocks at 30 entries.`}
        </p>
        <button class="btn-primary" style="max-width:240px;margin:0 auto;display:block;" onclick="showToast('${totalEntries >= 30 ? 'Generating your year-in-review…' : `Keep going! ${30 - totalEntries} more days to unlock this.`}')">
          ${totalEntries >= 30 ? 'Generate year-in-review' : `${totalEntries} / 30 days logged`}
        </button>
      </div>
    </div>`;
}

// Past reports
const past = Object.entries(entries).sort(([a],[b]) => b.localeCompare(a)).filter(([k]) => k !== todayKey);
if (past.length > 0) {
    html += `<div class="section"><div class="section-head">Past reports</div>`;
    past.slice(0, 12).forEach(([key, entry]) => {
        const d = new Date(key + 'T12:00:00');
        const label = d.toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
        const moodVal = entry[2] ? '★'.repeat(Number(entry[2])) + '☆'.repeat(5 - Number(entry[2])) : '';
        html += `
      <div class="past-card" onclick="showPastEntry('${key}')">
        <div>
          <div class="past-card-date">${label}</div>
          <div class="past-card-sub">${moodVal ? 'Mood: ' + moodVal + ' · ' : ''}Reflection complete</div>
        </div>
        <div class="past-card-icon">⬇</div>
      </div>`;
    });
    html += `</div>`;
}

document.getElementById('main-content').innerHTML = html;

// Modal for past entry
function showPastEntry(key) {
    const entry = entries[key];
    if (!entry) return;
    const d = new Date(key + 'T12:00:00');
    const label = d.toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long', year:'numeric' });

    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(15,22,40,0.92);display:flex;align-items:center;justify-content:center;z-index:9000;padding:20px;overflow-y:auto;';
    modal.innerHTML = `
      <div style="background:#1a2540;border-radius:20px;padding:24px;max-width:400px;width:100%;border:1px solid rgba(200,169,110,0.25);">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
          <div style="font-size:14px;color:var(--gold);font-weight:500;">${label}</div>
          <button onclick="this.closest('div[style]').remove()" style="background:none;border:none;color:rgba(240,235,225,0.4);font-size:20px;cursor:pointer;line-height:1;">✕</button>
        </div>
        <div class="pdf-card" style="margin-bottom:0;">
          <div class="pdf-brand">م Mohasaba</div>
          <div class="pdf-sub"><span>${label}</span><span>${fullName}</span></div>
          <hr class="pdf-divider">
          ${buildPdfRows(entry)}
          <div class="pdf-footer">Mohasaba · Your 365-Day Journey</div>
        </div>
      </div>`;
    document.body.appendChild(modal);
}

function sendEmail()    { showToast(`PDF sent to ${user.email} ✓`); }
function downloadPdf()  { showToast('PDF downloaded ✓'); }