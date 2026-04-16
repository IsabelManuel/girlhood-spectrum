// ============================================
// API HELPER
// ============================================

async function apiPost(url, data) {
  try {
    const res = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (e) {
    return { success: false, error: 'Erro de ligação ao servidor' };
  }
}

async function apiGet(url) {
  try {
    const res = await fetch(url, { credentials: 'include' });
    return await res.json();
  } catch (e) {
    return { success: false, error: 'Erro de ligação ao servidor' };
  }
}

// ============================================
// AUTH FUNCTIONS
// ============================================

// Login form
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email    = document.getElementById('email')?.value?.trim();
    const password = document.getElementById('password')?.value;

    if (!email || !password) {
      alert('❌ Por favor, preenche email e palavra-passe!');
      return;
    }

    const result = await apiPost('auth/login.php', { email, password });
    if (result.success) {
      alert('✅ Login bem-sucedido! 🎉');
      setTimeout(() => { window.location.href = 'dashboard.html'; }, 400);
    } else {
      alert('❌ ' + result.error);
    }
  });
}

// Signup form
const signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name            = document.getElementById('username')?.value?.trim();
    const email           = document.getElementById('email')?.value?.trim();
    const password        = document.getElementById('password')?.value;
    const passwordConfirm = document.getElementById('password-confirm')?.value;

    if (!name || !email || !password || !passwordConfirm) {
      alert('❌ Por favor, preenche todos os campos!');
      return;
    }
    if (password !== passwordConfirm) {
      alert('❌ As palavras-passe não coincidem!');
      return;
    }

    const result = await apiPost('auth/register.php', { name, email, password });
    if (result.success) {
      alert('✅ Conta criada com sucesso! 🎉');
      setTimeout(() => { window.location.href = 'dashboard.html'; }, 400);
    } else {
      alert('❌ ' + result.error);
    }
  });
}

// Logout
function logout() {
  fetch('auth/logout.php', { method: 'POST', credentials: 'include' })
    .finally(() => { window.location.href = 'index.html'; });
}

// Check auth — called on every protected page
async function checkAuth() {
  const page = window.location.pathname;
  const isPublic = ['index.html', 'login.html', 'signup.html', 'forgot-password.html']
    .some(p => page.includes(p)) || page.endsWith('/');

  const result = await apiGet('auth/check.php');

  if (result.loggedIn) {
    // Store in sessionStorage for quick UI access
    sessionStorage.setItem('userId',    result.user.id);
    sessionStorage.setItem('username',  result.user.name);
    sessionStorage.setItem('userEmail', result.user.email);

    // Redirect away from public pages if already logged in
    if (isPublic && !page.endsWith('/') && !page.includes('index.html')) {
      window.location.href = 'dashboard.html';
    }
  } else {
    sessionStorage.clear();
    if (!isPublic) {
      window.location.href = 'login.html';
    }
  }
}

// Google placeholders
function loginWithGoogle()  { alert('Google Sign-In em breve! 🚀'); }
function signupWithGoogle() { alert('Google Sign-Up em breve! 🚀'); }

// Run auth check
checkAuth();
