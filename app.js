import { initTicTacToe } from "./initTicTacToe.js";
import initRockPaperScissors from "./initRockPaperScissors.js";
import initHigherLower from "./initHigherLower.js";
import initMemory from "./initMemory.js";
import initBrickBreaker from "./initBrickBreaker.js";
import initDodge from "./initDodge.js";
import init2048MergeTiles from "./init2048MergeTiles.js";
import initHangman from "./initHangman.js";





console.log("APP FILE LOADED");

(() => {
  "use strict";

  /* ============================================================
     GAMES
     ============================================================ */

  const GAMES = [
    {
      id: "tictactoe",
      name: "Tic-Tac-Toe",
      icon: "❌",
      accent: "#a78bfa",
      description: "Classic noughts and crosses"
    },
    {
      id: "hangman",
      name: "Hangman",
      icon: "🔤",
      accent: "#fb923c",
      description: "Guess the hidden word"
    },
    {
      id: "game2048",
      name: "2048",
      icon: "🧠",
      accent: "#60a5fa",
      description: "Merge the tiles"
    },
    {
      id: "memory",
      name: "Memory",
      icon: "🧩",
      accent: "#f472b6",
      description: "Find every matching pair"
    },
    {
      id: "dodge",
      name: "Dodge",
      icon: "🚀",
      accent: "#22d3ee",
      description: "Survive the falling challenge"
    },
    {
      id: "rps",
      name: "Rock Paper Scissors",
      icon: "✋",
      accent: "#4ade80",
      description: "Beat the arcade hand"
    },
    {
      id: "higher-lower",
      name: "Higher or Lower",
      icon: "🃏",
      accent: "#fbbf24",
      description: "Trust your instincts"
    },
    {
      id: "brick-breaker",
      name: "Brick Breaker",
      icon: "🧱",
      accent: "#fb7185",
      description: "Clear the whole wall"
    }
  ];

  /* ============================================================
     STORAGE
     ============================================================ */

  const STORAGE_KEYS = {
    theme: "miniArcade.theme",
    sound: "miniArcade.sound"
  };

  /* ============================================================
     DOM
     ============================================================ */

  const dom = {
    homeView: document.querySelector("#home-view"),
    gameView: document.querySelector("#game-view"),
    gameGrid: document.querySelector("#game-grid"),

    gameIcon: document.querySelector("#game-icon"),
    gameTitle: document.querySelector("#game-title"),
    gameStage: document.querySelector("#game-stage"),

    gameScore: document.querySelector("#game-score"),

    scoreLabelLeft:
      document.querySelector("#score-label-left"),

    scoreValueLeft:
      document.querySelector("#score-value-left"),

    scoreLabelCenter:
      document.querySelector("#score-label-center"),

    scoreValueCenter:
      document.querySelector("#score-value-center"),

    scoreLabelRight:
      document.querySelector("#score-label-right"),

    scoreValueRight:
      document.querySelector("#score-value-right"),

    backButton:
      document.querySelector("#back-button"),

    restartButton:
      document.querySelector("#restart-button"),

    themeToggle:
      document.querySelector("#theme-toggle"),

    gameThemeToggle:
      document.querySelector("#game-theme-toggle"),

    soundToggle:
      document.querySelector("#sound-toggle"),

    modal:
      document.querySelector("#modal"),

    modalIcon:
      document.querySelector("#modal-icon"),

    modalKicker:
      document.querySelector("#modal-kicker"),

    modalTitle:
      document.querySelector("#modal-title"),

    modalMessage:
      document.querySelector("#modal-message"),

    modalStats:
      document.querySelector("#modal-stats"),

    modalPrimary:
      document.querySelector("#modal-primary"),

    modalSecondary:
      document.querySelector("#modal-secondary"),

    toast:
      document.querySelector("#toast"),

    overallBest:
      document.querySelector("#overall-best"),

    sessionStat:
      document.querySelector("#session-stat")
  };

  /* ============================================================
     STATE
     ============================================================ */

  const state = {
    activeGame: null,

    theme: "dark",

    sound: true,

    toastTimer: null,

    audioContext: null,

    ticTacToe: {
      board: Array(9).fill(null),

      currentPlayer: "X",

      gameOver: false,

      winner: null,

      winningCells: [],

      scores: {
        X: 0,
        O: 0,
        draws: 0
      }
    }
  };

  /* ============================================================
     MODULE REFERENCES
     ============================================================ */

  let ticTacToe = null;
  let rockPaperScissors = null;
  let higherLower = null;
  let memory = null;
  let brickBreaker = null;
  let dodge = null;
  let merge2048 = null;
  let hangman = null;




  /* ============================================================
     STORAGE
     ============================================================ */

  const readStorage = (key, fallback) => {
    try {
      const value = localStorage.getItem(key);

      if (value === null) {
        return fallback;
      }

      return JSON.parse(value);
    } catch (error) {
      return fallback;
    }
  };

  const writeStorage = (key, value) => {
    try {
      localStorage.setItem(
        key,
        JSON.stringify(value)
      );
    } catch (error) {
      // Storage may be unavailable.
    }
  };

  /* ============================================================
     HELPERS
     ============================================================ */

  const getGame = (id) => {
    return GAMES.find(
      (game) => game.id === id
    );
  };

  const vibrate = (pattern = 12) => {
    if (navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  };

  const playTone = (frequency = 520) => {
    if (!state.sound) {
      return;
    }

    try {
      const AudioContext =
        window.AudioContext ||
        window.webkitAudioContext;

      if (!AudioContext) {
        return;
      }

      state.audioContext =
        state.audioContext ||
        new AudioContext();

      if (
        state.audioContext.state ===
        "suspended"
      ) {
        state.audioContext.resume();
      }

      const oscillator =
        state.audioContext.createOscillator();

      const gain =
        state.audioContext.createGain();

      oscillator.type = "sine";

      oscillator.frequency.value =
        frequency;

      gain.gain.setValueAtTime(
        0.0001,
        state.audioContext.currentTime
      );

      gain.gain.exponentialRampToValueAtTime(
        0.035,
        state.audioContext.currentTime + 0.015
      );

      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        state.audioContext.currentTime + 0.09
      );

      oscillator.connect(gain);

      gain.connect(
        state.audioContext.destination
      );

      oscillator.start();

      oscillator.stop(
        state.audioContext.currentTime + 0.1
      );
    } catch (error) {
      // Audio is optional.
    }
  };

  const showToast = (message) => {
    window.clearTimeout(
      state.toastTimer
    );

    dom.toast.textContent = message;

    dom.toast.classList.add(
      "is-visible"
    );

    state.toastTimer =
      window.setTimeout(() => {
        dom.toast.classList.remove(
          "is-visible"
        );
      }, 2200);
  };

  /* ============================================================
     THEME
     ============================================================ */

  const setTheme = (theme) => {
    state.theme =
      theme === "light"
        ? "light"
        : "dark";

    document.documentElement.dataset.theme =
      state.theme;

    writeStorage(
      STORAGE_KEYS.theme,
      state.theme
    );

    const icon =
      state.theme === "light"
        ? "🌙"
        : "☀️";

    dom.themeToggle.textContent =
      icon;

    dom.gameThemeToggle.textContent =
      icon;

    const themeMeta =
      document.querySelector(
        'meta[name="theme-color"]'
      );

    if (themeMeta) {
      themeMeta.setAttribute(
        "content",
        state.theme === "light"
          ? "#f4f6ff"
          : "#0b1020"
      );
    }
  };

  const toggleTheme = () => {
    setTheme(
      state.theme === "light"
        ? "dark"
        : "light"
    );

    vibrate();

    playTone(620);
  };

  /* ============================================================
     SOUND
     ============================================================ */

  const setSound = (sound) => {
    state.sound =
      Boolean(sound);

    writeStorage(
      STORAGE_KEYS.sound,
      state.sound
    );

    dom.soundToggle.textContent =
      state.sound
        ? "🔊"
        : "🔇";

    dom.soundToggle.setAttribute(
      "aria-label",
      state.sound
        ? "Mute sound"
        : "Enable sound"
    );
  };

  const toggleSound = () => {
    setSound(
      !state.sound
    );

    vibrate();

    if (state.sound) {
      playTone(520);
    }

    showToast(
      state.sound
        ? "Sound on"
        : "Sound off"
    );
  };

  /* ============================================================
     HOME
     ============================================================ */

  const renderHome = () => {
    dom.gameGrid.replaceChildren();

    GAMES.forEach((game) => {
      const card =
        document.createElement("button");

      card.type = "button";

      card.className =
        "game-card";

      card.style.setProperty(
        "--game-accent",
        game.accent
      );

      card.setAttribute(
        "aria-label",
        `Open ${game.name}`
      );

      card.innerHTML = `
        <span
          class="game-card-icon"
          aria-hidden="true"
        >
          ${game.icon}
        </span>

        <span class="game-card-copy">
          <span class="game-card-name">
            ${game.name}
          </span>

          <span class="game-card-description">
            ${game.description}
          </span>
        </span>

        <span class="game-card-footer">
          <span>
            ${
              game.id === "tictactoe" ||
              game.id === "rps" ||
              game.id === "higher-lower"
                ? "Play"
                : "Intro"
            }
          </span>

          <span
            class="game-card-arrow"
            aria-hidden="true"
          >
            ↗
          </span>
        </span>
      `;

      card.addEventListener(
        "click",
        () => {
          vibrate(18);

          playTone(480);

          openGame(game.id);
        }
      );

      dom.gameGrid.append(card);
    });

dom.sessionStat.textContent =
        "Have a fun break!";

dom.overallBest.textContent =
        "no limits!";
  };

  /* ============================================================
     GENERIC GAME INTRO
     ============================================================ */

  const renderIntro = (game) => {
    const screen =
      document.createElement("section");

    screen.className =
      "intro-screen";

    screen.style.setProperty(
      "--accent",
      game.accent
    );

    screen.innerHTML = `
      <div
        class="intro-icon"
        aria-hidden="true"
      >
        ${game.icon}
      </div>

      <h2>
        ${game.name}
      </h2>

      <div
        class="intro-decoration"
        aria-hidden="true"
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
    `;

    dom.gameStage.replaceChildren(
      screen
    );
  };

  /* ============================================================
     GAME OPEN
     ============================================================ */

  const openGame = (id) => {
    const game =
      getGame(id);

    if (!game) {
      return;
    }

    state.activeGame =
      game;

    dom.homeView.classList.add(
      "is-hidden"
    );

    dom.gameView.classList.remove(
      "is-hidden"
    );

    dom.gameIcon.textContent =
      game.icon;

    dom.gameTitle.textContent =
      game.name;

    dom.gameView.style.setProperty(
      "--accent",
      game.accent
    );

    dom.gameView.style.setProperty(
      "--accent-strong",
      game.accent
    );

    dom.gameScore.classList.add(
      "is-hidden"
    );

    /* ----------------------------------------------------------
       GAME DISPATCH
       ---------------------------------------------------------- */

    if (game.id === "tictactoe") {
      ticTacToe.start();

    } else if (game.id === "rps") {
      rockPaperScissors =
        initRockPaperScissors(
          dom.gameStage
        );

      /*
       * RPS manages its own score
       * inside its game screen.
       */
      dom.gameScore.classList.add(
        "is-hidden"
      );

    } else if (
      game.id === "higher-lower"
    ) {
      higherLower =
        initHigherLower(
          dom.gameStage
        );

      /*
       * Higher or Lower manages
       * its own score inside
       * its game screen.
       */
      dom.gameScore.classList.add(
        "is-hidden"
      );

    } else if (game.id === "memory") {
      memory =
        initMemory(
          dom.gameStage
        );

      dom.gameScore.classList.add(
        "is-hidden"
      );

    } else if (game.id === "brick-breaker") {
      brickBreaker = initBrickBreaker(dom.gameStage, {
        playTone,
        vibrate
      });

      dom.gameScore.classList.remove("is-hidden");

      dom.scoreLabelLeft.textContent = "Score";
      dom.scoreLabelCenter.textContent = "Best";
      dom.scoreLabelRight.textContent = "Lives";

      dom.scoreValueLeft.textContent = "0";
      dom.scoreValueCenter.textContent = "0";
      dom.scoreValueRight.textContent = "3";
    }
    else if (game.id === "dodge") {
      dodge = initDodge(dom.gameStage, {
        playTone,
        vibrate
      });

      dom.gameScore.classList.remove("is-hidden");

      dom.scoreLabelLeft.textContent = "Score";
      dom.scoreLabelCenter.textContent = "Best";
      dom.scoreLabelRight.textContent = "Time";

      dom.scoreValueLeft.textContent = "0";
      dom.scoreValueCenter.textContent = "0";
      dom.scoreValueRight.textContent = "0s";

    }
    else if (game.id === "game2048") {
      merge2048 = init2048MergeTiles(
        dom.gameStage,
        {
          playTone,
          vibrate
        }
      );

      dom.gameScore.classList.remove(
        "is-hidden"
      );

      dom.scoreLabelLeft.textContent =
        "Score";

      dom.scoreLabelCenter.textContent =
        "Best";

      dom.scoreLabelRight.textContent =
        "Tiles";

      dom.scoreValueLeft.textContent =
        "0";

      dom.scoreValueCenter.textContent =
        "0";

      dom.scoreValueRight.textContent =
        "0/16";

    } 
    else if (game.id === "hangman") {
      hangman = initHangman(dom.gameStage, {
        playTone,
        vibrate
      });

      dom.gameScore.classList.remove("is-hidden");

      dom.scoreLabelLeft.textContent = "Score";
      dom.scoreLabelCenter.textContent = "Streak";
      dom.scoreLabelRight.textContent = "Attempts";

      dom.scoreValueLeft.textContent = "0";
      dom.scoreValueCenter.textContent = "0";
      dom.scoreValueRight.textContent = "9";

    }
    else {
      renderIntro(game);
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    history.replaceState(
      { gameId: id },
      "",
      `#${id}`
    );
  };

  /* ============================================================
     HOME
     ============================================================ */

  const goHome = () => {

    if (ticTacToe) {
      // Keep Tic-Tac-Toe state persistent.
      // No destroy needed unless its module adds timers/listeners.
    }

    if (rockPaperScissors) {
      rockPaperScissors = null;
    }

    if (dodge) {
      dodge.destroy();
      dodge = null;
    }

    if (merge2048) {
      merge2048.destroy();
      merge2048 = null;
    }

    if (hangman) {
      hangman.destroy();
      hangman = null;
    }

    if (memory) {
      memory.destroy();
      memory = null;
    }

    if (higherLower) {
      higherLower.destroy();
      higherLower = null;
    }

    if (brickBreaker) {
      brickBreaker.destroy();
      brickBreaker = null;
    }


    state.activeGame =
      null;

    dom.gameView.classList.add(
      "is-hidden"
    );

    dom.homeView.classList.remove(
      "is-hidden"
    );

    dom.gameStage.replaceChildren();

    dom.modal.classList.add(
      "is-hidden"
    );

    renderHome();

    history.replaceState(
      null,
      "",
      location.pathname +
        location.search
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  /* ============================================================
     RESTART
     ============================================================ */

  const restartIntro = () => {
    if (!state.activeGame) {
      return;
    }

    vibrate(15);

    playTone(560);

    /* ----------------------------------------------------------
       TIC-TAC-TOE
       ---------------------------------------------------------- */

    if (
      state.activeGame.id ===
      "tictactoe"
    ) {
      ticTacToe.reset();

      showToast(
        "New Tic-Tac-Toe round"
      );

      return;
    }

    /* ----------------------------------------------------------
       ROCK PAPER SCISSORS
       ---------------------------------------------------------- */

    if (
      state.activeGame.id ===
      "rps"
    ) {
      if (rockPaperScissors) {
        rockPaperScissors.reset();
      }

      showToast(
        "New Rock Paper Scissors round"
      );

      return;
    }

    /* ----------------------------------------------------------
       HIGHER OR LOWER
       ---------------------------------------------------------- */

    if (
      state.activeGame.id ===
      "higher-lower"
    ) {
      if (higherLower) {
        higherLower.reset();
      }

      showToast(
        "New Higher or Lower run"
      );

      return;
    }


    /* ----------------------------------------------------------
        MEMORY
        ---------------------------------------------------------- */

      if (
        state.activeGame.id ===
        "memory"
      ) {
        if (memory) {
          memory.reset();
        }

        showToast(
          "New Memory game"
        );

        return;
      }
     
      // Brivk breaker

      if (
        state.activeGame.id ===
        "brick-breaker"
      ) {
        if (brickBreaker) {
          brickBreaker.reset();
        }

        showToast(
          "New Brick Breaker game"
        );

        return;
      }
      
      /* ----------------------------------------------------------
      DODGE
      ---------------------------------------------------------- */

      if (
        state.activeGame.id ===
        "dodge"
      ) {
        if (dodge) {
          dodge.reset();
        }

        showToast(
          "New Dodge game"
        );

        return;
      }
        /* ----------------------------------------------------------
         2048
         ---------------------------------------------------------- */

      if (
        state.activeGame.id ===
        "game2048"
      ) {
        if (merge2048) {
          merge2048.reset();
        }

        showToast(
          "New 2048 game"
        );

        return;
      }
     
        /* ----------------------------------------------------------
         HANGMAN
         ---------------------------------------------------------- */

      if (
        state.activeGame.id ===
        "hangman"
      ) {
        if (hangman) {
          hangman.reset();
        }

        showToast(
          "New Hangman game"
        );

        return;
      }


    /* ----------------------------------------------------------
       OTHER GAMES
       ---------------------------------------------------------- */

    renderIntro(
      state.activeGame
    );

    showToast(
      `${state.activeGame.name} intro refreshed`
    );
  };

  /* ============================================================
     MODAL
     ============================================================ */

  const closeModal = () => {
    dom.modal.classList.add(
      "is-hidden"
    );
  };

  const initModal = () => {
    dom.modalPrimary.addEventListener(
      "click",
      () => {
        closeModal();

        if (
          state.activeGame?.id ===
          "tictactoe"
        ) {
          ticTacToe.reset();
        }
      }
    );

    dom.modalSecondary.addEventListener(
      "click",
      () => {
        closeModal();

        goHome();
      }
    );
  };

  /* ============================================================
     INIT
     ============================================================ */

  const init = () => {
    console.log(
      "APP: initializing"
    );

    const prefersLight =
      window.matchMedia?.(
        "(prefers-color-scheme: light)"
      ).matches;

    setTheme(
      readStorage(
        STORAGE_KEYS.theme,
        prefersLight
          ? "light"
          : "dark"
      )
    );

    setSound(
      readStorage(
        STORAGE_KEYS.sound,
        true
      )
    );

    /* ----------------------------------------------------------
       TIC-TAC-TOE MODULE
       ---------------------------------------------------------- */

    ticTacToe =
      initTicTacToe({
        state,
        dom,
        playTone,
        vibrate,
        showToast
      });

    console.log(
      "APP: Tic-Tac-Toe initialized"
    );

    /* ----------------------------------------------------------
       HOME
       ---------------------------------------------------------- */

    renderHome();

    /* ----------------------------------------------------------
       NAVIGATION
       ---------------------------------------------------------- */

    dom.backButton.addEventListener(
      "click",
      () => {
        vibrate();

        playTone(420);

        goHome();
      }
    );

    dom.restartButton.addEventListener(
      "click",
      restartIntro
    );

    /* ----------------------------------------------------------
       THEME / SOUND
       ---------------------------------------------------------- */

    dom.themeToggle.addEventListener(
      "click",
      toggleTheme
    );

    dom.gameThemeToggle.addEventListener(
      "click",
      toggleTheme
    );

    dom.soundToggle.addEventListener(
      "click",
      toggleSound
    );

    /* ----------------------------------------------------------
       MODAL
       ---------------------------------------------------------- */

    initModal();

    /* ----------------------------------------------------------
       INITIAL HASH
       ---------------------------------------------------------- */

    const initialGame =
      location.hash.replace(
        "#",
        ""
      );

    if (
      initialGame &&
      getGame(initialGame)
    ) {
      openGame(initialGame);
    }

    console.log(
      "APP: all games initialized"
    );
  };

  /* ============================================================
     START APP
     ============================================================ */

  init();

})();
