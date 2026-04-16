// ============================================
// GROUP MANAGEMENT FUNCTIONS
// ============================================

let selectedGroupId = null;
let cachedGroups    = [];
let cachedCreated   = 0;

// Update UI based on group membership
async function updateGroupUI() {
  const result  = await apiGet('api/groups.php');
  cachedGroups  = result.groups  || [];
  cachedCreated = result.created_count || 0;

  const viewBtn        = document.getElementById('viewBtn');
  const createBtn      = document.getElementById('createBtn');
  const joinBtn        = document.getElementById('joinBtn');
  const noGroupMessage = document.getElementById('noGroupMessage');

  if (cachedGroups.length === 0) {
    if (viewBtn)        viewBtn.style.display        = 'none';
    if (createBtn)      createBtn.style.display      = 'inline-block';
    if (joinBtn)        joinBtn.style.display        = 'inline-block';
    if (noGroupMessage) noGroupMessage.style.display = 'block';
    showTab('create');
    return;
  }

  // Has at least 1 group
  if (viewBtn)   viewBtn.style.display   = 'inline-block';
  // Show "Criar Grupo" only if user created fewer than 2
  if (createBtn) createBtn.style.display = cachedCreated < 2 ? 'inline-block' : 'none';
  if (joinBtn)   joinBtn.style.display   = 'inline-block';
  if (noGroupMessage) noGroupMessage.style.display = 'none';

  // Keep previous selection or default to first group
  const ids = cachedGroups.map(g => parseInt(g.id));
  if (!selectedGroupId || !ids.includes(selectedGroupId)) {
    selectedGroupId = ids[0];
  }

  const group = cachedGroups.find(g => parseInt(g.id) === selectedGroupId);
  showTab('view');
  populateGroupView(group, group.members || []);
}

// Switch to a different group
function selectGroup(groupId) {
  selectedGroupId = parseInt(groupId);
  const group = cachedGroups.find(g => parseInt(g.id) === selectedGroupId);
  if (group) populateGroupView(group, group.members || []);
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

  // Group selector (only shown when user has multiple groups)
  const selectorEl = document.getElementById('groupSelector');
  if (selectorEl) {
    if (cachedGroups.length > 1) {
      selectorEl.style.display = 'block';
      selectorEl.innerHTML = `
        <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
          ${cachedGroups.map(g => `
            <button
              class="btn ${parseInt(g.id) === selectedGroupId ? 'btn-primary' : 'btn-secondary'}"
              onclick="selectGroup(${g.id})"
              style="font-size:0.875rem;">
              ${g.is_owner ? '👑' : '👤'} ${g.name}
            </button>
          `).join('')}
        </div>
      `;
    } else {
      selectorEl.style.display = 'none';
    }
  }

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

// Copy group code for the selected group
async function copyGroupCode() {
  const group = cachedGroups.find(g => parseInt(g.id) === selectedGroupId);
  if (!group) { alert('❌ Sem grupo para copiar código!'); return; }
  navigator.clipboard.writeText(group.code);
  alert('✅ Código copiado: ' + group.code);
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
    selectedGroupId = result.group.id;
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
    selectedGroupId = result.group.id;
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
