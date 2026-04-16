// ============================================
// MOOD TRACKER PAGE - CHART & HISTORY
// ============================================

const moodEmojis = {
  happy: '😊', neutral: '😐', sad: '😢',
  anxious: '😰', angry: '😠', fear: '😨'
};
const moodLabels = {
  get happy()   { return typeof t === 'function' ? t('mood.happy')   : 'Feliz'; },
  get neutral()  { return typeof t === 'function' ? t('mood.neutral') : 'Neutro'; },
  get sad()      { return typeof t === 'function' ? t('mood.sad')     : 'Triste'; },
  get anxious()  { return typeof t === 'function' ? t('mood.anxious') : 'Ansioso'; },
  get angry()    { return typeof t === 'function' ? t('mood.angry')   : 'Irritado'; },
  get fear()     { return typeof t === 'function' ? t('mood.fear')    : 'Medo'; }
};
const moodValues = { happy: 5, neutral: 4, anxious: 3, fear: 2, angry: 1, sad: 0 };
const moodColors = {
  happy: '#10b981', neutral: '#6b7280', sad: '#3b82f6',
  anxious: '#f59e0b', angry: '#ef4444', fear: '#8b5cf6'
};

let currentPeriod = 7;
let moodChart     = null;

// ============================================
// DATA
// ============================================

async function getMoodHistory(days = 365) {
  const result = await apiGet(`api/mood.php?days=${days}`);
  return result.success ? result.moods : [];
}

// ============================================
// CHART
// ============================================

function groupByDay(moods) {
  const dayMap = {};
  moods.forEach(m => {
    const d   = new Date(m.timestamp);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    if (!dayMap[key]) dayMap[key] = { entries: [], date: d };
    dayMap[key].entries.push(m);
  });
  return Object.values(dayMap).map(({ entries, date }) => {
    const last         = entries[entries.length - 1];
    const avgIntensity = Math.round(entries.reduce((s, e) => s + e.intensity, 0) / entries.length);
    return { ...last, intensity: avgIntensity, date };
  });
}

function createChart(moods) {
  const canvas     = document.getElementById('moodChart');
  const emptyState = document.getElementById('chartEmptyState');

  if (moods.length === 0) {
    canvas.style.display     = 'none';
    emptyState.style.display = 'flex';
    return;
  }
  canvas.style.display     = 'block';
  emptyState.style.display = 'none';

  const chartMoods    = groupByDay(moods);
  const labels        = chartMoods.map(m => {
    const d = new Date(m.timestamp);
    return currentPeriod <= 7
      ? d.toLocaleDateString('pt-PT', { weekday: 'short', day: 'numeric' })
      : d.toLocaleDateString('pt-PT', { day: 'numeric', month: 'short' });
  });
  const moodDataPoints = chartMoods.map(m => moodValues[m.mood] ?? 3);
  const intensityPts   = chartMoods.map(m => m.intensity);
  const pointColors    = chartMoods.map(m => moodColors[m.mood] || '#a855f7');

  if (moodChart) moodChart.destroy();

  const ctx              = canvas.getContext('2d');
  const gradientMood     = ctx.createLinearGradient(0, 0, 0, 350);
  gradientMood.addColorStop(0, 'rgba(168,85,247,0.25)');
  gradientMood.addColorStop(1, 'rgba(168,85,247,0.01)');
  const gradientIntensity = ctx.createLinearGradient(0, 0, 0, 350);
  gradientIntensity.addColorStop(0, 'rgba(233,30,128,0.15)');
  gradientIntensity.addColorStop(1, 'rgba(233,30,128,0.01)');

  moodChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Humor', data: moodDataPoints, borderColor: '#a855f7',
          backgroundColor: gradientMood, borderWidth: 3,
          pointBackgroundColor: pointColors, pointBorderColor: '#fff',
          pointBorderWidth: 2, pointRadius: 8, pointHoverRadius: 12,
          fill: true, tension: 0.4, yAxisID: 'y'
        },
        {
          label: 'Intensidade', data: intensityPts, borderColor: '#e91e80',
          backgroundColor: gradientIntensity, borderWidth: 2, borderDash: [6, 4],
          pointBackgroundColor: '#e91e80', pointBorderColor: '#fff',
          pointBorderWidth: 2, pointRadius: 5, pointHoverRadius: 8,
          fill: true, tension: 0.4, yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: true, position: 'top', labels: { usePointStyle: true, pointStyle: 'circle', padding: 20, font: { size: 13, weight: '600' } } },
        tooltip: {
          backgroundColor: 'rgba(255,255,255,0.95)', titleColor: '#1f2937', bodyColor: '#6b7280',
          borderColor: 'rgba(168,85,247,0.2)', borderWidth: 1, cornerRadius: 12, padding: 14,
          bodyFont: { size: 13 }, titleFont: { size: 14, weight: '700' },
          callbacks: {
            label: (ctx) => ctx.datasetIndex === 0
              ? `  ${moodEmojis[chartMoods[ctx.dataIndex].mood]} ${moodLabels[chartMoods[ctx.dataIndex].mood]}`
              : `  Intensidade: ${ctx.parsed.y}/10`,
            afterBody: (items) => {
              const m = chartMoods[items[0].dataIndex];
              return m.notes ? [`  📝 "${m.notes}"`] : [];
            }
          }
        }
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11, weight: '500' }, color: '#9ca3af', maxRotation: 45 } },
        y: {
          position: 'left', min: -0.5, max: 5.5,
          grid: { color: 'rgba(168,85,247,0.06)', drawBorder: false },
          ticks: { stepSize: 1, font: { size: 11 }, color: '#9ca3af',
            callback: v => ['😢 Triste','😠 Irritado','😨 Medo','😰 Ansioso','😐 Neutro','😊 Feliz'][v] || '' }
        },
        y1: {
          position: 'right', min: 1, max: 10, grid: { drawOnChartArea: false },
          ticks: { stepSize: 1, font: { size: 11 }, color: '#e91e80',
            callback: v => Number.isInteger(v) ? v + '/10' : '' }
        }
      },
      animation: { duration: 800, easing: 'easeOutQuart' }
    }
  });
}

// ============================================
// HISTORY LIST
// ============================================

function renderHistory(moods) {
  const container = document.getElementById('moodHistoryList');
  const countEl   = document.getElementById('historyCount');
  const display   = [...moods].reverse().slice(0, 20);

  countEl.textContent = `${moods.length} registo${moods.length !== 1 ? 's' : ''}`;

  if (display.length === 0) {
    container.innerHTML = '<p style="color:var(--text-light);text-align:center;padding:2rem;">Sem registos para mostrar...</p>';
    return;
  }

  container.innerHTML = display.map(m => {
    const dateStr = new Date(m.timestamp).toLocaleDateString('pt-PT', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    let dots = '';
    for (let i = 1; i <= 10; i++) dots += `<span class="intensity-dot ${i <= m.intensity ? 'filled' : ''}"></span>`;
    return `
      <div class="history-item">
        <div class="history-emoji">${moodEmojis[m.mood] || '😊'}</div>
        <div class="history-info">
          <p class="history-mood-name">${moodLabels[m.mood] || m.mood}</p>
          <p class="history-date">${dateStr}</p>
          ${m.notes ? `<p class="history-notes">"${m.notes}"</p>` : ''}
        </div>
        <div class="history-intensity">
          <div class="history-dots">${dots}</div>
          <span class="history-intensity-value">${m.intensity}/10</span>
        </div>
      </div>
    `;
  }).join('');
}

// ============================================
// SUMMARY STATS
// ============================================

function updateSummary(moods) {
  const avgEl   = document.getElementById('avgIntensity');
  const freqEl  = document.getElementById('mostFrequentMood');
  const totalEl = document.getElementById('totalRegistrations');
  const highEl  = document.getElementById('highestIntensity');

  if (totalEl) totalEl.textContent = moods.length;
  if (moods.length === 0) {
    if (avgEl)  avgEl.textContent  = '--';
    if (freqEl) freqEl.textContent = '--';
    if (highEl) highEl.textContent = '--';
    return;
  }

  const avg = moods.reduce((s, m) => s + m.intensity, 0) / moods.length;
  if (avgEl) avgEl.textContent = avg.toFixed(1);

  const counts = {};
  moods.forEach(m => { counts[m.mood] = (counts[m.mood] || 0) + 1; });
  const top = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
  if (freqEl) freqEl.textContent = `${moodEmojis[top]} ${moodLabels[top]}`;

  const max = Math.max(...moods.map(m => m.intensity));
  if (highEl) highEl.textContent = `${max}/10`;
}

// ============================================
// SIDEBAR STATS
// ============================================

function updateSidebarStats(allMoods) {
  const totalEl = document.getElementById('totalEntries');
  if (totalEl) totalEl.textContent = allMoods.length;

  const distEl = document.getElementById('moodDistribution');
  if (!distEl || allMoods.length === 0) return;

  const counts = {};
  allMoods.forEach(m => { counts[m.mood] = (counts[m.mood] || 0) + 1; });
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  distEl.innerHTML = sorted.map(([mood, count]) => {
    const pct = Math.round((count / allMoods.length) * 100);
    return `
      <div class="dist-row">
        <span class="dist-emoji">${moodEmojis[mood]}</span>
        <span class="dist-label">${moodLabels[mood]}</span>
        <div class="dist-bar-track">
          <div class="dist-bar-fill" style="width:${pct}%;background:${moodColors[mood]}"></div>
        </div>
        <span class="dist-pct">${pct}%</span>
      </div>
    `;
  }).join('');
}

// ============================================
// PERIOD SELECTOR
// ============================================

function setupPeriodSelector() {
  document.querySelectorAll('.period-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentPeriod = parseInt(btn.dataset.period);
      refreshData();
    });
  });
}

// ============================================
// REFRESH
// ============================================

async function refreshData() {
  const allMoods      = await getMoodHistory(365);
  const cutoff        = new Date();
  cutoff.setDate(cutoff.getDate() - currentPeriod);
  const filteredMoods = allMoods.filter(m => new Date(m.timestamp) >= cutoff);

  createChart(filteredMoods);
  renderHistory(filteredMoods);
  updateSummary(filteredMoods);
  updateSidebarStats(allMoods);
}

// ============================================
// INIT
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  setupPeriodSelector();
  refreshData();
});
