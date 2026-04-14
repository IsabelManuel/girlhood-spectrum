// ============================================
// AUTHENTICATION FUNCTIONS
// ============================================

// Handle Login Form
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email')?.value?.trim();
    const password = document.getElementById('password')?.value;
    
    if (!email || !password) {
      alert('❌ Por favor, preenche email e palavra-passe!');
      return;
    }
    
    // Get registered users
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email);
    
    // Validate user exists
    if (!user) {
      alert('❌ Email não encontrado! Cria uma conta primeiro.');
      return;
    }
    
    // Validate password matches
    if (user.password !== password) {
      alert('❌ Palavra-passe incorreta!');
      return;
    }
    
    // Login successful
    localStorage.setItem('userEmail', email);
    localStorage.setItem('username', user.name);
    localStorage.setItem('isLoggedIn', 'true');
    
    alert('✅ Login bem-sucedido! 🎉');
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 500);
  });
}

// Handle Signup Form
const signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username')?.value?.trim();
    const email = document.getElementById('email')?.value?.trim();
    const password = document.getElementById('password')?.value;
    const passwordConfirm = document.getElementById('password-confirm')?.value;
    
    // Validations
    if (!username || !email || !password || !passwordConfirm) {
      alert('❌ Por favor, preenche todos os campos!');
      return;
    }
    
    if (username.length < 2) {
      alert('❌ Nome deve ter pelo menos 2 caracteres!');
      return;
    }
    
    if (!email.includes('@')) {
      alert('❌ Email inválido!');
      return;
    }
    
    if (password.length < 8) {
      alert('❌ Palavra-passe deve ter pelo menos 8 caracteres!');
      return;
    }
    
    if (password !== passwordConfirm) {
      alert('❌ As palavras-passe não coincidem!');
      return;
    }
    
    // Get existing users
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if email already registered
    if (users.find(u => u.email === email)) {
      alert('❌ Este email já está registado!');
      return;
    }
    
    // Create new user
    const newUser = {
      email: email,
      name: username,
      password: password, // In production, use bcrypt/hashing!
      createdDate: new Date().toLocaleString('pt-PT')
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto login
    localStorage.setItem('username', username);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('isLoggedIn', 'true');
    
    alert('✅ Conta criada com sucesso! 🎉');
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 500);
  });
}

// Check if user is logged in
function checkAuth() {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  if (!isLoggedIn && !window.location.pathname.includes('index.html') && !window.location.pathname.includes('login.html') && !window.location.pathname.includes('signup.html')) {
    window.location.href = 'login.html';
  }
}

// Logout function
function logout() {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('username');
  window.location.href = 'index.html';
}

// Google Sign-In Callback
function loginWithGoogle() {
  // TODO: Implement Google Sign-In
  alert('Google Sign-In coming soon! 🚀');
}

function signupWithGoogle() {
  // TODO: Implement Google Sign-Up
  alert('Google Sign-Up coming soon! 🚀');
}

// Initialize
checkAuth();
