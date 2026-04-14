// ============================================
// GROUP MANAGEMENT FUNCTIONS
// ============================================

// Get groups from localStorage
function getGroups() {
  return JSON.parse(localStorage.getItem('groups') || '{}');
}

// Save groups to localStorage
function saveGroups(groups) {
  localStorage.setItem('groups', JSON.stringify(groups));
}

// Generate unique group code (6 chars)
function generateGroupCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
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

// Update UI based on group membership
function updateGroupUI() {
  const userGroup = getUserGroup();
  const viewBtn = document.getElementById('viewBtn');
  const createBtn = document.getElementById('createBtn');
  const joinBtn = document.getElementById('joinBtn');
  const viewTab = document.getElementById('viewTab');
  const createTab = document.getElementById('createTab');
  const joinTab = document.getElementById('joinTab');
  const noGroupMessage = document.getElementById('noGroupMessage');
  
  if (userGroup) {
    // User is in a group - show view tab
    viewBtn.style.display = 'inline-block';
    viewTab.style.display = 'block';
    createTab.style.display = 'none';
    joinTab.style.display = 'none';
    noGroupMessage.style.display = 'none';
    
    // Hide create button but keep join visible for other groups
    createBtn.style.display = 'none';
    
    // Show view tab by default
    showTab('view');
    
    // Populate group data
    populateGroupView(userGroup);
  } else {
    // User is not in a group - show create/join options
    viewBtn.style.display = 'none';
    viewTab.style.display = 'none';
    createBtn.style.display = 'inline-block';
    joinBtn.style.display = 'inline-block';
    createTab.style.display = 'block';
    joinTab.style.display = 'none';
    noGroupMessage.style.display = 'block';
    
    // Show create tab by default
    showTab('create');
  }
}

// Populate group view with real data
function populateGroupView(group) {
  document.getElementById('groupTitle').textContent = `📛 ${group.name}`;
  document.getElementById('groupCodeDisplay').value = group.code;
  document.getElementById('memberCount').textContent = group.members.length;
  
  // Get user data
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const membersList = document.getElementById('membersList');
  membersList.innerHTML = '';
  
  group.members.forEach(email => {
    const user = users.find(u => u.email === email);
    const userName = user ? user.name : 'Utilizador';
    const userEmail = localStorage.getItem('userEmail');
    const isCreator = group.createdBy === email;
    const isSelf = userEmail === email;
    
    const memberDiv = document.createElement('div');
    memberDiv.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: rgba(255,255,255,0.5); border-radius: 0.75rem; border: 1px solid var(--border);';
    
    let role = '👤 Membro';
    if (isCreator) role = '👑 Criador';
    if (isSelf) role += ' (Tu)';
    
    memberDiv.innerHTML = `
      <span style="font-weight: 600;">${userName}</span>
      <span style="color: var(--text-light); font-size: 0.875rem;">${role}</span>
    `;
    
    membersList.appendChild(memberDiv);
  });
}

// Show/hide tabs
function showTab(tabName) {
  const viewTab = document.getElementById('viewTab');
  const createTab = document.getElementById('createTab');
  const joinTab = document.getElementById('joinTab');
  const noGroupMessage = document.getElementById('noGroupMessage');
  
  viewTab.style.display = 'none';
  createTab.style.display = 'none';
  joinTab.style.display = 'none';
  noGroupMessage.style.display = 'none';
  
  if (tabName === 'view') viewTab.style.display = 'block';
  else if (tabName === 'create') createTab.style.display = 'block';
  else if (tabName === 'join') joinTab.style.display = 'block';
}

// Copy group code to clipboard
function copyGroupCode() {
  const userGroup = getUserGroup();
  if (!userGroup) {
    alert('❌ Sem grupo para copiar código!');
    return;
  }
  
  navigator.clipboard.writeText(userGroup.code);
  alert('✅ Código copiado: ' + userGroup.code);
}

// Create new group
function createGroup(e) {
  e.preventDefault();
  
  const name = document.getElementById('groupName').value.trim();
  const description = document.getElementById('groupDesc').value.trim();
  const userEmail = localStorage.getItem('userEmail');
  
  if (!name) {
    alert('❌ Por favor, preenche o nome do grupo!');
    return;
  }
  
  // Check if user already in a group
  if (getUserGroup()) {
    alert('❌ Já fazes parte de um grupo! Sai ou cria uma nova conta para outro grupo.');
    return;
  }
  
  // Generate unique code
  let code = generateGroupCode();
  const groups = getGroups();
  
  // Ensure code is unique
  while (Object.values(groups).some(g => g.code === code)) {
    code = generateGroupCode();
  }
  
  // Create group
  const groupId = 'group_' + Date.now();
  const newGroup = {
    id: groupId,
    name: name,
    description: description,
    code: code,
    members: [userEmail],
    createdBy: userEmail,
    createdAt: new Date().toISOString()
  };
  
  groups[groupId] = newGroup;
  saveGroups(groups);
  
  alert(`✅ Grupo "${name}" criado com sucesso!\n\nCódigo: ${code}\n\nPartilha este código com as tuas amigas!`);
  
  // Reset form
  document.getElementById('groupName').value = '';
  document.getElementById('groupDesc').value = '';
  
  // Update UI
  updateGroupUI();
}

// Join group with code
function joinGroup(e) {
  e.preventDefault();
  
  const code = document.getElementById('groupCode').value.trim().toUpperCase();
  const userEmail = localStorage.getItem('userEmail');
  
  if (!code) {
    alert('❌ Por favor, introduz o código do grupo!');
    return;
  }
  
  const groups = getGroups();
  let foundGroup = null;
  let groupId = null;
  
  // Find group by code
  for (let gId in groups) {
    if (groups[gId].code === code) {
      foundGroup = groups[gId];
      groupId = gId;
      break;
    }
  }
  
  if (!foundGroup) {
    alert('❌ Código de grupo inválido! Verifica se está correto.');
    return;
  }
  
  // Check if already member
  if (foundGroup.members.includes(userEmail)) {
    alert('❌ Já fazes parte deste grupo!');
    return;
  }
  
  // Check if already in another group
  if (getUserGroup()) {
    alert('❌ Já fazes parte de outro grupo! Sai para entrar neste.');
    return;
  }
  
  // Add user to group
  foundGroup.members.push(userEmail);
  groups[groupId] = foundGroup;
  saveGroups(groups);
  
  alert(`✅ Juntou-se ao grupo "${foundGroup.name}" com sucesso! 👫`);
  
  // Reset form
  document.getElementById('groupCode').value = '';
  
  // Update UI
  updateGroupUI();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  // Check authentication
  const userEmail = localStorage.getItem('userEmail');
  if (!userEmail) {
    window.location.href = 'login.html';
  }
  
  // Update UI based on group membership
  updateGroupUI();
});
