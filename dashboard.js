// ============================================
// DASHBOARD FUNCTIONS
// ============================================

// Mood emoji map
const moodEmojiMap = {
  'happy': '😊',
  'neutral': '😐',
  'sad': '😢',
  'anxious': '😰',
  'angry': '😠',
  'fear': '😨'
};

const moodNameMap = {
  'happy': 'Feliz',
  'neutral': 'Neutro',
  'sad': 'Triste',
  'anxious': 'Ansioso',
  'angry': 'Irritado',
  'fear': 'Medo'
};

// Calculate Points Based on Real Data
function calculatePoints() {
  const userEmail = localStorage.getItem('userEmail');
  if (!userEmail) return 0;
  
  const moodHistoryKey = 'moodHistory_' + userEmail;
  const moodHistory = JSON.parse(localStorage.getItem(moodHistoryKey) || '[]');
  
  // Sistema de pontos:
  // - 1 registo de humor = 5 pontos
  // - Bónus por intensidade (até 5 pontos extras)
  let totalPoints = 0;
  
  moodHistory.forEach(mood => {
    totalPoints += 5; // Ponto base por registo
    totalPoints += Math.floor(mood.intensity / 2); // Bónus por intensidade (1-5 pts)
  });
  
  return totalPoints;
}

// Update Dashboard Points
function updateDashboardPoints() {
  const totalPoints = calculatePoints();
  const pointsElement = document.getElementById('totalPoints');
  if (pointsElement) {
    pointsElement.textContent = totalPoints;
  }
}

// Update alerts display (not needed anymore - alerts section removed)
function updateAlertsDisplay() {
  // This function is deprecated as alerts section was removed from dashboard
  return;
}

// Show success toast instead of alert()
function showSuccessToast() {
  const toast = document.getElementById('moodSuccessToast');
  if (toast) {
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
}

// Update last mood display
function updateLastMoodDisplay() {
  const userEmail = localStorage.getItem('userEmail');
  if (!userEmail) return;
  
  const moodHistoryKey = 'moodHistory_' + userEmail;
  const moods = JSON.parse(localStorage.getItem(moodHistoryKey) || '[]');
  
  if (moods.length === 0) return;
  
  const lastMood = moods[moods.length - 1];
  const section = document.getElementById('lastMoodSection');
  const emoji = document.getElementById('lastMoodEmoji');
  const name = document.getElementById('lastMoodName');
  const time = document.getElementById('lastMoodTime');
  const intensity = document.getElementById('lastMoodIntensity');
  
  if (!section) return;
  
  section.style.display = 'block';
  emoji.textContent = moodEmojiMap[lastMood.mood] || '😊';
  name.textContent = moodNameMap[lastMood.mood] || lastMood.mood;
  
  // Format time
  const date = new Date(lastMood.timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) {
    time.textContent = 'Agora mesmo';
  } else if (diffMins < 60) {
    time.textContent = `Há ${diffMins} minuto${diffMins > 1 ? 's' : ''}`;
  } else if (diffHours < 24) {
    time.textContent = `Há ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
  } else {
    time.textContent = `Há ${diffDays} dia${diffDays > 1 ? 's' : ''}`;
  }
  
  // Intensity dots
  let dotsHTML = '';
  for (let i = 1; i <= 10; i++) {
    dotsHTML += `<span class="intensity-dot ${i <= lastMood.intensity ? 'filled' : ''}"></span>`;
  }
  intensity.innerHTML = dotsHTML;
}

// Mood Tracker
let selectedMood = null;
let moodBtns = [];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  // Set welcome name
  const userName = localStorage.getItem('username');
  const welcomeName = document.getElementById('welcomeName');
  if (welcomeName && userName) {
    welcomeName.textContent = userName;
  }
  
  // Set current date
  const dateEl = document.getElementById('currentDate');
  if (dateEl) {
    const now = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    const formatted = now.toLocaleDateString('pt-PT', options);
    dateEl.textContent = formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }
  
  // Update points from real data
  updateDashboardPoints();
  
  // Show last mood
  updateLastMoodDisplay();
  
  // Setup mood buttons with improved interactivity
  moodBtns = document.querySelectorAll('.mood-btn');
  moodBtns.forEach((btn) => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      moodBtns.forEach((b) => b.classList.remove('active'));
      this.classList.add('active');
      selectedMood = this.dataset.mood;
      
      const moodForm = document.getElementById('moodForm');
      if (moodForm) {
        moodForm.style.display = 'flex';
      }
    });
    
    // Ensure buttons are interactive
    btn.style.cursor = 'pointer';
    btn.style.userSelect = 'none';
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Setup intensity slider
  const intensitySlider = document.getElementById('intensity');
  if (intensitySlider) {
    intensitySlider.addEventListener('input', (e) => {
      const value = document.getElementById('intensityValue');
      if (value) {
        value.textContent = e.target.value;
      }
    });
  }

  // Check auth
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  if (!isLoggedIn && window.location.pathname.includes('dashboard.html')) {
    window.location.href = 'login.html';
  }
  
});

// Submit Mood
function submitMood() {
  const userEmail = localStorage.getItem('userEmail');
  const intensity = document.getElementById('intensity')?.value || 5;
  const notes = document.getElementById('notes')?.value || '';
  
  if (!selectedMood) {
    alert('Escolhe um sentimento!');
    return;
  }
  
  const moodData = {
    mood: selectedMood,
    intensity: parseInt(intensity),
    notes: notes,
    timestamp: new Date().toISOString()
  };
  
  // Save to localStorage (per user)
  const moodHistoryKey = 'moodHistory_' + userEmail;
  let moods = JSON.parse(localStorage.getItem(moodHistoryKey) || '[]');
  moods.push(moodData);
  localStorage.setItem(moodHistoryKey, JSON.stringify(moods));
  
  // Show success toast
  showSuccessToast();
  
  // Update points display
  updateDashboardPoints();
  
  // Update alerts for group members
  updateAlertsDisplay();
  
  // Update last mood display
  updateLastMoodDisplay();
  
  // Reset form
  selectedMood = null;
  moodBtns.forEach((b) => b.classList.remove('active'));
  document.getElementById('moodForm').style.display = 'none';
  document.getElementById('intensity').value = 5;
  document.getElementById('intensityValue').textContent = '5';
  document.getElementById('notes').value = '';
}

