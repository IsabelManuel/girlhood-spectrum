// ============================================
// MOOD TRACKER PAGE - CHART & HISTORY
// ============================================

// Mood mappings
const moodEmojis = {
  'happy': '😊', 'neutral': '😐', 'sad': '😢',
  'anxious': '😰', 'angry': '😠', 'fear': '😨'
};

const moodLabels = {
  'happy': 'Feliz', 'neutral': 'Neutro', 'sad': 'Triste',
  'anxious': 'Ansioso', 'angry': 'Irritado', 'fear': 'Medo'
};

// Mood to numeric value (for chart Y-axis: higher = more positive)
const moodValues = {
  'happy': 5,
  'neutral': 4,
  'anxious': 3,
  'fear': 2,
  'angry': 1,
  'sad': 0
};

// Mood colors
const moodColors = {
  'happy': '#10b981',
  'neutral': '#6b7280',
  'sad': '#3b82f6',
  'anxious': '#f59e0b',
  'angry': '#ef4444',
  'fear': '#8b5cf6'
};

let currentPeriod = 7;
let moodChart = null;

// ============================================
// DATA FUNCTIONS
// ============================================

function getMoodHistory() {
  const userEmail = localStorage.getItem('userEmail');
  if (!userEmail) return [];
  const key = 'moodHistory_' + userEmail;
  return JSON.parse(localStorage.getItem(key) || '[]');
}

function getFilteredMoods(days) {
  const allMoods = getMoodHistory();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  
  return allMoods.filter(m => new Date(m.timestamp) >= cutoff)
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}

// ============================================
// CHART FUNCTIONS
// ============================================

// Group entries by day: average intensity, keep most recent mood
function groupByDay(moods) {
  const dayMap = {};
  moods.forEach(m => {
    const d = new Date(m.timestamp);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    if (!dayMap[key]) {
      dayMap[key] = { entries: [], date: d };
    }
    dayMap[key].entries.push(m);
  });

  return Object.values(dayMap).map(({ entries, date }) => {
    const last = entries[entries.length - 1];
    const avgIntensity = Math.round(entries.reduce((s, e) => s + e.intensity, 0) / entries.length);
    return { ...last, intensity: avgIntensity, date };
  });
}

function createChart(moods) {
  const canvas = document.getElementById('moodChart');
  const emptyState = document.getElementById('chartEmptyState');

  if (moods.length === 0) {
    canvas.style.display = 'none';
    emptyState.style.display = 'flex';
    return;
  }

  canvas.style.display = 'block';
  emptyState.style.display = 'none';

  // Aggregate by day to avoid duplicate labels
  const chartMoods = groupByDay(moods);

  // Prepare data
  const labels = chartMoods.map(m => {
    const d = new Date(m.timestamp);
    if (currentPeriod <= 7) {
      return d.toLocaleDateString('pt-PT', { weekday: 'short', day: 'numeric' });
    } else {
      return d.toLocaleDateString('pt-PT', { day: 'numeric', month: 'short' });
    }
  });

  const moodDataPoints = chartMoods.map(m => moodValues[m.mood] ?? 3);
  const intensityPoints = chartMoods.map(m => m.intensity);
  const pointColors = chartMoods.map(m => moodColors[m.mood] || '#a855f7');
  const pointEmojis = chartMoods.map(m => moodEmojis[m.mood] || '😊');
  
  // Destroy existing chart
  if (moodChart) {
    moodChart.destroy();
  }
  
  const ctx = canvas.getContext('2d');
  
  // Gradient for mood line
  const gradientMood = ctx.createLinearGradient(0, 0, 0, 350);
  gradientMood.addColorStop(0, 'rgba(168, 85, 247, 0.25)');
  gradientMood.addColorStop(1, 'rgba(168, 85, 247, 0.01)');
  
  // Gradient for intensity line
  const gradientIntensity = ctx.createLinearGradient(0, 0, 0, 350);
  gradientIntensity.addColorStop(0, 'rgba(233, 30, 128, 0.15)');
  gradientIntensity.addColorStop(1, 'rgba(233, 30, 128, 0.01)');
  
  moodChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Humor',
          data: moodDataPoints,
          borderColor: '#a855f7',
          backgroundColor: gradientMood,
          borderWidth: 3,
          pointBackgroundColor: pointColors,
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 8,
          pointHoverRadius: 12,
          fill: true,
          tension: 0.4,
          yAxisID: 'y'
        },
        {
          label: 'Intensidade',
          data: intensityPoints,
          borderColor: '#e91e80',
          backgroundColor: gradientIntensity,
          borderWidth: 2,
          borderDash: [6, 4],
          pointBackgroundColor: '#e91e80',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 8,
          fill: true,
          tension: 0.4,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            usePointStyle: true,
            pointStyle: 'circle',
            padding: 20,
            font: {
              size: 13,
              weight: '600'
            }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          titleColor: '#1f2937',
          bodyColor: '#6b7280',
          borderColor: 'rgba(168, 85, 247, 0.2)',
          borderWidth: 1,
          cornerRadius: 12,
          padding: 14,
          bodyFont: { size: 13 },
          titleFont: { size: 14, weight: '700' },
          callbacks: {
            title: function(items) {
              return items[0].label;
            },
            label: function(context) {
              if (context.datasetIndex === 0) {
                const mood = chartMoods[context.dataIndex];
                return `  ${moodEmojis[mood.mood]} ${moodLabels[mood.mood]}`;
              } else {
                return `  Intensidade: ${context.parsed.y}/10`;
              }
            },
            afterBody: function(items) {
              const mood = chartMoods[items[0].dataIndex];
              if (mood.notes) {
                return [`  📝 "${mood.notes}"`];
              }
              return [];
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            font: { size: 11, weight: '500' },
            color: '#9ca3af',
            maxRotation: 45,
            minRotation: 0
          }
        },
        y: {
          position: 'left',
          min: -0.5,
          max: 5.5,
          grid: {
            color: 'rgba(168, 85, 247, 0.06)',
            drawBorder: false
          },
          ticks: {
            stepSize: 1,
            font: { size: 11 },
            color: '#9ca3af',
            callback: function(value) {
              const labels = ['😢 Triste', '😠 Irritado', '😨 Medo', '😰 Ansioso', '😐 Neutro', '😊 Feliz'];
              return labels[value] || '';
            }
          }
        },
        y1: {
          position: 'right',
          min: 1,
          max: 10,
          grid: {
            drawOnChartArea: false
          },
          ticks: {
            stepSize: 1,
            font: { size: 11 },
            color: '#e91e80',
            callback: function(value) {
              if (Number.isInteger(value)) return value + '/10';
              return '';
            }
          }
        }
      },
      animation: {
        duration: 800,
        easing: 'easeOutQuart'
      }
    }
  });
}

// ============================================
// HISTORY LIST
// ============================================

function renderHistory(moods) {
  const container = document.getElementById('moodHistoryList');
  const countEl = document.getElementById('historyCount');
  
  // Show most recent first
  const reversed = [...moods].reverse();
  const display = reversed.slice(0, 20); // Show last 20
  
  countEl.textContent = `${moods.length} registo${moods.length !== 1 ? 's' : ''}`;
  
  if (display.length === 0) {
    container.innerHTML = '<p style="color: var(--text-light); text-align: center; padding: 2rem;">Sem registos para mostrar...</p>';
    return;
  }
  
  container.innerHTML = display.map(m => {
    const date = new Date(m.timestamp);
    const dateStr = date.toLocaleDateString('pt-PT', { 
      weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
    });
    
    // Intensity dots
    let dots = '';
    for (let i = 1; i <= 10; i++) {
      dots += `<span class="intensity-dot ${i <= m.intensity ? 'filled' : ''}"></span>`;
    }
    
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
  const avgEl = document.getElementById('avgIntensity');
  const freqEl = document.getElementById('mostFrequentMood');
  const totalEl = document.getElementById('totalRegistrations');
  const highEl = document.getElementById('highestIntensity');
  
  totalEl.textContent = moods.length;
  
  if (moods.length === 0) {
    avgEl.textContent = '--';
    freqEl.textContent = '--';
    highEl.textContent = '--';
    return;
  }
  
  // Average intensity
  const avgIntensity = moods.reduce((sum, m) => sum + m.intensity, 0) / moods.length;
  avgEl.textContent = avgIntensity.toFixed(1);
  
  // Most frequent mood
  const moodCounts = {};
  moods.forEach(m => {
    moodCounts[m.mood] = (moodCounts[m.mood] || 0) + 1;
  });
  const topMood = Object.keys(moodCounts).reduce((a, b) => moodCounts[a] > moodCounts[b] ? a : b);
  freqEl.textContent = `${moodEmojis[topMood]} ${moodLabels[topMood]}`;
  
  // Highest intensity
  const maxIntensity = Math.max(...moods.map(m => m.intensity));
  highEl.textContent = `${maxIntensity}/10`;
}

// ============================================
// SIDEBAR STATS
// ============================================

function updateSidebarStats() {
  const allMoods = getMoodHistory();
  
  // Total entries
  const totalEl = document.getElementById('totalEntries');
  if (totalEl) totalEl.textContent = allMoods.length;
  
  // Distribution
  const distEl = document.getElementById('moodDistribution');
  if (!distEl || allMoods.length === 0) return;
  
  const moodCounts = {};
  allMoods.forEach(m => {
    moodCounts[m.mood] = (moodCounts[m.mood] || 0) + 1;
  });
  
  const sorted = Object.entries(moodCounts).sort((a, b) => b[1] - a[1]);
  
  distEl.innerHTML = sorted.map(([mood, count]) => {
    const pct = Math.round((count / allMoods.length) * 100);
    return `
      <div class="dist-row">
        <span class="dist-emoji">${moodEmojis[mood]}</span>
        <span class="dist-label">${moodLabels[mood]}</span>
        <div class="dist-bar-track">
          <div class="dist-bar-fill" style="width: ${pct}%; background: ${moodColors[mood]}"></div>
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
  const buttons = document.querySelectorAll('.period-btn');
  
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      currentPeriod = parseInt(btn.dataset.period);
      refreshData();
    });
  });
}

// ============================================
// REFRESH ALL DATA
// ============================================

function refreshData() {
  const moods = getFilteredMoods(currentPeriod);
  createChart(moods);
  renderHistory(moods);
  updateSummary(moods);
  updateSidebarStats();
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Check auth
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  if (!isLoggedIn) {
    window.location.href = 'login.html';
    return;
  }
  
  setupPeriodSelector();
  refreshData();
});
