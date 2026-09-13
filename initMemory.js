// initMemory.js

export default function initMemory(root) {
  const styleId = "memory-local-styles";

  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;

    style.textContent = `
      .memory-screen {
        --memory-accent: #f472b6;
        --memory-accent-strong: #ec4899;

        width: 100%;
        max-width: 680px;
        margin: 0 auto;
        padding: 6px 0 18px;
        color: inherit;
        overflow: hidden;
      }

      .memory-screen *,
      .memory-screen *::before,
      .memory-screen *::after {
        box-sizing: border-box;
      }

      /* HEADER */
      .memory-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        margin-bottom: 11px;
        min-width: 0;
      }

      .memory-header > div:first-child {
        min-width: 0;
      }

      .memory-header h3 {
        margin: 2px 0 0;
        font-size: clamp(1.25rem, 4.5vw, 1.7rem);
        line-height: 1.05;
      }

      .memory-header .eyebrow {
        margin: 0;
      }

      .memory-status {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        flex-shrink: 0;
        padding: 6px 9px;
        border-radius: 999px;
        background: color-mix(
          in srgb,
          var(--memory-accent) 10%,
          transparent
        );
        border: 1px solid color-mix(
          in srgb,
          var(--memory-accent) 24%,
          transparent
        );
        font-size: 0.7rem;
        font-weight: 800;
        white-space: nowrap;
      }

      .memory-status-mark {
        font-size: 0.95rem;
      }

      /* SCORE */
      .memory-score {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 6px;
        margin-bottom: 9px;
      }

      .memory-score-unit {
        min-width: 0;
        padding: 7px 5px;
        text-align: center;
        border-radius: 11px;
        background: color-mix(
          in srgb,
          var(--memory-accent) 6%,
          transparent
        );
        border: 1px solid color-mix(
          in srgb,
          var(--memory-accent) 14%,
          transparent
        );
      }

      .memory-score-unit span {
        display: block;
        margin-bottom: 2px;
        font-size: 0.58rem;
        font-weight: 800;
        letter-spacing: 0.07em;
        text-transform: uppercase;
        opacity: 0.62;
      }

      .memory-score-unit strong {
        display: block;
        font-size: 1rem;
        line-height: 1;
      }

      /* CONTROLS */
      .memory-controls {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 8px;
        margin-bottom: 8px;
        min-width: 0;
      }

      .memory-difficulty {
        display: inline-flex;
        align-items: center;
        gap: 2px;
        padding: 3px;
        border-radius: 999px;
        background: color-mix(
          in srgb,
          var(--memory-accent) 7%,
          transparent
        );
        border: 1px solid color-mix(
          in srgb,
          var(--memory-accent) 14%,
          transparent
        );
      }

      .memory-difficulty button {
        appearance: none;
        border: 0;
        min-height: 29px;
        padding: 4px 8px;
        border-radius: 999px;
        background: transparent;
        color: inherit;
        font: inherit;
        font-size: 0.67rem;
        font-weight: 800;
        cursor: pointer;
        opacity: 0.58;
        touch-action: manipulation;
        transition:
          background 0.16s ease,
          color 0.16s ease,
          opacity 0.16s ease,
          transform 0.16s ease;
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
          0 3px 10px color-mix(
            in srgb,
            var(--memory-accent) 26%,
            transparent
          );
      }

      /* MESSAGE */
      .memory-message {
        min-height: 19px;
        margin-bottom: 7px;
        text-align: center;
        font-size: 0.76rem;
        font-weight: 700;
        line-height: 1.25;
        opacity: 0.72;
      }

      /* BOARD */
      .memory-board-wrap {
        position: relative;
        width: min(
          100%,
          calc(100vw - 24px),
          540px
        );
        margin: 0 auto;
        max-width: 100%;
      }

      .memory-board {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        grid-template-rows: repeat(4, minmax(0, 1fr));

        gap: clamp(5px, 1.5vw, 9px);

        width: 100%;
        aspect-ratio: 1 / 1;
        padding: clamp(6px, 1.5vw, 9px);

        border-radius: 19px;
        background: #211a2f;
        border: 2px solid rgba(244, 114, 182, 0.30);

        box-shadow:
          0 16px 40px rgba(0,0,0,0.14),
          inset 0 1px 0 rgba(255,255,255,0.07);

        overflow: hidden;
      }

      .memory-board.memory-board-easy {
        grid-template-columns: repeat(4, minmax(0, 1fr));
        grid-template-rows: repeat(3, minmax(0, 1fr));
        aspect-ratio: 4 / 3;
      }

      .memory-board.memory-board-hard {
        grid-template-columns: repeat(5, minmax(0, 1fr));
        grid-template-rows: repeat(4, minmax(0, 1fr));
        gap: clamp(4px, 1.2vw, 7px);
        padding: clamp(5px, 1.3vw, 8px);
        aspect-ratio: 5 / 4;
      }

      /* CARDS */
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
        perspective: 900px;
        border-radius: 11px;
        -webkit-tap-highlight-color: transparent;
        filter: drop-shadow(
          0 3px 6px rgba(0,0,0,0.18)
        );
        transition:
          transform 0.16s ease,
          filter 0.16s ease;
      }

      .memory-card:hover {
        transform: translateY(-1px);
        filter: drop-shadow(
          0 6px 9px rgba(0,0,0,0.15)
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
          transform 0.4s cubic-bezier(.2,.75,.25,1);
        border-radius: 11px;
      }

      .memory-card.is-flipped .memory-card-inner,
      .memory-card.is-matched .memory-card-inner {
        transform: rotateY(180deg);
      }

      .memory-card-face {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 11px;
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
        overflow: hidden;
      }

      /* FRONT */
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
            #fff,
            #f4edf8
          );

        border: 2px solid color-mix(
          in srgb,
          var(--memory-accent) 38%,
          #fff
        );

        box-shadow:
          0 5px 11px rgba(0,0,0,0.11),
          inset 0 1px 0 rgba(255,255,255,0.95);
      }

      /* BACK */
      .memory-card-back {
        background:
          radial-gradient(
            circle at 30% 20%,
            rgba(255,255,255,0.15),
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

        border: 2px solid rgba(255,255,255,0.26);

        box-shadow:
          0 6px 12px rgba(0,0,0,0.15),
          inset 0 1px 0 rgba(255,255,255,0.18);
      }

      .memory-card-back::before {
        content: "✦";
        position: absolute;
        width: 52%;
        height: 52%;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 10px;
        border: 1px solid rgba(255,255,255,0.23);
        color: rgba(255,255,255,0.76);
        font-size: clamp(0.9rem, 4vw, 1.7rem);
        background:
          repeating-linear-gradient(
            45deg,
            rgba(255,255,255,0.05) 0,
            rgba(255,255,255,0.05) 3px,
            transparent 3px,
            transparent 7px
          );
      }

      /* EMOJI */
      .memory-emoji {
        font-size: clamp(1.65rem, 8vw, 3.7rem);
        line-height: 1;
        filter:
          drop-shadow(
            0 4px 5px rgba(0,0,0,0.13)
          );
        user-select: none;
      }

      /* MATCHED */
      .memory-card.is-matched .memory-card-front {
        border-color: #4ade80;
        box-shadow:
          0 0 0 2px rgba(74,222,128,0.18),
          0 6px 18px rgba(74,222,128,0.18),
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

      /* WIN */
      .memory-win {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 12px;
        border-radius: 19px;

        background:
          linear-gradient(
            145deg,
            rgba(15,23,42,0.97),
            rgba(49,46,129,0.97)
          );

        border: 1px solid color-mix(
          in srgb,
          var(--memory-accent) 50%,
          transparent
        );

        box-shadow:
          0 18px 50px rgba(0,0,0,0.30);

        opacity: 0;
        visibility: hidden;
        transform: scale(0.94);

        transition:
          opacity 0.22s ease,
          visibility 0.22s ease,
          transform 0.22s ease;

        z-index: 20;
      }

      .memory-win.is-visible {
        opacity: 1;
        visibility: visible;
        transform: scale(1);
      }

      .memory-win-content {
        width: min(100%, 280px);
        text-align: center;
        color: #fff;
      }

      .memory-win-icon {
        font-size: clamp(2.6rem, 11vw, 4.5rem);
        line-height: 1;
        margin-bottom: 7px;
        animation:
          memoryTrophy 1s ease infinite alternate;
      }

      .memory-win h4 {
        margin: 0 0 5px;
        font-size: clamp(1.35rem, 5vw, 1.9rem);
      }

      .memory-win p {
        margin: 0 0 11px;
        opacity: 0.76;
        font-size: 0.78rem;
      }

      .memory-win-stats {
        display: flex;
        justify-content: center;
        gap: 6px;
        margin-bottom: 12px;
      }

      .memory-win-stat {
        min-width: 70px;
        padding: 7px 8px;
        border-radius: 10px;
        background: rgba(255,255,255,0.08);
        border: 1px solid rgba(255,255,255,0.1);
      }

      .memory-win-stat span {
        display: block;
        font-size: 0.55rem;
        text-transform: uppercase;
        letter-spacing: 0.07em;
        opacity: 0.62;
      }

      .memory-win-stat strong {
        display: block;
        margin-top: 2px;
        font-size: 0.95rem;
      }

      .memory-win-button {
        appearance: none;
        border: 0;
        min-height: 40px;
        padding: 9px 17px;
        border-radius: 999px;
        background: var(--memory-accent);
        color: #fff;
        font: inherit;
        font-size: 0.82rem;
        font-weight: 900;
        cursor: pointer;
        box-shadow:
          0 6px 18px color-mix(
            in srgb,
            var(--memory-accent) 32%,
            transparent
          );
        transition:
          transform 0.15s ease,
          filter 0.15s ease;
      }

      .memory-win-button:hover {
        filter: brightness(1.08);
      }

      .memory-win-button:active {
        transform: scale(0.95);
      }

      /* FOOTER */
      .memory-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        margin-top: 9px;
        min-width: 0;
      }

      .memory-footer-message {
        min-width: 0;
        font-size: 0.7rem;
        font-weight: 700;
        opacity: 0.62;
      }

      .memory-new-round {
        flex-shrink: 0;
      }

      /* ANIMATIONS */
      @keyframes memoryMatched {
        0% { transform: scale(0.8); }
        60% { transform: scale(1.14); }
        100% { transform: scale(1); }
      }

      @keyframes memoryPop {
        0% { transform: scale(0.92); }
        60% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }

      @keyframes memoryShake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-6px); }
        40% { transform: translateX(6px); }
        60% { transform: translateX(-4px); }
        80% { transform: translateX(4px); }
      }

      @keyframes memoryTrophy {
        from { transform: translateY(0) rotate(-3deg); }
        to { transform: translateY(-5px) rotate(3deg); }
      }

      /* MOBILE */
      @media (max-width: 480px) {
        .memory-screen {
          padding: 4px 2px 14px;
        }

        .memory-header {
          margin-bottom: 9px;
        }

        .memory-status {
          padding: 5px 7px;
        }

        .memory-status span:last-child {
          display: none;
        }

        .memory-score {
          gap: 5px;
          margin-bottom: 7px;
        }

        .memory-score-unit {
          padding: 6px 4px;
          border-radius: 9px;
        }

        .memory-score-unit span {
          font-size: 0.54rem;
        }

        .memory-score-unit strong {
          font-size: 0.92rem;
        }

        .memory-board-wrap {
          width: min(
            100%,
            calc(100vw - 16px),
            500px
          );
        }

        .memory-board {
          gap: 5px;
          padding: 6px;
          border-radius: 16px;
        }

        .memory-board.memory-board-hard {
          gap: 4px;
          padding: 5px;
        }

        .memory-card,
        .memory-card-face,
        .memory-card-inner {
          border-radius: 9px;
        }

        .memory-card-front,
        .memory-card-back {
          border-width: 1.5px;
        }

        .memory-footer {
          margin-top: 7px;
          align-items: center;
        }

        .memory-footer-message {
          font-size: 0.66rem;
        }
      }

      @media (max-width: 350px) {
        .memory-board-wrap {
          width: calc(100vw - 12px);
        }

        .memory-board {
          gap: 4px;
          padding: 5px;
        }

        .memory-emoji {
          font-size: clamp(1.35rem, 8vw, 2.6rem);
        }

        .memory-difficulty button {
          min-height: 27px;
          padding: 4px 6px;
          font-size: 0.62rem;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .memory-card,
        .memory-card-inner,
        .memory-win,
        .memory-difficulty button,
        .memory-win-button {
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

  /* HTML */
  root.innerHTML = `
    <section data-game="memory" class="memory-screen">
      <div class="memory-header">
        <div>
          <p class="eyebrow">Game</p>
          <h3>Memory</h3>
        </div>

        <div class="memory-status">
          <span class="memory-status-mark" aria-hidden="true">🧩</span>
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
        <div class="memory-difficulty" aria-label="Difficulty">
          <button type="button" data-memory-difficulty="easy">Easy</button>
          <button
            type="button"
            class="is-active"
            data-memory-difficulty="normal"
          >Normal</button>
          <button type="button" data-memory-difficulty="hard">Hard</button>
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
            <div class="memory-win-icon" aria-hidden="true">🏆</div>

            <h4>Perfect Memory!</h4>

            <p>You matched every pair.</p>

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

  /* ELEMENTS */
  const board = root.querySelector("[data-memory-board]");
  const movesElement = root.querySelector("[data-memory-moves]");
  const timeElement = root.querySelector("[data-memory-time]");
  const pairsElement = root.querySelector("[data-memory-pairs]");
  const messageElement = root.querySelector("[data-memory-message]");
  const footerElement = root.querySelector("[data-memory-footer]");
  const winScreen = root.querySelector("[data-memory-win]");
  const winMovesElement = root.querySelector("[data-win-moves]");
  const winTimeElement = root.querySelector("[data-win-time]");
  const difficultyButtons = root.querySelectorAll(
    "[data-memory-difficulty]"
  );
  const resetButton = root.querySelector("[data-memory-reset]");
  const winRestartButton = root.querySelector(
    "[data-memory-win-restart]"
  );

  /* GAME DATA */
  const EMOJIS = [
    "🍕", "🚀", "🐼", "🦊",
    "🌈", "⚡", "🎮", "🍩",
    "🦄", "🐸", "🍔", "🌟"
  ];

  const DIFFICULTIES = {
    easy: { pairs: 6, label: "6 pairs" },
    normal: { pairs: 8, label: "8 pairs" },
    hard: { pairs: 10, label: "10 pairs" }
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

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remaining = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remaining
    ).padStart(2, "0")}`;
  }

  function shuffle(array) {
    const copy = [...array];

    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [copy[i], copy[j]] = [copy[j], copy[i]];
    }

    return copy;
  }

  function getDifficultyData() {
    return DIFFICULTIES[difficulty];
  }

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

  function updateScore() {
    const totalPairs =
      getDifficultyData().pairs;

    movesElement.textContent = moves;
    timeElement.textContent =
      formatTime(elapsedSeconds);
    pairsElement.textContent =
      `${matchedPairs}/${totalPairs}`;
  }

  function createCards() {
    const pairCount =
      getDifficultyData().pairs;

    const selected =
      shuffle(EMOJIS).slice(0, pairCount);

    return shuffle(
      [...selected, ...selected].map(
        (emoji, index) => ({
          id: index,
          emoji,
          flipped: false,
          matched: false
        })
      )
    );
  }

  function renderBoard() {
    board.replaceChildren();

    cards.forEach((card) => {
      const button =
        document.createElement("button");

      button.type = "button";
      button.className = "memory-card";

      if (card.flipped) {
        button.classList.add("is-flipped");
      }

      if (card.matched) {
        button.classList.add("is-matched");
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

          <span class="memory-card-face memory-card-front">
            <span class="memory-emoji" aria-hidden="true">
              ${card.emoji}
            </span>
          </span>
        </span>
      `;

      button.addEventListener(
        "click",
        () => handleCardClick(card.id)
      );

      board.append(button);
    });
  }

  function getCardElement(id) {
    return board.querySelector(
      `[data-card-id="${id}"]`
    );
  }

  function handleCardClick(id) {
    if (lockBoard || gameFinished) {
      return;
    }

    const card = cards.find(
      (item) => item.id === id
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

    const element = getCardElement(id);

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

  function checkMatch() {
    const [first, second] = flippedCards;

    lockBoard = true;

    if (first.emoji === second.emoji) {
      handleMatch(first, second);
    } else {
      handleMismatch(first, second);
    }
  }

  function handleMatch(first, second) {
    first.matched = true;
    second.matched = true;

    matchedPairs += 1;

    const firstElement =
      getCardElement(first.id);

    const secondElement =
      getCardElement(second.id);

    firstElement?.classList.add("is-matched");
    secondElement?.classList.add("is-matched");

    const totalPairs =
      getDifficultyData().pairs;

    messageElement.textContent =
      matchedPairs === totalPairs
        ? "You found them all! 🎉"
        : "Nice match! Keep going ✨";

    footerElement.textContent =
      matchedPairs >= 4
        ? "You're getting sharp 🧠"
        : "Good memory!";

    flippedCards = [];
    lockBoard = false;

    updateScore();

    if (matchedPairs === totalPairs) {
      finishGame();
    }
  }

  function handleMismatch(first, second) {
    const firstElement =
      getCardElement(first.id);

    const secondElement =
      getCardElement(second.id);

    firstElement?.classList.add("is-wrong");
    secondElement?.classList.add("is-wrong");

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

  function finishGame() {
    gameFinished = true;

    stopTimer();
    updateScore();

    winMovesElement.textContent =
      moves;

    winTimeElement.textContent =
      formatTime(elapsedSeconds);

    window.setTimeout(() => {
      winScreen.classList.add("is-visible");
    }, 350);
  }

  function setDifficulty(nextDifficulty) {
    if (!DIFFICULTIES[nextDifficulty]) {
      return;
    }

    difficulty = nextDifficulty;

    difficultyButtons.forEach((button) => {
      button.classList.toggle(
        "is-active",
        button.dataset.memoryDifficulty === difficulty
      );
    });

    startGame();
  }

  function startGame() {
    stopTimer();

    cards = createCards();
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    elapsedSeconds = 0;
    lockBoard = false;
    gameFinished = false;

    winScreen.classList.remove("is-visible");

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

  /* EVENTS */
  const difficultyHandlers = [];

  difficultyButtons.forEach((button) => {
    const handler = () => {
      setDifficulty(
        button.dataset.memoryDifficulty
      );
    };

    difficultyHandlers.push([button, handler]);
    button.addEventListener("click", handler);
  });

  resetButton.addEventListener("click", startGame);
  winRestartButton.addEventListener("click", startGame);

  /* START */
  startGame();

  /* PUBLIC API */
  return {
    reset: startGame,

    destroy() {
      stopTimer();

      difficultyHandlers.forEach(
        ([button, handler]) => {
          button.removeEventListener(
            "click",
            handler
          );
        }
      );

      resetButton.removeEventListener(
        "click",
        startGame
      );

      winRestartButton.removeEventListener(
        "click",
        startGame
      );

      winScreen.classList.remove(
        "is-visible"
      );

      board.replaceChildren();
    }
  };
}
