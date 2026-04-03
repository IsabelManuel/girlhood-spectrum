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
