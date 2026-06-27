/* =========================================================
   Mohasaba — shared app script
   One file for every page. Each page sets <body data-page="...">
   so the right init function runs; everything else is inert.
   ========================================================= */

/* ---------- storage helpers ---------- */

function getUser() {
    return JSON.parse(localStorage.getItem('moh_user') || 'null');
}

function requireAuth() {
    const user = getUser();
    if (!user) {
        window.location.href = '01-login.html';
        return null;
    }
    return user;
}

function todayKey(offsetDays = 0) {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d.toISOString().split('T')[0];
}

function getEntries() {
    return JSON.parse(localStorage.getItem('moh_entries') || '{}');
}

function getDraft(key) {
    return JSON.parse(localStorage.getItem('moh_draft_' + key) || '{}');
}

function saveDraft(key, draft) {
    localStorage.setItem('moh_draft_' + key, JSON.stringify(draft));
}

function formatLong(dateOrKey) {
    const d = typeof dateOrKey === 'string' ? new Date(dateOrKey + 'T12:00:00') : dateOrKey;
    return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function showToast(msg, holdMs = 2600) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.style.display = 'block';
    clearTimeout(t._hideTimer);
    t._hideTimer = setTimeout(() => { t.style.display = 'none'; }, holdMs);
}

function stars(value, max = 5) {
    const v = Number(value) || 0;
    return '★'.repeat(v) + '☆'.repeat(max - v);
}

/* ---------- shared question bank (used by daily-form, weekly, reports) ---------- */

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

const Q_LABELS = {};
QUESTIONS.forEach(q => { Q_LABELS[q.id] = q.cat; });

/* =========================================================
   Page: morning prompt   (data-page="morning")
   ========================================================= */

function initMorning() {
    const user = requireAuth();
    if (!user) return;

    document.getElementById('user-name').textContent = user.firstName || 'Friend';

    const hour = new Date().getHours();
    const timeEl = document.getElementById('time-label');
    timeEl.textContent = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    const yKey = todayKey(-1);
    const entries = getEntries();
    const yEntry = entries[yKey];
    if (yEntry && yEntry[40]) {
        document.getElementById('yesterday-box').style.display = 'block';
        document.getElementById('yesterday-text').textContent = '"' + yEntry[40] + '"';
    }

    const key = todayKey();
    const draft = getDraft(key);
    const answerEl = document.getElementById('morning-answer');
    if (draft.sleepReflection) {
        answerEl.value = draft.sleepReflection;
        updateCount(answerEl);
    }

    answerEl.addEventListener('input', () => updateCount(answerEl));

    function updateCount(el) {
        document.getElementById('char-count').textContent = el.value.length;
    }

    document.getElementById('morning-save').addEventListener('click', () => {
        const answer = answerEl.value.trim();
        if (!answer) { showToast('Write your intention first.'); return; }
        const d = getDraft(key);
        d.sleepReflection = answer;
        saveDraft(key, d);
        showToast('Morning intention set ✓');
        setTimeout(() => { window.location.href = '03-home.html'; }, 900);
    });

    document.getElementById('morning-skip').addEventListener('click', () => {
        window.location.href = '03-home.html';
    });
}

/* =========================================================
   Page: home   (data-page="home")
   ========================================================= */

function initHome() {
    const user = requireAuth();
    if (!user) return;

    document.getElementById('user-name').textContent = user.firstName || 'Friend';

    const hour = new Date().getHours();
    const greet = hour < 12 ? 'Good morning,' : hour < 17 ? 'Good afternoon,' : 'Good evening,';
    document.getElementById('greeting-line').innerHTML = `${greet} <em>${user.firstName || 'Friend'}</em>`;

    document.getElementById('today-date').textContent = formatLong(new Date());

    if (new Date().getDay() === 0) document.getElementById('sunday-banner').style.display = 'block';

    const key = todayKey();
    const TOTAL_QS = new Date().getDay() === 0 ? 41 : 40;
    const draft = getDraft(key);
    const answered = Object.entries(draft).filter(([k, v]) => !isNaN(k) && String(v).trim()).length;
    const pct = Math.round((answered / TOTAL_QS) * 100);

    document.getElementById('prog-pct').textContent = pct + '%';
    document.getElementById('prog-fill').style.width = pct + '%';
    document.getElementById('prog-sub').textContent = `${answered} of ${TOTAL_QS} questions answered`;

    const entries = getEntries();
    if (entries[key]?.completed) {
        document.getElementById('completed-badge').style.display = 'block';
    }

    const ctaBtn = document.getElementById('cta-btn');
    if (answered > 0) ctaBtn.textContent = "Continue today's reflection →";
    if (entries[key]?.completed) ctaBtn.textContent = "View today's entry →";

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

    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('moh_user');
        window.location.href = '01-login.html';
    });
}

/* =========================================================
   Page: daily form   (data-page="daily-form")
   ========================================================= */

function initDailyForm() {
    const user = requireAuth();
    if (!user) return;

    const isSunday = new Date().getDay() === 0;
    const questions = QUESTIONS.filter(q => !q.sundayOnly || isSunday);
    const key = todayKey();
    let current = 0;
    let answers = getDraft(key);

    function persist() { saveDraft(key, answers); }

    function getAnswer() {
        const q = questions[current];
        if (q.type === 'rating') {
            const filled = document.querySelectorAll('.star.filled').length;
            return filled ? filled.toString() : '';
        } else if (q.type === 'choice') {
            const sel = document.querySelector('.choice-btn.selected');
            return sel ? sel.textContent : '';
        }
        const el = document.getElementById('ans-input');
        return el ? el.value : '';
    }

    function saveCurrentAnswer() {
        const q = questions[current];
        const val = getAnswer();
        if (val) answers[q.id] = val; else delete answers[q.id];
        persist();
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
            html = `<textarea id="ans-input" placeholder="Write your reflection…">${saved}</textarea>`;
        } else if (q.type === 'text') {
            html = `<input type="text" id="ans-input" placeholder="Your answer…" value="${String(saved).replace(/"/g, '&quot;')}">`;
        } else if (q.type === 'rating') {
            const val = parseInt(saved) || 0;
            html = `<div class="star-row" id="star-row">`;
            for (let i = 1; i <= 5; i++) {
                html += `<span class="star ${i <= val ? 'filled' : ''}" data-val="${i}">★</span>`;
            }
            html += `<span class="star-val" id="star-val">${val > 0 ? val + '/5' : ''}</span></div>`;
        } else if (q.type === 'choice') {
            html = `<div class="choice-row">`;
            q.options.forEach(opt => {
                html += `<button type="button" class="choice-btn ${saved === opt ? 'selected' : ''}">${opt}</button>`;
            });
            html += `</div>`;
        }

        document.getElementById('q-input').innerHTML = html;

        if (q.type === 'text' || q.type === 'textarea') {
            document.getElementById('ans-input').addEventListener('input', saveCurrentAnswer);
        } else if (q.type === 'rating') {
            document.querySelectorAll('.star').forEach(star => {
                star.addEventListener('click', () => setRating(Number(star.dataset.val)));
            });
        } else if (q.type === 'choice') {
            document.querySelectorAll('.choice-btn').forEach(btn => {
                btn.addEventListener('click', () => setChoice(btn));
            });
        }

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

        const card = document.getElementById('q-card');
        card.style.opacity = '0'; card.style.transform = 'translateY(8px)';
        requestAnimationFrame(() => {
            card.style.transition = 'opacity .22s ease, transform .22s ease';
            card.style.opacity = '1'; card.style.transform = 'translateY(0)';
        });
    }

    function setRating(val) {
        document.querySelectorAll('.star').forEach((s, i) => s.classList.toggle('filled', i < val));
        document.getElementById('star-val').textContent = val + '/5';
        answers[questions[current].id] = val.toString();
        persist(); renderDots();
    }

    function setChoice(btn) {
        document.querySelectorAll('.choice-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        answers[questions[current].id] = btn.textContent;
        persist(); renderDots();
    }

    function navigate(dir) {
        saveCurrentAnswer();
        if (dir === 1 && current === questions.length - 1) { submitDay(); return; }
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

    function submitDay() {
        const entries = getEntries();
        entries[key] = { ...answers, date: key, completed: true, timestamp: Date.now() };
        localStorage.setItem('moh_entries', JSON.stringify(entries));
        showToast('Day submitted ✓ Generating your report…');
        setTimeout(() => { window.location.href = '06-reports.html'; }, 1200);
    }

    document.getElementById('btn-back').addEventListener('click', () => navigate(-1));
    document.getElementById('btn-next').addEventListener('click', () => navigate(1));

    renderQuestion();
}

/* =========================================================
   Page: weekly tracker   (data-page="weekly")
   ========================================================= */

function initWeekly() {
    requireAuth();

    const DAYS_SHORT = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    const DAYS_FULL  = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
    const PREVIEW_IDS = [1, 2, 3, 5, 13, 14, 40, 41];

    const entries = getEntries();
    const today = new Date();
    const dow = today.getDay() === 0 ? 6 : today.getDay() - 1;

    const weekDays = DAYS_SHORT.map((label, i) => {
        const d = new Date(today); d.setDate(today.getDate() - dow + i);
        return { key: d.toISOString().split('T')[0], label, full: DAYS_FULL[i], isToday: i === dow, isFuture: i > dow };
    });

    const completedCount = weekDays.filter(d => entries[d.key]?.completed).length;
    document.getElementById('week-subtitle').textContent = `${completedCount} of 7 days complete`;
    document.getElementById('prog-label').textContent = `${completedCount} of 7 days complete`;
    document.getElementById('week-fill').style.width = `${(completedCount / 7) * 100}%`;

    let streak = 0;
    for (let i = dow; i >= 0; i--) {
        if (entries[weekDays[i].key]?.completed) streak++; else break;
    }
    if (streak > 1) document.getElementById('streak-label').textContent = `🔥 ${streak}-day streak`;

    const grid = document.getElementById('day-grid');
    let selectedKey = null;

    weekDays.forEach(d => {
        const done = entries[d.key]?.completed;
        const chip = document.createElement('div');
        chip.className = 'day-chip' + (done ? ' done' : '') + (d.isToday ? ' today' : '') + (d.isFuture ? ' future' : '');
        chip.innerHTML = `<div class="chip-label">${d.label}</div><div class="chip-icon">${done ? '✓' : d.isToday ? '✏️' : '·'}</div>`;
        if (!d.isFuture) {
            chip.addEventListener('click', () => {
                if (selectedKey === d.key) { closePreview(); return; }
                if (done || d.isToday) showPreview(d.key, d.full);
                selectedKey = d.key;
                document.querySelectorAll('.day-chip').forEach(c => c.classList.remove('selected'));
                chip.classList.add('selected');
            });
        }
        grid.appendChild(chip);
    });

    function showPreview(key, dayName) {
        const entry = entries[key];
        if (!entry) return;
        document.getElementById('preview-day-name').textContent = dayName;
        const rows = document.getElementById('preview-rows');
        rows.innerHTML = '';
        const showQs = PREVIEW_IDS.filter(id => entry[id]);
        if (showQs.length === 0) {
            rows.innerHTML = '<div style="color:var(--text-faint);font-size:13px;">No answers recorded.</div>';
        }
        showQs.forEach(id => {
            const val = entry[id];
            const row = document.createElement('div');
            row.className = 'entry-row';
            const displayVal = id === 2 ? `${stars(val)} (${val}/5)` : String(val).slice(0, 150) + (String(val).length > 150 ? '…' : '');
            row.innerHTML = `<div class="entry-row-cat">${Q_LABELS[id] || 'Q' + id}</div><div class="entry-row-val">${displayVal}</div>`;
            rows.appendChild(row);
        });
        document.getElementById('entry-preview').style.display = 'block';
    }

    function closePreview() {
        document.getElementById('entry-preview').style.display = 'none';
        document.querySelectorAll('.day-chip').forEach(c => c.classList.remove('selected'));
        selectedKey = null;
    }
    document.getElementById('entry-close').addEventListener('click', closePreview);

    const list = document.getElementById('entries-list');
    const sortedEntries = Object.entries(entries).sort(([a], [b]) => b.localeCompare(a));

    if (sortedEntries.length === 0) {
        list.innerHTML = '<div class="empty-state">No entries yet.<br>Complete your first reflection today.</div>';
    } else {
        sortedEntries.slice(0, 20).forEach(([key, entry]) => {
            const label = formatLong(key);
            const snippet = entry[1] ? String(entry[1]).slice(0, 70) + (String(entry[1]).length > 70 ? '…' : '') : 'Reflection complete';
            const card = document.createElement('div');
            card.className = 'entry-card';
            card.innerHTML = `<div><div class="entry-card-date">${label}</div><div class="entry-card-snippet">${snippet}</div></div><div class="entry-arrow">›</div>`;
            card.addEventListener('click', () => {
                const d = new Date(key + 'T12:00:00');
                showPreview(key, d.toLocaleDateString('en-GB', { weekday: 'long' }));
            });
            list.appendChild(card);
        });
    }
}

/* =========================================================
   Page: reports   (data-page="reports")
   ========================================================= */

function initReports() {
    const user = requireAuth();
    if (!user) return;

    const entries = getEntries();
    const key = todayKey();
    const todayEntry = entries[key];
    const dateStr = formatLong(new Date());
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();

    const REPORT_IDS = [1, 2, 3, 4, 5, 8, 17, 29, 37, 40, 41];

    function buildPdfRows(entry) {
        const showQs = REPORT_IDS.filter(id => entry[id]);
        if (showQs.length === 0) return '<div style="color:var(--paper-dim);font-size:12px;">No answers recorded for this day.</div>';
        return showQs.map(id => {
            let val = String(entry[id]);
            if (id === 2 || id === 4 || id === 17) val = `${stars(entry[id])} (${entry[id]}/5)`;
            return `<div class="pdf-row"><div class="pdf-row-label">${Q_LABELS[id]}</div><div class="pdf-row-val">${val.slice(0, 200)}</div></div>`;
        }).join('');
    }

    const totalEntries = Object.keys(entries).length;
    let html = '';

    if (todayEntry?.completed) {
        html += `
    <div class="section">
      <div class="section-head">Today's report · ${dateStr}</div>
      <div class="pdf-outer">
        <div class="pdf-label-row"><span class="pdf-icon">📄</span><span class="pdf-label">Daily Reflection · ${dateStr}</span></div>
        <div class="pdf-card">
          <div class="pdf-brand">Mohasaba</div>
          <div class="pdf-sub"><span>${dateStr}</span><span>${fullName}</span></div>
          <hr class="pdf-divider">
          ${buildPdfRows(todayEntry)}
          <div class="pdf-footer">Mohasaba · Your 365-Day Journey · ${new Date().getFullYear()}</div>
        </div>
        <button class="btn-ghost" id="send-email-btn">Send to ${user.email}</button>
        <button class="btn-primary" id="download-pdf-btn">Download PDF</button>
      </div>
    </div>`;
    } else {
        html += `
    <div class="section">
      <div class="empty-card">
        <div class="icon">📄</div>
        <h3>No report for today yet</h3>
        <p>Complete and submit your daily reflection to generate your PDF summary.</p>
        <a href="04-daily-form.html" class="btn-primary">Start today's reflection →</a>
      </div>
    </div>`;
    }

    if (totalEntries >= 5) {
        const unlocked = totalEntries >= 30;
        html += `
    <div class="section">
      <div class="year-card">
        <div class="icon">🏆</div>
        <h3>${unlocked ? '365-Day Brief available' : 'Year-in-review coming'}</h3>
        <p>${unlocked
            ? "You've journaled enough days. Generate your annual personal growth summary — themes, patterns, and your evolution."
            : `Keep going — you've logged ${totalEntries} days. Your year-in-review unlocks at 30 entries.`}</p>
        <button class="btn-primary" id="year-review-btn" data-unlocked="${unlocked}" data-remaining="${30 - totalEntries}" data-count="${totalEntries}">
          ${unlocked ? 'Generate year-in-review' : `${totalEntries} / 30 days logged`}
        </button>
      </div>
    </div>`;
    }

    const past = Object.entries(entries).sort(([a], [b]) => b.localeCompare(a)).filter(([k]) => k !== key);
    if (past.length > 0) {
        html += `<div class="section"><div class="section-head">Past reports</div>`;
        past.slice(0, 12).forEach(([pKey, entry]) => {
            const label = formatLong(pKey);
            const moodVal = entry[2] ? stars(entry[2]) : '';
            html += `
      <div class="past-card" data-key="${pKey}">
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

    document.getElementById('send-email-btn')?.addEventListener('click', () => showToast(`PDF sent to ${user.email} ✓`));
    document.getElementById('download-pdf-btn')?.addEventListener('click', () => showToast('PDF downloaded ✓'));
    document.getElementById('year-review-btn')?.addEventListener('click', (e) => {
        const btn = e.currentTarget;
        const unlocked = btn.dataset.unlocked === 'true';
        showToast(unlocked ? 'Generating your year-in-review…' : `Keep going! ${btn.dataset.remaining} more days to unlock this.`);
    });

    document.querySelectorAll('.past-card').forEach(card => {
        card.addEventListener('click', () => showPastEntry(card.dataset.key));
    });

    function showPastEntry(pKey) {
        const entry = entries[pKey];
        if (!entry) return;
        const label = formatLong(pKey);

        const backdrop = document.createElement('div');
        backdrop.className = 'entry-modal-backdrop';
        backdrop.innerHTML = `
      <div class="entry-modal">
        <div class="entry-modal-head">
          <div class="date">${label}</div>
          <button class="entry-modal-close" type="button">✕</button>
        </div>
        <div class="pdf-card" style="margin-bottom:0;">
          <div class="pdf-brand">Mohasaba</div>
          <div class="pdf-sub"><span>${label}</span><span>${fullName}</span></div>
          <hr class="pdf-divider">
          ${buildPdfRows(entry)}
          <div class="pdf-footer">Mohasaba · Your 365-Day Journey</div>
        </div>
      </div>`;
        backdrop.querySelector('.entry-modal-close').addEventListener('click', () => backdrop.remove());
        backdrop.addEventListener('click', (e) => { if (e.target === backdrop) backdrop.remove(); });
        document.body.appendChild(backdrop);
    }
}

/* =========================================================
   Dispatch
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
    switch (document.body.dataset.page) {
        case 'morning':    initMorning();    break;
        case 'home':       initHome();       break;
        case 'daily-form': initDailyForm();  break;
        case 'weekly':     initWeekly();     break;
        case 'reports':    initReports();   break;
    }
});
