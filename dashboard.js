// ============================================
// DASHBOARD FUNCTIONS
// ============================================

const moodEmojiMap = {
  happy: '😊', neutral: '😐', sad: '😢',
  anxious: '😰', angry: '😠', fear: '😨'
};
const moodNameMap = {
  happy: 'Feliz', neutral: 'Neutro', sad: 'Triste',
  anxious: 'Ansioso', angry: 'Irritado', fear: 'Medo'
};

// ============================================
// FEAR ALERT SYSTEM
// ============================================

async function saveFearAlert() {
  await apiPost('api/fear_alerts.php', { action: 'create' });
}

async function checkFearAlerts() {
  const result = await apiGet('api/fear_alerts.php');
  if (!result.success || result.unread_count === 0) return;

  const banner = document.getElementById('fearAlertBanner');
  const textEl = document.getElementById('fearAlertText');
  if (!banner || !textEl) return;

  const unread = result.unread;
  if (unread.length === 1) {
    textEl.textContent = `${unread[0].sender_name} está com medo e pode precisar do teu apoio.`;
  } else {
    const names = unread.map(a => a.sender_name).join(', ');
    textEl.textContent = `${names} estão com medo e podem precisar do teu apoio.`;
  }
  banner.style.display = 'flex';
}

async function dismissFearAlerts() {
  await apiPost('api/fear_alerts.php', { action: 'dismiss' });
  const banner = document.getElementById('fearAlertBanner');
  if (banner) banner.style.display = 'none';
}

// ============================================
// POINTS
// ============================================

async function updateDashboardPoints() {
  const result = await apiGet('api/mood.php?days=365');
  if (!result.success) return;

  let total = 0;
  result.moods.forEach(m => {
    total += 5;
    total += Math.floor(m.intensity / 2);
  });
  const el = document.getElementById('totalPoints');
  if (el) el.textContent = total;
}

// ============================================
// SUCCESS TOAST
// ============================================

function showSuccessToast() {
  const toast = document.getElementById('moodSuccessToast');
  if (!toast) return;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ============================================
// LAST MOOD
// ============================================

async function updateLastMoodDisplay() {
  const result = await apiGet('api/mood.php?days=365');
  if (!result.success || result.moods.length === 0) return;

  const moods    = result.moods;
  const lastMood = moods[moods.length - 1];
  const section  = document.getElementById('lastMoodSection');
  if (!section) return;

  section.style.display = 'block';
  document.getElementById('lastMoodEmoji').textContent = moodEmojiMap[lastMood.mood] || '😊';
  document.getElementById('lastMoodName').textContent  = moodNameMap[lastMood.mood]  || lastMood.mood;

  const date     = new Date(lastMood.timestamp);
  const now      = new Date();
  const diffMins = Math.floor((now - date) / 60000);
  const diffHrs  = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHrs  / 24);
  const timeEl   = document.getElementById('lastMoodTime');

  if (diffMins < 1)       timeEl.textContent = 'Agora mesmo';
  else if (diffMins < 60) timeEl.textContent = `Há ${diffMins} minuto${diffMins > 1 ? 's' : ''}`;
  else if (diffHrs  < 24) timeEl.textContent = `Há ${diffHrs} hora${diffHrs > 1 ? 's' : ''}`;
  else                    timeEl.textContent = `Há ${diffDays} dia${diffDays > 1 ? 's' : ''}`;

  let dots = '';
  for (let i = 1; i <= 10; i++) {
    dots += `<span class="intensity-dot ${i <= lastMood.intensity ? 'filled' : ''}"></span>`;
  }
  document.getElementById('lastMoodIntensity').innerHTML = dots;
}

// ============================================
// ACTIVITIES PANEL
// ============================================

const moodActivities = {
  sad: {
    icon: '💙',
    subtitle: 'Estamos aqui por ti. Experimenta uma destas atividades:',
    activities: [
      { icon: '🎵', label: 'Ouvir uma música relaxante', description: 'Uma melodia suave para te ajudar a sentir melhor', action: 'link', url: 'https://www.youtube.com/watch?v=PqK2ImIUEMA&list=PLJ7_FMxCfRj2M3y4-ZkSSLevOXG4sS9BJ' },
      { icon: '🌬️', label: 'Respiração profunda', description: 'Inspira 4 segundos, segura 4, expira 4. Repete 5 vezes.', action: 'text' },
      { icon: '📓', label: 'Escreve os teus sentimentos', description: 'Usa as notas abaixo para escrever o que estás a sentir.', action: 'focus', target: 'notes' }
    ]
  },
  anxious: {
    icon: '🌿',
    subtitle: 'Vai devagar. Aqui estão algumas formas de te acalmar:',
    activities: [
      { icon: '🌬️', label: 'Técnica 4-7-8', description: 'Inspira 4 seg, segura 7 seg, expira 8 seg. Repete 3 vezes.', action: 'text' },
      { icon: '🎵', label: 'Música calma', description: 'Uma melodia suave para baixar a ansiedade', action: 'link', url: 'https://www.youtube.com/watch?v=yQqjZAqNf9Y' },
      { icon: '🌳', label: 'Regra dos 5 sentidos', description: 'Encontra 5 coisas que vês, 4 que tocas, 3 que ouves, 2 que cheiras, 1 que saboreias.', action: 'text' }
    ]
  },
  angry: {
    icon: '🔥',
    subtitle: 'É normal sentir raiva. Tenta uma destas atividades:',
    activities: [
      { icon: '🌬️', label: 'Respira fundo', description: 'Para tudo. Inspira pelo nariz, expira pela boca, 5 vezes.', action: 'text' },
      { icon: '📓', label: 'Escreve o que estás a sentir', description: 'Escreve sem filtros nas notas abaixo. Ninguém vai ver.', action: 'focus', target: 'notes' },
      { icon: '🎵', label: 'Ouvir música', description: 'Uma melodia para ajudar a descomprimir', action: 'link', url: 'https://www.youtube.com/watch?v=N63-oDNTtic&list=RDN63-oDNTtic&start_radio=1' }
    ]
  },
  happy: {
    icon: '✨',
    subtitle: 'Que bom! Aproveita este momento:',
    activities: [
      { icon: '💃', label: 'Dança um pouco!', description: 'Coloca a tua música favorita e deixa o corpo mover-se.', action: 'text' },
      { icon: '📓', label: 'Regista este momento', description: 'Escreve o que te está a fazer sentir tão bem.', action: 'focus', target: 'notes' },
      { icon: '🎵', label: 'Ouvir música animada', description: 'Uma música para celebrar o teu bom humor', action: 'link', url: 'https://www.youtube.com/watch?v=UtF6Jej8yb4&list=PLgogaB00wRYc0czjXfkevl6qGhrIGxSBO' }
    ]
  },
  neutral: {
    icon: '🌤️',
    subtitle: 'Um dia tranquilo. Talvez uma destas atividades te inspire:',
    activities: [
      { icon: '🎵', label: 'Ouvir música', description: 'Uma melodia agradável para acompanhar o teu momento', action: 'link', url: 'https://www.youtube.com/watch?v=ZUBiQxrH09w&list=RDZUBiQxrH09w&start_radio=1' },
      { icon: '🌬️', label: 'Meditação de 2 minutos', description: 'Fecha os olhos, foca na respiração durante 2 minutos.', action: 'text' },
      { icon: '📓', label: 'Como foi o teu dia?', description: 'Escreve um resumo do teu dia nas notas.', action: 'focus', target: 'notes' }
    ]
  },
  fear: {
    icon: '🕯️',
    subtitle: 'Estamos contigo. Experimenta uma destas atividades:',
    activities: [
      { icon: '🌬️', label: 'Respiração calmante', description: 'Inspira lentamente 4 seg, expira 6 seg. O teu sistema nervoso vai agradecer.', action: 'text' },
      { icon: '🎵', label: 'Música suave', description: 'Uma melodia tranquila para te sentires mais segura', action: 'link', url: 'https://www.youtube.com/watch?v=syvVo8NX6RQ&list=RDsyvVo8NX6RQ&start_radio=1' },
      { icon: '📓', label: 'Escreve o que te preocupa', description: 'Por vezes, colocar o medo em palavras ajuda a diminuí-lo.', action: 'focus', target: 'notes' }
    ]
  }
};

function showActivities(mood) {
  const panel = document.getElementById('activitiesPanel');
  const data  = moodActivities[mood];
  if (!panel || !data) return;

  document.getElementById('activitiesIcon').textContent     = data.icon;
  document.getElementById('activitiesTitle').textContent    = 'O que queres fazer?';
  document.getElementById('activitiesSubtitle').textContent = data.subtitle;

  document.getElementById('activitiesList').innerHTML = data.activities.map((act, i) => `
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

function handleActivity(index, mood) {
  const act = moodActivities[mood]?.activities[index];
  if (!act) return;
  if (act.action === 'link') {
    window.open(act.url, '_blank', 'noopener,noreferrer');
  } else if (act.action === 'focus') {
    const target = document.getElementById(act.target);
    if (target) { target.focus(); target.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
  }
}

// ============================================
// MOOD TRACKER
// ============================================

let selectedMood = null;
let moodBtns     = [];

document.addEventListener('DOMContentLoaded', async function () {
  // Set welcome name
  const username    = sessionStorage.getItem('username');
  const welcomeName = document.getElementById('welcomeName');
  if (welcomeName && username) welcomeName.textContent = username;

  // Set current date
  const dateEl = document.getElementById('currentDate');
  if (dateEl) {
    const formatted = new Date().toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' });
    dateEl.textContent = formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }

  // Load data
  await Promise.all([
    updateDashboardPoints(),
    checkFearAlerts(),
    updateLastMoodDisplay()
  ]);

  // Setup mood buttons
  moodBtns = document.querySelectorAll('.mood-btn');
  moodBtns.forEach((btn) => {
    btn.style.cursor = 'pointer';
    btn.style.userSelect = 'none';
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      moodBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      selectedMood = this.dataset.mood;
      showActivities(selectedMood);
      const moodForm = document.getElementById('moodForm');
      if (moodForm) moodForm.style.display = 'flex';
    });
  });

  // Intensity slider
  const slider = document.getElementById('intensity');
  if (slider) {
    slider.addEventListener('input', (e) => {
      const val = document.getElementById('intensityValue');
      if (val) val.textContent = e.target.value;
    });
  }

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
});

// ============================================
// SUBMIT MOOD
// ============================================

async function submitMood() {
  if (!selectedMood) { alert('Escolhe um sentimento!'); return; }

  const intensity = document.getElementById('intensity')?.value  || 5;
  const notes     = document.getElementById('notes')?.value      || '';

  const result = await apiPost('api/mood.php', {
    mood:      selectedMood,
    intensity: parseInt(intensity),
    notes:     notes
  });

  if (!result.success) { alert('❌ Erro ao guardar: ' + result.error); return; }

  // If fear mood → send urgent alert to group
  if (selectedMood === 'fear') await saveFearAlert();

  showSuccessToast();
  await Promise.all([updateDashboardPoints(), updateLastMoodDisplay()]);

  // Reset form
  selectedMood = null;
  moodBtns.forEach(b => b.classList.remove('active'));
  document.getElementById('moodForm').style.display = 'none';
  const ap = document.getElementById('activitiesPanel');
  if (ap) ap.style.display = 'none';
  document.getElementById('intensity').value = 5;
  document.getElementById('intensityValue').textContent = '5';
  document.getElementById('notes').value = '';
}
