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

// ============================================
// FEAR ALERT SYSTEM
// ============================================

// Save a fear alert for all group members to see
function saveFearAlert() {
  const userEmail = localStorage.getItem('userEmail');
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u => u.email === userEmail);
  const userName = user ? user.name : (localStorage.getItem('username') || 'Alguém');

  const userGroup = typeof getUserGroup === 'function' ? getUserGroup() : null;
  if (!userGroup) return;

  const newAlert = {
    id: Date.now(),
    senderEmail: userEmail,
    senderName: userName,
    groupId: userGroup.id,
    timestamp: new Date().toISOString(),
    readBy: [userEmail]
  };

  const fearAlerts = JSON.parse(localStorage.getItem('fearAlerts') || '[]');
  fearAlerts.push(newAlert);
  localStorage.setItem('fearAlerts', JSON.stringify(fearAlerts));
}

// Check for unread fear alerts from group members and show banner
function checkFearAlerts() {
  const userEmail = localStorage.getItem('userEmail');
  const userGroup = typeof getUserGroup === 'function' ? getUserGroup() : null;
  if (!userGroup || !userEmail) return;

  const fearAlerts = JSON.parse(localStorage.getItem('fearAlerts') || '[]');

  const unread = fearAlerts.filter(a =>
    a.groupId === userGroup.id &&
    a.senderEmail !== userEmail &&
    !a.readBy.includes(userEmail)
  );

  if (unread.length === 0) return;

  const banner = document.getElementById('fearAlertBanner');
  const textEl = document.getElementById('fearAlertText');
  if (!banner || !textEl) return;

  if (unread.length === 1) {
    textEl.textContent = `${unread[0].senderName} está com medo e pode precisar do teu apoio.`;
  } else {
    const names = unread.map(a => a.senderName).join(', ');
    textEl.textContent = `${names} estão com medo e podem precisar do teu apoio.`;
  }

  banner.style.display = 'flex';
}

// Dismiss fear alert banner and mark as read
function dismissFearAlerts() {
  const userEmail = localStorage.getItem('userEmail');
  const userGroup = typeof getUserGroup === 'function' ? getUserGroup() : null;
  if (!userGroup || !userEmail) return;

  const fearAlerts = JSON.parse(localStorage.getItem('fearAlerts') || '[]');
  fearAlerts.forEach(a => {
    if (a.groupId === userGroup.id && !a.readBy.includes(userEmail)) {
      a.readBy.push(userEmail);
    }
  });
  localStorage.setItem('fearAlerts', JSON.stringify(fearAlerts));

  const banner = document.getElementById('fearAlertBanner');
  if (banner) banner.style.display = 'none';
}

// Activities per mood
const moodActivities = {
  sad: {
    icon: '💙',
    subtitle: 'Estamos aqui por ti. Experimenta uma destas atividades:',
    activities: [
      {
        icon: '🎵',
        label: 'Ouvir uma música relaxante',
        description: 'Uma melodia suave para te ajudar a sentir melhor',
        action: 'link',
        url: 'https://www.youtube.com/watch?v=PqK2ImIUEMA&list=PLJ7_FMxCfRj2M3y4-ZkSSLevOXG4sS9BJ'
      },
      {
        icon: '🌬️',
        label: 'Respiração profunda',
        description: 'Inspira 4 segundos, segura 4, expira 4. Repete 5 vezes.',
        action: 'text'
      },
      {
        icon: '📓',
        label: 'Escreve os teus sentimentos',
        description: 'Usa as notas abaixo para escrever o que estás a sentir.',
        action: 'focus',
        target: 'notes'
      }
    ]
  },
  anxious: {
    icon: '🌿',
    subtitle: 'Vai devagar. Aqui estão algumas formas de te acalmar:',
    activities: [
      {
        icon: '🌬️',
        label: 'Técnica 4-7-8',
        description: 'Inspira 4 seg, segura 7 seg, expira 8 seg. Repete 3 vezes.',
        action: 'text'
      },
      {
        icon: '🎵',
        label: 'Música calma',
        description: 'Uma melodia suave para baixar a ansiedade',
        action: 'link',
        url: 'https://www.youtube.com/watch?v=yQqjZAqNf9Y'
      },
      {
        icon: '🌳',
        label: 'Regra dos 5 sentidos',
        description: 'Encontra 5 coisas que vês, 4 que tocas, 3 que ouves, 2 que cheiras, 1 que saboreias.',
        action: 'text'
      }
    ]
  },
  angry: {
    icon: '🔥',
    subtitle: 'É normal sentir raiva. Tenta uma destas atividades:',
    activities: [
      {
        icon: '🌬️',
        label: 'Respira fundo',
        description: 'Para tudo. Inspira pelo nariz, expira pela boca, 5 vezes.',
        action: 'text'
      },
      {
        icon: '📓',
        label: 'Escreve o que estás a sentir',
        description: 'Escreve sem filtros nas notas abaixo. Ninguém vai ver.',
        action: 'focus',
        target: 'notes'
      },
      {
        icon: '🎵',
        label: 'Ouvir música',
        description: 'Uma melodia para ajudar a descomprimir',
        action: 'link',
        url: 'https://www.youtube.com/watch?v=N63-oDNTtic&list=RDN63-oDNTtic&start_radio=1'
      }
    ]
  },
  happy: {
    icon: '✨',
    subtitle: 'Que bom! Aproveita este momento:',
    activities: [
      {
        icon: '💃',
        label: 'Dança um pouco!',
        description: 'Coloca a tua música favorita e deixa o corpo mover-se.',
        action: 'text'
      },
      {
        icon: '📓',
        label: 'Regista este momento',
        description: 'Escreve o que te está a fazer sentir tão bem.',
        action: 'focus',
        target: 'notes'
      },
      {
        icon: '🎵',
        label: 'Ouvir música animada',
        description: 'Uma música para celebrar o teu bom humor',
        action: 'link',
        url: 'https://www.youtube.com/watch?v=UtF6Jej8yb4&list=PLgogaB00wRYc0czjXfkevl6qGhrIGxSBO'
      }
    ]
  },
  neutral: {
    icon: '🌤️',
    subtitle: 'Um dia tranquilo. Talvez uma destas atividades te inspire:',
    activities: [
      {
        icon: '🎵',
        label: 'Ouvir música',
        description: 'Uma melodia agradável para acompanhar o teu momento',
        action: 'link',
        url: 'https://www.youtube.com/watch?v=ZUBiQxrH09w&list=RDZUBiQxrH09w&start_radio=1'
      },
      {
        icon: '🌬️',
        label: 'Meditação de 2 minutos',
        description: 'Fecha os olhos, foca na respiração durante 2 minutos.',
        action: 'text'
      },
      {
        icon: '📓',
        label: 'Como foi o teu dia?',
        description: 'Escreve um resumo do teu dia nas notas.',
        action: 'focus',
        target: 'notes'
      }
    ]
  },
  fear: {
    icon: '🕯️',
    subtitle: 'Estamos contigo. Experimenta uma destas atividades:',
    activities: [
      {
        icon: '🌬️',
        label: 'Respiração calmante',
        description: 'Inspira lentamente 4 seg, expira 6 seg. O teu sistema nervoso vai agradecer.',
        action: 'text'
      },
      {
        icon: '🎵',
        label: 'Música suave',
        description: 'Uma melodia tranquila para te sentires mais segura',
        action: 'link',
        url: 'https://www.youtube.com/watch?v=syvVo8NX6RQ&list=RDsyvVo8NX6RQ&start_radio=1'
      },
      {
        icon: '📓',
        label: 'Escreve o que te preocupa',
        description: 'Por vezes, colocar o medo em palavras ajuda a diminuí-lo.',
        action: 'focus',
        target: 'notes'
      }
    ]
  }
};

// Show activities panel for selected mood
function showActivities(mood) {
  const panel = document.getElementById('activitiesPanel');
  const data = moodActivities[mood];
  if (!panel || !data) return;

  document.getElementById('activitiesIcon').textContent = data.icon;
  document.getElementById('activitiesTitle').textContent = 'O que queres fazer?';
  document.getElementById('activitiesSubtitle').textContent = data.subtitle;

  const list = document.getElementById('activitiesList');
  list.innerHTML = data.activities.map((act, i) => `
    <div class="activity-card activity-card--${mood}" onclick="handleActivity(${i}, '${mood}')">
      <span class="activity-card__icon">${act.icon}</span>
      <div class="activity-card__content">
        <span class="activity-card__label">${act.label}</span>
        <span class="activity-card__desc">${act.description}</span>
      </div>
      <span class="activity-card__arrow">→</span>
    </div>
  `).join('');

  panel.style.display = 'block';
}

// Handle activity click
function handleActivity(index, mood) {
  const act = moodActivities[mood]?.activities[index];
  if (!act) return;

  if (act.action === 'link') {
    window.open(act.url, '_blank', 'noopener,noreferrer');
  } else if (act.action === 'focus') {
    const target = document.getElementById(act.target);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
  // 'text' actions just show the description — no extra behavior needed
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

  // Check for fear alerts from group members
  checkFearAlerts();

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

      showActivities(selectedMood);

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
  
  // If mood is fear, send urgent alert to group
  if (selectedMood === 'fear') {
    saveFearAlert();
  }

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
  const activitiesPanel = document.getElementById('activitiesPanel');
  if (activitiesPanel) activitiesPanel.style.display = 'none';
  document.getElementById('intensity').value = 5;
  document.getElementById('intensityValue').textContent = '5';
  document.getElementById('notes').value = '';
}

