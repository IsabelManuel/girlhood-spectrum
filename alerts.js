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
// SUPPORT RECEIVED SECTION
// ============================================

async function renderSupportReceived() {
  const container = document.getElementById('supportReceivedContainer');
  if (!container) return;

  const result = await apiGet('api/support.php');
  if (!result.success) return;

  const unread = result.notifications.filter(n => n.is_read === 0);
  if (unread.length === 0) {
    container.style.display = 'none';
    return;
  }

  // Mark as read
  apiPost('api/support.php', { action: 'mark_read' });

  container.style.display = 'block';
  container.innerHTML = `
    <div class="content-section" style="border: 2px solid #10b981; background: rgba(16,185,129,0.06);">
      <h3 style="color: #10b981; margin-bottom: 1rem;">💚 Apoio Recebido</h3>
      ${unread.map(n => `
        <div style="display:flex; align-items:center; gap:0.75rem; padding:0.75rem 0; border-bottom: 1px solid rgba(16,185,129,0.15);">
          <span style="font-size:1.5rem;">❤️</span>
          <div>
            <p style="font-weight:600; margin:0;"><strong>${n.sender_name}</strong> enviou-te apoio</p>
            <p style="font-size:0.8rem; color:var(--text-light); margin:0.2rem 0 0;">${formatTimeAgo(n.timestamp)}</p>
          </div>
        </div>
      `).join('')}
    </div>
  `;
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
              <button class="btn btn-small btn-primary" id="support-fear-${a.sender_user_id}"
                onclick="sendSupport(${a.sender_user_id}, '${a.sender_name}', this)">❤️ Apoio</button>
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

  await renderFearAlerts();
  await renderSupportReceived();

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
    const sentiment = alertSentiments[alert.mood];
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
        <button class="btn btn-small btn-primary" id="support-${alert.member_id}"
          onclick="sendSupport(${alert.member_id}, '${alert.member_name}', this)">❤️ Apoio</button>
      </div>
    `;
    alertsContainer.appendChild(alertDiv);
  });
}

// ============================================
// SEND SUPPORT
// ============================================

async function sendSupport(receiverId, memberName, btn) {
  btn.disabled = true;
  btn.textContent = '⏳ A enviar...';

  const result = await apiPost('api/support.php', { action: 'send', receiver_id: receiverId });

  if (result.success) {
    btn.textContent = '✅ Enviado!';
    btn.style.background = '#10b981';
    btn.style.borderColor = '#10b981';
  } else {
    btn.disabled = false;
    btn.textContent = '❤️ Apoio';
  }
}

// ============================================
// INIT
// ============================================

document.addEventListener('DOMContentLoaded', function () {
  renderAlerts();
  setInterval(renderAlerts, 10000);
});
