// ============================================
// ALERTS SYSTEM - GROUP NOTIFICATIONS
// ============================================

// Get groups from localStorage
function getGroups() {
  return JSON.parse(localStorage.getItem('groups') || '{}');
}

// Get user's group (if member)
function getUserGroup() {
  const userEmail = localStorage.getItem('userEmail');
  if (!userEmail) return null;
  
  const groups = getGroups();
  
  // Find group where user is a member
  for (let groupId in groups) {
    const group = groups[groupId];
    if (group.members.includes(userEmail)) {
      return { id: groupId, ...group };
    }
  }
  
  return null;
}

// Get alert sentiments (negative moods)
const alertSentiments = {
  'sad': { emoji: '😢', color: '#3b82f6', label: 'está triste' },
  'fear': { emoji: '😨', color: '#ef4444', label: 'está com medo' },
  'anxious': { emoji: '😰', color: '#f97316', label: 'está ansiosa' },
  'angry': { emoji: '😠', color: '#dc2626', label: 'está irritada' }
};

// Format time difference
function formatTimeAgo(timestamp) {
  const now = new Date();
  const time = new Date(timestamp);
  const diffMs = now - time;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'agora';
  if (diffMins < 60) return `há ${diffMins} minuto${diffMins > 1 ? 's' : ''}`;
  if (diffHours < 24) return `há ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
  if (diffDays < 7) return `há ${diffDays} dia${diffDays > 1 ? 's' : ''}`;
  return 'há mais de uma semana';
}

// Get all alerts (negative moods from group members)
function getGroupAlerts() {
  const userEmail = localStorage.getItem('userEmail');
  const userGroup = getUserGroup();
  
  if (!userGroup) return [];
  
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const alerts = [];
  
  // Check moods from each group member (except self)
  userGroup.members.forEach(memberEmail => {
    if (memberEmail === userEmail) return; // Skip self
    
    // Get user info
    const user = users.find(u => u.email === memberEmail);
    if (!user) return;
    
    // Get moods for this member
    const moodHistoryKey = 'moodHistory_' + memberEmail;
    const moods = JSON.parse(localStorage.getItem(moodHistoryKey) || '[]');
    
    // Find negative moods
    moods.forEach(mood => {
      if (alertSentiments[mood.mood]) {
        const sentiment = alertSentiments[mood.mood];
        alerts.push({
          memberName: user.name,
          memberEmail: memberEmail,
          mood: mood.mood,
          sentiment: sentiment,
          intensity: mood.intensity,
          timestamp: mood.timestamp,
          notes: mood.notes
        });
      }
    });
  });
  
  // Sort by most recent first
  alerts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  return alerts;
}

// Render urgent fear alerts at the top of the page
function renderFearAlerts() {
  const container = document.getElementById('fearAlertsContainer');
  if (!container) return;

  const userEmail = localStorage.getItem('userEmail');
  const userGroup = getUserGroup();
  if (!userGroup || !userEmail) { container.style.display = 'none'; return; }

  const fearAlerts = JSON.parse(localStorage.getItem('fearAlerts') || '[]');
  const recent = fearAlerts.filter(a =>
    a.groupId === userGroup.id &&
    a.senderEmail !== userEmail
  ).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  if (recent.length === 0) { container.style.display = 'none'; return; }

  container.style.display = 'block';
  container.innerHTML = `
    <div class="fear-alerts-section">
      <div class="fear-alerts-section__header">
        <span>😨</span>
        <div>
          <h3>Alertas de Medo</h3>
          <p>Estas pessoas do teu grupo registaram medo. Estão a precisar de apoio.</p>
        </div>
      </div>
      <div class="fear-alerts-list">
        ${recent.map(a => `
          <div class="fear-alert-card">
            <span class="fear-alert-card__emoji">😨</span>
            <div class="fear-alert-card__info">
              <strong>${a.senderName}</strong>
              <span>registou que está com medo</span>
              <span class="fear-alert-card__time">${formatTimeAgo(a.timestamp)}</span>
            </div>
            <div class="fear-alert-card__btns">
              <button class="btn btn-small btn-secondary" onclick="sendMessage('${a.senderEmail}')">💬 Chat</button>
              <button class="btn btn-small btn-primary" onclick="sendSupport('${a.senderEmail}')">❤️ Apoio</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// Render alerts on page
function renderAlerts() {
  const alertsContainer = document.getElementById('alertsContainer');
  if (!alertsContainer) return; // Não estamos na página de alertas

  renderFearAlerts();

  const userGroup = getUserGroup();
  const emptyState = document.getElementById('emptyState');

  if (!userGroup) {
    // User not in a group
    alertsContainer.innerHTML = `
      <div style="text-align: center; padding: 2rem;">
        <p style="font-size: 2rem; margin-bottom: 1rem;">👫</p>
        <h3>Sem grupo</h3>
        <p style="color: var(--text-light);">Junta-te a um grupo para receber alertas do teu grupo!</p>
        <a href="group.html" class="btn btn-primary" style="margin-top: 1rem;">Ir para Grupos</a>
      </div>
    `;
    return;
  }
  
  const alerts = getGroupAlerts();
  
  if (alerts.length === 0) {
    alertsContainer.style.display = 'none';
    emptyState.style.display = 'block';
    return;
  }
  
  alertsContainer.style.display = 'flex';
  emptyState.style.display = 'none';
  alertsContainer.innerHTML = '';
  
  alerts.forEach(alert => {
    const timeAgo = formatTimeAgo(alert.timestamp);
    const borderColor = alert.sentiment.color;
    
    const alertDiv = document.createElement('div');
    alertDiv.style.cssText = `
      background: rgba(${hexToRgb(borderColor).r}, ${hexToRgb(borderColor).g}, ${hexToRgb(borderColor).b}, 0.1);
      border: 2px solid ${borderColor};
      border-radius: 1rem;
      padding: 1.5rem;
      display: flex;
      gap: 1rem;
      align-items: start;
    `;
    
    alertDiv.innerHTML = `
      <span style="font-size: 2.5rem;">${alert.sentiment.emoji}</span>
      <div style="flex: 1;">
        <h4 style="margin-bottom: 0.25rem;">${alert.memberName} ${alert.sentiment.label}</h4>
        <p style="font-size: 0.875rem; color: var(--text-light); margin-bottom: 0.5rem;">Intensidade: ${alert.intensity}/10</p>
        <p style="font-size: 0.875rem; color: var(--text-light); margin-bottom: 0.5rem;">${timeAgo}</p>
        ${alert.notes ? `<p style="font-size: 0.875rem; font-style: italic; color: var(--text-light);">📝 ${alert.notes}</p>` : ''}
      </div>
      <div style="display: flex; gap: 0.5rem;">
        <button class="btn btn-small btn-secondary" onclick="sendMessage('${alert.memberEmail}')">💬 Chat</button>
        <button class="btn btn-small btn-primary" onclick="sendSupport('${alert.memberEmail}')">❤️ Apoio</button>
      </div>
    `;
    
    alertsContainer.appendChild(alertDiv);
  });
}

// Helper function to convert hex to RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

// Send support notification
function sendSupport(memberEmail) {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u => u.email === memberEmail);
  if (!user) return;
  
  alert(`❤️ Apoio enviado para ${user.name}!\n\nEla vai receber uma notificação do teu apoio.`);
}

// Send message (placeholder)
function sendMessage(memberEmail) {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u => u.email === memberEmail);
  if (!user) return;
  
  alert(`💬 Chat com ${user.name} (em desenvolvimento)\n\nEm breve poderás chatear diretamente!`);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  // Check authentication
  const userEmail = localStorage.getItem('userEmail');
  if (!userEmail) {
    window.location.href = 'login.html';
  }
  
  // Render alerts
  renderAlerts();
  
  // Refresh alerts every 5 seconds
  setInterval(renderAlerts, 5000);
});
