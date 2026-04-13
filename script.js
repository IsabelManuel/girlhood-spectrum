// LOGIN (index.html)

const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const username = document.getElementById("usernameInput").value;
    // guardar nome
    localStorage.setItem("username", username);

    // ir para página mood
    window.location.href = "mood.html";
  });
}

// MOOD (mood.html)

// Real-time intensity slider display
const intensitySlider = document.getElementById("intensitySlider");
if (intensitySlider) {
  intensitySlider.addEventListener("input", function(e) {
    document.getElementById("intensityValue").textContent = e.target.value;
  });
}

const moodForm = document.getElementById("moodForm");
if (moodForm) {
  moodForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const mood = document.querySelector('input[name="mood"]:checked').value;
    const intensity = document.getElementById("intensitySlider").value;
    const username = localStorage.getItem("username");

    // obter data e hora atual
    const now = new Date();
    const timestamp = now.toLocaleString('pt-PT', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    // ir buscar lista existente ou criar nova
    let moodEntries = JSON.parse(localStorage.getItem("userMoods")) || [];

    // adicionar novo mood com timestamp e intensidade
    moodEntries.push({
      name: username,
      mood: mood,
      intensity: parseInt(intensity),
      timestamp: timestamp,
      fullTimestamp: now.getTime() // para ordenação
    });

    // guardar lista atualizada
    localStorage.setItem("userMoods", JSON.stringify(moodEntries));

    // também guardar na lista da comunidade
    let communityMoods = JSON.parse(localStorage.getItem("moods")) || [];
    communityMoods.push({
      name: username,
      mood: mood,
      intensity: parseInt(intensity),
      timestamp: timestamp
    });
    localStorage.setItem("moods", JSON.stringify(communityMoods));

    // ir para página de histórico
    window.location.href = "history.html";
  });
}

// HISTORY PAGE (history.html)

const historyList = document.getElementById("historyList");
const totalMoodsEl = document.getElementById("totalMoods");
const topMoodEl = document.getElementById("topMood");
const avgIntensityEl = document.getElementById("avgIntensity");

if (historyList) {
  const userMoods = JSON.parse(localStorage.getItem("userMoods")) || [];

  // Ordenar por data (mais recente primeiro)
  userMoods.sort((a, b) => b.fullTimestamp - a.fullTimestamp);

  // Exibir moods
  if (userMoods.length === 0) {
    historyList.innerHTML = "<p class='empty-message'>Ainda não registaste nenhum mood. Vamos começar! 🌸</p>";
  } else {
    userMoods.forEach(entry => {
      const card = document.createElement("div");
      card.classList.add("history-card");

      const intensityBar = "⭐".repeat(entry.intensity) + "☆".repeat(10 - entry.intensity);

      card.innerHTML = `
        <div class="history-content">
          <div class="mood-main">
            <span class="mood-emoji">${entry.mood.split(" ")[0]}</span>
            <span class="mood-name">${entry.mood}</span>
          </div>
          <div class="mood-details">
            <div class="intensity-display">${intensityBar}</div>
            <div class="timestamp">📅 ${entry.timestamp}</div>
          </div>
        </div>
      `;

      historyList.appendChild(card);
    });
  }

  // Calcular estatísticas
  if (userMoods.length > 0) {
    // Total de moods
    totalMoodsEl.textContent = userMoods.length;

    // Mood mais frequente
    const moodCounts = {};
    userMoods.forEach(entry => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });

    const topMood = Object.keys(moodCounts).reduce((a, b) =>
      moodCounts[a] > moodCounts[b] ? a : b
    );
    topMoodEl.textContent = topMood;

    // Intensidade média
    const avgIntensity = (userMoods.reduce((sum, entry) => sum + entry.intensity, 0) / userMoods.length).toFixed(1);
    avgIntensityEl.textContent = avgIntensity + "/10";
  } else {
    totalMoodsEl.textContent = "0";
    topMoodEl.textContent = "-";
    avgIntensityEl.textContent = "-";
  }
}

// FINAL PAGE / COMMUNITY (finalmood.html)

const moodsList = document.querySelector(".moods-list");

if (moodsList) {
  const moods = JSON.parse(localStorage.getItem("moods")) || [];

  // Limpar exemplos
  moodsList.innerHTML = "";

  if (moods.length === 0) {
    moodsList.innerHTML = "<p class='empty-message'>Sê a primeira a partilhar o teu mood! 💗</p>";
  } else {
    moods.forEach(entry => {
      const card = document.createElement("div");
      card.classList.add("mood-card");

      const moodEmoji = entry.mood ? entry.mood.split(" ")[0] : "😊";

      card.innerHTML = `
        <div class="name">${entry.name}</div>
        <div class="emoji">${moodEmoji}</div>
        <div class="mood-label">${entry.mood}</div>
        ${entry.intensity ? `<div class="mood-intensity">Intensidade: ${entry.intensity}/10</div>` : ''}
      `;

      moodsList.appendChild(card);
    });
  }
}

// ========== GAMIFICATION SYSTEM ==========

// DEFAULT WELLNESS CHALLENGES
const defaultChallenges = [
  { id: 1, title: "💧 Bebe 2 Litros de Água", description: "Mantém-te hidratada durante o dia", points: 20, icon: "💧" },
  { id: 2, title: "🧘 Meditação de 10 Minutos", description: "Dedica 10 minutos à meditação", points: 25, icon: "🧘" },
  { id: 3, title: "🚶 Caminhada de 30 Minutos", description: "Sai à rua e aproveita o ar fresco", points: 30, icon: "🚶" },
  { id: 4, title: "📖 Lê uma Página", description: "Relaxa e mergulha num livro", points: 15, icon: "📖" },
  { id: 5, title: "😴 Dorme Bem", description: "Vai dormir antes das 23h", points: 35, icon: "😴" },
  { id: 6, title: "🎨 Criatividade", description: "Desenha, pinta ou cria algo", points: 20, icon: "🎨" },
  { id: 7, title: "🤝 Contacta uma Amiga", description: "Manda uma mensagem de apoio", points: 25, icon: "🤝" },
  { id: 8, title: "🍎 Come Saudável", description: "Consome uma refeição nutritiva", points: 15, icon: "🍎" }
];

// === FRIENDS MANAGEMENT (friends.html) ===

const addFriendForm = document.getElementById("addFriendForm");
const friendsList = document.getElementById("friendsList");

if (addFriendForm) {
  addFriendForm.addEventListener("submit", function(e) {
    e.preventDefault();
    
    const friendName = document.getElementById("friendNameInput").value.trim();
    const username = localStorage.getItem("username");
    
    if (!friendName) return;
    
    // Criar objeto da amiga
    let userFriends = JSON.parse(localStorage.getItem("userFriends")) || [];
    
    // Verificar se amiga já existe
    if (userFriends.find(f => f.name.toLowerCase() === friendName.toLowerCase())) {
      alert("Esta amiga já está na tua lista! 💕");
      return;
    }
    
    userFriends.push({
      name: friendName,
      addedDate: new Date().toLocaleString('pt-PT'),
      points: 0,
      reactions: 0,
      comments: 0,
      completedChallenges: 0
    });
    
    localStorage.setItem("userFriends", JSON.stringify(userFriends));
    document.getElementById("friendNameInput").value = "";
    
    loadFriendsView();
  });
}

function loadFriendsView() {
  if (!friendsList) return;
  
  let userFriends = JSON.parse(localStorage.getItem("userFriends")) || [];
  
  friendsList.innerHTML = "";
  
  if (userFriends.length === 0) {
    friendsList.innerHTML = "<p class='empty-message'>Ainda não adicionaste nenhuma amiga. Vamos começar! 👯</p>";
  } else {
    userFriends.forEach((friend, index) => {
      const friendCard = document.createElement("div");
      friendCard.classList.add("friend-card");
      
      const supportBadge = friend.reactions > 5 ? "🌟 Muito Apoiadora" : friend.reactions > 0 ? "💪 Apoiadora" : "👋 Recente";
      
      friendCard.innerHTML = `
        <div class="friend-header">
          <div class="friend-name">${friend.name}</div>
          <button class="remove-btn" onclick="removeFriend(${index})">✕</button>
        </div>
        <div class="friend-stats">
          <div class="stat">
            <span class="stat-label">Pontos</span>
            <span class="stat-value">${friend.points}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Reações</span>
            <span class="stat-value">${friend.reactions}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Comentários</span>
            <span class="stat-value">${friend.comments}</span>
          </div>
        </div>
        <div class="friend-badge">${supportBadge}</div>
        <div class="friend-actions">
          <button class="action-btn" onclick="addReaction(${index})">👍 Reagir</button>
          <button class="action-btn" onclick="addComment(${index})">💬 Comentar</button>
        </div>
      `;
      
      friendsList.appendChild(friendCard);
    });
  }
}

function removeFriend(index) {
  let userFriends = JSON.parse(localStorage.getItem("userFriends")) || [];
  const friendName = userFriends[index].name;
  
  if (confirm(`Tens a certeza que queres remover ${friendName}? 💔`)) {
    userFriends.splice(index, 1);
    localStorage.setItem("userFriends", JSON.stringify(userFriends));
    loadFriendsView();
  }
}

function addReaction(index) {
  let userFriends = JSON.parse(localStorage.getItem("userFriends")) || [];
  userFriends[index].reactions += 1;
  userFriends[index].points += 5;
  
  localStorage.setItem("userFriends", JSON.stringify(userFriends));
  loadFriendsView();
}

function addComment(index) {
  let userFriends = JSON.parse(localStorage.getItem("userFriends")) || [];
  userFriends[index].comments += 1;
  userFriends[index].points += 10;
  
  localStorage.setItem("userFriends", JSON.stringify(userFriends));
  loadFriendsView();
}

// Load friends on friends page
if (friendsList) {
  loadFriendsView();
}

// === WELLNESS CHALLENGES (wellness-challenges.html) ===

const challengesList = document.getElementById("challengesList");
const completedList = document.getElementById("completedList");

function loadChallengesView() {
  if (!challengesList) return;
  
  let userChallenges = JSON.parse(localStorage.getItem("userChallenges")) || [];
  let userPoints = JSON.parse(localStorage.getItem("userPoints")) || 0;
  
  // Inicializar desafios padrão se não existem
  if (userChallenges.length === 0) {
    userChallenges = defaultChallenges.map(c => ({
      ...c,
      completed: false,
      completedDate: null
    }));
    localStorage.setItem("userChallenges", JSON.stringify(userChallenges));
  }
  
  // Separar desafios ativos e completados
  const activeChallenges = userChallenges.filter(c => !c.completed);
  const completed = userChallenges.filter(c => c.completed);
  
  // Exibir desafios ativos
  challengesList.innerHTML = "";
  if (activeChallenges.length === 0) {
    challengesList.innerHTML = "<p class='empty-message'>Todos os desafios completados! Parabéns! 🎉</p>";
  } else {
    activeChallenges.forEach((challenge, index) => {
      const card = document.createElement("div");
      card.classList.add("challenge-card");
      
      card.innerHTML = `
        <div class="challenge-header">
          <span class="challenge-icon">${challenge.icon}</span>
          <div class="challenge-info">
            <strong>${challenge.title}</strong>
            <p>${challenge.description}</p>
          </div>
          <span class="challenge-points">+${challenge.points}pts</span>
        </div>
        <button class="challenge-complete-btn" onclick="completeChallenge(${challenge.id})">✔️ Completo!</button>
      `;
      
      challengesList.appendChild(card);
    });
  }
  
  // Exibir desafios completados
  completedList.innerHTML = "";
  if (completed.length === 0) {
    completedList.innerHTML = "<p class='empty-message'>Completa desafios para vê-los aqui! 🌟</p>";
  } else {
    completed.forEach(challenge => {
      const card = document.createElement("div");
      card.classList.add("challenge-card completed-challenge");
      
      card.innerHTML = `
        <div class="challenge-header">
          <span class="challenge-icon">${challenge.icon}</span>
          <div class="challenge-info">
            <strong>${challenge.title}</strong>
            <p>${challenge.description}</p>
          </div>
          <span class="challenge-points-earned">+${challenge.points}pts ✨</span>
        </div>
        <p class="completed-date">Completado em: ${challenge.completedDate}</p>
      `;
      
      completedList.appendChild(card);
    });
  }
}

function completeChallenge(challengeId) {
  let userChallenges = JSON.parse(localStorage.getItem("userChallenges")) || [];
  let userPoints = JSON.parse(localStorage.getItem("userPoints")) || 0;
  
  const challenge = userChallenges.find(c => c.id === challengeId);
  if (challenge && !challenge.completed) {
    challenge.completed = true;
    challenge.completedDate = new Date().toLocaleString('pt-PT', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    userPoints += challenge.points;
    
    localStorage.setItem("userChallenges", JSON.stringify(userChallenges));
    localStorage.setItem("userPoints", JSON.stringify(userPoints));
    
    alert(`Parabéns! Ganhaste ${challenge.points} pontos! 🎉`);
    loadChallengesView();
  }
}

// Load challenges on challenges page
if (challengesList) {
  loadChallengesView();
}

// === EMPATHY PODIUM (empathy-podium.html) ===

const medalPodium = document.getElementById("medalPodium");
const leaderboard = document.getElementById("leaderboard");

function calculateAllScores() {
  let allScores = {};
  
  const userFriends = JSON.parse(localStorage.getItem("userFriends")) || [];
  const username = localStorage.getItem("username");
  
  userFriends.forEach(friend => {
    allScores[friend.name] = friend.points;
  });
  
  // Adicionar pontos do utilizador
  const userPoints = JSON.parse(localStorage.getItem("userPoints")) || 0;
  allScores[username] = userPoints;
  
  return allScores;
}

function loadPodiumView() {
  if (!medalPodium) return;
  
  const scores = calculateAllScores();
  const sortedScores = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  
  medalPodium.innerHTML = "";
  
  if (sortedScores.length === 0) {
    medalPodium.innerHTML = "<p class='empty-message'>Começa a ganhar pontos! 💖</p>";
  } else {
    const positions = [2, 0, 1]; // Para ordenar 1º, 2º, 3º corretamente
    const medals = ["🥇", "🥈", "🥉"];
    
    sortedScores.forEach((entry, idx) => {
      const [name, points] = entry;
      const position = idx;
      const medal = medals[position];
      
      const medalCard = document.createElement("div");
      medalCard.classList.add("medal-card");
      medalCard.classList.add(position === 0 ? "first" : position === 1 ? "second" : "third");
      
      medalCard.innerHTML = `
        <div class="medal-emoji">${medal}</div>
        <div class="medal-name">${name}</div>
        <div class="medal-points">${points} pontos</div>
      `;
      
      medalPodium.appendChild(medalCard);
    });
  }
  
  // Carregar leaderboard completo
  if (leaderboard) {
    leaderboard.innerHTML = "";
    
    const scores = calculateAllScores();
    const sortedScores = Object.entries(scores)
      .sort((a, b) => b[1] - a[1]);
    
    if (sortedScores.length === 0) {
      leaderboard.innerHTML = "<p class='empty-message'>Nenhuma amiga ainda. Começa a ganhar pontos! 💪</p>";
    } else {
      sortedScores.forEach((entry, idx) => {
        const [name, points] = entry;
        
        const row = document.createElement("div");
        row.classList.add("leaderboard-row");
        
        const rank = idx + 1;
        const rankMedal = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `${rank}º`;
        
        row.innerHTML = `
          <div class="rank">${rankMedal}</div>
          <div class="name">${name}</div>
          <div class="points">${points} pts</div>
        `;
        
        leaderboard.appendChild(row);
      });
    }
  }
}

// Load podium on podium page
if (medalPodium) {
  loadPodiumView();
}
