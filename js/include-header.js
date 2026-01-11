/*
  include-header.js
  Fetches `html/partials/header.html` and injects it into #site-header placeholder.
  Also sets the active nav item based on current filename.
*/
(function () {
  async function tryFetch(paths) {
    for (const p of paths) {
      try {
        const resp = await fetch(p);
        if (resp.ok) return await resp.text();
      } catch (e) {
        // try next
      }
    }
    throw new Error("All fetch attempts failed for header partial");
  }

  async function loadHeader() {
    const candidates = [
      "/html/partials/header.html",
      "../html/partials/header.html",
      "html/partials/header.html",
      "partials/header.html",
    ];

    try {
      const html = await tryFetch(candidates);

      const placeholder = document.getElementById("site-header");
      if (!placeholder) return;

      const wrapper = document.createElement("header");
      wrapper.innerHTML = html;
      placeholder.replaceWith(wrapper);
      document.body.classList.add("with-fixed-header");

      // Set active link based on current file name
      const path = window.location.pathname;
      const file = path.substring(path.lastIndexOf("/") + 1);
      const links = wrapper.querySelectorAll("nav a");
      links.forEach((a) => {
        const href = a.getAttribute("href");
        if (href === file) {
          a.classList.add("active");
        }
      });
      // Dispatch event so other scripts can react
      try {
        window.dispatchEvent(new Event('headerLoaded'));
      } catch (e) {
        console.warn('Could not dispatch headerLoaded event', e);
      }

      // Call page-level initialization helpers if present (some pages define these)
      try {
        if (typeof window.generateCaptcha === 'function') {
          window.generateCaptcha();
        }
      } catch (e) {
        console.warn('Error calling page generateCaptcha', e);
      }
      try {
        if (typeof window.checkAuthStatus === 'function') {
          window.checkAuthStatus();
        }
      } catch (e) {
        console.warn('Error calling page checkAuthStatus', e);
      }
      try {
        if (typeof window.initSearchSuggestions === 'function') {
          window.initSearchSuggestions();
        }
      } catch (e) {
        console.warn('Error calling page initSearchSuggestions', e);
      }

      // Bind header-level auth/modal behavior (only once)
      if (!window._headerAuthBound) {
        window._headerAuthBound = true;
        bindHeaderAuth(wrapper);
      }
    } catch (err) {
      console.error("Error loading header partial:", err);
    }
  }

  // Attach auth/modal handlers for login/signup present in header
  function bindHeaderAuth(headerEl) {
    // Query elements inside newly injected header
    const loginBtn = headerEl.querySelector('#login-btn');
    const signupBtn = headerEl.querySelector('#signup-btn');
    const logoutBtn = headerEl.querySelector('#logout-btn');
    const profileDropdown = headerEl.querySelector('.profile-dropdown');
    const profileImageEl = profileDropdown ? profileDropdown.querySelector('#profile-image') : null;

    // Modal elements live in page body; query them
    const loginModal = document.getElementById('login-modal');
    const signupModal = document.getElementById('signup-modal');
    const closeButtons = document.querySelectorAll('.close');
    const switchToSignup = document.getElementById('switch-to-signup');
    const switchToLogin = document.getElementById('switch-to-login');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const captchaText = document.getElementById('captcha-text');
    const refreshCaptchaBtn = document.getElementById('refresh-captcha');
    const captchaInput = document.getElementById('captcha-input');

    let currentCaptcha = '';

    function generateCaptcha() {
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
      let captcha = '';
      for (let i=0;i<6;i++) captcha += chars.charAt(Math.floor(Math.random()*chars.length));
      currentCaptcha = captcha;
      if (captchaText) captchaText.textContent = captcha;
    }

    function checkAuthStatus() {
      const user = JSON.parse(localStorage.getItem('currentUser'));
      const authButtons = headerEl.querySelectorAll('#login-btn, #signup-btn');
      if (user) {
        authButtons.forEach(b => b.style.display = 'none');
        if (profileDropdown) profileDropdown.style.display = 'block';
        if (profileImageEl && user.profileImage) profileImageEl.src = user.profileImage;
      } else {
        authButtons.forEach(b => b.style.display = 'inline-block');
        if (profileDropdown) {
          profileDropdown.style.display = 'none';
          profileDropdown.classList.remove('open');
        }
      }
    }

    function openModal(modal) {
      if (!modal) return;
      modal.style.display = 'block';
      document.body.style.overflow = 'hidden';
    }

    function closeModal(modal) {
      if (!modal) return;
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }

    function showNotification(message) {
      const notification = document.createElement('div');
      notification.className = 'notification';
      notification.textContent = message;
      document.body.appendChild(notification);
      setTimeout(()=> notification.classList.add('show'), 10);
      setTimeout(()=> { notification.classList.remove('show'); setTimeout(()=> notification.remove(),300); }, 3000);
    }

    // Wire header buttons
    if (loginBtn) loginBtn.addEventListener('click', () => openModal(loginModal));
    if (signupBtn) signupBtn.addEventListener('click', () => { openModal(signupModal); generateCaptcha(); });
    if (logoutBtn) logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('currentUser');
      checkAuthStatus();
      try {
        window.dispatchEvent(new CustomEvent('authStatusChanged', { detail: { status: 'loggedOut' } }));
      } catch (eventErr) {
        console.warn('Could not dispatch authStatusChanged on logout', eventErr);
      }
      showNotification('Logged out successfully!');
      window.location.href = 'index.html';
    });

    if (profileImageEl && profileDropdown) {
      profileImageEl.addEventListener('click', (e) => {
        e.stopPropagation();
        const willOpen = !profileDropdown.classList.contains('open');
        document.querySelectorAll('.profile-dropdown.open').forEach((openDropdown) => {
          if (openDropdown !== profileDropdown) openDropdown.classList.remove('open');
        });
        if (willOpen) {
          profileDropdown.classList.add('open');
        } else {
          profileDropdown.classList.remove('open');
        }
      });

      document.addEventListener('click', (e) => {
        if (!profileDropdown.contains(e.target)) {
          profileDropdown.classList.remove('open');
        }
      });
    }

    // Close buttons in modals
    closeButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        const modal = this.closest('.modal');
        closeModal(modal);
      });
    });

    // Switch links
    if (switchToSignup) switchToSignup.addEventListener('click', (e)=>{ e.preventDefault(); closeModal(loginModal); openModal(signupModal); generateCaptcha(); });
    if (switchToLogin) switchToLogin.addEventListener('click', (e)=>{ e.preventDefault(); closeModal(signupModal); openModal(loginModal); });

    // Refresh CAPTCHA
    if (refreshCaptchaBtn) refreshCaptchaBtn.addEventListener('click', generateCaptcha);

    // Login submit (basic localStorage users)
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          closeModal(loginModal);
          checkAuthStatus();
          try {
            window.dispatchEvent(new CustomEvent('authStatusChanged', { detail: { status: 'loggedIn' } }));
          } catch (eventErr) {
            console.warn('Could not dispatch authStatusChanged on login', eventErr);
          }
          showNotification('Login successful!');
        } else {
          alert('Invalid email or password!');
        }
      });
    }

    // Signup submit
    if (signupForm) {
      signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;
        const captchaVal = (captchaInput && captchaInput.value) || '';
        if (captchaVal !== currentCaptcha) { alert('Invalid CAPTCHA!'); generateCaptcha(); return; }
        if (password !== confirmPassword) { alert('Passwords do not match!'); return; }
        const users = JSON.parse(localStorage.getItem('users')) || [];
        if (users.some(u => u.email === email)) { alert('Email already exists! Please use a different email.'); return; }
        const newUser = { id: Date.now(), name, email, password, savedEvents: [], createdEvents: [] };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        closeModal(signupModal);
        checkAuthStatus();
        try {
          window.dispatchEvent(new CustomEvent('authStatusChanged', { detail: { status: 'signedUp' } }));
        } catch (eventErr) {
          console.warn('Could not dispatch authStatusChanged on signup', eventErr);
        }
        showNotification('Account created successfully!');
      });
    }

    // Finalize initial auth state
    generateCaptcha();
    checkAuthStatus();
  }

  // Run as soon as possible
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadHeader);
  } else {
    loadHeader();
  }
})();
