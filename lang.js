// ============================================
// GIRLHOOD SPECTRUM — LANGUAGE SYSTEM
// ============================================

const translations = {
  pt: {
    // ── Nav ──────────────────────────────────
    'nav.login':      'Entrar',
    'nav.register':   'Registar',
    'nav.logout':     'Sair',
    'nav.dashboard':  'Dashboard',
    'nav.profile':    'Perfil',

    // ── Sidebar ──────────────────────────────
    'sidebar.menu':       'Menu',
    'sidebar.trackMood':  '❤️ Rastrear Humor',
    'sidebar.myGroup':    '👫 Meu Grupo',
    'sidebar.alerts':     '📬 Alertas',
    'sidebar.profile':    '👤 Perfil',
    'sidebar.settings':   '⚙️ Definições',
    'sidebar.totalPoints':'Pontos Totais',
    'sidebar.streak':     'Série: 0 dias',

    // ── Index ─────────────────────────────────
    'index.heroTitle':   'A amizade se transforma em <span class="gradient-text">apoio real</span>',
    'index.heroSubtitle':'Partilha sentimentos, ajuda as tuas amigas. Um espaço seguro, acolhedor e pensado para raparigas como tu.',
    'index.heroBtn':     '✨ Começar Agora',
    'index.featTitle':   'O que te espera 🌟',
    'feat.shareTitle':   'Partilha Sentimentos',
    'feat.shareDesc':    'Regista como te sentes todos os dias e recebe apoio do teu grupo',
    'feat.groupTitle':   'Grupos Privados',
    'feat.groupDesc':    'Cria grupos com as tuas amigas e apoiem-se mutuamente',
    'feat.alertTitle':   'Alertas de Apoio',
    'feat.alertDesc':    'Recebe notificações quando uma amiga precisa de ti',
    'feat.challengeTitle':'Desafios Positivos',
    'feat.challengeDesc': 'Completa desafios de bem-estar e ganha pontos',
    'feat.safeTitle':    '100% Seguro',
    'feat.safeDesc':     'Os teus dados são privados. Confia no teu espaço.',
    'cta.title':         'Pronta para começar? 🚀',
    'cta.desc':          'Junta-te a milhares de raparigas que já estão a criar conexões reais através de apoio emocional autêntico.',
    'cta.btn':           'Criar Conta Agora',
    'footer.text':       '© 2026 Girlhood Spectrum. Construído com 💖 para apoio emocional real.',

    // ── Login ────────────────────────────────
    'login.title':       'Bem-vinda de volta! 👋',
    'login.subtitle':    'Entra na tua conta para continuares a apoiar as tuas amigas',
    'login.emailLabel':  'Email',
    'login.passLabel':   'Palavra-passe',
    'login.emailPH':     'o_teu_email@exemplo.com',
    'login.btn':         'Entrar →',
    'login.divider':     'ou',
    'login.googleBtn':   '🔐 Entrar com Google',
    'login.noAccount':   'Não tens conta?',
    'login.registerHere':'Registar-te aqui',
    'login.forgotPass':  'Esqueceste a palavra-passe?',

    // ── Signup ───────────────────────────────
    'signup.title':      'Bem-vinda! 🌟',
    'signup.subtitle':   'Cria a tua conta e começa a partilhar sentimentos com amigas',
    'signup.nameLabel':  'Nome de Utilizador',
    'signup.namePH':     'ex: Sofia_2008',
    'signup.emailLabel': 'Email',
    'signup.emailPH':    'o_teu_email@exemplo.com',
    'signup.passLabel':  'Palavra-passe',
    'signup.passPH':     'Mínimo 8 caracteres',
    'signup.confirmLabel':'Confirmar Palavra-passe',
    'signup.terms':      'Concordo com os Termos de Serviço e Privacidade',
    'signup.btn':        'Criar Conta ✨',
    'signup.divider':    'ou',
    'signup.googleBtn':  '🔐 Registar com Google',
    'signup.haveAccount':'Já tens conta?',
    'signup.loginHere':  'Entra aqui',

    // ── Forgot password ──────────────────────
    'forgot.title':      'Recuperar Palavra-passe 🔑',
    'forgot.subtitle':   'Redefine a tua palavra-passe para recuperares acesso à conta',
    'forgot.emailLabel': 'Email',
    'forgot.emailPH':    'o_teu_email@exemplo.com',
    'forgot.btn':        'Enviar Link de Recuperação',
    'forgot.divider':    'ou',
    'forgot.remember':   'Lembrou-se da palavra-passe?',
    'forgot.backLogin':  'Volta ao Login',
    'forgot.noAccount':  'Não tens conta?',
    'forgot.register':   'Registar-te aqui',

    // ── Dashboard ────────────────────────────
    'dash.subtitle':     'Como te sentes hoje? Partilha o teu sentimento com o teu grupo.',
    'dash.moodTitle':    'Regista o teu sentimento',
    'dash.moodSubtitle': 'Escolhe a emoção que melhor descreve o teu momento',
    'dash.intensity':    'Intensidade:',
    'dash.intensityMin': 'Leve',
    'dash.intensityMax': 'Forte',
    'dash.notesLabel':   'Notas (opcional)',
    'dash.notesPH':      'Porque te sentes assim? Escreve aqui os teus pensamentos...',
    'dash.saveBtn':      '✨ Guardar Sentimento',
    'dash.lastRecord':   'Último registo',
    'dash.fearTitle':    'Alerta Urgente',
    'dash.fearViewBtn':  'Ver alertas',
    'dash.actTitle':     'O que queres fazer?',

    // ── Mood names ───────────────────────────
    'mood.happy':   'Feliz',
    'mood.neutral': 'Neutro',
    'mood.sad':     'Triste',
    'mood.anxious': 'Ansioso',
    'mood.angry':   'Irritado',
    'mood.fear':    'Medo',

    // ── Alerts ───────────────────────────────
    'alerts.title':     '📬 Alertas do Grupo',
    'alerts.fearTitle': 'Alertas de Medo',
    'alerts.fearDesc':  'Estas pessoas do teu grupo registaram medo. Estão a precisar de apoio.',
    'alerts.empty':     'Nenhum alerta no momento',
    'alerts.emptyDesc': 'Quando alguém do teu grupo tiver sentimentos difíceis, verás aqui!',
    'alerts.chat':      '💬 Chat',
    'alerts.support':   '❤️ Apoio',
    'alerts.intensity': 'Intensidade:',

    // ── Group ────────────────────────────────
    'group.title':       'Gestão de Grupos 👫',
    'group.viewBtn':     'Ver Meu Grupo',
    'group.createBtn':   'Criar Grupo',
    'group.joinBtn':     'Juntar-se a Grupo',
    'group.codeLabel':   'Código do Grupo (partilha com amigas)',
    'group.copyBtn':     'Copiar Código',
    'group.membersLabel':'Membros do Grupo',
    'group.tipMsg':      '💡 Partilha o código acima com as amigas para as adicionar ao grupo!',
    'group.nameLabel':   'Nome do Grupo',
    'group.namePH':      'ex: Amigas da Turma 10°A',
    'group.descLabel':   'Descrição (opcional)',
    'group.descPH':      'Descreve o teu grupo...',
    'group.createSubmit':'Criar Grupo ✨',
    'group.codeLabel2':  'Código do Grupo',
    'group.codePH':      'ex: ABC123',
    'group.codeHint':    'Pede a uma amiga o código do grupo dela',
    'group.joinSubmit':  'Juntar-se 👫',
    'group.noGroup':     'Ainda não tens grupo',
    'group.noGroupDesc': 'Cria um novo grupo ou pede o código a uma amiga para te juntares!',

    // ── Profile ──────────────────────────────
    'profile.personalInfo':  'Informações Pessoais',
    'profile.nameLabel':     'Nome de Utilizador',
    'profile.emailLabel':    'Email',
    'profile.infoNote':      'ℹ️ Para alterar informações, contacta o suporte.',
    'profile.stats':         'Estatísticas',
    'profile.totalPoints':   'Pontos Totais',
    'profile.streak':        'Série Atual',
    'profile.alertsAnswered':'Alertas Respondidos',
    'profile.security':      'Segurança',
    'profile.changePass':    '🔒 Mudar Palavra-passe',
    'profile.trackMood':     '❤️ Rastrear Humor',
    'profile.dangerZone':    'Zona de Perigo ⚠️',
    'profile.deleteAccount': '❌ Eliminar Conta Permanentemente',
    'profile.deleteWarning': 'Esta ação é irreversível. Todos os teus dados serão permanentemente apagados.',

    // ── Settings ─────────────────────────────
    'settings.notifications':  '🔔 Notificações',
    'settings.friendAlerts':   'Alertas de Amigas',
    'settings.dailyChallenges':'Desafios Diários',
    'settings.groupUpdates':   'Atualizações de Grupo',
    'settings.privacy':        '🔒 Privacidade',
    'settings.privateProfile': 'Perfil Privado',
    'settings.onlineStatus':   'Mostrar Status Online',
    'settings.privacyNote':    'ℹ️ O teu estado emocional nunca é partilhado fora do grupo.',
    'settings.appearance':     '🌙 Aparência',
    'settings.lightMode':      '☀️ Claro',
    'settings.darkMode':       '🌙 Escuro',
    'settings.supportText':    'Precisa de ajuda? Contacta-nos.',
    'settings.supportBtn':     '📧 Enviar Email de Suporte',
    'settings.dangerZone':     'Zona de Perigo ⚠️',
    'settings.deleteAccount':  '❌ Eliminar Conta',
    'settings.deleteWarning':  'Esta ação não pode ser desfeita.',
    'settings.language':       '🌐 Idioma',

    // ── Mood Tracker ─────────────────────────
    'tracker.title':        '📊 Rastrear Humor',
    'tracker.subtitle':     'Visualiza a evolução dos teus sentimentos ao longo do tempo',
    'tracker.totalEntries': 'Total de Registos',
    'tracker.distribution': 'Distribuição',
    'tracker.noData':       'Sem dados ainda...',
    'tracker.week':         '1 Semana',
    'tracker.month':        '1 Mês',
    'tracker.3months':      '3 Meses',
    'tracker.6months':      '6 Meses',
    'tracker.emptyTitle':   'Ainda sem registos',
    'tracker.emptyDesc':    'Começa a registar o teu humor no dashboard para veres os resultados aqui.',
    'tracker.emptyBtn':     'Ir para o Dashboard',
    'tracker.historyTitle': '📋 Histórico de Registos',
    'tracker.summaryTitle': '📈 Resumo do Período',
    'tracker.avgIntensity': 'Intensidade Média',
    'tracker.mostFrequent': 'Humor Mais Frequente',
    'tracker.periodRecords':'Registos no Período',
    'tracker.maxIntensity': 'Intensidade Máxima',
    'tracker.noRecords':    'Sem registos para mostrar...',
  },

  en: {
    // ── Nav ──────────────────────────────────
    'nav.login':      'Login',
    'nav.register':   'Register',
    'nav.logout':     'Logout',
    'nav.dashboard':  'Dashboard',
    'nav.profile':    'Profile',

    // ── Sidebar ──────────────────────────────
    'sidebar.menu':       'Menu',
    'sidebar.trackMood':  '❤️ Track Mood',
    'sidebar.myGroup':    '👫 My Group',
    'sidebar.alerts':     '📬 Alerts',
    'sidebar.profile':    '👤 Profile',
    'sidebar.settings':   '⚙️ Settings',
    'sidebar.totalPoints':'Total Points',
    'sidebar.streak':     'Streak: 0 days',

    // ── Index ─────────────────────────────────
    'index.heroTitle':   'Friendship transforms into <span class="gradient-text">real support</span>',
    'index.heroSubtitle':'Share feelings, help your friends. A safe, welcoming space designed for girls like you.',
    'index.heroBtn':     '✨ Get Started',
    'index.featTitle':   'What awaits you 🌟',
    'feat.shareTitle':   'Share Feelings',
    'feat.shareDesc':    'Record how you feel every day and receive support from your group',
    'feat.groupTitle':   'Private Groups',
    'feat.groupDesc':    'Create groups with your friends and support each other',
    'feat.alertTitle':   'Support Alerts',
    'feat.alertDesc':    'Receive notifications when a friend needs you',
    'feat.challengeTitle':'Positive Challenges',
    'feat.challengeDesc': 'Complete wellness challenges and earn points',
    'feat.safeTitle':    '100% Safe',
    'feat.safeDesc':     'Your data is private. Trust your space.',
    'cta.title':         'Ready to start? 🚀',
    'cta.desc':          'Join thousands of girls who are already creating real connections through authentic emotional support.',
    'cta.btn':           'Create Account Now',
    'footer.text':       '© 2026 Girlhood Spectrum. Built with 💖 for real emotional support.',

    // ── Login ────────────────────────────────
    'login.title':       'Welcome back! 👋',
    'login.subtitle':    'Log in to your account to keep supporting your friends',
    'login.emailLabel':  'Email',
    'login.passLabel':   'Password',
    'login.emailPH':     'your_email@example.com',
    'login.btn':         'Login →',
    'login.divider':     'or',
    'login.googleBtn':   '🔐 Login with Google',
    'login.noAccount':   "Don't have an account?",
    'login.registerHere':'Register here',
    'login.forgotPass':  'Forgot your password?',

    // ── Signup ───────────────────────────────
    'signup.title':      'Welcome! 🌟',
    'signup.subtitle':   'Create your account and start sharing feelings with friends',
    'signup.nameLabel':  'Username',
    'signup.namePH':     'e.g.: Sofia_2008',
    'signup.emailLabel': 'Email',
    'signup.emailPH':    'your_email@example.com',
    'signup.passLabel':  'Password',
    'signup.passPH':     'Minimum 8 characters',
    'signup.confirmLabel':'Confirm Password',
    'signup.terms':      'I agree to the Terms of Service and Privacy Policy',
    'signup.btn':        'Create Account ✨',
    'signup.divider':    'or',
    'signup.googleBtn':  '🔐 Register with Google',
    'signup.haveAccount':'Already have an account?',
    'signup.loginHere':  'Login here',

    // ── Forgot password ──────────────────────
    'forgot.title':      'Recover Password 🔑',
    'forgot.subtitle':   'Reset your password to regain access to your account',
    'forgot.emailLabel': 'Email',
    'forgot.emailPH':    'your_email@example.com',
    'forgot.btn':        'Send Recovery Link',
    'forgot.divider':    'or',
    'forgot.remember':   'Remembered your password?',
    'forgot.backLogin':  'Back to Login',
    'forgot.noAccount':  "Don't have an account?",
    'forgot.register':   'Register here',

    // ── Dashboard ────────────────────────────
    'dash.subtitle':     'How are you feeling today? Share your feeling with your group.',
    'dash.moodTitle':    'Register your feeling',
    'dash.moodSubtitle': 'Choose the emotion that best describes your moment',
    'dash.intensity':    'Intensity:',
    'dash.intensityMin': 'Mild',
    'dash.intensityMax': 'Strong',
    'dash.notesLabel':   'Notes (optional)',
    'dash.notesPH':      'Why do you feel this way? Write your thoughts here...',
    'dash.saveBtn':      '✨ Save Feeling',
    'dash.lastRecord':   'Last record',
    'dash.fearTitle':    'Urgent Alert',
    'dash.fearViewBtn':  'View alerts',
    'dash.actTitle':     'What do you want to do?',

    // ── Mood names ───────────────────────────
    'mood.happy':   'Happy',
    'mood.neutral': 'Neutral',
    'mood.sad':     'Sad',
    'mood.anxious': 'Anxious',
    'mood.angry':   'Angry',
    'mood.fear':    'Fear',

    // ── Alerts ───────────────────────────────
    'alerts.title':     '📬 Group Alerts',
    'alerts.fearTitle': 'Fear Alerts',
    'alerts.fearDesc':  'These people in your group registered fear. They need support.',
    'alerts.empty':     'No alerts at the moment',
    'alerts.emptyDesc': 'When someone in your group has difficult feelings, you will see them here!',
    'alerts.chat':      '💬 Chat',
    'alerts.support':   '❤️ Support',
    'alerts.intensity': 'Intensity:',

    // ── Group ────────────────────────────────
    'group.title':       'Group Management 👫',
    'group.viewBtn':     'View My Group',
    'group.createBtn':   'Create Group',
    'group.joinBtn':     'Join a Group',
    'group.codeLabel':   'Group Code (share with friends)',
    'group.copyBtn':     'Copy Code',
    'group.membersLabel':'Group Members',
    'group.tipMsg':      '💡 Share the code above with friends to add them to the group!',
    'group.nameLabel':   'Group Name',
    'group.namePH':      'e.g.: Class Friends 10°A',
    'group.descLabel':   'Description (optional)',
    'group.descPH':      'Describe your group...',
    'group.createSubmit':'Create Group ✨',
    'group.codeLabel2':  'Group Code',
    'group.codePH':      'e.g.: ABC123',
    'group.codeHint':    'Ask a friend for their group code',
    'group.joinSubmit':  'Join 👫',
    'group.noGroup':     "You don't have a group yet",
    'group.noGroupDesc': 'Create a new group or ask a friend for the code to join!',

    // ── Profile ──────────────────────────────
    'profile.personalInfo':  'Personal Information',
    'profile.nameLabel':     'Username',
    'profile.emailLabel':    'Email',
    'profile.infoNote':      'ℹ️ To change information, contact support.',
    'profile.stats':         'Statistics',
    'profile.totalPoints':   'Total Points',
    'profile.streak':        'Current Streak',
    'profile.alertsAnswered':'Alerts Responded',
    'profile.security':      'Security',
    'profile.changePass':    '🔒 Change Password',
    'profile.trackMood':     '❤️ Track Mood',
    'profile.dangerZone':    'Danger Zone ⚠️',
    'profile.deleteAccount': '❌ Permanently Delete Account',
    'profile.deleteWarning': 'This action is irreversible. All your data will be permanently deleted.',

    // ── Settings ─────────────────────────────
    'settings.notifications':  '🔔 Notifications',
    'settings.friendAlerts':   'Friend Alerts',
    'settings.dailyChallenges':'Daily Challenges',
    'settings.groupUpdates':   'Group Updates',
    'settings.privacy':        '🔒 Privacy',
    'settings.privateProfile': 'Private Profile',
    'settings.onlineStatus':   'Show Online Status',
    'settings.privacyNote':    'ℹ️ Your emotional state is never shared outside the group.',
    'settings.appearance':     '🌙 Appearance',
    'settings.lightMode':      '☀️ Light',
    'settings.darkMode':       '🌙 Dark',
    'settings.supportText':    'Need help? Contact us.',
    'settings.supportBtn':     '📧 Send Support Email',
    'settings.dangerZone':     'Danger Zone ⚠️',
    'settings.deleteAccount':  '❌ Delete Account',
    'settings.deleteWarning':  'This action cannot be undone.',
    'settings.language':       '🌐 Language',

    // ── Mood Tracker ─────────────────────────
    'tracker.title':        '📊 Track Mood',
    'tracker.subtitle':     'Visualise the evolution of your feelings over time',
    'tracker.totalEntries': 'Total Entries',
    'tracker.distribution': 'Distribution',
    'tracker.noData':       'No data yet...',
    'tracker.week':         '1 Week',
    'tracker.month':        '1 Month',
    'tracker.3months':      '3 Months',
    'tracker.6months':      '6 Months',
    'tracker.emptyTitle':   'No records yet',
    'tracker.emptyDesc':    'Start recording your mood on the dashboard to see results here.',
    'tracker.emptyBtn':     'Go to Dashboard',
    'tracker.historyTitle': '📋 Records History',
    'tracker.summaryTitle': '📈 Period Summary',
    'tracker.avgIntensity': 'Average Intensity',
    'tracker.mostFrequent': 'Most Frequent Mood',
    'tracker.periodRecords':'Records in Period',
    'tracker.maxIntensity': 'Maximum Intensity',
    'tracker.noRecords':    'No records to show...',
  }
};

// ── Core functions ──────────────────────────

function t(key) {
  const lang = localStorage.getItem('lang') || 'pt';
  return translations[lang]?.[key] ?? translations['pt'][key] ?? key;
}

function applyTranslations() {
  const lang = localStorage.getItem('lang') || 'pt';
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const val = translations[lang]?.[el.dataset.i18n];
    if (val !== undefined) el.innerHTML = val;
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const val = translations[lang]?.[el.dataset.i18nPlaceholder];
    if (val !== undefined) el.placeholder = val;
  });

  // Update active state on lang buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

function setLang(lang) {
  localStorage.setItem('lang', lang);
  applyTranslations();
}

// Apply as soon as DOM is ready
document.addEventListener('DOMContentLoaded', applyTranslations);
