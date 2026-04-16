// ============================================
// GROUP MANAGEMENT FUNCTIONS
// ============================================

// Update UI based on group membership
async function updateGroupUI() {
  const result = await apiGet('api/groups.php');
  const group  = result.group;

  const viewBtn        = document.getElementById('viewBtn');
  const createBtn      = document.getElementById('createBtn');
  const joinBtn        = document.getElementById('joinBtn');
  const viewTab        = document.getElementById('viewTab');
  const createTab      = document.getElementById('createTab');
  const joinTab        = document.getElementById('joinTab');
  const noGroupMessage = document.getElementById('noGroupMessage');

  if (group) {
    if (viewBtn)        viewBtn.style.display   = 'inline-block';
    if (createBtn)      createBtn.style.display = 'none';
    if (viewTab)        viewTab.style.display   = 'block';
    if (createTab)      createTab.style.display = 'none';
    if (joinTab)        joinTab.style.display   = 'none';
    if (noGroupMessage) noGroupMessage.style.display = 'none';

    showTab('view');
    populateGroupView(group, result.members || []);
  } else {
    if (viewBtn)        viewBtn.style.display   = 'none';
    if (createBtn)      createBtn.style.display = 'inline-block';
    if (joinBtn)        joinBtn.style.display   = 'inline-block';
    if (viewTab)        viewTab.style.display   = 'none';
    if (createTab)      createTab.style.display = 'block';
    if (joinTab)        joinTab.style.display   = 'none';
    if (noGroupMessage) noGroupMessage.style.display = 'block';

    showTab('create');
  }
}

// Populate group view
function populateGroupView(group, members) {
  const titleEl = document.getElementById('groupTitle');
  const codeEl  = document.getElementById('groupCodeDisplay');
  const countEl = document.getElementById('memberCount');
  const listEl  = document.getElementById('membersList');

  if (titleEl) titleEl.textContent = `📛 ${group.name}`;
  if (codeEl)  codeEl.value        = group.code;
  if (countEl) countEl.textContent = members.length;
  if (!listEl) return;

  const currentEmail = sessionStorage.getItem('userEmail');
  listEl.innerHTML = '';

  members.forEach(member => {
    const isCreator = parseInt(member.is_creator) === 1;
    const isSelf    = member.email === currentEmail;

    let role = '👤 Membro';
    if (isCreator) role = '👑 Criador';
    if (isSelf)    role += ' (Tu)';

    const div = document.createElement('div');
    div.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:1rem;background:rgba(255,255,255,0.5);border-radius:.75rem;border:1px solid var(--border);';
    div.innerHTML = `
      <span style="font-weight:600;">${member.name}</span>
      <span style="color:var(--text-light);font-size:.875rem;">${role}</span>
    `;
    listEl.appendChild(div);
  });
}

// Show/hide tabs
function showTab(tabName) {
  ['view', 'create', 'join'].forEach(t => {
    const el = document.getElementById(t + 'Tab');
    if (el) el.style.display = 'none';
  });
  const noGroup = document.getElementById('noGroupMessage');
  if (noGroup) noGroup.style.display = 'none';

  const target = document.getElementById(tabName + 'Tab');
  if (target) target.style.display = 'block';
}

// Copy group code
async function copyGroupCode() {
  const result = await apiGet('api/groups.php');
  if (!result.group) { alert('❌ Sem grupo para copiar código!'); return; }
  navigator.clipboard.writeText(result.group.code);
  alert('✅ Código copiado: ' + result.group.code);
}

// Create group
async function createGroup(e) {
  e.preventDefault();
  const name        = document.getElementById('groupName')?.value.trim();
  const description = document.getElementById('groupDesc')?.value.trim() || '';

  if (!name) { alert('❌ Por favor, preenche o nome do grupo!'); return; }

  const result = await apiPost('api/groups.php', { action: 'create', name, description });
  if (result.success) {
    alert(`✅ Grupo "${name}" criado com sucesso!\n\nCódigo: ${result.group.code}\n\nPartilha este código com as tuas amigas!`);
    document.getElementById('groupName').value = '';
    if (document.getElementById('groupDesc')) document.getElementById('groupDesc').value = '';
    await updateGroupUI();
  } else {
    alert('❌ ' + result.error);
  }
}

// Join group
async function joinGroup(e) {
  e.preventDefault();
  const code = document.getElementById('groupCode')?.value.trim().toUpperCase();
  if (!code) { alert('❌ Por favor, introduz o código do grupo!'); return; }

  const result = await apiPost('api/groups.php', { action: 'join', code });
  if (result.success) {
    alert(`✅ Juntou-se ao grupo "${result.group.name}" com sucesso! 👫`);
    document.getElementById('groupCode').value = '';
    await updateGroupUI();
  } else {
    alert('❌ ' + result.error);
  }
}

// ============================================
// INIT
// ============================================

document.addEventListener('DOMContentLoaded', async function () {
  await updateGroupUI();
});
