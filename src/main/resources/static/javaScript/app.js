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


