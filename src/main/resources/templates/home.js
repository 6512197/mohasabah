document.addEventListener('DOMContentLoaded', () => {

  const tabButtons  = document.querySelectorAll('.tabs__btn');
  const indicator   = document.getElementById('tabsIndicator');
  const panels      = {
    signin:   document.getElementById('panelSignin'),
    register: document.getElementById('panelRegister'),
  };
  const gotoButtons = document.querySelectorAll('[data-goto]');
  const formMsg     = document.getElementById('formMsg');
  const welcomeSub  = document.getElementById('welcomeSub');
  const tabsContainer = document.querySelector('.tabs');

  const copy = {
    signin:   'how are you today?',
    register: "let's set your journal up",
  };

  function updateIndicator(tab) {
    const activeBtn = document.querySelector(`.tabs__btn[data-tab="${tab}"]`);
    if (!activeBtn || !tabsContainer) return;

    // Get positions relative to the tabs container
    const containerRect = tabsContainer.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();

    // Calculate position
    const left = btnRect.left - containerRect.left;
    const width = btnRect.width;

    // Apply styles to move the indicator
    indicator.style.left = `${left}px`;
    indicator.style.width = `${width}px`;
  }

  function switchTo(tab){
    // Update tabs
    tabButtons.forEach(btn => {
      const active = btn.dataset.tab === tab;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-selected', String(active));
    });

    // Update indicator position
    updateIndicator(tab);

    // Update panels
    Object.entries(panels).forEach(([key, panel]) => {
      if (key === tab){
        panel.hidden = false;
        panel.classList.add('is-active');
      } else {
        panel.hidden = true;
        panel.classList.remove('is-active');
      }
    });

    // Update welcome message and clear form messages
    welcomeSub.textContent = copy[tab];
    formMsg.textContent = '';
    formMsg.style.color = ''; // Reset color
  }

  // Tab button click handlers
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      switchTo(btn.dataset.tab);
    });
  });

  // "Switch to" links inside forms
  gotoButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      switchTo(btn.dataset.goto);
    });
  });

  // Password visibility toggles
  document.querySelectorAll('[data-eye]').forEach(eyeBtn => {
    eyeBtn.addEventListener('click', () => {
      const wrap = eyeBtn.closest('.field__wrap');
      if (!wrap) return;

      const input = wrap.querySelector('.field__input');
      if (!input) return;

      const open = eyeBtn.querySelector('.eye--open');
      const closed = eyeBtn.querySelector('.eye--closed');
      const isPassword = input.type === 'password';

      input.type = isPassword ? 'text' : 'password';
      open.hidden = !isPassword;
      closed.hidden = isPassword;
      eyeBtn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    });
  });

  // Form submission handlers
  function handleSubmit(form, successText){
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!form.checkValidity()){
        form.reportValidity();
        return;
      }

      // Check password confirmation for register form
      if (form.id === 'panelRegister'){
        const pass = form.querySelector('[name="password"]');
        const confirm = form.querySelector('[name="confirm"]');

        if (pass && confirm && pass.value !== confirm.value){
          formMsg.style.color = '#ff6b6b';
          formMsg.textContent = "Passwords don't match.";
          return;
        }
      }

      // Success message
      formMsg.style.color = 'var(--neon)';
      formMsg.textContent = successText;

      // Optional: reset form after short delay
      setTimeout(() => {
        // form.reset();
      }, 2000);
    });
  }

  handleSubmit(panels.signin, '✅ Signed in — welcome back!');
  handleSubmit(panels.register, '✅ Account created — you can sign in now.');

  // Forgot password link
  const forgotLink = document.getElementById('forgotLink');
  if (forgotLink) {
    forgotLink.addEventListener('click', (e) => {
      e.preventDefault();
      formMsg.style.color = 'var(--neon)';
      formMsg.textContent = '📧 Password reset link sent (hook this up to your backend).';
    });
  }

  // Initialize with sign in tab active
  switchTo('signin');
});