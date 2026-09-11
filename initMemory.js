// #6 initMemory.js

export default function initMemory(root) {
  console.log("MEMORY FILE LOADED");

  /* ============================================================
     LOCAL STYLES
     ============================================================ */

  const styleId = "memory-local-styles";

  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");

    style.id = styleId;

    style.textContent = `
      .memory-screen {
        --memory-accent: #f472b6;
        --memory-accent-strong: #ec4899;

        width: 100%;
        max-width: 760px;
        margin: 0 auto;
        padding: 8px 0 24px;

        color: inherit;
      }

      .memory-screen *,
      .memory-screen *::before,
      .memory-screen *::after {
        box-sizing: border-box;
      }

      /* ========================================================
         HEADER
         ======================================================== */

      .memory-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        margin-bottom: 18px;
      }

      .memory-header h3 {
        margin: 2px 0 0;
        font-size: clamp(1.35rem, 4vw, 1.8rem);
        line-height: 1.1;
      }

      .memory-header .eyebrow {
        margin: 0;
      }

      .memory-status {
        display: inline-flex;
        align-items: center;
        gap: 8px;

        padding: 8px 12px;
        border-radius: 999px;

        background: color-mix(
          in srgb,
          var(--memory-accent) 12%,
          transparent
        );

        border: 1px solid color-mix(
          in srgb,
          var(--memory-accent) 30%,
          transparent
        );

        font-size: 0.8rem;
        font-weight: 800;
        white-space: nowrap;
      }

      .memory-status-mark {
        font-size: 1.1rem;
      }

      /* ========================================================
         SCORE
         ======================================================== */

      .memory-score {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
        margin-bottom: 16px;
      }

      .memory-score-unit {
        min-width: 0;
        padding: 10px 8px;

        text-align: center;

        border-radius: 14px;

        background: color-mix(
          in srgb,
          var(--memory-accent) 7%,
          transparent
        );

        border: 1px solid color-mix(
          in srgb,
          var(--memory-accent) 16%,
          transparent
        );
      }

      .memory-score-unit span {
        display: block;
        margin-bottom: 2px;

        font-size: 0.68rem;
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        opacity: 0.65;
      }

      .memory-score-unit strong {
        display: block;
        font-size: 1.15rem;
        line-height: 1;
      }

      /* ========================================================
         CONTROLS
         ======================================================== */

      .memory-controls {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        margin-bottom: 14px;
      }

      .memory-difficulty {
        display: inline-flex;
        align-items: center;
        gap: 4px;

        padding: 4px;

        border-radius: 999px;

        background: color-mix(
          in srgb,
          var(--memory-accent) 8%,
          transparent
        );

        border: 1px solid color-mix(
          in srgb,
          var(--memory-accent) 16%,
          transparent
        );
      }

      .memory-difficulty button {
        appearance: none;
        border: 0;

        min-height: 32px;
        padding: 5px 10px;

        border-radius: 999px;

        background: transparent;
        color: inherit;

        font: inherit;
        font-size: 0.72rem;
        font-weight: 800;

        cursor: pointer;
        opacity: 0.6;

        transition:
          background 0.18s ease,
          color 0.18s ease,
          opacity 0.18s ease,
          transform 0.18s ease;
      }

      .memory-difficulty button:hover {
        opacity: 1;
      }

      .memory-difficulty button:active {
        transform: scale(0.95);
      }

      .memory-difficulty button.is-active {
        opacity: 1;

        background: var(--memory-accent);
        color: #fff;

        box-shadow:
          0 4px 14px color-mix(
            in srgb,
            var(--memory-accent) 30%,
            transparent
          );
      }

      /* ========================================================
         MESSAGE
         ======================================================== */

      .memory-message {
        min-height: 24px;
        margin-bottom: 12px;

        text-align: center;

        font-size: 0.88rem;
        font-weight: 700;

        opacity: 0.78;
      }

      /* ========================================================
         BOARD
         ======================================================== */

      .memory-board-wrap {
        position: relative;

        width: min(100%, 620px);
        margin: 0 auto;
      }

      .memory-board {
        display: grid;

        grid-template-columns: repeat(4, minmax(0, 1fr));
        grid-template-rows: repeat(4, minmax(0, 1fr));

        gap: clamp(8px, 2vw, 14px);

        width: 100%;
        aspect-ratio: 1;

        padding: clamp(8px, 2vw, 14px);

        border-radius: 26px;

        background: #211a2f;

        border: 2px solid rgba(244, 114, 182, 0.35);

        box-shadow:
          0 22px 60px rgba(0, 0, 0, 0.14),
          inset 0 1px 0 rgba(255,255,255,0.08);
      }

        .memory-board.memory-board-easy {
          grid-template-columns: repeat(4, minmax(0, 1fr));
          grid-template-rows: repeat(3, minmax(0, 1fr));
        }

        .memory-board.memory-board-hard {
          grid-template-columns: repeat(5, minmax(0, 1fr));
          grid-template-rows: repeat(4, minmax(0, 1fr));

          gap: clamp(6px, 1.5vw, 11px);
          padding: clamp(7px, 1.8vw, 12px);
        }


      /* ========================================================
         CARD
         ======================================================== */

      .memory-card {
        position: relative;

        width: 100%;
        height: 100%;
        min-width: 0;
        min-height: 0;

        padding: 0;

        border: 0;
        background: transparent;

        cursor: pointer;

        perspective: 1000px;

        border-radius: 18px;

        -webkit-tap-highlight-color: transparent;

        filter: drop-shadow(
            0 5px 8px rgba(0,0,0,0.20)
        );

        transition:
            transform 0.18s ease,
            filter 0.18s ease;
    }


      .memory-card:hover {
        transform: translateY(-2px);

        filter: drop-shadow(
          0 9px 14px rgba(0,0,0,0.16)
        );
      }

      .memory-card:active {
        transform: scale(0.96);
      }

      .memory-card:disabled {
        cursor: default;
      }

    .memory-card-inner {
        position: relative;

        display: block;

        width: 100%;
        height: 100%;
        min-width: 0;
        min-height: 0;

        transform-style: preserve-3d;

        transition:
            transform 0.44s cubic-bezier(.2,.75,.25,1);

        border-radius: 18px;
    }


      .memory-card.is-flipped .memory-card-inner,
      .memory-card.is-matched .memory-card-inner {
        transform: rotateY(180deg);
      }

      /* ========================================================
         CARD FACES
         ======================================================== */

      .memory-card-face {
        position: absolute;
        inset: 0;

        display: flex;
        align-items: center;
        justify-content: center;

        border-radius: 18px;

        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;

        overflow: hidden;
      }

      /* ========================================================
         FRONT
         ======================================================== */

      .memory-card-front {
        transform: rotateY(180deg);

        background:
          radial-gradient(
            circle at 30% 25%,
            rgba(255,255,255,0.55),
            transparent 30%
          ),
          linear-gradient(
            145deg,
            #ffffff,
            #f4edf8
          );

        /*
         * Stronger visible card boundary.
         */
        border: 3px solid color-mix(
          in srgb,
          var(--memory-accent) 38%,
          #ffffff
        );

        box-shadow:
          0 7px 16px rgba(0,0,0,0.13),
          inset 0 1px 0 rgba(255,255,255,0.95);
      }

      /* ========================================================
         BACK
         ======================================================== */

      .memory-card-back {
        background:
          radial-gradient(
            circle at 30% 20%,
            rgba(255,255,255,0.16),
            transparent 28%
          ),
          linear-gradient(
            145deg,
            color-mix(
              in srgb,
              var(--memory-accent) 82%,
              #7c3aed
            ),
            color-mix(
              in srgb,
              var(--memory-accent) 48%,
              #312e81
            )
          );

        /*
         * Strong white outline makes the cell separation obvious.
         */
        border: 3px solid rgba(255,255,255,0.28);

        box-shadow:
          0 8px 18px rgba(0,0,0,0.17),
          inset 0 1px 0 rgba(255,255,255,0.20);
      }

      .memory-card-back::before {
        content: "✦";

        position: absolute;

        width: 54%;
        height: 54%;

        display: flex;
        align-items: center;
        justify-content: center;

        border-radius: 15px;

        border: 2px solid rgba(255,255,255,0.25);

        color: rgba(255,255,255,0.8);

        font-size: clamp(1.2rem, 5vw, 2rem);

        background:
          repeating-linear-gradient(
            45deg,
            rgba(255,255,255,0.05) 0,
            rgba(255,255,255,0.05) 3px,
            transparent 3px,
            transparent 7px
          );
      }

      /* ========================================================
         EMOJI
         ======================================================== */

      .memory-emoji {
        /*
         * Bigger icons — more like a real arcade game.
         */
        font-size: clamp(2.4rem, 9vw, 4.8rem);

        line-height: 1;

        filter:
          drop-shadow(
            0 6px 6px rgba(0,0,0,0.14)
          );

        user-select: none;
      }

      /* ========================================================
         MATCHED
         ======================================================== */

      .memory-card.is-matched .memory-card-front {
        border-color: #4ade80;

        box-shadow:
          0 0 0 3px rgba(74,222,128,0.18),
          0 8px 24px rgba(74,222,128,0.20),
          inset 0 1px 0 rgba(255,255,255,0.9);
      }

      .memory-card.is-matched .memory-emoji {
        animation: memoryMatched 0.45s ease;
      }

      .memory-card.is-wrong .memory-card-inner {
        animation: memoryShake 0.42s ease;
      }

      .memory-card.is-popping .memory-card-front {
        animation: memoryPop 0.34s ease;
      }

      /* ========================================================
         WIN SCREEN
         ======================================================== */

      .memory-win {
        position: absolute;
        inset: 0;

        display: flex;
        align-items: center;
        justify-content: center;

        padding: 20px;

        border-radius: 26px;

        background:
          linear-gradient(
            145deg,
            rgba(15, 23, 42, 0.97),
            rgba(49, 46, 129, 0.97)
          );

        border: 1px solid color-mix(
          in srgb,
          var(--memory-accent) 50%,
          transparent
        );

        box-shadow:
          0 24px 70px rgba(0,0,0,0.32);

        opacity: 0;
        visibility: hidden;

        transform: scale(0.94);

        transition:
          opacity 0.25s ease,
          visibility 0.25s ease,
          transform 0.25s ease;

        z-index: 20;
      }

      .memory-win.is-visible {
        opacity: 1;
        visibility: visible;
        transform: scale(1);
      }

      .memory-win-content {
        text-align: center;
        color: #fff;
      }

      .memory-win-icon {
        font-size: clamp(3rem, 12vw, 5.5rem);
        line-height: 1;
        margin-bottom: 10px;

        animation:
          memoryTrophy 1s ease infinite alternate;
      }

      .memory-win h4 {
        margin: 0 0 6px;

        font-size: clamp(1.5rem, 5vw, 2.1rem);
      }

      .memory-win p {
        margin: 0 0 16px;

        opacity: 0.78;
        font-size: 0.9rem;
      }

      .memory-win-stats {
        display: flex;
        justify-content: center;
        gap: 8px;

        margin-bottom: 18px;
      }

      .memory-win-stat {
        min-width: 82px;
        padding: 9px 10px;

        border-radius: 12px;

        background: rgba(255,255,255,0.08);
        border: 1px solid rgba(255,255,255,0.1);
      }

      .memory-win-stat span {
        display: block;

        font-size: 0.62rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;

        opacity: 0.65;
      }

      .memory-win-stat strong {
        display: block;
        margin-top: 3px;

        font-size: 1.05rem;
      }

      .memory-win-button {
        appearance: none;

        border: 0;

        padding: 11px 20px;

        border-radius: 999px;

        background: var(--memory-accent);
        color: #fff;

        font: inherit;
        font-weight: 900;

        cursor: pointer;

        box-shadow:
          0 8px 24px color-mix(
            in srgb,
            var(--memory-accent) 35%,
            transparent
          );

        transition:
          transform 0.16s ease,
          filter 0.16s ease;
      }

      .memory-win-button:hover {
        filter: brightness(1.08);
      }

      .memory-win-button:active {
        transform: scale(0.95);
      }

      /* ========================================================
         FOOTER
         ======================================================== */

      .memory-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;

        margin-top: 15px;
      }

      .memory-footer-message {
        font-size: 0.8rem;
        font-weight: 700;
        opacity: 0.65;
      }

      .memory-new-round {
        flex-shrink: 0;
      }

      /* ========================================================
         ANIMATIONS
         ======================================================== */

      @keyframes memoryMatched {
        0% {
          transform: scale(0.8);
        }

        60% {
          transform: scale(1.18);
        }

        100% {
          transform: scale(1);
        }
      }

      @keyframes memoryPop {
        0% {
          transform: scale(0.92);
        }

        60% {
          transform: scale(1.06);
        }

        100% {
          transform: scale(1);
        }
      }

      @keyframes memoryShake {
        0%, 100% {
          transform: translateX(0);
        }

        20% {
          transform: translateX(-7px);
        }

        40% {
          transform: translateX(7px);
        }

        60% {
          transform: translateX(-5px);
        }

        80% {
          transform: translateX(5px);
        }
      }

      @keyframes memoryTrophy {
        from {
          transform: translateY(0) rotate(-3deg);
        }

        to {
          transform: translateY(-7px) rotate(3deg);
        }
      }

      /* ========================================================
         MOBILE
         ======================================================== */

      @media (max-width: 480px) {
        .memory-screen {
          padding-left: 2px;
          padding-right: 2px;
        }

        .memory-header {
          margin-bottom: 14px;
        }

        .memory-status {
          padding: 7px 9px;
        }

        .memory-status span:last-child {
          display: none;
        }

        .memory-score {
          gap: 6px;
        }

        .memory-score-unit {
          padding: 8px 5px;
        }

        .memory-board {
          gap: 8px;
          padding: 8px;
          border-radius: 22px;
        }

        .memory-card,
        .memory-card-face,
        .memory-card-inner {
          border-radius: 14px;
        }

        .memory-card-front,
        .memory-card-back {
          border-width: 2px;
        }

        .memory-board.memory-board-hard {
          grid-template-columns: repeat(5, minmax(0, 1fr));
          grid-template-rows: repeat(4, minmax(0, 1fr));

          gap: clamp(6px, 1.5vw, 11px);
          padding: clamp(7px, 1.8vw, 12px);
        }


        .memory-footer {
          align-items: flex-start;
        }
      }

      /* ========================================================
         REDUCED MOTION
         ======================================================== */

      @media (prefers-reduced-motion: reduce) {
        .memory-card,
        .memory-card-inner,
        .memory-win,
        .memory-difficulty button {
          transition: none;
        }

        .memory-card.is-wrong .memory-card-inner,
        .memory-card.is-matched .memory-emoji,
        .memory-card.is-popping .memory-card-front,
        .memory-win-icon {
          animation: none;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* ============================================================
     HTML
     ============================================================ */

  root.innerHTML = `
    <section
      data-game="memory"
      class="memory-screen"
    >
      <div class="memory-header">
        <div>
          <p class="eyebrow">Game</p>
          <h3>Memory</h3>
        </div>

        <div class="memory-status">
          <span
            class="memory-status-mark"
            aria-hidden="true"
          >
            🧩
          </span>

          <span>Match them all</span>
        </div>
      </div>

      <div class="memory-score">
        <div class="memory-score-unit">
          <span>Moves</span>
          <strong data-memory-moves>0</strong>
        </div>

        <div class="memory-score-unit">
          <span>Time</span>
          <strong data-memory-time>00:00</strong>
        </div>

        <div class="memory-score-unit">
          <span>Pairs</span>
          <strong data-memory-pairs>0/8</strong>
        </div>
      </div>

      <div class="memory-controls">
        <div
          class="memory-difficulty"
          aria-label="Difficulty"
        >
          <button
            type="button"
            data-memory-difficulty="easy"
          >
            Easy
          </button>

          <button
            type="button"
            class="is-active"
            data-memory-difficulty="normal"
          >
            Normal
          </button>

          <button
            type="button"
            data-memory-difficulty="hard"
          >
            Hard
          </button>
        </div>
      </div>

      <div
        class="memory-message"
        data-memory-message
        aria-live="polite"
      >
        Find all 8 matching pairs
      </div>

      <div class="memory-board-wrap">
        <div
          class="memory-board"
          data-memory-board
          aria-label="Memory card board"
        ></div>

        <div
          class="memory-win"
          data-memory-win
          aria-live="polite"
        >
          <div class="memory-win-content">
            <div
              class="memory-win-icon"
              aria-hidden="true"
            >
              🏆
            </div>

            <h4>Perfect Memory!</h4>

            <p>
              You matched every pair.
            </p>

            <div class="memory-win-stats">
              <div class="memory-win-stat">
                <span>Moves</span>
                <strong data-win-moves>0</strong>
              </div>

              <div class="memory-win-stat">
                <span>Time</span>
                <strong data-win-time>00:00</strong>
              </div>
            </div>

            <button
              type="button"
              class="memory-win-button"
              data-memory-win-restart
            >
              Play Again
            </button>
          </div>
        </div>
      </div>

      <div class="memory-footer">
        <span
          class="memory-footer-message"
          data-memory-footer
        >
          Take your time 🧠
        </span>

        <button
          type="button"
          class="button button-quiet memory-new-round"
          data-memory-reset
        >
          New Game
        </button>
      </div>
    </section>
  `;

  /* ============================================================
     ELEMENTS
     ============================================================ */

  const board =
    root.querySelector("[data-memory-board]");

  const movesElement =
    root.querySelector("[data-memory-moves]");

  const timeElement =
    root.querySelector("[data-memory-time]");

  const pairsElement =
    root.querySelector("[data-memory-pairs]");

  const messageElement =
    root.querySelector("[data-memory-message]");

  const footerElement =
    root.querySelector("[data-memory-footer]");

  const winScreen =
    root.querySelector("[data-memory-win]");

  const winMovesElement =
    root.querySelector("[data-win-moves]");

  const winTimeElement =
    root.querySelector("[data-win-time]");

  const difficultyButtons =
    root.querySelectorAll(
      "[data-memory-difficulty]"
    );

  const resetButton =
    root.querySelector("[data-memory-reset]");

  const winRestartButton =
    root.querySelector(
      "[data-memory-win-restart]"
    );

  /* ============================================================
     GAME DATA
     ============================================================ */

  const EMOJIS = [
    "🍕",
    "🚀",
    "🐼",
    "🦊",
    "🌈",
    "⚡",
    "🎮",
    "🍩",
    "🦄",
    "🐸",
    "🍔",
    "🌟"
  ];

  const DIFFICULTIES = {
    easy: {
      pairs: 6,
      label: "6 pairs"
    },

    normal: {
      pairs: 8,
      label: "8 pairs"
    },

    hard: {
      pairs: 10,
      label: "10 pairs"
    }
  };

  let difficulty = "normal";

  let cards = [];

  let flippedCards = [];

  let matchedPairs = 0;

  let moves = 0;

  let elapsedSeconds = 0;

  let timer = null;

  let lockBoard = false;

  let gameFinished = false;

  /* ============================================================
     HELPERS
     ============================================================ */

  function formatTime(seconds) {
    const minutes =
      Math.floor(seconds / 60);

    const remaining =
      seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remaining
    ).padStart(2, "0")}`;
  }

  function shuffle(array) {
    const copy = [...array];

    for (
      let i = copy.length - 1;
      i > 0;
      i--
    ) {
      const j =
        Math.floor(
          Math.random() * (i + 1)
        );

      [
        copy[i],
        copy[j]
      ] = [
        copy[j],
        copy[i]
      ];
    }

    return copy;
  }

  function getDifficultyData() {
    return DIFFICULTIES[difficulty];
  }

  /* ============================================================
     TIMER
     ============================================================ */

  function stopTimer() {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  function startTimer() {
    if (timer || gameFinished) {
      return;
    }

    timer = window.setInterval(() => {
      elapsedSeconds += 1;

      timeElement.textContent =
        formatTime(elapsedSeconds);
    }, 1000);
  }

  /* ============================================================
     SCORE
     ============================================================ */

  function updateScore() {
    const totalPairs =
      getDifficultyData().pairs;

    movesElement.textContent =
      moves;

    timeElement.textContent =
      formatTime(elapsedSeconds);

    pairsElement.textContent =
      `${matchedPairs}/${totalPairs}`;
  }

  /* ============================================================
     CARD CREATION
     ============================================================ */

  function createCards() {
    const pairCount =
      getDifficultyData().pairs;

    const selected =
      shuffle(EMOJIS).slice(
        0,
        pairCount
      );

    const duplicated = [
      ...selected,
      ...selected
    ];

    return shuffle(
      duplicated.map(
        (emoji, index) => ({
          id: index,
          emoji,
          flipped: false,
          matched: false
        })
      )
    );
  }

  /* ============================================================
     RENDER BOARD
     ============================================================ */

  function renderBoard() {
    board.replaceChildren();

    cards.forEach((card) => {
      const button =
        document.createElement("button");

      button.type = "button";

      button.className =
        "memory-card";

      if (card.flipped) {
        button.classList.add(
          "is-flipped"
        );
      }

      if (card.matched) {
        button.classList.add(
          "is-matched"
        );
      }

      button.dataset.cardId =
        String(card.id);

      button.setAttribute(
        "aria-label",
        card.flipped || card.matched
          ? `Memory card ${card.emoji}`
          : "Hidden memory card"
      );

      button.innerHTML = `
        <span class="memory-card-inner">
          <span
            class="memory-card-face memory-card-back"
            aria-hidden="true"
          ></span>

          <span
            class="memory-card-face memory-card-front"
          >
            <span
              class="memory-emoji"
              aria-hidden="true"
            >
              ${card.emoji}
            </span>
          </span>
        </span>
      `;

      button.addEventListener(
        "click",
        () => {
          handleCardClick(card.id);
        }
      );

      board.append(button);
    });
  }

  /* ============================================================
     CARD LOOKUP
     ============================================================ */

  function getCardElement(id) {
    return board.querySelector(
      `[data-card-id="${id}"]`
    );
  }

  /* ============================================================
     CARD CLICK
     ============================================================ */

  function handleCardClick(id) {
    if (
      lockBoard ||
      gameFinished
    ) {
      return;
    }

    const card =
      cards.find(
        (item) =>
          item.id === id
      );

    if (
      !card ||
      card.flipped ||
      card.matched
    ) {
      return;
    }

    if (!flippedCards.length) {
      startTimer();
    }

    card.flipped = true;

    flippedCards.push(card);

    moves += 1;

    updateScore();

    const element =
      getCardElement(id);

    if (element) {
      element.classList.add(
        "is-flipped",
        "is-popping"
      );

      window.setTimeout(() => {
        element.classList.remove(
          "is-popping"
        );
      }, 340);
    }

    if (flippedCards.length === 2) {
      checkMatch();
    }
  }

  /* ============================================================
     MATCH CHECK
     ============================================================ */

  function checkMatch() {
    const [first, second] =
      flippedCards;

    lockBoard = true;

    if (
      first.emoji ===
      second.emoji
    ) {
      handleMatch(
        first,
        second
      );

      return;
    }

    handleMismatch(
      first,
      second
    );
  }

  /* ============================================================
     MATCH
     ============================================================ */

  function handleMatch(
    first,
    second
  ) {
    first.matched = true;
    second.matched = true;

    matchedPairs += 1;

    const firstElement =
      getCardElement(first.id);

    const secondElement =
      getCardElement(second.id);

    firstElement?.classList.add(
      "is-matched"
    );

    secondElement?.classList.add(
      "is-matched"
    );

    messageElement.textContent =
      matchedPairs ===
      getDifficultyData().pairs
        ? "You found them all! 🎉"
        : "Nice match! Keep going ✨";

    footerElement.textContent =
      matchedPairs >= 4
        ? "You're getting sharp 🧠"
        : "Good memory!";

    flippedCards = [];

    lockBoard = false;

    updateScore();

    if (
      matchedPairs ===
      getDifficultyData().pairs
    ) {
      finishGame();
    }
  }

  /* ============================================================
     MISMATCH
     ============================================================ */

  function handleMismatch(
    first,
    second
  ) {
    const firstElement =
      getCardElement(first.id);

    const secondElement =
      getCardElement(second.id);

    firstElement?.classList.add(
      "is-wrong"
    );

    secondElement?.classList.add(
      "is-wrong"
    );

    messageElement.textContent =
      "Not a match — try again!";

    window.setTimeout(() => {
      first.flipped = false;
      second.flipped = false;

      firstElement?.classList.remove(
        "is-flipped",
        "is-wrong"
      );

      secondElement?.classList.remove(
        "is-flipped",
        "is-wrong"
      );

      flippedCards = [];

      lockBoard = false;

      messageElement.textContent =
        "Find the matching pairs";
    }, 700);
  }

  /* ============================================================
     WIN
     ============================================================ */

  function finishGame() {
    gameFinished = true;

    stopTimer();

    updateScore();

    winMovesElement.textContent =
      moves;

    winTimeElement.textContent =
      formatTime(elapsedSeconds);

    window.setTimeout(() => {
      winScreen.classList.add(
        "is-visible"
      );
    }, 350);
  }

  /* ============================================================
     DIFFICULTY
     ============================================================ */

  function setDifficulty(nextDifficulty) {
    if (
      !DIFFICULTIES[nextDifficulty]
    ) {
      return;
    }

    difficulty =
      nextDifficulty;

    difficultyButtons.forEach(
      (button) => {
        button.classList.toggle(
          "is-active",
          button.dataset
            .memoryDifficulty ===
            difficulty
        );
      }
    );

    startGame();
  }

  difficultyButtons.forEach(
    (button) => {
      button.addEventListener(
        "click",
        () => {
          setDifficulty(
            button.dataset
              .memoryDifficulty
          );
        }
      );
    }
  );

  /* ============================================================
     NEW GAME
     ============================================================ */

  function startGame() {
    stopTimer();

    cards = createCards();

    flippedCards = [];

    matchedPairs = 0;

    moves = 0;

    elapsedSeconds = 0;

    lockBoard = false;

    gameFinished = false;

    winScreen.classList.remove(
      "is-visible"
    );

    const totalPairs =
      getDifficultyData().pairs;

    messageElement.textContent =
      `Find all ${totalPairs} matching pairs`;

    footerElement.textContent =
      "Take your time 🧠";

    updateScore();

    board.classList.toggle(
      "memory-board-easy",
      difficulty === "easy"
    );

    board.classList.toggle(
      "memory-board-hard",
      difficulty === "hard"
    );


    renderBoard();
  }

  /* ============================================================
     EVENTS
     ============================================================ */

  resetButton.addEventListener(
    "click",
    startGame
  );

  winRestartButton.addEventListener(
    "click",
    startGame
  );

  /* ============================================================
     START
     ============================================================ */

  startGame();

  /* ============================================================
     PUBLIC API
     ============================================================ */

   return {
    reset: startGame,

    destroy() {
      stopTimer();

      winScreen.classList.remove(
        "is-visible"
      );

      board.replaceChildren();
    }
  };
}
