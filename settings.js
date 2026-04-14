// ============================================
// SETTINGS - THEME MANAGEMENT
// ============================================

// Set theme and persist to localStorage
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  
  // Update button states on settings page
  const lightBtn = document.getElementById('themeLightBtn');
  const darkBtn = document.getElementById('themeDarkBtn');
  
  if (lightBtn && darkBtn) {
    lightBtn.classList.toggle('active', theme === 'light');
    darkBtn.classList.toggle('active', theme === 'dark');
  }
}

// Initialize theme buttons on settings page
document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('theme') || 'light';
  const lightBtn = document.getElementById('themeLightBtn');
  const darkBtn = document.getElementById('themeDarkBtn');
  
  if (lightBtn && darkBtn) {
    lightBtn.classList.toggle('active', saved === 'light');
    darkBtn.classList.toggle('active', saved === 'dark');
  }
});
