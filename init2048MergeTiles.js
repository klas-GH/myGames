// init2048MergeTiles.js

export default function init2048MergeTiles(root, options = {}) {
  const {
    playTone = () => {},
    vibrate = () => {}
  } = options;

  /* ============================================================
     LOCAL STYLES
     ============================================================ */

  const styleId = "merge2048-local-styles";

  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;

    style.textContent = `
      .merge2048-screen {
        --merge2048-accent: #f59e0b;
        --merge2048-accent-strong: #d97706;

        width: 100%;
        max-width: 540px;
        margin: 0 auto;
        padding: clamp(2px, 0.8vh, 4px) 0 clamp(4px, 1.2vh, 10px);

        color: inherit;
        overflow: hidden;

        user-select: none;
        -webkit-user-select: none;
      }

      .merge2048-screen *,
      .merge2048-screen *::before,
      .merge2048-screen *::after {
        box-sizing: border-box;
      }

      /* ========================================================
         HEADER
         ======================================================== */

      .merge2048-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        margin-bottom: clamp(4px, 1vh, 8px);
        min-width: 0;
      }

      .merge2048-header > div:first-child {
        min-width: 0;
      }

      .merge2048-header h3 {
        margin: 1px 0 0;
        font-size: clamp(1.2rem, 4.5vw, 1.6rem);
        line-height: 1.05;
      }

      .merge2048-header .eyebrow {
        margin: 0;
        font-size: 0.72rem;
      }

      .merge2048-badges {
        display: flex;
        gap: 5px;
        flex-shrink: 0;
      }

      .merge2048-score-box {
        min-width: 60px;
        padding: 5px 7px;
        text-align: center;
        border-radius: 9px;
        background: rgba(245,158,11,0.10);
        border: 1px solid rgba(245,158,11,0.22);
      }

      .merge2048-score-label {
        display: block;
        font-size: 0.52rem;
        font-weight: 900;
        letter-spacing: 0.07em;
        text-transform: uppercase;
        opacity: 0.58;
      }

      .merge2048-score-value {
        display: block;
        margin-top: 1px;
        font-size: 0.9rem;
        font-weight: 950;
        line-height: 1.05;
      }

      /* ========================================================
         GAME
         ======================================================== */

      .merge2048-game-wrap {
        position: relative;

        width: min(
          100%,
          420px,
          calc(100vw - 20px),
          max(180px, calc((100svh - 315px) * 0.95)),
          max(180px, calc((100dvh - 315px) * 0.95))
        );

        margin: 0 auto;
        padding: clamp(5px, 1.2vh, 8px);

        border-radius: clamp(12px, 2vh, 19px);

        background:
          linear-gradient(
            145deg,
            #b88752,
            #9a693b
          );

        border: 1px solid rgba(255,255,255,0.10);

        box-shadow:
          0 14px 34px rgba(0,0,0,0.20),
          inset 0 1px 0 rgba(255,255,255,0.14);

        touch-action: none;
      }

      .merge2048-board {
        position: relative;

        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));

        gap: 6px;

        width: 100%;
        aspect-ratio: 1;

        border-radius: 12px;

        background:
          rgba(110,72,38,0.55);

        overflow: hidden;
        touch-action: none;
      }

      .merge2048-cell {
        position: relative;
        min-width: 0;
        min-height: 0;

        border-radius: 8px;

        background:
          rgba(238,228,218,0.28);
      }

      /* ========================================================
         TILES
         ======================================================== */

      .merge2048-tile-layer {
        position: absolute;
        inset: 0;
        pointer-events: none;
      }

      .merge2048-tile {
        position: absolute;

        display: flex;
        align-items: center;
        justify-content: center;

        border-radius: 8px;

        font-weight: 950;
        line-height: 1;

        color: #776e65;

        transform:
          translate3d(0,0,0)
          scale(1);

        transition:
          transform 110ms ease,
          opacity 110ms ease;
      }

      .merge2048-tile.is-new {
        animation:
          merge2048-tile-new
          150ms cubic-bezier(.2,1.4,.4,1)
          both;
      }

      .merge2048-tile.is-merged {
        animation:
          merge2048-tile-merged
          190ms cubic-bezier(.2,1.35,.35,1)
          both;
      }

      .merge2048-tile.is-removing {
        opacity: 0;
        transform:
          translate3d(0,0,0)
          scale(0.2);
      }

      @keyframes merge2048-tile-new {
        0% {
          opacity: 0;
          transform:
            translate3d(0,0,0)
            scale(0);
        }

        70% {
          opacity: 1;
          transform:
            translate3d(0,0,0)
            scale(1.12);
        }

        100% {
          opacity: 1;
          transform:
            translate3d(0,0,0)
            scale(1);
        }
      }

      @keyframes merge2048-tile-merged {
        0% {
          transform:
            translate3d(0,0,0)
            scale(1);
        }

        45% {
          transform:
            translate3d(0,0,0)
            scale(1.18);
        }

        100% {
          transform:
            translate3d(0,0,0)
            scale(1);
        }
      }

      /* ========================================================
         TILE COLORS
         ======================================================== */

      .merge2048-tile[data-value="2"] {
        background: #eee4da;
        color: #776e65;
      }

      .merge2048-tile[data-value="4"] {
        background: #ede0c8;
        color: #776e65;
      }

      .merge2048-tile[data-value="8"] {
        background: #f2b179;
        color: #f9f6f2;
      }

      .merge2048-tile[data-value="16"] {
        background: #f59563;
        color: #f9f6f2;
      }

      .merge2048-tile[data-value="32"] {
        background: #f67c5f;
        color: #f9f6f2;
      }

      .merge2048-tile[data-value="64"] {
        background: #f65e3b;
        color: #f9f6f2;
      }

      .merge2048-tile[data-value="128"] {
        background: #edcf72;
        color: #f9f6f2;
        box-shadow:
          0 0 15px rgba(237,207,114,0.30);
      }

      .merge2048-tile[data-value="256"] {
        background: #edcc61;
        color: #f9f6f2;
        box-shadow:
          0 0 17px rgba(237,204,97,0.34);
      }

      .merge2048-tile[data-value="512"] {
        background: #edc850;
        color: #f9f6f2;
        box-shadow:
          0 0 19px rgba(237,200,80,0.38);
      }

      .merge2048-tile[data-value="1024"] {
        background: #edc53f;
        color: #f9f6f2;
        box-shadow:
          0 0 21px rgba(237,197,63,0.42);
      }

      .merge2048-tile[data-value="2048"] {
        background:
          linear-gradient(
            135deg,
            #f9d976,
            #f39c12
          );

        color: #fff;

        box-shadow:
          0 0 26px rgba(249,217,118,0.60);
      }

      .merge2048-tile[data-value="4096"],
      .merge2048-tile[data-value="8192"] {
        background:
          linear-gradient(
            135deg,
            #60a5fa,
            #7c3aed
          );

        color: #fff;

        box-shadow:
          0 0 26px rgba(124,58,237,0.50);
      }

      /* ========================================================
         MESSAGE
         ======================================================== */

      .merge2048-message {
        min-height: clamp(15px, 2.2vh, 18px);
        margin: clamp(3px, 0.6vh, 5px) 0 0;

        text-align: center;

        font-size: clamp(0.66rem, 1.5vh, 0.74rem);
        font-weight: 750;

        opacity: 0.70;
      }

      /* ========================================================
         CONTROLS
         ======================================================== */

      .merge2048-controls {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: clamp(3px, 0.6vh, 5px);

        width: 100%;
        margin-top: clamp(4px, 0.8vh, 6px);
      }

      .merge2048-control {
        appearance: none;

        min-width: 0;
        min-height: clamp(26px, 3.8vh, 34px);
        padding: clamp(3px, 0.6vh, 5px) 3px;

        border: 1px solid rgba(245,158,11,0.22);
        border-radius: clamp(6px, 1.2vh, 10px);

        background:
          rgba(245,158,11,0.08);

        color: inherit;

        font: inherit;
        font-size: clamp(0.62rem, 1.5vh, 0.7rem);
        font-weight: 900;

        cursor: pointer;
        touch-action: manipulation;

        transition:
          transform 120ms ease,
          background 120ms ease;
      }

      .merge2048-control:active {
        transform: scale(0.96);
        background:
          rgba(245,158,11,0.18);
      }

      .merge2048-new-game {
        appearance: none;

        width: 100%;
        min-height: clamp(28px, 4vh, 36px);
        margin-top: clamp(4px, 0.8vh, 6px);
        padding: clamp(4px, 0.8vh, 6px) 14px;

        border: 0;
        border-radius: 999px;

        background:
          var(--merge2048-accent);

        color: #fff;

        font: inherit;
        font-size: clamp(0.7rem, 1.6vh, 0.76rem);
        font-weight: 900;

        cursor: pointer;

        box-shadow:
          0 6px 16px rgba(245,158,11,0.22);

        transition:
          transform 120ms ease,
          filter 120ms ease;
      }

      .merge2048-new-game:hover {
        filter: brightness(1.06);
      }

      .merge2048-new-game:active {
        transform: scale(0.98);
      }

      /* ========================================================
         OVERLAY
         ======================================================== */

      .merge2048-overlay {
        position: absolute;
        inset: 8px;

        display: flex;
        align-items: center;
        justify-content: center;

        padding: 10px;

        border-radius: 12px;

        background:
          rgba(20,14,8,0.78);

        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px);

        opacity: 0;
        visibility: hidden;

        transition:
          opacity 180ms ease,
          visibility 180ms ease;

        z-index: 20;
      }

      .merge2048-overlay.is-visible {
        opacity: 1;
        visibility: visible;
      }

      .merge2048-overlay-card {
        width: min(100%, 280px);
        padding: 17px 13px;

        text-align: center;

        border-radius: 17px;

        background:
          rgba(255,255,255,0.09);

        border:
          1px solid rgba(255,255,255,0.14);

        color: #fff;

        box-shadow:
          0 18px 45px rgba(0,0,0,0.30);
      }

      .merge2048-overlay-icon {
        margin-bottom: 6px;

        font-size: 2.5rem;
        line-height: 1;
      }

      .merge2048-overlay-card h4 {
        margin: 0 0 4px;
        font-size: 1.4rem;
      }

      .merge2048-overlay-card p {
        margin: 0 0 11px;
        font-size: 0.76rem;
        opacity: 0.72;
      }

      .merge2048-overlay-stats {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 6px;
        margin-bottom: 12px;
      }

      .merge2048-overlay-stat {
        padding: 7px;
        border-radius: 9px;

        background:
          rgba(255,255,255,0.07);

        border:
          1px solid rgba(255,255,255,0.08);
      }

      .merge2048-overlay-stat span {
        display: block;

        font-size: 0.52rem;
        font-weight: 800;

        letter-spacing: 0.07em;
        text-transform: uppercase;

        opacity: 0.58;
      }

      .merge2048-overlay-stat strong {
        display: block;
        margin-top: 2px;
        font-size: 0.95rem;
      }

      .merge2048-overlay-button {
        appearance: none;

        min-height: 38px;
        padding: 7px 18px;

        border: 0;
        border-radius: 999px;

        background:
          var(--merge2048-accent);

        color: #fff;

        font: inherit;
        font-size: 0.78rem;
        font-weight: 900;

        cursor: pointer;
      }

      /* ========================================================
         FOOTER
         ======================================================== */

      .merge2048-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 6px;

        margin-top: clamp(3px, 0.6vh, 5px);

        font-size: clamp(0.56rem, 1.3vh, 0.64rem);
        line-height: 1.2;

        opacity: 0.55;
      }

      .merge2048-footer span:first-child {
        min-width: 0;
      }

      .merge2048-footer span:last-child {
        flex-shrink: 0;
      }

      .merge2048-footer strong {
        color:
          var(--merge2048-accent);

        opacity: 1;
      }

      @media (max-height: 760px) {
        .merge2048-screen {
          padding: 2px 0 4px;
        }

        .merge2048-header {
          margin-bottom: 4px;
        }

        .merge2048-header h3 {
          font-size: 1.15rem;
        }

        .merge2048-score-box {
          min-width: 50px;
          padding: 3px 5px;
        }

        .merge2048-game-wrap {
          width: min(
            100%,
            380px,
            calc(100vw - 16px),
            max(170px, calc((100svh - 265px) * 0.95)),
            max(170px, calc((100dvh - 265px) * 0.95))
          );
          padding: 6px;
        }

        .merge2048-message {
          min-height: 14px;
          margin-top: 3px;
          font-size: 0.68rem;
        }

        .merge2048-controls {
          margin-top: 3px;
          gap: 4px;
        }

        .merge2048-control {
          min-height: 28px;
          font-size: 0.64rem;
        }

        .merge2048-new-game {
          min-height: 30px;
          margin-top: 4px;
          font-size: 0.72rem;
        }

        .merge2048-footer {
          margin-top: 3px;
          font-size: 0.58rem;
        }
      }

      @media (max-height: 620px) {
        .merge2048-screen {
          padding: 1px 0 2px;
        }

        .merge2048-header {
          margin-bottom: 3px;
        }

        .merge2048-header h3 {
          font-size: 1.05rem;
        }

        .merge2048-header .eyebrow {
          display: none;
        }

        .merge2048-score-box {
          min-width: 44px;
          padding: 2px 4px;
        }

        .merge2048-score-label {
          font-size: 0.44rem;
        }

        .merge2048-score-value {
          font-size: 0.78rem;
        }

        .merge2048-game-wrap {
          width: min(
            100%,
            300px,
            calc(100vw - 14px),
            max(150px, calc((100svh - 215px) * 0.95)),
            max(150px, calc((100dvh - 215px) * 0.95))
          );
          padding: 5px;
          border-radius: 12px;
        }

        .merge2048-board {
          gap: 4px;
          border-radius: 8px;
        }

        .merge2048-message {
          min-height: 12px;
          margin-top: 2px;
          font-size: 0.62rem;
        }

        .merge2048-controls {
          margin-top: 2px;
          gap: 3px;
        }

        .merge2048-control {
          min-height: 24px;
          font-size: 0.58rem;
        }

        .merge2048-new-game {
          min-height: 26px;
          margin-top: 3px;
          font-size: 0.68rem;
        }

        .merge2048-footer {
          display: none;
        }
      }

      /* ========================================================
         MOBILE
         ======================================================== */

      @media (max-width: 430px) {
        .merge2048-screen {
          max-width: 100%;
          padding: 2px 0 10px;
        }

        .merge2048-header {
          margin-bottom: 7px;
        }

        .merge2048-game-wrap {
          width: min(
            100%,
            calc(100vw - 14px)
          );

          padding: 6px;
          border-radius: 15px;
        }

        .merge2048-board {
          gap: 5px;
          border-radius: 10px;
        }

        .merge2048-cell,
        .merge2048-tile {
          border-radius: 6px;
        }

        .merge2048-controls {
          gap: 5px;
        }

        .merge2048-control {
          min-height: 36px;
          font-size: 0.61rem;
        }

        .merge2048-score-box {
          min-width: 54px;
          padding: 4px 6px;
        }

        .merge2048-score-label {
          font-size: 0.48rem;
        }

        .merge2048-score-value {
          font-size: 0.82rem;
        }

        .merge2048-message {
          font-size: 0.70rem;
          margin-top: 5px;
        }

        .merge2048-new-game {
          min-height: 37px;
          margin-top: 5px;
        }

        .merge2048-footer {
          margin-top: 5px;
          font-size: 0.60rem;
        }
      }

      @media (max-width: 340px) {
        .merge2048-header h3 {
          font-size: 1.2rem;
        }

        .merge2048-badges {
          gap: 3px;
        }

        .merge2048-score-box {
          min-width: 49px;
          padding: 4px;
        }

        .merge2048-control {
          min-height: 34px;
          font-size: 0.56rem;
        }

        .merge2048-footer {
          font-size: 0.56rem;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .merge2048-tile,
        .merge2048-overlay,
        .merge2048-control,
        .merge2048-new-game {
          transition: none;
        }

        .merge2048-tile.is-new,
        .merge2048-tile.is-merged {
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
      class="merge2048-screen"
      data-game="2048"
    >

      <div class="merge2048-header">
        <div>
          <p class="eyebrow">Game</p>
          <h3>2048</h3>
        </div>

        <div class="merge2048-badges">
          <div class="merge2048-score-box">
            <span class="merge2048-score-label">Score</span>
            <strong
              class="merge2048-score-value"
              data-score
            >0</strong>
          </div>

          <div class="merge2048-score-box">
            <span class="merge2048-score-label">Best</span>
            <strong
              class="merge2048-score-value"
              data-best
            >0</strong>
          </div>
        </div>
      </div>

      <div class="merge2048-game-wrap">

        <div
          class="merge2048-board"
          data-board
          aria-label="2048 game board"
        >
          <div
            class="merge2048-tile-layer"
            data-tile-layer
          ></div>
        </div>

        <div
          class="merge2048-overlay"
          data-overlay
          aria-live="polite"
        >
          <div class="merge2048-overlay-card">

            <div
              class="merge2048-overlay-icon"
              data-overlay-icon
            >🎉</div>

            <h4 data-overlay-title>
              You Win!
            </h4>

            <p data-overlay-message>
              You reached 2048!
            </p>

            <div class="merge2048-overlay-stats">
              <div class="merge2048-overlay-stat">
                <span>Score</span>
                <strong data-final-score>0</strong>
              </div>

              <div class="merge2048-overlay-stat">
                <span>Best</span>
                <strong data-final-best>0</strong>
              </div>
            </div>

            <button
              type="button"
              class="merge2048-overlay-button"
              data-overlay-restart
            >
              New Game
            </button>

          </div>
        </div>

      </div>

      <div
        class="merge2048-message"
        data-message
        aria-live="polite"
      >
        Swipe or use the arrow keys
      </div>

      <div class="merge2048-controls">
        <button
          type="button"
          class="merge2048-control"
          data-up
          aria-label="Move up"
        >▲ UP</button>

        <button
          type="button"
          class="merge2048-control"
          data-down
          aria-label="Move down"
        >▼ DOWN</button>

        <button
          type="button"
          class="merge2048-control"
          data-left
          aria-label="Move left"
        >◀ LEFT</button>

        <button
          type="button"
          class="merge2048-control"
          data-right
          aria-label="Move right"
        >RIGHT ▶</button>
      </div>

      <button
        type="button"
        class="merge2048-new-game"
        data-reset
      >
        New Game
      </button>

      <div class="merge2048-footer">
        <span>
          Combine matching tiles to reach
          <strong>2048</strong>
        </span>

        <span data-tile-count>
          0 tiles
        </span>
      </div>

    </section>
  `;

  /* ============================================================
     ELEMENTS
     ============================================================ */

  const board =
    root.querySelector("[data-board]");

  const tileLayer =
    root.querySelector("[data-tile-layer]");

  const scoreElement =
    root.querySelector("[data-score]");

  const bestElement =
    root.querySelector("[data-best]");

  const messageElement =
    root.querySelector("[data-message]");

  const tileCountElement =
    root.querySelector("[data-tile-count]");

  const resetButton =
    root.querySelector("[data-reset]");

  const overlay =
    root.querySelector("[data-overlay]");

  const overlayIcon =
    root.querySelector("[data-overlay-icon]");

  const overlayTitle =
    root.querySelector("[data-overlay-title]");

  const overlayMessage =
    root.querySelector("[data-overlay-message]");

  const finalScore =
    root.querySelector("[data-final-score]");

  const finalBest =
    root.querySelector("[data-final-best]");

  const overlayRestart =
    root.querySelector("[data-overlay-restart]");

  const upButton =
    root.querySelector("[data-up]");

  const downButton =
    root.querySelector("[data-down]");

  const leftButton =
    root.querySelector("[data-left]");

  const rightButton =
    root.querySelector("[data-right]");

  /* ============================================================
     APP SCORE ELEMENTS
     ============================================================ */

  const appScore =
    document.querySelector("#score-value-left");

  const appBest =
    document.querySelector("#score-value-center");

  const appStatus =
    document.querySelector("#score-value-right");

  const appScoreLabel =
    document.querySelector("#score-label-left");

  const appBestLabel =
    document.querySelector("#score-label-center");

  const appStatusLabel =
    document.querySelector("#score-label-right");

  /* ============================================================
     CONSTANTS
     ============================================================ */

  const SIZE = 4;
  const BEST_SCORE_KEY = "miniArcade.2048.best";
  const WIN_VALUE = 2048;

  /* ============================================================
     STATE
     ============================================================ */

  let boardState = [];
  let score = 0;
  let bestScore = readBestScore();

  let gameOver = false;
  let won = false;
  let destroyed = false;

  let animationTimer = null;

  let touchStartX = 0;
  let touchStartY = 0;
  let touchActive = false;

  let lastMoveTime = 0;

  /* ============================================================
     STORAGE
     ============================================================ */

  function readBestScore() {
    try {
      const value = Number(
        localStorage.getItem(BEST_SCORE_KEY)
      );

      return Number.isFinite(value)
        ? Math.max(0, value)
        : 0;
    } catch {
      return 0;
    }
  }

  function saveBestScore() {
    try {
      localStorage.setItem(
        BEST_SCORE_KEY,
        String(bestScore)
      );
    } catch {
      // Storage is optional.
    }
  }

  /* ============================================================
     HELPERS
     ============================================================ */

  function createEmptyBoard() {
    return Array.from(
      { length: SIZE },
      () => Array(SIZE).fill(0)
    );
  }

  function randomEmptyCell() {
    const empty = [];

    for (let row = 0; row < SIZE; row++) {
      for (let col = 0; col < SIZE; col++) {
        if (boardState[row][col] === 0) {
          empty.push({ row, col });
        }
      }
    }

    if (!empty.length) {
      return null;
    }

    return empty[
      Math.floor(Math.random() * empty.length)
    ];
  }

  function addRandomTile() {
    const cell = randomEmptyCell();

    if (!cell) {
      return false;
    }

    boardState[cell.row][cell.col] =
      Math.random() < 0.9 ? 2 : 4;

    return true;
  }

  function countTiles() {
    let count = 0;

    for (let row = 0; row < SIZE; row++) {
      for (let col = 0; col < SIZE; col++) {
        if (boardState[row][col] !== 0) {
          count++;
        }
      }
    }

    return count;
  }

  /* ============================================================
     UI
     ============================================================ */

  function updateScoreUI() {
    const tiles = countTiles();

    scoreElement.textContent = String(score);
    bestElement.textContent = String(bestScore);

    if (appScore) {
      appScore.textContent = String(score);
    }

    if (appBest) {
      appBest.textContent = String(bestScore);
    }

    if (appStatus) {
      appStatus.textContent = `${tiles}/16`;
    }

    if (appScoreLabel) {
      appScoreLabel.textContent = "Score";
    }

    if (appBestLabel) {
      appBestLabel.textContent = "Best";
    }

    if (appStatusLabel) {
      appStatusLabel.textContent = "Tiles";
    }

    tileCountElement.textContent =
      `${tiles} ${tiles === 1 ? "tile" : "tiles"}`;
  }

  function setMessage(text) {
    messageElement.textContent = text;
  }

  /* ============================================================
     TILE GEOMETRY
     ============================================================ */

  function getTilePosition(row, col) {
    const boardRect =
      board.getBoundingClientRect();

    if (!boardRect.width) {
      return {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      };
    }

    const gap =
      parseFloat(
        getComputedStyle(board).gap
      ) || 0;

    const size =
      (boardRect.width - gap * 3) / SIZE;

    return {
      x: col * (size + gap),
      y: row * (size + gap),
      width: size,
      height: size
    };
  }

  /* ============================================================
     BOARD DOM
     ============================================================ */

  function buildBoardCells() {
    board
      .querySelectorAll(".merge2048-cell")
      .forEach((cell) => cell.remove());

    for (let row = 0; row < SIZE; row++) {
      for (let col = 0; col < SIZE; col++) {
        const cell =
          document.createElement("div");

        cell.className = "merge2048-cell";
        cell.dataset.row = String(row);
        cell.dataset.col = String(col);

        board.insertBefore(cell, tileLayer);
      }
    }
  }

  function getTileFontSize(value) {
    const digits = String(value).length;

    if (digits <= 2) {
      return "clamp(1.4rem, 8vw, 2.7rem)";
    }

    if (digits === 3) {
      return "clamp(1.15rem, 6.5vw, 2.2rem)";
    }

    if (digits === 4) {
      return "clamp(0.9rem, 5.5vw, 1.8rem)";
    }

    return "clamp(0.78rem, 4.7vw, 1.45rem)";
  }

  function renderTiles(animateNew = false) {
    tileLayer.replaceChildren();

    for (let row = 0; row < SIZE; row++) {
      for (let col = 0; col < SIZE; col++) {
        const value = boardState[row][col];

        if (!value) {
          continue;
        }

        const tile =
          document.createElement("div");

        tile.className = "merge2048-tile";
        tile.dataset.value = String(value);
        tile.textContent = String(value);

        const position =
          getTilePosition(row, col);

        tile.style.left = `${position.x}px`;
        tile.style.top = `${position.y}px`;
        tile.style.width = `${position.width}px`;
        tile.style.height = `${position.height}px`;
        tile.style.fontSize =
          getTileFontSize(value);

        if (animateNew) {
          tile.classList.add("is-new");
        }

        tileLayer.append(tile);
      }
    }

    updateScoreUI();
  }

  /* ============================================================
     MOVEMENT
     ============================================================ */

  function slideLine(line) {
    const filtered =
      line.filter((value) => value !== 0);

    const result = [];
    let gained = 0;

    for (let i = 0; i < filtered.length; i++) {
      if (filtered[i] === filtered[i + 1]) {
        const merged = filtered[i] * 2;

        result.push(merged);
        gained += merged;

        i++;
      } else {
        result.push(filtered[i]);
      }
    }

    while (result.length < SIZE) {
      result.push(0);
    }

    return {
      line: result,
      gained
    };
  }

  function moveLeft() {
    let changed = false;
    let gained = 0;

    for (let row = 0; row < SIZE; row++) {
      const original = [...boardState[row]];
      const result = slideLine(original);

      boardState[row] = result.line;
      gained += result.gained;

      if (
        original.some(
          (value, index) =>
            value !== result.line[index]
        )
      ) {
        changed = true;
      }
    }

    return { changed, gained };
  }

  function moveRight() {
    let changed = false;
    let gained = 0;

    for (let row = 0; row < SIZE; row++) {
      const original = [...boardState[row]];
      const result =
        slideLine([...original].reverse());

      const line =
        [...result.line].reverse();

      boardState[row] = line;
      gained += result.gained;

      if (
        original.some(
          (value, index) =>
            value !== line[index]
        )
      ) {
        changed = true;
      }
    }

    return { changed, gained };
  }

  function moveUp() {
    let changed = false;
    let gained = 0;

    for (let col = 0; col < SIZE; col++) {
      const original = [];

      for (let row = 0; row < SIZE; row++) {
        original.push(boardState[row][col]);
      }

      const result = slideLine(original);

      for (let row = 0; row < SIZE; row++) {
        boardState[row][col] =
          result.line[row];
      }

      gained += result.gained;

      if (
        original.some(
          (value, index) =>
            value !== result.line[index]
        )
      ) {
        changed = true;
      }
    }

    return { changed, gained };
  }

  function moveDown() {
    let changed = false;
    let gained = 0;

    for (let col = 0; col < SIZE; col++) {
      const original = [];

      for (let row = 0; row < SIZE; row++) {
        original.push(boardState[row][col]);
      }

      const result =
        slideLine([...original].reverse());

      const line =
        [...result.line].reverse();

      for (let row = 0; row < SIZE; row++) {
        boardState[row][col] = line[row];
      }

      gained += result.gained;

      if (
        original.some(
          (value, index) =>
            value !== line[index]
        )
      ) {
        changed = true;
      }
    }

    return { changed, gained };
  }

  /* ============================================================
     GAME STATE
     ============================================================ */

  function hasMovesAvailable() {
    for (let row = 0; row < SIZE; row++) {
      for (let col = 0; col < SIZE; col++) {
        if (boardState[row][col] === 0) {
          return true;
        }

        if (
          col < SIZE - 1 &&
          boardState[row][col] ===
            boardState[row][col + 1]
        ) {
          return true;
        }

        if (
          row < SIZE - 1 &&
          boardState[row][col] ===
            boardState[row + 1][col]
        ) {
          return true;
        }
      }
    }

    return false;
  }

  function hasWon() {
    for (let row = 0; row < SIZE; row++) {
      for (let col = 0; col < SIZE; col++) {
        if (
          boardState[row][col] >= WIN_VALUE
        ) {
          return true;
        }
      }
    }

    return false;
  }

  /* ============================================================
     OVERLAY
     ============================================================ */

  function hideOverlay() {
    overlay.classList.remove("is-visible");
  }

  function showOverlay(type) {
    if (type === "win") {
      overlayIcon.textContent = "🏆";
      overlayTitle.textContent = "You Win!";
      overlayMessage.textContent =
        "You reached 2048!";
    } else {
      overlayIcon.textContent = "😵";
      overlayTitle.textContent = "Game Over";
      overlayMessage.textContent =
        "No more moves. Try another run!";
    }

    finalScore.textContent = String(score);
    finalBest.textContent = String(bestScore);

    overlay.classList.add("is-visible");
  }

  /* ============================================================
     SCORE
     ============================================================ */

  function addScore(amount) {
    score += amount;

    if (score > bestScore) {
      bestScore = score;
      saveBestScore();
    }
  }

  /* ============================================================
     MOVE
     ============================================================ */

  function performMove(direction) {
    if (
      destroyed ||
      gameOver ||
      won
    ) {
      return;
    }

    const now = performance.now();

    if (now - lastMoveTime < 70) {
      return;
    }

    lastMoveTime = now;

    let result;

    if (direction === "left") {
      result = moveLeft();
    } else if (direction === "right") {
      result = moveRight();
    } else if (direction === "up") {
      result = moveUp();
    } else if (direction === "down") {
      result = moveDown();
    } else {
      return;
    }

    if (!result.changed) {
      playTone(180);
      return;
    }

    addScore(result.gained);
    addRandomTile();

    renderTiles(true);

    if (result.gained > 0) {
      playTone(
        Math.min(
          900,
          300 +
            Math.log2(result.gained) * 80
        )
      );

      vibrate(10);
    } else {
      playTone(240);
    }

    if (hasWon()) {
      won = true;

      setMessage("You reached 2048!");
      showOverlay("win");

      vibrate([30, 40, 70]);

      return;
    }

    if (!hasMovesAvailable()) {
      gameOver = true;

      setMessage(
        "Game over — no more moves"
      );

      showOverlay("gameover");
      vibrate(100);

      return;
    }

    setMessage("Keep merging!");
  }

  /* ============================================================
     NEW GAME
     ============================================================ */

  function startGame() {
    if (destroyed) {
      return;
    }

    if (animationTimer) {
      clearTimeout(animationTimer);
      animationTimer = null;
    }

    boardState = createEmptyBoard();

    score = 0;
    gameOver = false;
    won = false;
    lastMoveTime = 0;

    hideOverlay();

    addRandomTile();
    addRandomTile();

    buildBoardCells();
    renderTiles(true);

    setMessage(
      "Swipe or use the arrow keys"
    );

    updateScoreUI();
  }

  /* ============================================================
     KEYBOARD
     ============================================================ */

  function handleKeyDown(event) {
    if (destroyed) {
      return;
    }

    const key =
      String(event.key).toLowerCase();

    let direction = null;

    if (key === "arrowleft") {
      direction = "left";
    } else if (key === "arrowright") {
      direction = "right";
    } else if (key === "arrowup") {
      direction = "up";
    } else if (key === "arrowdown") {
      direction = "down";
    }

    if (!direction) {
      return;
    }

    event.preventDefault();
    performMove(direction);
  }

  /* ============================================================
     TOUCH / SWIPE
     ============================================================ */

  function handlePointerDown(event) {
    if (destroyed) {
      return;
    }

    touchActive = true;

    touchStartX = event.clientX;
    touchStartY = event.clientY;

    try {
      board.setPointerCapture(
        event.pointerId
      );
    } catch {
      // Pointer capture is optional.
    }
  }

  function handlePointerUp(event) {
    if (
      destroyed ||
      !touchActive
    ) {
      return;
    }

    touchActive = false;

    const deltaX =
      event.clientX - touchStartX;

    const deltaY =
      event.clientY - touchStartY;

    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    const SWIPE_THRESHOLD = 28;

    if (
      Math.max(absX, absY) <
      SWIPE_THRESHOLD
    ) {
      return;
    }

    if (absX > absY) {
      performMove(
        deltaX > 0 ? "right" : "left"
      );
    } else {
      performMove(
        deltaY > 0 ? "down" : "up"
      );
    }
  }

  function handlePointerCancel(event) {
    if (destroyed) {
      return;
    }

    touchActive = false;

    try {
      board.releasePointerCapture(
        event.pointerId
      );
    } catch {
      // Pointer capture is optional.
    }
  }

  /* ============================================================
     BUTTON CONTROLS
     ============================================================ */

  function handleUpClick() {
    performMove("up");
  }

  function handleDownClick() {
    performMove("down");
  }

  function handleLeftClick() {
    performMove("left");
  }

  function handleRightClick() {
    performMove("right");
  }

  /* ============================================================
     EVENTS
     ============================================================ */

  upButton.addEventListener(
    "click",
    handleUpClick
  );

  downButton.addEventListener(
    "click",
    handleDownClick
  );

  leftButton.addEventListener(
    "click",
    handleLeftClick
  );

  rightButton.addEventListener(
    "click",
    handleRightClick
  );

  board.addEventListener(
    "pointerdown",
    handlePointerDown
  );

  board.addEventListener(
    "pointerup",
    handlePointerUp
  );

  board.addEventListener(
    "pointercancel",
    handlePointerCancel
  );

  resetButton.addEventListener(
    "click",
    startGame
  );

  overlayRestart.addEventListener(
    "click",
    startGame
  );

  function handleResize() {
    if (destroyed) {
      return;
    }
    renderTiles(false);
  }

  window.addEventListener(
    "resize",
    handleResize
  );

  window.addEventListener(
    "keydown",
    handleKeyDown
  );

  /* ============================================================
     PUBLIC API
     ============================================================ */

  function reset() {
    startGame();
  }

  /* ============================================================
     CLEANUP
     ============================================================ */

  function destroy() {
    if (destroyed) {
      return;
    }

    destroyed = true;

    if (animationTimer) {
      clearTimeout(animationTimer);
      animationTimer = null;
    }

    window.removeEventListener(
      "resize",
      handleResize
    );

    window.removeEventListener(
      "keydown",
      handleKeyDown
    );

    upButton.removeEventListener(
      "click",
      handleUpClick
    );

    downButton.removeEventListener(
      "click",
      handleDownClick
    );

    leftButton.removeEventListener(
      "click",
      handleLeftClick
    );

    rightButton.removeEventListener(
      "click",
      handleRightClick
    );

    resetButton.removeEventListener(
      "click",
      startGame
    );

    overlayRestart.removeEventListener(
      "click",
      startGame
    );

    board.removeEventListener(
      "pointerdown",
      handlePointerDown
    );

    board.removeEventListener(
      "pointerup",
      handlePointerUp
    );

    board.removeEventListener(
      "pointercancel",
      handlePointerCancel
    );

    touchActive = false;
    boardState = [];

    tileLayer.replaceChildren();
  }

  /* ============================================================
     START
     ============================================================ */

  buildBoardCells();
  startGame();

  return {
    reset,
    destroy
  };
}
