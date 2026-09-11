export default function initDodge(root, options = {}) {
  const {
    playTone = () => {},
    vibrate = () => {}
  } = options;

  /* ============================================================
     LOCAL STYLES
     ============================================================ */

  const styleId = "dodge-local-styles";

  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");

    style.id = styleId;

    style.textContent = `
      .dodge-screen {
        --dodge-accent: #38bdf8;
        --dodge-accent-strong: #0ea5e9;

        width: 100%;
        max-width: 760px;
        margin: 0 auto;
        padding: 8px 0 24px;

        color: inherit;

        user-select: none;
        -webkit-user-select: none;
      }

      .dodge-screen *,
      .dodge-screen *::before,
      .dodge-screen *::after {
        box-sizing: border-box;
      }

      .dodge-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 14px;
      }

      .dodge-header h3 {
        margin: 2px 0 0;
        font-size: clamp(1.35rem, 4vw, 1.8rem);
        line-height: 1.1;
      }

      .dodge-header .eyebrow {
        margin: 0;
      }

      .dodge-status {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        padding: 8px 12px;

        border-radius: 999px;

        background: rgba(56,189,248,0.12);
        border: 1px solid rgba(56,189,248,0.30);

        font-size: 0.78rem;
        font-weight: 800;
        white-space: nowrap;
      }

      .dodge-status-mark {
        font-size: 1rem;
      }

      .dodge-game-wrap {
        position: relative;
        width: 100%;
        max-width: 620px;
        margin: 0 auto;
        overflow: hidden;

        border-radius: 26px;

        background:
          radial-gradient(
            circle at 50% 18%,
            rgba(56,189,248,0.12),
            transparent 34%
          ),
          linear-gradient(
            145deg,
            #111827,
            #07111d
          );

        border: 2px solid rgba(56,189,248,0.30);

        box-shadow:
          0 22px 60px rgba(0,0,0,0.20),
          inset 0 1px 0 rgba(255,255,255,0.07);
      }

      .dodge-canvas {
        display: block;
        width: 100%;
        height: auto;

        aspect-ratio: 360 / 550;

        touch-action: none;
        cursor: crosshair;

        -webkit-tap-highlight-color: transparent;
      }

      .dodge-overlay {
        position: absolute;
        inset: 0;

        display: flex;
        align-items: center;
        justify-content: center;

        padding: 22px;

        background:
          linear-gradient(
            145deg,
            rgba(7,17,29,0.92),
            rgba(15,42,64,0.94)
          );

        opacity: 0;
        visibility: hidden;

        transition:
          opacity 0.24s ease,
          visibility 0.24s ease;

        z-index: 10;
      }

      .dodge-overlay.is-visible {
        opacity: 1;
        visibility: visible;
      }

      .dodge-overlay-card {
        width: min(100%, 340px);
        padding: 26px 20px;

        text-align: center;

        border-radius: 24px;

        background: rgba(255,255,255,0.07);
        border: 1px solid rgba(255,255,255,0.13);

        box-shadow:
          0 22px 60px rgba(0,0,0,0.30);

        color: #fff;
      }

      .dodge-overlay-icon {
        font-size: clamp(3rem, 13vw, 5rem);
        line-height: 1;
        margin-bottom: 10px;
      }

      .dodge-overlay h4 {
        margin: 0 0 7px;
        font-size: clamp(1.55rem, 6vw, 2.1rem);
      }

      .dodge-overlay p {
        margin: 0 0 17px;
        font-size: 0.88rem;
        opacity: 0.76;
      }

      .dodge-overlay-stats {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
        margin-bottom: 18px;
      }

      .dodge-overlay-stat {
        padding: 10px;

        border-radius: 13px;

        background: rgba(255,255,255,0.07);
        border: 1px solid rgba(255,255,255,0.09);
      }

      .dodge-overlay-stat span {
        display: block;

        font-size: 0.62rem;
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;

        opacity: 0.62;
      }

      .dodge-overlay-stat strong {
        display: block;

        margin-top: 3px;

        font-size: 1.1rem;
      }

      .dodge-overlay-button {
        appearance: none;
        border: 0;

        min-height: 44px;
        padding: 10px 22px;

        border-radius: 999px;

        background: var(--dodge-accent);
        color: #fff;

        font: inherit;
        font-weight: 900;

        cursor: pointer;

        box-shadow:
          0 8px 24px rgba(56,189,248,0.32);

        transition:
          transform 0.16s ease,
          filter 0.16s ease;
      }

      .dodge-overlay-button:hover {
        filter: brightness(1.08);
      }

      .dodge-overlay-button:active {
        transform: scale(0.95);
      }

      .dodge-controls {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;

        width: 100%;
        max-width: 620px;
        margin: 12px auto 0;
      }

      .dodge-control {
        appearance: none;
        border: 1px solid rgba(56,189,248,0.24);

        min-height: 46px;

        border-radius: 15px;

        background: rgba(56,189,248,0.08);
        color: inherit;

        font: inherit;
        font-size: 1.05rem;
        font-weight: 900;

        cursor: pointer;

        touch-action: none;

        transition:
          transform 0.12s ease,
          background 0.12s ease,
          border-color 0.12s ease;
      }

      .dodge-control:active,
      .dodge-control.is-held {
        transform: scale(0.97);

        background: rgba(56,189,248,0.20);
        border-color: rgba(56,189,248,0.50);
      }

      .dodge-message {
        min-height: 24px;
        margin: 10px 0 0;

        text-align: center;

        font-size: 0.84rem;
        font-weight: 750;

        opacity: 0.72;
      }

      .dodge-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;

        gap: 12px;
        margin-top: 12px;
      }

      .dodge-footer-message {
        font-size: 0.78rem;
        font-weight: 700;
        opacity: 0.60;
      }

      .dodge-new-game {
        flex-shrink: 0;
      }

      @media (max-width: 480px) {
        .dodge-screen {
          padding-left: 2px;
          padding-right: 2px;
        }

        .dodge-header {
          margin-bottom: 11px;
        }

        .dodge-status {
          padding: 7px 9px;
        }

        .dodge-status span:last-child {
          display: none;
        }

        .dodge-game-wrap {
          border-radius: 22px;
        }

        .dodge-footer {
          align-items: flex-start;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .dodge-overlay,
        .dodge-overlay-button,
        .dodge-control {
          transition: none;
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
      data-game="dodge"
      class="dodge-screen"
    >

      <div class="dodge-header">
        <div>
          <p class="eyebrow">Game</p>
          <h3>Dodge</h3>
        </div>

        <div class="dodge-status">
          <span
            class="dodge-status-mark"
            aria-hidden="true"
          >⚡</span>

          <span>Survive the fall</span>
        </div>
      </div>

      <div class="dodge-game-wrap">

        <canvas
          class="dodge-canvas"
          data-dodge-canvas
          aria-label="Dodge survival game"
        ></canvas>

        <div
          class="dodge-overlay"
          data-dodge-overlay
          aria-live="polite"
        >
          <div class="dodge-overlay-card">

            <div
              class="dodge-overlay-icon"
              data-dodge-overlay-icon
              aria-hidden="true"
            >💥</div>

            <h4 data-dodge-overlay-title>
              Game Over
            </h4>

            <p data-dodge-overlay-message>
              You got caught.
            </p>

            <div class="dodge-overlay-stats">

              <div class="dodge-overlay-stat">
                <span>Score</span>
                <strong data-dodge-final-score>0</strong>
              </div>

              <div class="dodge-overlay-stat">
                <span>Best</span>
                <strong data-dodge-final-best>0</strong>
              </div>

            </div>

            <button
              type="button"
              class="dodge-overlay-button"
              data-dodge-overlay-restart
            >
              Play Again
            </button>

          </div>
        </div>
      </div>

      <div class="dodge-controls">

        <button
          type="button"
          class="dodge-control"
          data-dodge-left
          aria-label="Move left"
        >
          ◀ LEFT
        </button>

        <button
          type="button"
          class="dodge-control"
          data-dodge-right
          aria-label="Move right"
        >
          RIGHT ▶
        </button>

      </div>

      <div
        class="dodge-message"
        data-dodge-message
        aria-live="polite"
      >
        Move left and right to survive
      </div>

      <div class="dodge-footer">

        <span
          class="dodge-footer-message"
          data-dodge-footer
        >
          Arrows / A / D also work
        </span>

        <button
          type="button"
          class="button button-quiet dodge-new-game"
          data-dodge-reset
        >
          New Game
        </button>

      </div>

    </section>
  `;

  /* ============================================================
     ELEMENTS
     ============================================================ */

  const canvas =
    root.querySelector("[data-dodge-canvas]");

  const ctx =
    canvas.getContext("2d");

  const overlay =
    root.querySelector("[data-dodge-overlay]");

  const overlayIcon =
    root.querySelector("[data-dodge-overlay-icon]");

  const overlayTitle =
    root.querySelector("[data-dodge-overlay-title]");

  const overlayMessage =
    root.querySelector("[data-dodge-overlay-message]");

  const finalScore =
    root.querySelector("[data-dodge-final-score]");

  const finalBest =
    root.querySelector("[data-dodge-final-best]");

  const overlayRestart =
    root.querySelector("[data-dodge-overlay-restart]");

  const resetButton =
    root.querySelector("[data-dodge-reset]");

  const messageElement =
    root.querySelector("[data-dodge-message]");

  const footerElement =
    root.querySelector("[data-dodge-footer]");

  const leftButton =
    root.querySelector("[data-dodge-left]");

  const rightButton =
    root.querySelector("[data-dodge-right]");

  /* ============================================================
     APP SCORE ELEMENTS
     ============================================================ */

  const scoreValueLeft =
    document.querySelector("#score-value-left");

  const scoreValueCenter =
    document.querySelector("#score-value-center");

  const scoreValueRight =
    document.querySelector("#score-value-right");

  const scoreLabelLeft =
    document.querySelector("#score-label-left");

  const scoreLabelCenter =
    document.querySelector("#score-label-center");

  const scoreLabelRight =
    document.querySelector("#score-label-right");

  /* ============================================================
     CONSTANTS
     ============================================================ */

  const BASE_WIDTH = 360;
  const BASE_HEIGHT = 550;

  const BEST_SCORE_KEY =
    "miniArcade.dodge.best";

  const PLAYER_WIDTH = 30;
  const PLAYER_HEIGHT = 25;

  const PLAYER_Y =
    BASE_HEIGHT - 48;

  const PLAYER_SPEED = 310;

  const START_SPAWN_DELAY = 0.75;

  const MIN_SPAWN_INTERVAL = 0.30;
  const START_SPAWN_INTERVAL = 0.90;

  const START_OBSTACLE_SPEED = 165;
  const MAX_OBSTACLE_SPEED = 480;

  /* ============================================================
     STATE
     ============================================================ */

  let score = 0;
  let bestScore = readBestScore();

  let elapsed = 0;
  let lastScoreShown = -1;

  let spawnTimer = START_SPAWN_DELAY;

  let gameOver = false;
  let destroyed = false;

  let animationFrame = null;
  let lastFrameTime = 0;

  let canvasWidth = BASE_WIDTH;
  let canvasHeight = BASE_HEIGHT;

  let scaleX = 1;
  let scaleY = 1;

  let draggingPointerId = null;

  const input = {
    left: false,
    right: false
  };

  const player = {
    x:
      (BASE_WIDTH - PLAYER_WIDTH) / 2,

    y: PLAYER_Y,

    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,

    hitFlash: 0
  };

  let obstacles = [];

  const stars =
    Array.from(
      {
        length: 42
      },
      () => ({
        x:
          Math.random() *
          BASE_WIDTH,

        y:
          Math.random() *
          BASE_HEIGHT,

        radius:
          0.5 +
          Math.random() * 1.4,

        alpha:
          0.15 +
          Math.random() * 0.45,

        speed:
          8 +
          Math.random() * 20
      })
    );

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
     UI
     ============================================================ */

  function updateScoreUI() {
    if (scoreValueLeft) {
      scoreValueLeft.textContent =
        String(score);
    }

    if (scoreValueCenter) {
      scoreValueCenter.textContent =
        String(bestScore);
    }

    if (scoreValueRight) {
      scoreValueRight.textContent =
        `${Math.floor(elapsed)}s`;
    }

    if (scoreLabelLeft) {
      scoreLabelLeft.textContent =
        "Score";
    }

    if (scoreLabelCenter) {
      scoreLabelCenter.textContent =
        "Best";
    }

    if (scoreLabelRight) {
      scoreLabelRight.textContent =
        "Time";
    }
  }

  function updateMessage(text) {
    if (messageElement) {
      messageElement.textContent = text;
    }
  }

  function updateFooter(text) {
    if (footerElement) {
      footerElement.textContent = text;
    }
  }

  /* ============================================================
     RESIZE
     ============================================================ */

  function resizeCanvas() {
    const rect =
      canvas.getBoundingClientRect();

    const cssWidth =
      Math.max(
        280,
        rect.width || BASE_WIDTH
      );

    const cssHeight =
      cssWidth *
      (BASE_HEIGHT / BASE_WIDTH);

    const dpr =
      Math.min(
        window.devicePixelRatio || 1,
        2
      );

    canvas.width =
      Math.round(
        cssWidth * dpr
      );

    canvas.height =
      Math.round(
        cssHeight * dpr
      );

    canvasWidth = BASE_WIDTH;
    canvasHeight = BASE_HEIGHT;

    scaleX =
      cssWidth / BASE_WIDTH;

    scaleY =
      cssHeight / BASE_HEIGHT;

    ctx.setTransform(
      dpr * scaleX,
      0,
      0,
      dpr * scaleY,
      0,
      0
    );
  }

  /* ============================================================
     HELPERS
     ============================================================ */

  function clamp(
    value,
    min,
    max
  ) {
    return Math.max(
      min,
      Math.min(max, value)
    );
  }

  function roundedRectPath(
    context,
    x,
    y,
    width,
    height,
    radius
  ) {
    const r =
      Math.min(
        radius,
        width / 2,
        height / 2
      );

    context.beginPath();

    context.moveTo(
      x + r,
      y
    );

    context.arcTo(
      x + width,
      y,
      x + width,
      y + height,
      r
    );

    context.arcTo(
      x + width,
      y + height,
      x,
      y + height,
      r
    );

    context.arcTo(
      x,
      y + height,
      x,
      y,
      r
    );

    context.arcTo(
      x,
      y,
      x + width,
      y,
      r
    );

    context.closePath();
  }

  /* ============================================================
     DIFFICULTY
     ============================================================ */

  function getSpawnInterval() {
    return Math.max(
      MIN_SPAWN_INTERVAL,
      START_SPAWN_INTERVAL -
        elapsed * 0.009
    );
  }

  function getObstacleSpeed() {
    return Math.min(
      MAX_OBSTACLE_SPEED,
      START_OBSTACLE_SPEED +
        elapsed * 6.5
    );
  }

  /* ============================================================
     PLAYER
     ============================================================ */

  function resetPlayer() {
    player.x =
      (
        BASE_WIDTH -
        player.width
      ) / 2;

    player.y =
      PLAYER_Y;

    player.hitFlash = 0;
  }

  function movePlayer(delta) {
    let direction = 0;

    if (input.left) {
      direction -= 1;
    }

    if (input.right) {
      direction += 1;
    }

    if (direction !== 0) {
      player.x +=
        direction *
        PLAYER_SPEED *
        delta;
    }

    player.x =
      clamp(
        player.x,
        0,
        BASE_WIDTH -
          player.width
      );
  }

  function updatePlayerFromPointer(
    clientX
  ) {
    if (gameOver) {
      return;
    }

    const rect =
      canvas.getBoundingClientRect();

    if (!rect.width) {
      return;
    }

    const x =
      (
        clientX -
        rect.left
      ) /
      rect.width *
      BASE_WIDTH;

    player.x =
      clamp(
        x -
          player.width / 2,
        0,
        BASE_WIDTH -
          player.width
      );
  }

  /* ============================================================
     OBSTACLES
     ============================================================ */

  function spawnObstacle() {
    const width =
      24 +
      Math.random() * 46;

    const height =
      16 +
      Math.random() * 18;

    const x =
      Math.random() *
      (
        BASE_WIDTH -
        width
      );

    const speed =
      getObstacleSpeed() *
      (
        0.86 +
        Math.random() * 0.28
      );

    const colors = [
      "#fb7185",
      "#f97316",
      "#f43f5e",
      "#ef4444",
      "#e879f9"
    ];

    const color =
      colors[
        Math.floor(
          Math.random() *
          colors.length
        )
      ];

    obstacles.push({
      x,
      y: -height - 8,

      width,
      height,

      speed,

      color,

      glow:
        color,

      rotation:
        Math.random() *
        Math.PI * 2,

      rotationSpeed:
        (
          Math.random() * 2 -
          1
        ) * 2.5
    });
  }

  function clearObstacles() {
    obstacles = [];
  }

  /* ============================================================
     COLLISION
     ============================================================ */

  function intersects(
    a,
    b
  ) {
    const padding = 3;

    return (
      a.x + padding <
        b.x + b.width &&
      a.x +
        a.width -
        padding >
        b.x &&
      a.y + padding <
        b.y + b.height &&
      a.y +
        a.height -
        padding >
        b.y
    );
  }

  /* ============================================================
     UPDATE
     ============================================================ */

  function updateScore() {
    score =
      Math.floor(elapsed);

    if (
      score ===
      lastScoreShown
    ) {
      return;
    }

    lastScoreShown =
      score;

    updateScoreUI();

    if (score > 0) {
      if (
        score % 10 === 0
      ) {
        playTone(500);
      }
    }
  }

  function updateObstacles(delta) {
    spawnTimer -= delta;

    if (spawnTimer <= 0) {
      spawnObstacle();

      spawnTimer =
        getSpawnInterval();
    }

    for (
      let i = obstacles.length - 1;
      i >= 0;
      i--
    ) {
      const obstacle =
        obstacles[i];

      obstacle.y +=
        obstacle.speed *
        delta;

      obstacle.rotation +=
        obstacle.rotationSpeed *
        delta;

      if (
        intersects(
          player,
          obstacle
        )
      ) {
        endGame();
        return;
      }

      if (
        obstacle.y >
        BASE_HEIGHT + 40
      ) {
        obstacles.splice(
          i,
          1
        );
      }
    }
  }

  function update(delta) {
    if (gameOver) {
      return;
    }

    elapsed += delta;

    movePlayer(delta);

    updateObstacles(delta);

    if (gameOver) {
      return;
    }

    updateScore();

    if (
      elapsed > 3 &&
      score % 5 === 0
    ) {
      updateFooter(
        `Speed ${Math.round(
          getObstacleSpeed()
        )} · Keep moving`
      );
    }
  }

  /* ============================================================
     DRAW BACKGROUND
     ============================================================ */

  function drawBackground() {
    const gradient =
      ctx.createLinearGradient(
        0,
        0,
        0,
        BASE_HEIGHT
      );

    gradient.addColorStop(
      0,
      "#07111d"
    );

    gradient.addColorStop(
      0.55,
      "#0b1725"
    );

    gradient.addColorStop(
      1,
      "#07101a"
    );

    ctx.fillStyle =
      gradient;

    ctx.fillRect(
      0,
      0,
      BASE_WIDTH,
      BASE_HEIGHT
    );

    const glow =
      ctx.createRadialGradient(
        BASE_WIDTH / 2,
        90,
        0,
        BASE_WIDTH / 2,
        90,
        240
      );

    glow.addColorStop(
      0,
      "rgba(56,189,248,0.12)"
    );

    glow.addColorStop(
      1,
      "rgba(56,189,248,0)"
    );

    ctx.fillStyle =
      glow;

    ctx.fillRect(
      0,
      0,
      BASE_WIDTH,
      330
    );

    ctx.save();

    stars.forEach((star) => {
      star.y +=
        star.speed * 0.002;

      if (
        star.y >
        BASE_HEIGHT
      ) {
        star.y = 0;
      }

      ctx.globalAlpha =
        star.alpha;

      ctx.fillStyle =
        "#dbeafe";

      ctx.beginPath();

      ctx.arc(
        star.x,
        star.y,
        star.radius,
        0,
        Math.PI * 2
      );

      ctx.fill();
    });

    ctx.restore();

    ctx.save();

    ctx.strokeStyle =
      "rgba(56,189,248,0.055)";

    ctx.lineWidth = 1;

    for (
      let y = 0;
      y <= BASE_HEIGHT;
      y += 40
    ) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(
        BASE_WIDTH,
        y
      );
      ctx.stroke();
    }

    ctx.restore();
  }

  /* ============================================================
     DRAW PLAYER
     ============================================================ */

  function drawPlayer() {
    const flash =
      player.hitFlash > 0;

    if (
      player.hitFlash > 0
    ) {
      player.hitFlash =
        Math.max(
          0,
          player.hitFlash - 0.08
        );
    }

    ctx.save();

    ctx.shadowColor =
      flash
        ? "#ffffff"
        : "rgba(56,189,248,0.85)";

    ctx.shadowBlur =
      flash
        ? 26
        : 16;

    const gradient =
      ctx.createLinearGradient(
        player.x,
        player.y,
        player.x,
        player.y +
          player.height
      );

    gradient.addColorStop(
      0,
      "#7dd3fc"
    );

    gradient.addColorStop(
      1,
      "#0284c7"
    );

    ctx.fillStyle =
      gradient;

    roundedRectPath(
      ctx,
      player.x,
      player.y,
      player.width,
      player.height,
      8
    );

    ctx.fill();

    ctx.shadowBlur = 0;

    ctx.fillStyle =
      "rgba(255,255,255,0.72)";

    roundedRectPath(
      ctx,
      player.x + 6,
      player.y + 5,
      player.width - 12,
      6,
      3
    );

    ctx.fill();

    ctx.fillStyle =
      "#082f49";

    ctx.beginPath();

    ctx.arc(
      player.x + 9,
      player.y + 15,
      2,
      0,
      Math.PI * 2
    );

    ctx.arc(
      player.x + player.width - 9,
      player.y + 15,
      2,
      0,
      Math.PI * 2
    );

    ctx.fill();

    ctx.restore();
  }

  /* ============================================================
     DRAW OBSTACLES
     ============================================================ */

  function drawObstacles() {
    obstacles.forEach(
      (obstacle) => {
        const centerX =
          obstacle.x +
          obstacle.width / 2;

        const centerY =
          obstacle.y +
          obstacle.height / 2;

        ctx.save();

        ctx.translate(
          centerX,
          centerY
        );

        ctx.rotate(
          obstacle.rotation
        );

        ctx.shadowColor =
          obstacle.glow;

        ctx.shadowBlur = 12;

        const gradient =
          ctx.createLinearGradient(
            -obstacle.width / 2,
            -obstacle.height / 2,
            obstacle.width / 2,
            obstacle.height / 2
          );

        gradient.addColorStop(
          0,
          "#ffffff"
        );

        gradient.addColorStop(
          0.12,
          obstacle.color
        );

        gradient.addColorStop(
          1,
          "#7f1d1d"
        );

        ctx.fillStyle =
          gradient;

        roundedRectPath(
          ctx,
          -obstacle.width / 2,
          -obstacle.height / 2,
          obstacle.width,
          obstacle.height,
          6
        );

        ctx.fill();

        ctx.shadowBlur = 0;

        ctx.strokeStyle =
          "rgba(255,255,255,0.20)";

        ctx.lineWidth = 1;

        roundedRectPath(
          ctx,
          -obstacle.width / 2 + 0.5,
          -obstacle.height / 2 + 0.5,
          obstacle.width - 1,
          obstacle.height - 1,
          6
        );

        ctx.stroke();

        ctx.restore();
      }
    );
  }

  /* ============================================================
     DRAW HUD
     ============================================================ */

  function drawHud() {
    ctx.save();

    ctx.fillStyle =
      "rgba(255,255,255,0.52)";

    ctx.font =
      "700 10px system-ui, sans-serif";

    ctx.textAlign = "left";
    ctx.textBaseline = "top";

    ctx.fillText(
      `${score}s`,
      14,
      15
    );

    ctx.textAlign = "right";

    ctx.fillText(
      "DODGE",
      BASE_WIDTH - 14,
      15
    );

    ctx.restore();
  }

  /* ============================================================
     DRAW HINT
     ============================================================ */

  function drawHint() {
    if (
      elapsed > 4 ||
      gameOver
    ) {
      return;
    }

    const alpha =
      0.48 +
      Math.sin(
        performance.now() / 300
      ) * 0.15;

    ctx.save();

    ctx.fillStyle =
      `rgba(255,255,255,${alpha})`;

    ctx.font =
      "700 12px system-ui, sans-serif";

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
      "MOVE TO DODGE",
      BASE_WIDTH / 2,
      BASE_HEIGHT - 22
    );

    ctx.restore();
  }

  /* ============================================================
     DRAW
     ============================================================ */

  function draw() {
    if (!ctx) {
      return;
    }

    ctx.clearRect(
      0,
            0,
      BASE_WIDTH,
      BASE_HEIGHT
    );

    drawBackground();
    drawObstacles();
    drawPlayer();
    drawHud();
    drawHint();
  }

  /* ============================================================
     GAME LOOP
     ============================================================ */

  function gameLoop(timestamp) {
    if (destroyed) {
      return;
    }

    if (!lastFrameTime) {
      lastFrameTime = timestamp;
    }

    let delta =
      (timestamp - lastFrameTime) / 1000;

    lastFrameTime = timestamp;

    /*
     * Prevent huge jumps when the browser tab is
     * inactive or the device is temporarily busy.
     */
    delta =
      Math.min(
        0.05,
        Math.max(0, delta)
      );

    update(delta);
    draw();

    animationFrame =
      requestAnimationFrame(
        gameLoop
      );
  }

  /* ============================================================
     GAME STATE
     ============================================================ */

  function hideOverlay() {
    overlay.classList.remove(
      "is-visible"
    );
  }

  function showOverlay() {
    overlay.classList.add(
      "is-visible"
    );
  }

  function startGame() {
    if (destroyed) {
      return;
    }

    score = 0;
    elapsed = 0;
    lastScoreShown = -1;

    spawnTimer =
      START_SPAWN_DELAY;

    gameOver = false;

    draggingPointerId = null;

    input.left = false;
    input.right = false;

    leftButton.classList.remove(
      "is-held"
    );

    rightButton.classList.remove(
      "is-held"
    );

    clearObstacles();
    resetPlayer();

    hideOverlay();

    updateMessage(
      "Move left and right to survive"
    );

    updateFooter(
      "Arrows / A / D also work"
    );

    updateScoreUI();

    lastFrameTime =
      performance.now();

    if (
      animationFrame === null
    ) {
      animationFrame =
        requestAnimationFrame(
          gameLoop
        );
    }
  }

  function endGame() {
    if (
      gameOver ||
      destroyed
    ) {
      return;
    }

    gameOver = true;

    input.left = false;
    input.right = false;

    leftButton.classList.remove(
      "is-held"
    );

    rightButton.classList.remove(
      "is-held"
    );

    player.hitFlash = 1;

    score =
      Math.floor(elapsed);

    if (
      score >
      bestScore
    ) {
      bestScore = score;
      saveBestScore();

      overlayIcon.textContent =
        "🏆";

      overlayTitle.textContent =
        "New Best!";

      overlayMessage.textContent =
        "Amazing run. Can you beat it again?";
    } else {
      overlayIcon.textContent =
        "💥";

      overlayTitle.textContent =
        "Game Over";

      overlayMessage.textContent =
        "You got caught. Try again!";
    }

    finalScore.textContent =
      String(score);

    finalBest.textContent =
      String(bestScore);

    updateScoreUI();

    updateMessage(
      `Game over — you survived ${score}s`
    );

    updateFooter(
      "Press Play Again to try once more"
    );

    playTone(140);

    try {
      vibrate(100);
    } catch {
      // Vibration is optional.
    }

    showOverlay();
  }

  /* ============================================================
     KEYBOARD INPUT
     ============================================================ */

  function handleKeyDown(event) {
    if (destroyed) {
      return;
    }

    const key =
      String(event.key).toLowerCase();

    const isLeft =
      key === "arrowleft" ||
      key === "a";

    const isRight =
      key === "arrowright" ||
      key === "d";

    if (
      isLeft ||
      isRight
    ) {
      event.preventDefault();

      if (isLeft) {
        input.left = true;
      }

      if (isRight) {
        input.right = true;
      }

      return;
    }

    if (
      gameOver &&
      (
        key === "enter" ||
        key === " " ||
        key === "spacebar"
      )
    ) {
      event.preventDefault();

      startGame();
    }
  }

  function handleKeyUp(event) {
    if (destroyed) {
      return;
    }

    const key =
      String(event.key).toLowerCase();

    if (
      key === "arrowleft" ||
      key === "a"
    ) {
      input.left = false;
    }

    if (
      key === "arrowright" ||
      key === "d"
    ) {
      input.right = false;
    }
  }

  /* ============================================================
     BUTTON INPUT
     ============================================================ */

  function pressDirection(
    direction,
    button
  ) {
    if (gameOver) {
      return;
    }

    input[direction] = true;

    button.classList.add(
      "is-held"
    );
  }

  function releaseDirection(
    direction,
    button
  ) {
    input[direction] = false;

    button.classList.remove(
      "is-held"
    );
  }

  function handleLeftPointerDown(
    event
  ) {
    event.preventDefault();

    pressDirection(
      "left",
      leftButton
    );

    try {
      leftButton.setPointerCapture(
        event.pointerId
      );
    } catch {
      // Pointer capture is optional.
    }
  }

  function handleLeftPointerUp(
    event
  ) {
    event.preventDefault();

    releaseDirection(
      "left",
      leftButton
    );

    try {
      leftButton.releasePointerCapture(
        event.pointerId
      );
    } catch {
      // Pointer capture is optional.
    }
  }

  function handleRightPointerDown(
    event
  ) {
    event.preventDefault();

    pressDirection(
      "right",
      rightButton
    );

    try {
      rightButton.setPointerCapture(
        event.pointerId
      );
    } catch {
      // Pointer capture is optional.
    }
  }

  function handleRightPointerUp(
    event
  ) {
    event.preventDefault();

    releaseDirection(
      "right",
      rightButton
    );

    try {
      rightButton.releasePointerCapture(
        event.pointerId
      );
    } catch {
      // Pointer capture is optional.
    }
  }

  /* ============================================================
     CANVAS POINTER CONTROL
     ============================================================ */

  function handleCanvasPointerDown(
    event
  ) {
    if (gameOver) {
      return;
    }

    event.preventDefault();

    draggingPointerId =
      event.pointerId;

    updatePlayerFromPointer(
      event.clientX
    );

    try {
      canvas.setPointerCapture(
        event.pointerId
      );
    } catch {
      // Pointer capture is optional.
    }
  }

  function handleCanvasPointerMove(
    event
  ) {
    if (
      draggingPointerId !==
      event.pointerId
    ) {
      return;
    }

    event.preventDefault();

    updatePlayerFromPointer(
      event.clientX
    );
  }

  function handleCanvasPointerUp(
    event
  ) {
    if (
      draggingPointerId !==
      event.pointerId
    ) {
      return;
    }

    draggingPointerId = null;

    try {
      canvas.releasePointerCapture(
        event.pointerId
      );
    } catch {
      // Pointer capture is optional.
    }
  }

  /* ============================================================
     RESIZE HANDLING
     ============================================================ */

  let resizeObserver = null;

  function handleResize() {
    if (destroyed) {
      return;
    }

    resizeCanvas();
    draw();
  }

  if (
    typeof ResizeObserver !==
    "undefined"
  ) {
    resizeObserver =
      new ResizeObserver(
        handleResize
      );

    resizeObserver.observe(
      canvas
    );
  } else {
    window.addEventListener(
      "resize",
      handleResize
    );
  }

  /* ============================================================
     VISIBILITY
     ============================================================ */

  function handleVisibilityChange() {
    if (document.hidden) {
      lastFrameTime =
        performance.now();
    }
  }

  /* ============================================================
     EVENTS
     ============================================================ */

  window.addEventListener(
    "keydown",
    handleKeyDown,
    {
      passive: false
    }
  );

  window.addEventListener(
    "keyup",
    handleKeyUp
  );

  document.addEventListener(
    "visibilitychange",
    handleVisibilityChange
  );

  leftButton.addEventListener(
    "pointerdown",
    handleLeftPointerDown
  );

  leftButton.addEventListener(
    "pointerup",
    handleLeftPointerUp
  );

  leftButton.addEventListener(
    "pointercancel",
    handleLeftPointerUp
  );

  leftButton.addEventListener(
    "pointerleave",
    handleLeftPointerUp
  );

  rightButton.addEventListener(
    "pointerdown",
    handleRightPointerDown
  );

  rightButton.addEventListener(
    "pointerup",
    handleRightPointerUp
  );

  rightButton.addEventListener(
    "pointercancel",
    handleRightPointerUp
  );

  rightButton.addEventListener(
    "pointerleave",
    handleRightPointerUp
  );

  canvas.addEventListener(
    "pointerdown",
    handleCanvasPointerDown
  );

  canvas.addEventListener(
    "pointermove",
    handleCanvasPointerMove
  );

  canvas.addEventListener(
    "pointerup",
    handleCanvasPointerUp
  );

  canvas.addEventListener(
    "pointercancel",
    handleCanvasPointerUp
  );

  overlayRestart.addEventListener(
    "click",
    startGame
  );

  resetButton.addEventListener(
    "click",
    startGame
  );

  /* ============================================================
     INITIALIZE
     ============================================================ */

  resizeCanvas();
  resetPlayer();
  updateScoreUI();
  draw();

  animationFrame =
    requestAnimationFrame(
      gameLoop
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

    if (
      animationFrame !== null
    ) {
      cancelAnimationFrame(
        animationFrame
      );

      animationFrame = null;
    }

    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    } else {
      window.removeEventListener(
        "resize",
        handleResize
      );
    }

    window.removeEventListener(
      "keydown",
      handleKeyDown
    );

    window.removeEventListener(
      "keyup",
      handleKeyUp
    );

    document.removeEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    leftButton.removeEventListener(
      "pointerdown",
      handleLeftPointerDown
    );

    leftButton.removeEventListener(
      "pointerup",
      handleLeftPointerUp
    );

    leftButton.removeEventListener(
      "pointercancel",
      handleLeftPointerUp
    );

    leftButton.removeEventListener(
      "pointerleave",
      handleLeftPointerUp
    );

    rightButton.removeEventListener(
      "pointerdown",
      handleRightPointerDown
    );

    rightButton.removeEventListener(
      "pointerup",
      handleRightPointerUp
    );

    rightButton.removeEventListener(
      "pointercancel",
      handleRightPointerUp
    );

    rightButton.removeEventListener(
      "pointerleave",
      handleRightPointerUp
    );

    canvas.removeEventListener(
      "pointerdown",
      handleCanvasPointerDown
    );

    canvas.removeEventListener(
      "pointermove",
      handleCanvasPointerMove
    );

    canvas.removeEventListener(
      "pointerup",
      handleCanvasPointerUp
    );

    canvas.removeEventListener(
      "pointercancel",
      handleCanvasPointerUp
    );

    overlayRestart.removeEventListener(
      "click",
      startGame
    );

    resetButton.removeEventListener(
      "click",
      startGame
    );

    input.left = false;
    input.right = false;

    clearObstacles();
  };

    return {
    reset,
    destroy
  }

}
