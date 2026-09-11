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
        max-width: 620px;
        margin: 0 auto;
        padding: 8px 0 24px;

        color: inherit;

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
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 14px;
      }

      .merge2048-header h3 {
        margin: 2px 0 0;

        font-size:
          clamp(1.45rem, 5vw, 1.9rem);

        line-height: 1.1;
      }

      .merge2048-header .eyebrow {
        margin: 0;
      }

      .merge2048-badges {
        display: flex;
        gap: 7px;
      }

      .merge2048-score-box {
        min-width: 70px;
        padding: 7px 10px;

        text-align: center;

        border-radius: 12px;

        background:
          rgba(245,158,11,0.10);

        border:
          1px solid rgba(245,158,11,0.24);
      }

      .merge2048-score-label {
        display: block;

        font-size: 0.58rem;
        font-weight: 900;

        letter-spacing: 0.08em;
        text-transform: uppercase;

        opacity: 0.58;
      }

      .merge2048-score-value {
        display: block;

        margin-top: 2px;

        font-size: 1rem;
        font-weight: 950;
      }

      /* ========================================================
         GAME
         ======================================================== */

      .merge2048-game-wrap {
        position: relative;

        width: 100%;
        max-width: 520px;

        margin: 0 auto;

        padding: 11px;

        border-radius: 25px;

        background:
          linear-gradient(
            145deg,
            #b88752,
            #9a693b
          );

        border:
          2px solid
          rgba(255,255,255,0.10);

        box-shadow:
          0 22px 55px rgba(0,0,0,0.22),
          inset 0 1px 0
          rgba(255,255,255,0.16);

        touch-action: none;
      }

      .merge2048-board {
        position: relative;

        display: grid;

        grid-template-columns:
          repeat(4, 1fr);

        gap: 9px;

        width: 100%;

        aspect-ratio: 1 / 1;

        padding: 0;

        border-radius: 16px;

        background:
          rgba(110,72,38,0.55);

        touch-action: none;
      }

      .merge2048-cell {
        position: relative;

        min-width: 0;

        border-radius: 12px;

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

        border-radius: 12px;

        font-weight: 950;

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
          0 0 18px
          rgba(237,207,114,0.30);
      }

      .merge2048-tile[data-value="256"] {
        background: #edcc61;
        color: #f9f6f2;

        box-shadow:
          0 0 20px
          rgba(237,204,97,0.34);
      }

      .merge2048-tile[data-value="512"] {
        background: #edc850;
        color: #f9f6f2;

        box-shadow:
          0 0 22px
          rgba(237,200,80,0.38);
      }

      .merge2048-tile[data-value="1024"] {
        background: #edc53f;
        color: #f9f6f2;

        box-shadow:
          0 0 25px
          rgba(237,197,63,0.42);
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
          0 0 30px
          rgba(249,217,118,0.60);
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
          0 0 30px
          rgba(124,58,237,0.50);
      }

      /* ========================================================
         MESSAGE
         ======================================================== */

      .merge2048-message {
        min-height: 24px;

        margin: 11px 0 0;

        text-align: center;

        font-size: 0.84rem;
        font-weight: 750;

        opacity: 0.72;
      }

      /* ========================================================
         CONTROLS
         ======================================================== */

      .merge2048-controls {
        display: grid;

        grid-template-columns:
          repeat(2, 1fr);

        gap: 9px;

        width: 100%;

        margin-top: 12px;
      }

      .merge2048-control {
        appearance: none;

        border:
          1px solid
          rgba(245,158,11,0.24);

        min-height: 45px;

        border-radius: 14px;

        background:
          rgba(245,158,11,0.08);

        color: inherit;

        font: inherit;
        font-weight: 900;

        cursor: pointer;

        touch-action: manipulation;

        transition:
          transform 120ms ease,
          background 120ms ease;
      }

      .merge2048-control:active {
        transform: scale(0.97);

        background:
          rgba(245,158,11,0.18);
      }

      .merge2048-new-game {
        appearance: none;

        border: 0;

        width: 100%;

        min-height: 46px;

        margin-top: 10px;

        border-radius: 999px;

        background:
          var(--merge2048-accent);

        color: #fff;

        font: inherit;
        font-weight: 900;

        cursor: pointer;

        box-shadow:
          0 8px 22px
          rgba(245,158,11,0.24);

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
        inset: 11px;

        display: flex;
        align-items: center;
        justify-content: center;

        padding: 20px;

        border-radius: 16px;

        background:
          rgba(20,14,8,0.78);

        backdrop-filter:
          blur(5px);

        -webkit-backdrop-filter:
          blur(5px);

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
        width: min(100%, 310px);

        padding: 24px 18px;

        text-align: center;

        border-radius: 22px;

        background:
          rgba(255,255,255,0.09);

        border:
          1px solid
          rgba(255,255,255,0.14);

        color: #fff;

        box-shadow:
          0 22px 60px
          rgba(0,0,0,0.30);
      }

      .merge2048-overlay-icon {
        font-size: 3.2rem;
        line-height: 1;

        margin-bottom: 9px;
      }

      .merge2048-overlay-card h4 {
        margin: 0 0 6px;

        font-size: 1.65rem;
      }

      .merge2048-overlay-card p {
        margin: 0 0 16px;

        font-size: 0.85rem;

        opacity: 0.72;
      }

      .merge2048-overlay-stats {
        display: grid;

        grid-template-columns:
          repeat(2, 1fr);

        gap: 8px;

        margin-bottom: 17px;
      }

      .merge2048-overlay-stat {
        padding: 9px;

        border-radius: 12px;

        background:
          rgba(255,255,255,0.07);

        border:
          1px solid
          rgba(255,255,255,0.08);
      }

      .merge2048-overlay-stat span {
        display: block;

        font-size: 0.60rem;

        font-weight: 800;

        letter-spacing: 0.08em;

        text-transform: uppercase;

        opacity: 0.58;
      }

      .merge2048-overlay-stat strong {
        display: block;

        margin-top: 3px;

        font-size: 1.1rem;
      }

      .merge2048-overlay-button {
        appearance: none;

        border: 0;

        min-height: 44px;

        padding: 10px 23px;

        border-radius: 999px;

        background:
          var(--merge2048-accent);

        color: #fff;

        font: inherit;
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

        gap: 10px;

        margin-top: 10px;

        font-size: 0.75rem;

        opacity: 0.58;
      }

      .merge2048-footer strong {
        color:
          var(--merge2048-accent);

        opacity: 1;
      }

      /* ========================================================
         SMALL SCREENS
         ======================================================== */

      @media (max-width: 430px) {
        .merge2048-screen {
          padding-left: 2px;
          padding-right: 2px;
        }

        .merge2048-game-wrap {
          padding: 9px;

          border-radius: 21px;
        }

        .merge2048-board {
          gap: 7px;

          border-radius: 14px;
        }

        .merge2048-cell,
        .merge2048-tile {
          border-radius: 9px;
        }

        .merge2048-score-box {
          min-width: 61px;

          padding:
            6px 8px;
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
            <span class="merge2048-score-label">
              Score
            </span>

            <strong
              class="merge2048-score-value"
              data-score
            >0</strong>
          </div>

          <div class="merge2048-score-box">
            <span class="merge2048-score-label">
              Best
            </span>

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
        >
          ▲ UP
        </button>

        <button
          type="button"
          class="merge2048-control"
          data-down
          aria-label="Move down"
        >
          ▼ DOWN
        </button>

        <button
          type="button"
          class="merge2048-control"
          data-left
          aria-label="Move left"
        >
          ◀ LEFT
        </button>

        <button
          type="button"
          class="merge2048-control"
          data-right
          aria-label="Move right"
        >
          RIGHT ▶
        </button>

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

  const BEST_SCORE_KEY =
    "miniArcade.2048.best";

  const WIN_VALUE = 2048;

  const ANIMATION_TIME = 130;

  /* ============================================================
     STATE
     ============================================================ */

  let boardState = [];

  let score = 0;

  let bestScore =
    readBestScore();

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
      const value =
        Number(
          localStorage.getItem(
            BEST_SCORE_KEY
          )
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
      {
        length: SIZE
      },
      () =>
        Array(SIZE).fill(0)
    );
  }

  function cloneBoard(source) {
    return source.map(
      (row) => [...row]
    );
  }

  function randomEmptyCell() {
    const empty = [];

    for (
      let row = 0;
      row < SIZE;
      row++
    ) {
      for (
        let col = 0;
        col < SIZE;
        col++
      ) {
        if (
          boardState[row][col] === 0
        ) {
          empty.push({
            row,
            col
          });
        }
      }
    }

    if (!empty.length) {
      return null;
    }

    return empty[
      Math.floor(
        Math.random() *
        empty.length
      )
    ];
  }

  function addRandomTile() {
    const cell =
      randomEmptyCell();

    if (!cell) {
      return false;
    }

    boardState[cell.row][cell.col] =
      Math.random() < 0.9
        ? 2
        : 4;

    return true;
  }

  function countTiles() {
    let count = 0;

    for (
      let row = 0;
      row < SIZE;
      row++
    ) {
      for (
        let col = 0;
        col < SIZE;
        col++
      ) {
        if (
          boardState[row][col] !== 0
        ) {
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
    scoreElement.textContent =
      String(score);

    bestElement.textContent =
      String(bestScore);

    if (appScore) {
      appScore.textContent =
        String(score);
    }

    if (appBest) {
      appBest.textContent =
        String(bestScore);
    }

    if (appStatus) {
      appStatus.textContent =
        `${countTiles()}/16`;
    }

    if (appScoreLabel) {
      appScoreLabel.textContent =
        "Score";
    }

    if (appBestLabel) {
      appBestLabel.textContent =
        "Best";
    }

    if (appStatusLabel) {
      appStatusLabel.textContent =
        "Tiles";
    }

    tileCountElement.textContent =
      `${countTiles()} ${
        countTiles() === 1
          ? "tile"
          : "tiles"
      }`;
  }

  function setMessage(text) {
    messageElement.textContent =
      text;
  }

  /* ============================================================
     TILE GEOMETRY
     ============================================================ */

  function getTilePosition(
    row,
    col
  ) {
    const cell =
      board.querySelector(
        ".merge2048-cell"
      );

    const boardRect =
      board.getBoundingClientRect();

    if (!cell || !boardRect.width) {
      return {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      };
    }

    const gap =
      parseFloat(
        getComputedStyle(board)
          .gap
      ) || 0;

    const size =
      (
        boardRect.width -
        gap * 3
      ) / 4;

    return {
      x:
        col *
        (size + gap),

      y:
        row *
        (size + gap),

      width: size,

      height: size
    };
  }

  /* ============================================================
     BOARD DOM
     ============================================================ */

  function buildBoardCells() {
    const existingCells =
      board.querySelectorAll(
        ".merge2048-cell"
      );

    existingCells.forEach(
      (cell) => cell.remove()
    );

    for (
      let row = 0;
      row < SIZE;
      row++
    ) {
      for (
        let col = 0;
        col < SIZE;
        col++
      ) {
        const cell =
          document.createElement(
            "div"
          );

        cell.className =
          "merge2048-cell";

        cell.dataset.row =
          String(row);

        cell.dataset.col =
          String(col);

        board.insertBefore(
          cell,
          tileLayer
        );
      }
    }
  }

  function getTileFontSize(
    value
  ) {
    const digits =
      String(value).length;

    if (digits <= 2) {
      return "clamp(1.65rem, 9vw, 3rem)";
    }

    if (digits === 3) {
      return "clamp(1.35rem, 7vw, 2.5rem)";
    }

    if (digits === 4) {
      return "clamp(1.05rem, 6vw, 2rem)";
    }

    return "clamp(0.9rem, 5vw, 1.65rem)";
  }

  function renderTiles(
    animateNew = false
  ) {
    tileLayer.replaceChildren();

    for (
      let row = 0;
      row < SIZE;
      row++
    ) {
      for (
        let col = 0;
        col < SIZE;
        col++
      ) {
        const value =
          boardState[row][col];

        if (!value) {
          continue;
        }

        const tile =
          document.createElement(
            "div"
          );

        tile.className =
          "merge2048-tile";

        tile.dataset.value =
          String(value);

        tile.textContent =
          String(value);

        const position =
          getTilePosition(
            row,
            col
          );

        tile.style.left =
          `${position.x}px`;

        tile.style.top =
          `${position.y}px`;

        tile.style.width =
          `${position.width}px`;

        tile.style.height =
          `${position.height}px`;

        tile.style.fontSize =
          getTileFontSize(value);

        if (animateNew) {
          tile.classList.add(
            "is-new"
          );
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
      line.filter(
        (value) => value !== 0
      );

    const result = [];

    let gained = 0;

    for (
      let i = 0;
      i < filtered.length;
      i++
    ) {
      if (
        filtered[i] ===
        filtered[i + 1]
      ) {
        const merged =
          filtered[i] * 2;

        result.push(merged);

        gained += merged;

        i++;
      } else {
        result.push(
          filtered[i]
        );
      }
    }

    while (
      result.length < SIZE
    ) {
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

    for (
      let row = 0;
      row < SIZE;
      row++
    ) {
      const original =
        [...boardState[row]];

      const result =
        slideLine(original);

      boardState[row] =
        result.line;

      gained +=
        result.gained;

      if (
        original.some(
          (value, index) =>
            value !==
            result.line[index]
        )
      ) {
        changed = true;
      }
    }

    return {
      changed,
      gained
    };
  }

  function moveRight() {
    let changed = false;
    let gained = 0;

    for (
      let row = 0;
      row < SIZE;
      row++
    ) {
      const original =
        [...boardState[row]];

      const reversed =
        [...original].reverse();

      const result =
        slideLine(reversed);

      const line =
        [...result.line].reverse();

      boardState[row] =
        line;

      gained +=
        result.gained;

      if (
        original.some(
          (value, index) =>
            value !==
            line[index]
        )
      ) {
        changed = true;
      }
    }

    return {
      changed,
      gained
    };
  }

  function moveUp() {
    let changed = false;
    let gained = 0;

    for (
      let col = 0;
      col < SIZE;
      col++
    ) {
      const original = [];

      for (
        let row = 0;
        row < SIZE;
        row++
      ) {
        original.push(
          boardState[row][col]
        );
      }

      const result =
        slideLine(original);

      for (
        let row = 0;
        row < SIZE;
        row++
      ) {
        boardState[row][col] =
          result.line[row];
      }

      gained +=
        result.gained;

      if (
        original.some(
          (value, index) =>
            value !==
            result.line[index]
        )
      ) {
        changed = true;
      }
    }

    return {
      changed,
      gained
    };
  }

  function moveDown() {
    let changed = false;
    let gained = 0;

    for (
      let col = 0;
      col < SIZE;
      col++
    ) {
      const original = [];

      for (
        let row = 0;
        row < SIZE;
        row++
      ) {
        original.push(
          boardState[row][col]
        );
      }

      const reversed =
        [...original].reverse();

      const result =
        slideLine(reversed);

      const line =
        [...result.line].reverse();

      for (
        let row = 0;
        row < SIZE;
        row++
      ) {
        boardState[row][col] =
          line[row];
      }

      gained +=
        result.gained;

      if (
        original.some(
          (value, index) =>
            value !==
            line[index]
        )
      ) {
        changed = true;
      }
    }

    return {
      changed,
      gained
    };
  }

  /* ============================================================
     GAME STATE
     ============================================================ */

  function hasMovesAvailable() {
    for (
      let row = 0;
      row < SIZE;
      row++
    ) {
      for (
        let col = 0;
        col < SIZE;
        col++
      ) {
        if (
          boardState[row][col] === 0
        ) {
          return true;
        }

        if (
          col <
            SIZE - 1 &&
          boardState[row][col] ===
            boardState[row][col + 1]
        ) {
          return true;
        }

        if (
          row <
            SIZE - 1 &&
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
    for (
      let row = 0;
      row < SIZE;
      row++
    ) {
      for (
        let col = 0;
        col < SIZE;
        col++
      ) {
        if (
          boardState[row][col] >=
          WIN_VALUE
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
    overlay.classList.remove(
      "is-visible"
    );
  }

  function showOverlay(
    type
  ) {
    if (type === "win") {
      overlayIcon.textContent =
        "🏆";

      overlayTitle.textContent =
        "You Win!";

      overlayMessage.textContent =
        "You reached 2048!";
    } else {
      overlayIcon.textContent =
        "😵";

      overlayTitle.textContent =
        "Game Over";

      overlayMessage.textContent =
        "No more moves. Try another run!";
    }

    finalScore.textContent =
      String(score);

    finalBest.textContent =
      String(bestScore);

    overlay.classList.add(
      "is-visible"
    );
  }

  /* ============================================================
     SCORE
     ============================================================ */

  function addScore(amount) {
    score += amount;

    if (
      score > bestScore
    ) {
      bestScore = score;

      saveBestScore();
    }
  }

  /* ============================================================
     MOVE
     ============================================================ */

  function performMove(
    direction
  ) {
    if (
      destroyed ||
      gameOver ||
      won
    ) {
      return;
    }

    const now =
      performance.now();

    if (
      now - lastMoveTime <
      70
    ) {
      return;
    }

    lastMoveTime = now;

    let result;

    if (direction === "left") {
      result = moveLeft();
    } else if (
      direction === "right"
    ) {
      result = moveRight();
    } else if (
      direction === "up"
    ) {
      result = moveUp();
    } else if (
      direction === "down"
    ) {
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

    if (
      result.gained > 0
    ) {
      playTone(
        Math.min(
          900,
          300 +
            Math.log2(
              result.gained
            ) * 80
        )
      );

      vibrate(10);
    } else {
      playTone(240);
    }

    if (
      hasWon()
    ) {
      won = true;

      setMessage(
        "You reached 2048!"
      );

      showOverlay("win");

      vibrate([
        30,
        40,
        70
      ]);

      return;
    }

    if (
      !hasMovesAvailable()
    ) {
      gameOver = true;

      setMessage(
        "Game over — no more moves"
      );

      showOverlay("gameover");

      vibrate(100);

      return;
    }

    setMessage(
      "Keep merging!"
    );
  }

  /* ============================================================
     NEW GAME
     ============================================================ */

  function startGame() {
    if (destroyed) {
      return;
    }

    if (animationTimer) {
      clearTimeout(
        animationTimer
      );

      animationTimer = null;
    }

    boardState =
      createEmptyBoard();

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

  function handleKeyDown(
    event
  ) {
    if (destroyed) {
      return;
    }

    const key =
      String(
        event.key
      ).toLowerCase();

    let direction = null;

    if (
      key === "arrowleft"
    ) {
      direction = "left";
    } else if (
      key === "arrowright"
    ) {
      direction = "right";
    } else if (
      key === "arrowup"
    ) {
      direction = "up";
    } else if (
      key === "arrowdown"
    ) {
      direction = "down";
    }

    if (!direction) {
      return;
    }

    event.preventDefault();

    performMove(
      direction
    );
  }

  /* ============================================================
     TOUCH / SWIPE
     ============================================================ */

  function handlePointerDown(
    event
  ) {
    if (destroyed) {
      return;
    }

    touchActive = true;

    touchStartX =
      event.clientX;

    touchStartY =
      event.clientY;

    try {
      board.setPointerCapture(
        event.pointerId
      );
    } catch {
      // Pointer capture is optional.
    }
  }

  function handlePointerUp(
    event
  ) {
    if (
      destroyed ||
      !touchActive
    ) {
      return;
    }

    touchActive = false;

    const deltaX =
      event.clientX -
      touchStartX;

    const deltaY =
      event.clientY -
      touchStartY;

    const absX =
      Math.abs(deltaX);

    const absY =
      Math.abs(deltaY);

    const SWIPE_THRESHOLD = 28;

    if (
      Math.max(absX, absY) <
      SWIPE_THRESHOLD
    ) {
      return;
    }

    if (absX > absY) {
      performMove(
        deltaX > 0
          ? "right"
          : "left"
      );
    } else {
      performMove(
        deltaY > 0
          ? "down"
          : "up"
      );
    }
  }

  function handlePointerCancel(
    event
  ) {
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
      clearTimeout(
        animationTimer
      );

      animationTimer = null;
    }

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

