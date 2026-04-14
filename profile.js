// ============================================
// PROFILE FUNCTIONS
// ============================================

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

// Update Profile Points
function updateProfilePoints() {
  const totalPoints = calculatePoints();
  const pointsElement = document.getElementById('profileTotalPoints');
  if (pointsElement) {
    pointsElement.textContent = totalPoints;
  }
}

// Change Password
function changePassword() {
  const currentPassword = prompt('Introduz a tua palavra-passe atual:');
  if (currentPassword === null) return; // User cancelled

  const userEmail = localStorage.getItem('userEmail');
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const user = users.find(u => u.email === userEmail);

  if (!user) {
    alert('❌ Erro: Utilizador não encontrado!');
    return;
  }

  if (user.password !== currentPassword) {
    alert('❌ Palavra-passe atual incorreta!');
    return;
  }

  const newPassword = prompt('Introduz a nova palavra-passe (mínimo 6 caracteres):');
  if (newPassword === null) return; // User cancelled

  if (newPassword.length < 8) {
    alert('❌ A nova palavra-passe deve ter pelo menos 8 caracteres!');
    return;
  }

  const confirmPassword = prompt('Confirma a nova palavra-passe:');
  if (confirmPassword === null) return; // User cancelled

  if (newPassword !== confirmPassword) {
    alert('❌ As palavras-passe não coincidem!');
    return;
  }

  // Update password
  user.password = newPassword;
  const updatedUsers = users.map(u => u.email === userEmail ? user : u);
  localStorage.setItem('users', JSON.stringify(updatedUsers));

  alert('✅ Palavra-passe alterada com sucesso!');
}

// View Activity
function viewActivity() {
  const userEmail = localStorage.getItem('userEmail');
  const moodHistoryKey = 'moodHistory_' + userEmail;
  const moodHistory = JSON.parse(localStorage.getItem(moodHistoryKey)) || [];
  
  if (moodHistory.length === 0) {
    alert('📊 Atividade\n\nAinda não tens atividade registada. Começa a registar os teus sentimentos no Dashboard!');
    return;
  }

  const moodNames = {
    'happy': 'Feliz',
    'neutral': 'Neutro',
    'sad': 'Triste',
    'anxious': 'Ansioso',
    'angry': 'Irritado',
    'fear': 'Medo'
  };

  let activitySummary = '📊 A TUA ATIVIDADE\n\n';
  activitySummary += '📈 Histórico de Sentimentos (Últimos 5):\n';
  activitySummary += '─'.repeat(35) + '\n';

  const recentMoods = moodHistory.slice(-5).reverse();
  
  recentMoods.forEach((mood, index) => {
    const date = new Date(mood.timestamp).toLocaleDateString('pt-PT');
    const time = new Date(mood.timestamp).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
    const moodLabel = moodNames[mood.mood] || mood.mood;
    activitySummary += `${index + 1}. ${moodLabel} (${mood.intensity}/10) - ${date} ${time}\n`;
    if (mood.notes) {
      activitySummary += `   Nota: ${mood.notes}\n`;
    }
  });

  activitySummary += '\n─'.repeat(35) + '\n';
  activitySummary += `Total de registos: ${moodHistory.length}`;

  alert(activitySummary);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  // Check authentication
  const userEmail = localStorage.getItem('userEmail');
  const username = localStorage.getItem('username');
  
  if (!userEmail) {
    window.location.href = 'login.html';
  }

  // Populate user data
  const usernameField = document.getElementById('usernameField');
  const emailField = document.getElementById('emailField');
  
  if (usernameField) {
    usernameField.value = username || 'Utilizador';
  }
  
  if (emailField) {
    emailField.value = userEmail || '';
  }

  // Update total points from real data
  updateProfilePoints();
});
