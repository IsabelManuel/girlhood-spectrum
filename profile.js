// ============================================
// PROFILE FUNCTIONS
// ============================================

const moodNamesProfile = {
  happy: 'Feliz', neutral: 'Neutro', sad: 'Triste',
  anxious: 'Ansioso', angry: 'Irritado', fear: 'Medo'
};

async function updateProfilePoints() {
  const result = await apiGet('api/mood.php?days=365');
  if (!result.success) return;

  let total = 0;
  result.moods.forEach(m => {
    total += 5;
    total += Math.floor(m.intensity / 2);
  });
  const el = document.getElementById('profileTotalPoints');
  if (el) el.textContent = total;
}

async function changePassword() {
  const current = prompt('Introduz a tua palavra-passe atual:');
  if (current === null) return;

  const newPass = prompt('Introduz a nova palavra-passe (mínimo 8 caracteres):');
  if (newPass === null) return;

  if (newPass.length < 8) { alert('❌ A nova palavra-passe deve ter pelo menos 8 caracteres!'); return; }

  const confirm = prompt('Confirma a nova palavra-passe:');
  if (confirm === null) return;

  if (newPass !== confirm) { alert('❌ As palavras-passe não coincidem!'); return; }

  const result = await apiPost('api/profile.php', {
    action:           'change_password',
    current_password: current,
    new_password:     newPass
  });

  if (result.success) {
    alert('✅ Palavra-passe alterada com sucesso!');
  } else {
    alert('❌ ' + result.error);
  }
}

async function viewActivity() {
  const result = await apiGet('api/mood.php?days=365');
  if (!result.success || result.moods.length === 0) {
    alert('📊 Atividade\n\nAinda não tens atividade registada. Começa a registar os teus sentimentos no Dashboard!');
    return;
  }

  const moods  = result.moods;
  const recent = [...moods].reverse().slice(0, 5);

  let text = '📊 A TUA ATIVIDADE\n\n📈 Histórico de Sentimentos (Últimos 5):\n' + '─'.repeat(35) + '\n';
  recent.forEach((m, i) => {
    const date  = new Date(m.timestamp).toLocaleDateString('pt-PT');
    const time  = new Date(m.timestamp).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
    const label = moodNamesProfile[m.mood] || m.mood;
    text += `${i + 1}. ${label} (${m.intensity}/10) - ${date} ${time}\n`;
    if (m.notes) text += `   Nota: ${m.notes}\n`;
  });
  text += '\n─'.repeat(35) + `\nTotal de registos: ${moods.length}`;
  alert(text);
}

// ============================================
// INIT
// ============================================

document.addEventListener('DOMContentLoaded', async function () {
  const result = await apiGet('api/profile.php');
  if (!result.success) return;

  const user = result.user;
  const usernameField = document.getElementById('usernameField');
  const emailField    = document.getElementById('emailField');
  if (usernameField) usernameField.value = user.name  || '';
  if (emailField)    emailField.value    = user.email || '';

  await updateProfilePoints();
});
