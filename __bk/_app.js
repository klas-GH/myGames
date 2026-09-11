(() => {
  'use strict';

  const GAMES = [
    { id: 'tictactoe', name: 'Tic-Tac-Toe', icon: '❌', accent: '#a78bfa', description: 'Classic noughts and crosses' },
    { id: 'hangman', name: 'Hangman', icon: '🔤', accent: '#fb923c', description: 'Guess the hidden word' },
    { id: 'game2048', name: '2048', icon: '🧠', accent: '#60a5fa', description: 'Merge the tiles' },
    { id: 'memory', name: 'Memory', icon: '🧩', accent: '#f472b6', description: 'Find every matching pair' },
    { id: 'dodge', name: 'Dodge', icon: '🚀', accent: '#22d3ee', description: 'Survive the falling challenge' },
    { id: 'rps', name: 'Rock Paper Scissors', icon: '✋', accent: '#4ade80', description: 'Beat the arcade hand' },
    { id: 'higher-lower', name: 'Higher or Lower', icon: '🃏', accent: '#fbbf24', description: 'Trust your instincts' },
    { id: 'brick-breaker', name: 'Brick Breaker', icon: '🧱', accent: '#fb7185', description: 'Clear the whole wall' }
  ];

  const STORAGE_KEYS = {
    theme: 'miniArcade.theme',
    sound: 'miniArcade.sound'
  };

  const dom = {
    homeView: document.querySelector('#home-view'),
    gameView: document.querySelector('#game-view'),
    gameGrid: document.querySelector('#game-grid'),
    gameIcon: document.querySelector('#game-icon'),
    gameTitle: document.querySelector('#game-title'),
    gameStage: document.querySelector('#game-stage'),
    gameScore: document.querySelector('#game-score'),
    backButton: document.querySelector('#back-button'),
    restartButton: document.querySelector('#restart-button'),
    themeToggle: document.querySelector('#theme-toggle'),
    gameThemeToggle: document.querySelector('#game-theme-toggle'),
    soundToggle: document.querySelector('#sound-toggle'),
    modal: document.querySelector('#modal'),
    modalIcon: document.querySelector('#modal-icon'),
    modalKicker: document.querySelector('#modal-kicker'),
    modalTitle: document.querySelector('#modal-title'),
    modalMessage: document.querySelector('#modal-message'),
    modalStats: document.querySelector('#modal-stats'),
    modalPrimary: document.querySelector('#modal-primary'),
    modalSecondary: document.querySelector('#modal-secondary'),
    toast: document.querySelector('#toast'),
    overallBest: document.querySelector('#overall-best'),
    sessionStat: document.querySelector('#session-stat')
  };

  const state = {
    activeGame: null,
    theme: 'dark',
    sound: true,
    toastTimer: null,
    audioContext: null
  };

  const readStorage = (key, fallback) => {
    try {
      const value = localStorage.getItem(key);
      return value === null ? fallback : JSON.parse(value);
    } catch (error) {
      return fallback;
    }
  };

  const writeStorage = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      return;
    }
  };

  const getGame = (id) => GAMES.find((game) => game.id === id);

  const vibrate = (pattern = 12) => {
    if (navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  };

  const playTone = (frequency = 520) => {
    if (!state.sound) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      state.audioContext = state.audioContext || new AudioContext();
      if (state.audioContext.state === 'suspended') state.audioContext.resume();
      const oscillator = state.audioContext.createOscillator();
      const gain = state.audioContext.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, state.audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.035, state.audioContext.currentTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, state.audioContext.currentTime + 0.09);
      oscillator.connect(gain);
      gain.connect(state.audioContext.destination);
      oscillator.start();
      oscillator.stop(state.audioContext.currentTime + 0.1);
    } catch (error) {
      return;
    }
  };

  const showToast = (message) => {
    window.clearTimeout(state.toastTimer);
    dom.toast.textContent = message;
    dom.toast.classList.add('is-visible');
    state.toastTimer = window.setTimeout(() => dom.toast.classList.remove('is-visible'), 2200);
  };

  const setTheme = (theme) => {
    state.theme = theme === 'light' ? 'light' : 'dark';
    document.documentElement.dataset.theme = state.theme;
    writeStorage(STORAGE_KEYS.theme, state.theme);
    const icon = state.theme === 'light' ? '🌙' : '☀️';
    dom.themeToggle.textContent = icon;
    dom.gameThemeToggle.textContent = icon;
    document.querySelector('meta[name="theme-color"]').setAttribute('content', state.theme === 'light' ? '#f4f6ff' : '#0b1020');
  };

  const toggleTheme = () => {
    setTheme(state.theme === 'light' ? 'dark' : 'light');
    vibrate();
    playTone(620);
  };

  const setSound = (sound) => {
    state.sound = Boolean(sound);
    writeStorage(STORAGE_KEYS.sound, state.sound);
    dom.soundToggle.textContent = state.sound ? '🔊' : '🔇';
    dom.soundToggle.setAttribute('aria-label', state.sound ? 'Mute sound' : 'Enable sound');
  };

  const toggleSound = () => {
    setSound(!state.sound);
    vibrate();
    if (state.sound) playTone(520);
    showToast(state.sound ? 'Sound on' : 'Sound off');
  };

  const renderHome = () => {
    dom.gameGrid.replaceChildren();
    GAMES.forEach((game) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'game-card';
      card.style.setProperty('--game-accent', game.accent);
      card.setAttribute('aria-label', `Open ${game.name}`);
      card.innerHTML = `
        <span class="game-card-icon" aria-hidden="true">${game.icon}</span>
        <span class="game-card-copy">
          <span class="game-card-name">${game.name}</span>
          <span class="game-card-description">${game.description}</span>
        </span>
        <span class="game-card-footer">
          <span>Intro</span>
          <span class="game-card-arrow" aria-hidden="true">↗</span>
        </span>
      `;
      card.addEventListener('click', () => {
        vibrate(18);
        playTone(480);
        openGame(game.id);
      });
      dom.gameGrid.append(card);
    });
    dom.sessionStat.textContent = 'Backbone ready';
    dom.overallBest.textContent = '0';
  };

  const renderIntro = (game) => {
    const screen = document.createElement('section');
    screen.className = 'intro-screen';
    screen.style.setProperty('--accent', game.accent);
    screen.innerHTML = `
      <div class="intro-icon" aria-hidden="true">${game.icon}</div>
      <h2>${game.name}</h2>
      <div class="intro-decoration" aria-hidden="true"><span></span><span></span><span></span></div>
    `;
    dom.gameStage.replaceChildren(screen);
  };

  const openGame = (id) => {
    const game = getGame(id);
    if (!game) return;
    state.activeGame = game;
    dom.homeView.classList.add('is-hidden');
    dom.gameView.classList.remove('is-hidden');
    dom.gameIcon.textContent = game.icon;
    dom.gameTitle.textContent = game.name;
    dom.gameView.style.setProperty('--accent', game.accent);
    dom.gameView.style.setProperty('--accent-strong', game.accent);
    dom.gameScore.classList.add('is-hidden');
    renderIntro(game);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    history.replaceState({ gameId: id }, '', `#${id}`);
  };

  const goHome = () => {
    state.activeGame = null;
    dom.gameView.classList.add('is-hidden');
    dom.homeView.classList.remove('is-hidden');
    dom.gameStage.replaceChildren();
    renderHome();
    history.replaceState(null, '', location.pathname + location.search);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const restartIntro = () => {
    if (!state.activeGame) return;
    vibrate(15);
    playTone(560);
    renderIntro(state.activeGame);
    showToast(`${state.activeGame.name} intro refreshed`);
  };

  const init = () => {
    setTheme(readStorage(STORAGE_KEYS.theme, window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark'));
    setSound(readStorage(STORAGE_KEYS.sound, true));
    renderHome();

    dom.backButton.addEventListener('click', () => {
      vibrate();
      playTone(420);
      goHome();
    });
    dom.restartButton.addEventListener('click', restartIntro);
    dom.themeToggle.addEventListener('click', toggleTheme);
    dom.gameThemeToggle.addEventListener('click', toggleTheme);
    dom.soundToggle.addEventListener('click', toggleSound);

    const initialGame = location.hash.replace('#', '');
    if (initialGame && getGame(initialGame)) {
      openGame(initialGame);
    }
  };

  init();
})();
