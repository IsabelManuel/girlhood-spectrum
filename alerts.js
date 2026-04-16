// ============================================
// ALERTS SYSTEM - GROUP NOTIFICATIONS
// ============================================

const alertSentiments = {
  sad:     { emoji: '😢', color: '#3b82f6', label: 'está triste' },
  fear:    { emoji: '😨', color: '#ef4444', label: 'está com medo' },
  anxious: { emoji: '😰', color: '#f97316', label: 'está ansiosa' },
  angry:   { emoji: '😠', color: '#dc2626', label: 'está irritada' }
};

function formatTimeAgo(timestamp) {
  const now      = new Date();
  const time     = new Date(timestamp);
  const diffMs   = now - time;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHrs  = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1)   return 'agora';
  if (diffMins < 60)  return `há ${diffMins} minuto${diffMins > 1 ? 's' : ''}`;
  if (diffHrs  < 24)  return `há ${diffHrs} hora${diffHrs > 1 ? 's' : ''}`;
  if (diffDays < 7)   return `há ${diffDays} dia${diffDays > 1 ? 's' : ''}`;
  return 'há mais de uma semana';
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : { r: 0, g: 0, b: 0 };
}

// ============================================
// FEAR ALERTS (urgent section at top)
// ============================================

async function renderFearAlerts() {
  const container = document.getElementById('fearAlertsContainer');
  if (!container) return;

  const result = await apiGet('api/fear_alerts.php');
  if (!result.success || result.alerts.length === 0) {
    container.style.display = 'none';
    return;
  }

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
        ${result.alerts.map(a => `
          <div class="fear-alert-card">
            <span class="fear-alert-card__emoji">😨</span>
            <div class="fear-alert-card__info">
              <strong>${a.sender_name}</strong>
              <span>registou que está com medo</span>
              <span class="fear-alert-card__time">${formatTimeAgo(a.timestamp)}</span>
            </div>
            <div class="fear-alert-card__btns">
              <button class="btn btn-small btn-secondary" onclick="sendMessage('${a.sender_email}')">💬 Chat</button>
              <button class="btn btn-small btn-primary"   onclick="sendSupport('${a.sender_email}')">❤️ Apoio</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ============================================
// GENERAL ALERTS
// ============================================

async function renderAlerts() {
  const alertsContainer = document.getElementById('alertsContainer');
  if (!alertsContainer) return;

  // Render fear alerts first
  await renderFearAlerts();

  const emptyState = document.getElementById('emptyState');
  const result     = await apiGet('api/alerts.php');

  if (!result.success) {
    alertsContainer.innerHTML = `<p style="color:var(--text-light);text-align:center;padding:2rem;">Erro ao carregar alertas.</p>`;
    return;
  }

  if (result.alerts.length === 0) {
    alertsContainer.style.display = 'none';
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  alertsContainer.style.display = 'flex';
  if (emptyState) emptyState.style.display = 'none';
  alertsContainer.innerHTML = '';

  result.alerts.forEach(alert => {
    const sentiment   = alertSentiments[alert.mood];
    if (!sentiment) return;

    const timeAgo     = formatTimeAgo(alert.timestamp);
    const borderColor = sentiment.color;
    const rgb         = hexToRgb(borderColor);

    const alertDiv = document.createElement('div');
    alertDiv.style.cssText = `
      background: rgba(${rgb.r},${rgb.g},${rgb.b},0.1);
      border: 2px solid ${borderColor};
      border-radius: 1rem;
      padding: 1.5rem;
      display: flex;
      gap: 1rem;
      align-items: start;
    `;
    alertDiv.innerHTML = `
      <span style="font-size:2.5rem;">${sentiment.emoji}</span>
      <div style="flex:1;">
        <h4 style="margin-bottom:.25rem;">${alert.member_name} ${sentiment.label}</h4>
        <p style="font-size:.875rem;color:var(--text-light);margin-bottom:.5rem;">Intensidade: ${alert.intensity}/10</p>
        <p style="font-size:.875rem;color:var(--text-light);margin-bottom:.5rem;">${timeAgo}</p>
        ${alert.notes ? `<p style="font-size:.875rem;font-style:italic;color:var(--text-light);">📝 ${alert.notes}</p>` : ''}
      </div>
      <div style="display:flex;gap:.5rem;">
        <button class="btn btn-small btn-secondary" onclick="sendMessage('${alert.member_email}')">💬 Chat</button>
        <button class="btn btn-small btn-primary"   onclick="sendSupport('${alert.member_email}')">❤️ Apoio</button>
      </div>
    `;
    alertsContainer.appendChild(alertDiv);
  });
}

// ============================================
// SUPPORT / MESSAGE
// ============================================

function sendSupport(email) {
  alert(`❤️ Apoio enviado!\n\nEla vai receber uma notificação do teu apoio.`);
}

function sendMessage(email) {
  alert(`💬 Chat em desenvolvimento.\n\nEm breve poderás chatear diretamente!`);
}

// ============================================
// INIT
// ============================================

document.addEventListener('DOMContentLoaded', function () {
  renderAlerts();
  setInterval(renderAlerts, 10000); // Refresh every 10s
});
