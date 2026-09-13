export default function initDodge(root, options = {}) {
  const {
    playTone = () => {},
    vibrate = () => {}
  } = options;

  const doc = root.ownerDocument || document;
  const win = doc.defaultView || window;
  const $ = (s) => root.querySelector(s);
  const $score = (s) => root.querySelector(s) || doc.querySelector(s);

  /* ============================================================
     STYLES
     ============================================================ */

  const styleId = "dodge-local-styles";

  if (!doc.getElementById(styleId)) {
    const style = doc.createElement("style");

    style.id = styleId;

    style.textContent = `
      .dodge-screen,
      .dodge-screen *,
      .dodge-screen *::before,
      .dodge-screen *::after {
        box-sizing:border-box;
        min-width:0;
      }

      .dodge-screen {
        --dodge-accent:#38bdf8;
        width:100%;
        max-width:760px;
        margin:0 auto;
        padding:4px 0 8px;
        color:inherit;
        overflow-x:hidden;
        user-select:none;
        -webkit-user-select:none;
      }

      .dodge-header {
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:8px;
        width:100%;
        margin-bottom:6px;
      }

      .dodge-header > div:first-child {
        min-width:0;
      }

      .dodge-header h3 {
        margin:1px 0 0;
        font-size:clamp(1.15rem,4vw,1.55rem);
        line-height:1.05;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
      }

      .dodge-header .eyebrow {
        margin:0;
      }

      .dodge-status {
        display:inline-flex;
        align-items:center;
        gap:5px;
        flex:0 0 auto;
        max-width:45%;
        padding:5px 8px;
        border-radius:999px;
        background:rgba(56,189,248,.10);
        border:1px solid rgba(56,189,248,.25);
        font-size:.66rem;
        font-weight:800;
        line-height:1;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
      }

      .dodge-status-mark {
        flex:0 0 auto;
        font-size:.82rem;
      }

      /*
       * The board scales from both width and screen height.
       * This is the main fix for phones/tablets/PC.
       */
      .dodge-game-wrap {
        position:relative;
        width:min(
          100%,
          520px,
          max(
            180px,
            calc((100svh - 175px) * .654545)
          )
        );
        aspect-ratio:360 / 550;
        margin:0 auto;
        overflow:hidden;
        border-radius:17px;
        border:1px solid rgba(56,189,248,.28);
        background:
          radial-gradient(
            circle at 50% 18%,
            rgba(56,189,248,.12),
            transparent 34%
          ),
          linear-gradient(
            145deg,
            #111827,
            #07111d
          );
        box-shadow:
          0 12px 30px rgba(0,0,0,.18),
          inset 0 1px 0 rgba(255,255,255,.06);
      }

      .dodge-canvas {
        display:block;
        width:100%;
        height:100%;
        touch-action:none;
        cursor:crosshair;
        -webkit-tap-highlight-color:transparent;
      }

      .dodge-overlay {
        position:absolute;
        inset:0;
        z-index:10;
        display:flex;
        align-items:center;
        justify-content:center;
        width:100%;
        height:100%;
        padding:8px;
        overflow:auto;
        background:
          linear-gradient(
            145deg,
            rgba(7,17,29,.91),
            rgba(15,42,64,.94)
          );
        opacity:0;
        visibility:hidden;
        transition:opacity .18s ease,visibility .18s ease;
      }

      .dodge-overlay.is-visible {
        opacity:1;
        visibility:visible;
      }

      .dodge-overlay-card {
        width:min(100%,280px);
        max-height:100%;
        overflow:auto;
        padding:14px 11px;
        text-align:center;
        border-radius:16px;
        background:rgba(255,255,255,.07);
        border:1px solid rgba(255,255,255,.12);
        box-shadow:0 14px 32px rgba(0,0,0,.28);
        color:#fff;
      }

      .dodge-overlay-icon {
        margin-bottom:5px;
        font-size:clamp(2.2rem,10vw,3.6rem);
        line-height:1;
      }

      .dodge-overlay h4 {
        margin:0 0 5px;
        font-size:clamp(1.2rem,5vw,1.7rem);
        line-height:1.05;
      }

      .dodge-overlay p {
        margin:0 0 10px;
        font-size:.74rem;
        line-height:1.3;
        opacity:.72;
      }

      .dodge-overlay-stats {
        display:grid;
        grid-template-columns:repeat(2,minmax(0,1fr));
        gap:5px;
        margin-bottom:10px;
      }

      .dodge-overlay-stat {
        padding:7px 5px;
        border-radius:10px;
        background:rgba(255,255,255,.07);
        border:1px solid rgba(255,255,255,.08);
      }

      .dodge-overlay-stat span {
        display:block;
        font-size:.52rem;
        font-weight:800;
        letter-spacing:.08em;
        text-transform:uppercase;
        opacity:.6;
      }

      .dodge-overlay-stat strong {
        display:block;
        margin-top:2px;
        font-size:.95rem;
      }

      .dodge-overlay-button {
        appearance:none;
        border:0;
        min-height:38px;
        max-width:100%;
        padding:7px 17px;
        border-radius:999px;
        background:var(--dodge-accent);
        color:#fff;
        font:inherit;
        font-size:.84rem;
        font-weight:900;
        cursor:pointer;
        box-shadow:0 6px 18px rgba(56,189,248,.28);
        transition:transform .12s ease,filter .12s ease;
      }

      .dodge-overlay-button:hover {
        filter:brightness(1.08);
      }

      .dodge-overlay-button:active {
        transform:scale(.96);
      }

      .dodge-controls {
        display:grid;
        grid-template-columns:repeat(2,minmax(0,1fr));
        gap:6px;
        width:min(100%,520px);
        margin:6px auto 0;
      }

      .dodge-control {
        appearance:none;
        width:100%;
        min-height:40px;
        padding:6px;
        border-radius:11px;
        border:1px solid rgba(56,189,248,.22);
        background:rgba(56,189,248,.07);
        color:inherit;
        font:inherit;
        font-size:.84rem;
        font-weight:900;
        line-height:1;
        cursor:pointer;
        touch-action:none;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        transition:
          transform .1s ease,
          background .1s ease,
          border-color .1s ease;
      }

      .dodge-control:active,
      .dodge-control.is-held {
        transform:scale(.97);
        background:rgba(56,189,248,.18);
        border-color:rgba(56,189,248,.48);
      }

      .dodge-message {
        min-height:16px;
        margin:4px 0 0;
        text-align:center;
        font-size:.68rem;
        font-weight:750;
        line-height:1.2;
        opacity:.68;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
      }

      .dodge-footer {
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:6px;
        width:min(100%,520px);
        margin:5px auto 0;
      }

      .dodge-footer-message {
        min-width:0;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        font-size:.62rem;
        font-weight:700;
        opacity:.52;
      }

      .dodge-new-game {
        flex:0 0 auto;
        min-height:34px;
        padding:6px 10px;
        white-space:nowrap;
      }

      @media(max-width:480px) {
        .dodge-screen {
          padding:3px 0 6px;
        }

        .dodge-header {
          margin-bottom:5px;
        }

        .dodge-status {
          padding:5px 7px;
        }

        .dodge-status span:last-child {
          display:none;
        }

        .dodge-game-wrap {
          border-radius:15px;
        }

        .dodge-controls {
          gap:5px;
          margin-top:5px;
        }

        .dodge-control {
          min-height:38px;
          border-radius:10px;
          font-size:.8rem;
        }

        .dodge-message {
          margin-top:3px;
          font-size:.65rem;
        }

        .dodge-footer {
          margin-top:5px;
        }

        .dodge-new-game {
          min-height:32px;
          padding:5px 9px;
        }
      }

      @media(max-width:340px) {
        .dodge-footer-message {
          display:none;
        }

        .dodge-footer {
          justify-content:flex-end;
        }

        .dodge-control {
          font-size:.76rem;
        }
      }

      @media(max-height:560px) {
        .dodge-header {
          margin-bottom:3px;
        }

        .dodge-controls {
          margin-top:4px;
        }

        .dodge-control {
          min-height:34px;
        }

        .dodge-message {
          display:none;
        }

        .dodge-footer {
          margin-top:4px;
        }

        .dodge-new-game {
          min-height:30px;
        }
      }

      @media(prefers-reduced-motion:reduce) {
        .dodge-overlay,
        .dodge-overlay-button,
        .dodge-control {
          transition:none;
        }
      }
    `;

    doc.head.appendChild(style);
  }

  /* ============================================================
     HTML
     ============================================================ */

  root.innerHTML = `
    <section data-game="dodge" class="dodge-screen">

      <div class="dodge-header">
        <div>
          <p class="eyebrow">Game</p>
          <h3>Dodge</h3>
        </div>

        <div class="dodge-status">
          <span class="dodge-status-mark" aria-hidden="true">⚡</span>
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
        >◀ LEFT</button>

        <button
          type="button"
          class="dodge-control"
          data-dodge-right
          aria-label="Move right"
        >RIGHT ▶</button>
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

  const canvas = $("[data-dodge-canvas]");
  const ctx = canvas.getContext("2d");

  const gameWrap = $(".dodge-game-wrap");
  const overlay = $("[data-dodge-overlay]");
  const overlayIcon = $("[data-dodge-overlay-icon]");
  const overlayTitle = $("[data-dodge-overlay-title]");
  const overlayMessage = $("[data-dodge-overlay-message]");
  const finalScore = $("[data-dodge-final-score]");
  const finalBest = $("[data-dodge-final-best]");
  const overlayRestart = $("[data-dodge-overlay-restart]");
  const resetButton = $("[data-dodge-reset]");
  const messageElement = $("[data-dodge-message]");
  const footerElement = $("[data-dodge-footer]");
  const leftButton = $("[data-dodge-left]");
  const rightButton = $("[data-dodge-right]");

  const scoreValueLeft = $score("#score-value-left");
  const scoreValueCenter = $score("#score-value-center");
  const scoreValueRight = $score("#score-value-right");
  const scoreLabelLeft = $score("#score-label-left");
  const scoreLabelCenter = $score("#score-label-center");
  const scoreLabelRight = $score("#score-label-right");

  /* ============================================================
     CONSTANTS
     ============================================================ */

  const BASE_WIDTH = 360;
  const BASE_HEIGHT = 550;

  const BEST_SCORE_KEY = "miniArcade.dodge.best";

  const PLAYER_WIDTH = 30;
  const PLAYER_HEIGHT = 25;
  const PLAYER_Y = BASE_HEIGHT - 48;
  const PLAYER_SPEED = 310;

  const START_SPAWN_DELAY = .75;
  const MIN_SPAWN_INTERVAL = .30;
  const START_SPAWN_INTERVAL = .90;

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
  let draggingPointerId = null;

  const input = {
    left: false,
    right: false
  };

  const player = {
    x: (BASE_WIDTH - PLAYER_WIDTH) / 2,
    y: PLAYER_Y,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    hitFlash: 0
  };

  let obstacles = [];

  const stars = Array.from(
    { length: 42 },
    () => ({
      x: Math.random() * BASE_WIDTH,
      y: Math.random() * BASE_HEIGHT,
      radius: .5 + Math.random() * 1.4,
      alpha: .15 + Math.random() * .45,
      speed: 8 + Math.random() * 20
    })
  );

  const cleanups = [];

  function listen(target, type, handler, options) {
    target.addEventListener(type, handler, options);
    cleanups.push(() => {
      target.removeEventListener(type, handler, options);
    });
  }

  /* ============================================================
     STORAGE
     ============================================================ */

  function readBestScore() {
    try {
      const value = Number(
        win.localStorage.getItem(BEST_SCORE_KEY)
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
      win.localStorage.setItem(
        BEST_SCORE_KEY,
        String(bestScore)
      );
    } catch {
      // Optional storage.
    }
  }

  /* ============================================================
     UI
     ============================================================ */

  function updateScoreUI() {
    if (scoreValueLeft)
      scoreValueLeft.textContent = String(score);

    if (scoreValueCenter)
      scoreValueCenter.textContent = String(bestScore);

    if (scoreValueRight)
      scoreValueRight.textContent = `${Math.floor(elapsed)}s`;

    if (scoreLabelLeft)
      scoreLabelLeft.textContent = "Score";

    if (scoreLabelCenter)
      scoreLabelCenter.textContent = "Best";

    if (scoreLabelRight)
      scoreLabelRight.textContent = "Time";
  }

  function updateMessage(text) {
    if (messageElement)
      messageElement.textContent = text;
  }

  function updateFooter(text) {
    if (footerElement)
      footerElement.textContent = text;
  }

  /* ============================================================
     RESIZE
     ============================================================ */

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();

    const cssWidth = Math.max(
      1,
      rect.width || BASE_WIDTH
    );

    const cssHeight =
      cssWidth * BASE_HEIGHT / BASE_WIDTH;

    const dpr = Math.min(
      win.devicePixelRatio || 1,
      2
    );

    canvas.width = Math.round(cssWidth * dpr);
    canvas.height = Math.round(cssHeight * dpr);

    ctx.setTransform(
      dpr * cssWidth / BASE_WIDTH,
      0,
      0,
      dpr * cssHeight / BASE_HEIGHT,
      0,
      0
    );
  }

  /* ============================================================
     HELPERS
     ============================================================ */

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function roundedRectPath(
    context,
    x,
    y,
    width,
    height,
    radius
  ) {
    const r = Math.min(
      radius,
      width / 2,
      height / 2
    );

    context.beginPath();
    context.moveTo(x + r, y);
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
      START_SPAWN_INTERVAL - elapsed * .009
    );
  }

  function getObstacleSpeed() {
    return Math.min(
      MAX_OBSTACLE_SPEED,
      START_OBSTACLE_SPEED + elapsed * 6.5
    );
  }

  /* ============================================================
     PLAYER
     ============================================================ */

  function resetPlayer() {
    player.x =
      (BASE_WIDTH - player.width) / 2;

    player.y = PLAYER_Y;
    player.hitFlash = 0;
  }

  function movePlayer(delta) {
    let direction = 0;

    if (input.left)
      direction--;

    if (input.right)
      direction++;

    if (direction) {
      player.x +=
        direction *
        PLAYER_SPEED *
        delta;
    }

    player.x = clamp(
      player.x,
      0,
      BASE_WIDTH - player.width
    );
  }

  function updatePlayerFromPointer(clientX) {
    if (gameOver)
      return;

    const rect =
      canvas.getBoundingClientRect();

    if (!rect.width)
      return;

    const x =
      (clientX - rect.left) /
      rect.width *
      BASE_WIDTH;

    player.x = clamp(
      x - player.width / 2,
      0,
      BASE_WIDTH - player.width
    );
  }

  /* ============================================================
     OBSTACLES
     ============================================================ */

  function spawnObstacle() {
    const width = 24 + Math.random() * 46;
    const height = 16 + Math.random() * 18;

    const x =
      Math.random() *
      (BASE_WIDTH - width);

    const speed =
      getObstacleSpeed() *
      (.86 + Math.random() * .28);

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
          Math.random() * colors.length
        )
      ];

    obstacles.push({
      x,
      y: -height - 8,
      width,
      height,
      speed,
      color,
      glow: color,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed:
        (Math.random() * 2 - 1) * 2.5
    });
  }

  function clearObstacles() {
    obstacles.length = 0;
  }

  /* ============================================================
     COLLISION
     ============================================================ */

  function intersects(a, b) {
    const padding = 3;

    return (
      a.x + padding < b.x + b.width &&
      a.x + a.width - padding > b.x &&
      a.y + padding < b.y + b.height &&
      a.y + a.height - padding > b.y
    );
  }

  /* ============================================================
     UPDATE
     ============================================================ */

  function updateScore() {
    score = Math.floor(elapsed);

    if (score === lastScoreShown)
      return;

    lastScoreShown = score;
    updateScoreUI();

    if (score > 0 && score % 10 === 0)
      playTone(500);
  }

  function updateObstacles(delta) {
    spawnTimer -= delta;

    if (spawnTimer <= 0) {
      spawnObstacle();
      spawnTimer = getSpawnInterval();
    }

    for (
      let i = obstacles.length - 1;
      i >= 0;
      i--
    ) {
      const obstacle = obstacles[i];

      obstacle.y +=
        obstacle.speed * delta;

      obstacle.rotation +=
        obstacle.rotationSpeed * delta;

      if (intersects(player, obstacle)) {
        endGame();
        return;
      }

      if (obstacle.y > BASE_HEIGHT + 40)
        obstacles.splice(i, 1);
    }
  }

  function update(delta) {
    if (gameOver)
      return;

    elapsed += delta;

    movePlayer(delta);
    updateObstacles(delta);

    if (gameOver)
      return;

    updateScore();

    if (
      elapsed > 3 &&
      score % 5 === 0
    ) {
      updateFooter(
        `Speed ${Math.round(getObstacleSpeed())} · Keep moving`
      );
    }
  }

  /* ============================================================
     DRAW
     ============================================================ */

  function drawBackground() {
    const gradient =
      ctx.createLinearGradient(
        0,
        0,
        0,
        BASE_HEIGHT
      );

    gradient.addColorStop(0, "#07111d");
    gradient.addColorStop(.55, "#0b1725");
    gradient.addColorStop(1, "#07101a");

    ctx.fillStyle = gradient;
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
      "rgba(56,189,248,.12)"
    );

    glow.addColorStop(
      1,
      "rgba(56,189,248,0)"
    );

    ctx.fillStyle = glow;

    ctx.fillRect(
      0,
      0,
      BASE_WIDTH,
      330
    );

    ctx.save();

    for (const star of stars) {
      star.y += star.speed * .002;

      if (star.y > BASE_HEIGHT)
        star.y = 0;

      ctx.globalAlpha = star.alpha;
      ctx.fillStyle = "#dbeafe";

      ctx.beginPath();

      ctx.arc(
        star.x,
        star.y,
        star.radius,
        0,
        Math.PI * 2
      );

      ctx.fill();
    }

    ctx.restore();

    ctx.save();

    ctx.strokeStyle =
      "rgba(56,189,248,.055)";

    ctx.lineWidth = 1;

    for (
      let y = 0;
      y <= BASE_HEIGHT;
      y += 40
    ) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(BASE_WIDTH, y);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawPlayer() {
    const flash = player.hitFlash > 0;

    if (player.hitFlash > 0) {
      player.hitFlash = Math.max(
        0,
        player.hitFlash - .08
      );
    }

    ctx.save();

    ctx.shadowColor = flash
      ? "#fff"
      : "rgba(56,189,248,.85)";

    ctx.shadowBlur =
      flash ? 26 : 16;

    const gradient =
      ctx.createLinearGradient(
        player.x,
        player.y,
        player.x,
        player.y + player.height
      );

    gradient.addColorStop(0, "#7dd3fc");
    gradient.addColorStop(1, "#0284c7");

    ctx.fillStyle = gradient;

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
      "rgba(255,255,255,.72)";

    roundedRectPath(
      ctx,
      player.x + 6,
      player.y + 5,
      player.width - 12,
      6,
      3
    );

    ctx.fill();

    ctx.fillStyle = "#082f49";

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

  function drawObstacles() {
    for (const obstacle of obstacles) {
      const centerX =
        obstacle.x + obstacle.width / 2;

      const centerY =
        obstacle.y + obstacle.height / 2;

      ctx.save();

      ctx.translate(centerX, centerY);
      ctx.rotate(obstacle.rotation);

      ctx.shadowColor = obstacle.glow;
      ctx.shadowBlur = 12;

      const gradient =
        ctx.createLinearGradient(
          -obstacle.width / 2,
          -obstacle.height / 2,
          obstacle.width / 2,
          obstacle.height / 2
        );

      gradient.addColorStop(0, "#fff");
      gradient.addColorStop(.12, obstacle.color);
      gradient.addColorStop(1, "#7f1d1d");

      ctx.fillStyle = gradient;

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
        "rgba(255,255,255,.20)";

      ctx.lineWidth = 1;

      roundedRectPath(
        ctx,
        -obstacle.width / 2 + .5,
        -obstacle.height / 2 + .5,
        obstacle.width - 1,
        obstacle.height - 1,
        6
      );

      ctx.stroke();

      ctx.restore();
    }
  }

  function drawHud() {
    ctx.save();

    ctx.fillStyle =
      "rgba(255,255,255,.52)";

    ctx.font =
      "700 10px system-ui,sans-serif";

    ctx.textBaseline = "top";

    ctx.textAlign = "left";
    ctx.fillText(`${score}s`, 14, 15);

    ctx.textAlign = "right";

    ctx.fillText(
      "DODGE",
      BASE_WIDTH - 14,
      15
    );

    ctx.restore();
  }

  function drawHint() {
    if (elapsed > 4 || gameOver)
      return;

    const alpha =
      .48 +
      Math.sin(
        win.performance.now() / 300
      ) * .15;

    ctx.save();

    ctx.fillStyle =
      `rgba(255,255,255,${alpha})`;

    ctx.font =
      "700 12px system-ui,sans-serif";

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
      "MOVE TO DODGE",
      BASE_WIDTH / 2,
      BASE_HEIGHT - 22
    );

    ctx.restore();
  }

  function draw() {
    if (!ctx)
      return;

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
    if (destroyed)
      return;

    if (!lastFrameTime)
      lastFrameTime = timestamp;

    let delta =
      (timestamp - lastFrameTime) / 1000;

    lastFrameTime = timestamp;

    delta = Math.min(
      .05,
      Math.max(0, delta)
    );

    update(delta);
    draw();

    animationFrame =
      win.requestAnimationFrame(gameLoop);
  }

  /* ============================================================
     GAME STATE
     ============================================================ */

  function hideOverlay() {
    overlay.classList.remove("is-visible");
  }

  function showOverlay() {
    overlay.classList.add("is-visible");
  }

  function resetDirectionButtons() {
    input.left = false;
    input.right = false;

    leftButton.classList.remove("is-held");
    rightButton.classList.remove("is-held");
  }

  function startGame() {
    if (destroyed)
      return;

    score = 0;
    elapsed = 0;
    lastScoreShown = -1;
    spawnTimer = START_SPAWN_DELAY;

    gameOver = false;
    draggingPointerId = null;

    resetDirectionButtons();
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

    lastFrameTime = win.performance.now();

    if (animationFrame === null) {
      animationFrame =
        win.requestAnimationFrame(gameLoop);
    }
  }

  function endGame() {
    if (gameOver || destroyed)
      return;

    gameOver = true;

    resetDirectionButtons();

    player.hitFlash = 1;

    score = Math.floor(elapsed);

    if (score > bestScore) {
      bestScore = score;
      saveBestScore();

      overlayIcon.textContent = "🏆";
      overlayTitle.textContent = "New Best!";
      overlayMessage.textContent =
        "Amazing run. Can you beat it again?";
    } else {
      overlayIcon.textContent = "💥";
      overlayTitle.textContent = "Game Over";
      overlayMessage.textContent =
        "You got caught. Try again!";
    }

    finalScore.textContent = String(score);
    finalBest.textContent = String(bestScore);

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
      // Optional vibration.
    }

    showOverlay();
  }

  /* ============================================================
     KEYBOARD
     ============================================================ */

  function handleKeyDown(event) {
    if (destroyed)
      return;

    const key =
      String(event.key).toLowerCase();

    const left =
      key === "arrowleft" || key === "a";

    const right =
      key === "arrowright" || key === "d";

    if (left || right) {
      event.preventDefault();

      if (left)
        input.left = true;

      if (right)
        input.right = true;

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
    if (destroyed)
      return;

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

  function bindDirectionButton(button, direction) {
    const down = (event) => {
      event.preventDefault();

      if (gameOver)
        return;

      input[direction] = true;
      button.classList.add("is-held");

      try {
        button.setPointerCapture(
          event.pointerId
        );
      } catch {}
    };

    const up = (event) => {
      event.preventDefault();

      input[direction] = false;
      button.classList.remove("is-held");

      try {
        button.releasePointerCapture(
          event.pointerId
        );
      } catch {}
    };

    listen(button, "pointerdown", down);
    listen(button, "pointerup", up);
    listen(button, "pointercancel", up);
    listen(button, "pointerleave", up);
  }

  /* ============================================================
     CANVAS TOUCH / POINTER
     ============================================================ */

  function handleCanvasPointerDown(event) {
    if (gameOver)
      return;

    event.preventDefault();

    draggingPointerId = event.pointerId;

    updatePlayerFromPointer(
      event.clientX
    );

    try {
      canvas.setPointerCapture(
        event.pointerId
      );
    } catch {}
  }

  function handleCanvasPointerMove(event) {
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

  function handleCanvasPointerUp(event) {
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
    } catch {}
  }

  /* ============================================================
     RESIZE
     ============================================================ */

  let resizeObserver = null;

  function handleResize() {
    if (destroyed)
      return;

    resizeCanvas();
    draw();
  }

  if (typeof win.ResizeObserver !== "undefined") {
    resizeObserver =
      new win.ResizeObserver(handleResize);

    resizeObserver.observe(gameWrap);
  } else {
    listen(
      win,
      "resize",
      handleResize
    );
  }

  /* ============================================================
     VISIBILITY
     ============================================================ */

  function handleVisibilityChange() {
    if (doc.hidden)
      lastFrameTime = win.performance.now();
  }

  /* ============================================================
     EVENTS
     ============================================================ */

  listen(
    win,
    "keydown",
    handleKeyDown,
    { passive:false }
  );

  listen(
    win,
    "keyup",
    handleKeyUp
  );

  listen(
    doc,
    "visibilitychange",
    handleVisibilityChange
  );

  bindDirectionButton(
    leftButton,
    "left"
  );

  bindDirectionButton(
    rightButton,
    "right"
  );

  listen(
    canvas,
    "pointerdown",
    handleCanvasPointerDown
  );

  listen(
    canvas,
    "pointermove",
    handleCanvasPointerMove
  );

  listen(
    canvas,
    "pointerup",
    handleCanvasPointerUp
  );

  listen(
    canvas,
    "pointercancel",
    handleCanvasPointerUp
  );

  listen(
    overlayRestart,
    "click",
    startGame
  );

  listen(
    resetButton,
    "click",
    startGame
  );

  /* ============================================================
     INIT
     ============================================================ */

  resizeCanvas();
  resetPlayer();
  updateScoreUI();
  draw();

  animationFrame =
    win.requestAnimationFrame(gameLoop);

  /* ============================================================
     PUBLIC API
     ============================================================ */

  function reset() {
    startGame();
  }

  function destroy() {
    if (destroyed)
      return;

    destroyed = true;

    if (animationFrame !== null) {
      win.cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }

    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }

    for (const cleanup of cleanups)
      cleanup();

    input.left = false;
    input.right = false;

    clearObstacles();
  }

  return {
    reset,
    destroy
  };
}
