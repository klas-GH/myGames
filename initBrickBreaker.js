export default function initBrickBreaker(root, options = {}) {
  const {
    playTone = () => {},
    vibrate = () => {}
  } = options;

  /* ============================================================
     STYLES
     ============================================================ */

  const styleId = "brick-breaker-local-styles";

  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;

    style.textContent = `
      .brick-breaker-screen {
        --brick-accent:#fb7185;
        width:100%;
        max-width:760px;
        min-width:0;
        height:100%;
        max-height:100%;
        margin:0 auto;
        padding:clamp(3px,1vh,8px) 0
          calc(10px + env(safe-area-inset-bottom,0px));
        color:inherit;
        user-select:none;
        -webkit-user-select:none;
        overflow:hidden;
        display:flex;
        flex-direction:column;
      }

      .brick-breaker-screen *,
      .brick-breaker-screen *::before,
      .brick-breaker-screen *::after {
        box-sizing:border-box;
      }

      .brick-header {
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:12px;
        min-width:0;
        margin-bottom:8px;
      }

      .brick-header > div:first-child {
        min-width:0;
      }

      .brick-header h3 {
        margin:2px 0 0;
        font-size:clamp(1.25rem,4vw,1.8rem);
        line-height:1.1;
        overflow-wrap:anywhere;
      }

      .brick-header .eyebrow {
        margin:0;
      }

      .brick-status {
        display:inline-flex;
        align-items:center;
        gap:7px;
        flex-shrink:0;
        padding:8px 12px;
        border-radius:999px;
        background:rgba(251,113,133,.12);
        border:1px solid rgba(251,113,133,.30);
        font-size:.78rem;
        font-weight:800;
        white-space:nowrap;
      }

      .brick-status-mark {
        font-size:1rem;
      }

      .brick-game-wrap {
        position:relative;
        flex:1 1 auto;
        min-height:0;
        width:min(100%,620px);
        height:min(
          58svh,
          calc(100svh - 195px)
        );
        aspect-ratio:360 / 550;
        margin:0 auto;
        overflow:hidden;
        border-radius:clamp(16px,4vw,26px);
        background:
          radial-gradient(
            circle at 50% 18%,
            rgba(251,113,133,.10),
            transparent 32%
          ),
          linear-gradient(145deg,#111827,#0b1020);
        border:2px solid rgba(251,113,133,.30);
        box-shadow:
          0 22px 60px rgba(0,0,0,.20),
          inset 0 1px 0 rgba(255,255,255,.07);
      }


      .brick-canvas {
        display:block;
        width:100%;
        height:100%;
        touch-action:none;
        cursor:none;
        -webkit-tap-highlight-color:transparent;
      }

      .brick-overlay {
        position:absolute;
        inset:0;
        display:flex;
        align-items:center;
        justify-content:center;
        padding:clamp(10px,3vw,22px);
        background:
          linear-gradient(
            145deg,
            rgba(15,23,42,.92),
            rgba(49,46,129,.94)
          );
        opacity:0;
        visibility:hidden;
        transition:opacity .24s ease,visibility .24s ease;
        z-index:10;
      }

      .brick-overlay.is-visible {
        opacity:1;
        visibility:visible;
      }

      .brick-overlay-card {
        width:min(100%,340px);
        max-height:calc(100% - 12px);
        overflow:auto;
        padding:clamp(16px,4vw,26px)
          clamp(13px,4vw,20px);
        text-align:center;
        border-radius:24px;
        background:rgba(255,255,255,.07);
        border:1px solid rgba(255,255,255,.13);
        box-shadow:0 22px 60px rgba(0,0,0,.30);
        color:#fff;
        scrollbar-width:thin;
      }

      .brick-overlay-icon {
        font-size:clamp(2.5rem,13vw,5rem);
        line-height:1;
        margin-bottom:8px;
      }

      .brick-overlay h4 {
        margin:0 0 7px;
        font-size:clamp(1.4rem,6vw,2.1rem);
        line-height:1.05;
      }

      .brick-overlay p {
        margin:0 0 14px;
        font-size:.84rem;
        line-height:1.35;
        opacity:.76;
      }

      .brick-overlay-stats {
        display:grid;
        grid-template-columns:repeat(2,minmax(0,1fr));
        gap:8px;
        margin-bottom:15px;
      }

      .brick-overlay-stat {
        min-width:0;
        padding:9px;
        border-radius:13px;
        background:rgba(255,255,255,.07);
        border:1px solid rgba(255,255,255,.09);
      }

      .brick-overlay-stat span {
        display:block;
        font-size:.60rem;
        font-weight:800;
        letter-spacing:.08em;
        text-transform:uppercase;
        opacity:.62;
      }

      .brick-overlay-stat strong {
        display:block;
        margin-top:3px;
        font-size:1.05rem;
      }

      .brick-overlay-button {
        appearance:none;
        border:0;
        min-height:44px;
        padding:9px 20px;
        border-radius:999px;
        background:var(--brick-accent);
        color:#fff;
        font:inherit;
        font-weight:900;
        cursor:pointer;
        box-shadow:0 8px 24px rgba(251,113,133,.32);
        transition:transform .16s ease,filter .16s ease;
      }

      .brick-overlay-button:hover {
        filter:brightness(1.08);
      }

      .brick-overlay-button:active {
        transform:scale(.95);
      }

      .brick-message {
        min-height:21px;
        margin:5px 0 0;
        padding:0 4px;
        text-align:center;
        font-size:.82rem;
        line-height:1.25;
        font-weight:750;
        opacity:.72;
      }

      .brick-footer {
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:10px;
        min-width:0;
        margin-top:8px;
      }

      .brick-footer-message {
        min-width:0;
        font-size:.76rem;
        line-height:1.2;
        font-weight:700;
        opacity:.60;
        overflow-wrap:anywhere;
      }

      .brick-new-game {
        flex-shrink:0;
      }

      @media (max-width:480px) {
        .brick-breaker-screen {
          padding-left:2px;
          padding-right:2px;
        }

        .brick-header {
          margin-bottom:9px;
        }

        .brick-status {
          padding:7px 9px;
        }

        .brick-status span:last-child {
          display:none;
        }

        .brick-message {
          margin-top:6px;
          font-size:.78rem;
        }
      }

      @media (max-height:720px) {
        .brick-game-wrap {
          height:min(
            58svh,
            calc(100svh - 175px)
          );
        }

        .brick-header {
          margin-bottom:7px;
        }

        .brick-message {
          min-height:19px;
          margin-top:5px;
        }

        .brick-footer {
          margin-top:5px;
        }
      }

      @media (max-height:560px) {
        .brick-header {
          margin-bottom:5px;
        }

        .brick-header h3 {
          font-size:1.15rem;
        }

        .brick-header .eyebrow {
          font-size:.62rem;
        }

        .brick-game-wrap {
          height:min(
            58svh,
            calc(100svh - 150px)
          );
        }

        .brick-message {
          min-height:17px;
          margin-top:4px;
          font-size:.72rem;
        }

        .brick-footer {
          margin-top:4px;
        }

        .brick-footer-message {
          font-size:.68rem;
        }
      }


      @media (max-width:360px) {
        .brick-footer {
          gap:7px;
        }

        .brick-footer-message {
          font-size:.68rem;
        }

        .brick-overlay-card {
          border-radius:18px;
        }

        .brick-overlay-stats {
          gap:6px;
          margin-bottom:10px;
        }
      }

      @media (prefers-reduced-motion:reduce) {
        .brick-overlay,
        .brick-overlay-button {
          transition:none;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* ============================================================
     HTML
     ============================================================ */

  root.innerHTML = `
    <section data-game="brick-breaker" class="brick-breaker-screen">
      <div class="brick-header">
        <div>
          <p class="eyebrow">Game</p>
          <h3>Brick Breaker</h3>
        </div>

        <div class="brick-status">
          <span class="brick-status-mark" aria-hidden="true">🧱</span>
          <span>Break the wall</span>
        </div>
      </div>

      <div class="brick-game-wrap">
        <canvas
          class="brick-canvas"
          data-brick-canvas
          aria-label="Brick Breaker game"
        ></canvas>

        <div
          class="brick-overlay"
          data-brick-overlay
          aria-live="polite"
        >
          <div class="brick-overlay-card">
            <div
              class="brick-overlay-icon"
              data-brick-overlay-icon
              aria-hidden="true"
            >💥</div>

            <h4 data-brick-overlay-title>Game Over</h4>

            <p data-brick-overlay-message>
              The wall fought back.
            </p>

            <div class="brick-overlay-stats">
              <div class="brick-overlay-stat">
                <span>Score</span>
                <strong data-brick-final-score>0</strong>
              </div>

              <div class="brick-overlay-stat">
                <span>Best</span>
                <strong data-brick-final-best>0</strong>
              </div>
            </div>

            <button
              type="button"
              class="brick-overlay-button"
              data-brick-overlay-restart
            >
              Play Again
            </button>
          </div>
        </div>
      </div>

      <div
        class="brick-message"
        data-brick-message
        aria-live="polite"
      >
        Tap the game area to launch
      </div>

      <div class="brick-footer">
        <span class="brick-footer-message" data-brick-footer>
          Clear the wall 🧱
        </span>

        <button
          type="button"
          class="button button-quiet brick-new-game"
          data-brick-reset
        >
          New Game
        </button>
      </div>
    </section>
  `;

  /* ============================================================
     ELEMENTS
     ============================================================ */

  const canvas = root.querySelector("[data-brick-canvas]");
  const ctx = canvas.getContext("2d");

  const overlay = root.querySelector("[data-brick-overlay]");
  const overlayIcon = root.querySelector("[data-brick-overlay-icon]");
  const overlayTitle = root.querySelector("[data-brick-overlay-title]");
  const overlayMessage = root.querySelector("[data-brick-overlay-message]");
  const finalScore = root.querySelector("[data-brick-final-score]");
  const finalBest = root.querySelector("[data-brick-final-best]");
  const overlayRestart = root.querySelector("[data-brick-overlay-restart]");
  const resetButton = root.querySelector("[data-brick-reset]");
  const messageElement = root.querySelector("[data-brick-message]");
  const footerElement = root.querySelector("[data-brick-footer]");

  const scoreValueLeft = document.querySelector("#score-value-left");
  const scoreValueCenter = document.querySelector("#score-value-center");
  const scoreValueRight = document.querySelector("#score-value-right");

  const scoreLabelLeft = document.querySelector("#score-label-left");
  const scoreLabelCenter = document.querySelector("#score-label-center");
  const scoreLabelRight = document.querySelector("#score-label-right");

  /* ============================================================
     CONSTANTS
     ============================================================ */

  const W = 360;
  const H = 550;

  const BEST_SCORE_KEY = "miniArcade.brickBreaker.best";
  const STARTING_LIVES = 3;
  const BASE_BALL_SPEED = 205;
  const MAX_BALL_SPEED = 330;
  const BALL_RADIUS = 5;

  const PADDLE_WIDTH = 76;
  const PADDLE_HEIGHT = 10;
  const PADDLE_Y = H - 48;
  const PADDLE_SPEED = 340;

  const BRICK_ROWS = 5;
  const BRICK_COLUMNS = 6;
  const BRICK_GAP = 5;
  const BRICK_SIDE_MARGIN = 15;
  const BRICK_TOP = 68;
  const BRICK_HEIGHT = 21;

  const LEVEL_BONUS = 50;

  /* ============================================================
     STATE
     ============================================================ */

  let score = 0;
  let bestScore = readBestScore();
  let lives = STARTING_LIVES;
  let level = 1;

  let bricks = [];
  let bricksRemaining = 0;

  let ballLaunched = false;
  let gameOver = false;
  let destroyed = false;

  let animationFrame = 0;
  let lastFrameTime = 0;
  let transitionTimer = 0;
  let gameVersion = 0;
  let resizeObserver = null;

  const paddle = {
    x: (W - PADDLE_WIDTH) / 2,
    y: PADDLE_Y,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    speed: PADDLE_SPEED,
    hitFlash: 0
  };

  const ball = {
    x: W / 2,
    y: PADDLE_Y - BALL_RADIUS - 3,
    vx: 0,
    vy: 0,
    radius: BALL_RADIUS,
    waiting: true,
    direction: -1
  };

  /* ============================================================
     STORAGE / UI
     ============================================================ */

  function readBestScore() {
    try {
      const value = Number(
        localStorage.getItem(BEST_SCORE_KEY)
      );
      return Number.isFinite(value) ? Math.max(0, value) : 0;
    } catch {
      return 0;
    }
  }

  function updateBestScore() {
    if (score <= bestScore) return;

    bestScore = score;

    try {
      localStorage.setItem(BEST_SCORE_KEY, String(bestScore));
    } catch {}
  }

  function updateScoreUI() {
    if (scoreValueLeft) scoreValueLeft.textContent = score;
    if (scoreValueCenter) scoreValueCenter.textContent = bestScore;
    if (scoreValueRight) scoreValueRight.textContent = Math.max(0, lives);

    if (scoreLabelLeft) scoreLabelLeft.textContent = "Score";
    if (scoreLabelCenter) scoreLabelCenter.textContent = "Best";
    if (scoreLabelRight) scoreLabelRight.textContent = "Lives";
  }

  function updateMessage(text) {
    if (messageElement) messageElement.textContent = text;
  }

  function updateFooter(text) {
    if (footerElement) footerElement.textContent = text;
  }

  function clearTransition() {
    if (!transitionTimer) return;
    clearTimeout(transitionTimer);
    transitionTimer = 0;
  }

  function schedule(callback, delay, version) {
    clearTransition();

    transitionTimer = window.setTimeout(() => {
      transitionTimer = 0;

      if (destroyed || version !== gameVersion) return;

      callback();
    }, delay);
  }

  /* ============================================================
     RESIZE
     ============================================================ */

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();

    const width = Math.max(1, rect.width || W);
    const height = Math.max(1, rect.height || width * H / W);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    ctx.setTransform(
      dpr * width / W,
      0,
      0,
      dpr * height / H,
      0,
      0
    );
  }

  /* ============================================================
     LEVEL
     ============================================================ */

  function buildLevel() {
    bricks = [];

    const availableWidth = W - BRICK_SIDE_MARGIN * 2;
    const brickWidth =
      (availableWidth - BRICK_GAP * (BRICK_COLUMNS - 1)) /
      BRICK_COLUMNS;

    const colors = [
      "#fb7185",
      "#f97316",
      "#fbbf24",
      "#4ade80",
      "#22d3ee"
    ];

    for (let row = 0; row < BRICK_ROWS; row++) {
      const brickRow = [];

      for (let column = 0; column < BRICK_COLUMNS; column++) {
        const color = colors[row % colors.length];

        brickRow.push({
          x:
            BRICK_SIDE_MARGIN +
            column * (brickWidth + BRICK_GAP),

          y:
            BRICK_TOP +
            row * (BRICK_HEIGHT + BRICK_GAP),

          width: brickWidth,
          height: BRICK_HEIGHT,
          color,
          colorDark: shadeColor(color, -22),
          glow: color,
          points: 10,
          alive: true
        });
      }

      bricks.push(brickRow);
    }

    bricksRemaining = BRICK_ROWS * BRICK_COLUMNS;
  }

  /* ============================================================
     PADDLE / BALL
     ============================================================ */

  function resetPaddle() {
    paddle.x = (W - paddle.width) / 2;
    paddle.y = PADDLE_Y;
    paddle.hitFlash = 0;
  }

  function clampPaddle() {
    paddle.x = Math.max(
      0,
      Math.min(W - paddle.width, paddle.x)
    );
  }

  function resetBall(direction = -1) {
    ball.waiting = true;
    ball.direction = direction;
    ball.x = paddle.x + paddle.width / 2;
    ball.y = paddle.y - ball.radius - 3;
    ball.vx = 0;
    ball.vy = 0;
  }

  function launchBall() {
    if (gameOver || ballLaunched) return;

    ballLaunched = true;
    ball.waiting = false;

    const speed = Math.min(
      BASE_BALL_SPEED + (level - 1) * 14,
      MAX_BALL_SPEED
    );

    const angle = Math.random() * 0.8 - 0.4;

    ball.vx = Math.sin(angle) * speed;
    ball.vy = -Math.cos(angle) * speed;

    playTone(520);
  }

  function currentBallSpeed() {
    return Math.hypot(ball.vx, ball.vy);
  }

  function increaseBallSpeed(amount = 2) {
    const current = currentBallSpeed();

    if (current <= 0 || current >= MAX_BALL_SPEED) return;

    const ratio =
      Math.min(MAX_BALL_SPEED, current + amount) / current;

    ball.vx *= ratio;
    ball.vy *= ratio;
  }

  /* ============================================================
     HELPERS
     ============================================================ */

  function shadeColor(color, amount) {
    const num = parseInt(color.replace("#", ""), 16);
    const clamp = value => Math.max(0, Math.min(255, value));

    const r = clamp((num >> 16) + amount);
    const g = clamp(((num >> 8) & 255) + amount);
    const b = clamp((num & 255) + amount);

    return (
      "#" +
      ((r << 16) | (g << 8) | b)
        .toString(16)
        .padStart(6, "0")
    );
  }

  function roundedRectPath(context, x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);

    context.beginPath();
    context.moveTo(x + r, y);
    context.arcTo(x + width, y, x + width, y + height, r);
    context.arcTo(x + width, y + height, x, y + height, r);
    context.arcTo(x, y + height, x, y, r);
    context.arcTo(x, y, x + width, y, r);
    context.closePath();
  }

  function circleIntersectsRect(circle, rect) {
    const x = Math.max(
      rect.x,
      Math.min(circle.x, rect.x + rect.width)
    );

    const y = Math.max(
      rect.y,
      Math.min(circle.y, rect.y + rect.height)
    );

    const dx = circle.x - x;
    const dy = circle.y - y;

    return dx * dx + dy * dy <=
      circle.radius * circle.radius;
  }

  /* ============================================================
     DRAW
     ============================================================ */

  function drawBackground() {
    const gradient = ctx.createLinearGradient(0, 0, 0, H);

    gradient.addColorStop(0, "#17152b");
    gradient.addColorStop(.55, "#111827");
    gradient.addColorStop(1, "#0b1020");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,.035)";
    ctx.lineWidth = 1;

    for (let x = 0; x <= W; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }

    for (let y = 0; y <= H; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    ctx.restore();

    const glow = ctx.createRadialGradient(
      W / 2,
      70,
      0,
      W / 2,
      70,
      230
    );

    glow.addColorStop(0, "rgba(251,113,133,.12)");
    glow.addColorStop(1, "rgba(251,113,133,0)");

    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, 300);
  }

  function drawBricks() {
    for (const row of bricks) {
      for (const brick of row) {
        if (!brick.alive) continue;

        ctx.save();

        ctx.shadowColor = brick.glow;
        ctx.shadowBlur = 8;

        roundedRectPath(
          ctx,
          brick.x,
          brick.y,
          brick.width,
          brick.height,
          5
        );

        const gradient = ctx.createLinearGradient(
          brick.x,
          brick.y,
          brick.x,
          brick.y + brick.height
        );

        gradient.addColorStop(0, brick.color);
        gradient.addColorStop(1, brick.colorDark);

        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.strokeStyle = "rgba(255,255,255,.18)";
        ctx.lineWidth = 1;

        roundedRectPath(
          ctx,
          brick.x + .5,
          brick.y + .5,
          brick.width - 1,
          brick.height - 1,
          5
        );

        ctx.stroke();
        ctx.restore();
      }
    }
  }

  function drawPaddle() {
    const flash = paddle.hitFlash > 0;

    if (flash) {
      paddle.hitFlash = Math.max(0, paddle.hitFlash - .06);
    }

    ctx.save();

    ctx.shadowColor = flash
      ? "#ffffff"
      : "rgba(251,113,133,.70)";

    ctx.shadowBlur = flash ? 22 : 14;

    const gradient = ctx.createLinearGradient(
      paddle.x,
      paddle.y,
      paddle.x + paddle.width,
      paddle.y
    );

    gradient.addColorStop(0, "#fb7185");
    gradient.addColorStop(.5, "#fda4af");
    gradient.addColorStop(1, "#fb7185");

    ctx.fillStyle = gradient;

    roundedRectPath(
      ctx,
      paddle.x,
      paddle.y,
      paddle.width,
      paddle.height,
      paddle.height / 2
    );

    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(255,255,255,.42)";

    roundedRectPath(
      ctx,
      paddle.x + 5,
      paddle.y + 3,
      paddle.width - 10,
      3,
      2
    );

    ctx.fill();
    ctx.restore();
  }

  function drawBall() {
    ctx.save();

    ctx.shadowColor = "#fda4af";
    ctx.shadowBlur = 16;

    const gradient = ctx.createRadialGradient(
      ball.x - ball.radius * .35,
      ball.y - ball.radius * .4,
      ball.radius * .12,
      ball.x,
      ball.y,
      ball.radius
    );

    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(.35, "#ffe4e6");
    gradient.addColorStop(1, "#fb7185");

    ctx.fillStyle = gradient;

    ctx.beginPath();
    ctx.arc(
      ball.x,
      ball.y,
      ball.radius,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.restore();
  }

  function drawLevelIndicator() {
    ctx.save();

    ctx.fillStyle = "rgba(255,255,255,.50)";
    ctx.font = "700 10px system-ui,sans-serif";
    ctx.textAlign = "right";
    ctx.textBaseline = "top";

    ctx.fillText(`LEVEL ${level}`, W - 14, 15);

    ctx.restore();
  }

  function drawLaunchHint() {
    if (gameOver) return;

    const alpha =
      .50 + Math.sin(performance.now() / 320) * .15;

    ctx.save();

    ctx.fillStyle =
      `rgba(255,255,255,${alpha})`;

    ctx.font = "700 12px system-ui,sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
      "TAP TO LAUNCH",
      W / 2,
      paddle.y - paddle.height - 22
    );

    ctx.restore();
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    drawBackground();
    drawLevelIndicator();
    drawBricks();
    drawPaddle();
    drawBall();

    if (ball.waiting && !gameOver) {
      drawLaunchHint();
    }
  }

  /* ============================================================
     COLLISIONS
     ============================================================ */

  function handlePaddleCollision() {
    if (ball.vy <= 0) return;
    if (!circleIntersectsRect(ball, paddle)) return;

    ball.y = paddle.y - ball.radius - 1;

    const center = paddle.x + paddle.width / 2;
    const hit = (ball.x - center) / (paddle.width / 2);
    const clamped = Math.max(-1, Math.min(1, hit));

    const speed = Math.min(
      currentBallSpeed() + 2,
      MAX_BALL_SPEED
    );

    const angle = clamped * Math.PI * .70;

    ball.vx = Math.sin(angle) * speed;
    ball.vy = -Math.abs(Math.cos(angle) * speed);

    paddle.hitFlash = 1;

    playTone(680);
  }

  function resolveBrickBounce(brick, previousX, previousY) {
    const above =
      previousY + ball.radius <= brick.y;

    const below =
      previousY - ball.radius >=
      brick.y + brick.height;

    const left =
      previousX + ball.radius <= brick.x;

    const right =
      previousX - ball.radius >=
      brick.x + brick.width;

    if (above || below) {
      ball.vy *= -1;

      ball.y = above
        ? brick.y - ball.radius - .5
        : brick.y + brick.height + ball.radius + .5;

      return;
    }

    if (left || right) {
      ball.vx *= -1;

      ball.x = left
        ? brick.x - ball.radius - .5
        : brick.x + brick.width + ball.radius + .5;

      return;
    }

    ball.vy *= -1;
  }

  function checkBrickCollisions(previousX, previousY) {
    for (const row of bricks) {
      for (const brick of row) {
        if (
          !brick.alive ||
          !circleIntersectsRect(ball, brick)
        ) {
          continue;
        }

        brick.alive = false;
        bricksRemaining--;

        score += brick.points;

        updateBestScore();
        updateScoreUI();

        resolveBrickBounce(
          brick,
          previousX,
          previousY
        );

        increaseBallSpeed(
          score % 50 === 0 ? 6 : 1.5
        );

        updateMessage(
          score >= 100
            ? "Great run! Keep going 🔥"
            : "Nice hit! Break another brick ✨"
        );

        updateFooter(
          `Level ${level} · ${bricksRemaining} bricks left`
        );

        playTone(560 + Math.min(320, score * 2));
        vibrate(6);

        if (bricksRemaining <= 0) {
          finishLevel();
        }

        return;
      }
    }
  }

  /* ============================================================
     LEVEL / LIFE / GAME OVER
     ============================================================ */

  function finishLevel() {
    if (gameOver) return;

    const version = gameVersion;

    ballLaunched = false;
    ball.waiting = true;

    const bonus = LEVEL_BONUS * level;

    score += bonus;

    updateBestScore();
    updateScoreUI();

    playTone(880);
    vibrate([15, 25, 30]);

    updateMessage(
      `Level ${level} cleared! +${bonus} bonus 🎉`
    );

    updateFooter("Preparing the next wall...");

    level++;

    resetPaddle();
    resetBall(-1);
    draw();

    schedule(() => {
      buildLevel();
      updateScoreUI();

      updateMessage(
        `Level ${level} · Clear the wall!`
      );

      updateFooter("New wall, faster ball 🚀");

      draw();

      schedule(() => {
        if (!gameOver) launchBall();
      }, 550, version);
    }, 500, version);
  }

  function loseLife() {
    if (gameOver) return;

    lives--;
    ballLaunched = false;

    updateScoreUI();

    vibrate([20, 40, 20]);
    playTone(220);

    if (lives <= 0) {
      endGame();
      return;
    }

    resetPaddle();
    resetBall(-1);

    updateMessage(
      lives === 1
        ? "Last life — stay focused!"
        : "Life lost — get ready!"
    );

    updateFooter(
      `${lives} ${lives === 1 ? "life" : "lives"} remaining`
    );

    draw();

    const version = gameVersion;

    schedule(() => {
      if (!gameOver) {
        updateMessage("Tap the game area to launch");
        launchBall();
      }
    }, 650, version);
  }

  function endGame() {
    gameOver = true;
    ballLaunched = false;
    ball.waiting = false;

    const newBest = score > bestScore;

    updateBestScore();
    updateScoreUI();

    finalScore.textContent = score;
    finalBest.textContent = bestScore;

    overlayIcon.textContent = "💥";
    overlayTitle.textContent = "Game Over";

    overlayMessage.textContent =
      newBest && score > 0
        ? "New high score! 🔥"
        : "The wall fought back.";

    overlay.classList.add("is-visible");

    updateMessage("Game over — try again!");
    updateFooter("Can you beat your best?");

    playTone(180);
    vibrate([50, 70, 50]);

    draw();
  }

  /* ============================================================
     START / RESET
     ============================================================ */

  function startGame() {
    gameVersion++;
    clearTransition();

    score = 0;
    lives = STARTING_LIVES;
    level = 1;

    gameOver = false;
    ballLaunched = false;
    ball.waiting = true;
    lastFrameTime = 0;

    overlay.classList.remove("is-visible");

    resizeCanvas();
    buildLevel();
    resetPaddle();
    resetBall(-1);

    updateScoreUI();
    updateMessage("Tap the game area to launch");
    updateFooter("Clear the wall 🧱");

    draw();
  }

  function reset() {
    startGame();
  }

  /* ============================================================
     POINTER INPUT
     ============================================================ */

  function updatePaddleFromPointer(clientX) {
    if (gameOver) return;

    const rect = canvas.getBoundingClientRect();
    if (!rect.width) return;

    paddle.x =
      ((clientX - rect.left) / rect.width) * W -
      paddle.width / 2;

    clampPaddle();

    if (ball.waiting) {
      ball.x = paddle.x + paddle.width / 2;
      ball.y = paddle.y - ball.radius - 3;
    }

    draw();
  }

  function handlePointerMove(event) {
    updatePaddleFromPointer(event.clientX);
  }

  function handlePointerDown(event) {
    if (
      event.pointerType === "mouse" &&
      event.button !== 0
    ) {
      return;
    }

    event.preventDefault();

    updatePaddleFromPointer(event.clientX);

    if (ball.waiting && !gameOver) {
      launchBall();
    }
  }

  canvas.addEventListener(
    "pointermove",
    handlePointerMove,
    { passive: true }
  );

  canvas.addEventListener(
    "pointerdown",
    handlePointerDown,
    { passive: false }
  );

  /* ============================================================
     KEYBOARD INPUT
     ============================================================ */

  function handleKeyDown(event) {
    if (gameOver) return;

    if (
      event.key === "ArrowLeft" ||
      event.key === "a" ||
      event.key === "A"
    ) {
      event.preventDefault();

      paddle.x -= paddle.speed * .08;
      clampPaddle();

      if (ball.waiting) {
        ball.x = paddle.x + paddle.width / 2;
      }

      draw();
      return;
    }

    if (
      event.key === "ArrowRight" ||
      event.key === "d" ||
      event.key === "D"
    ) {
      event.preventDefault();

      paddle.x += paddle.speed * .08;
      clampPaddle();

      if (ball.waiting) {
        ball.x = paddle.x + paddle.width / 2;
      }

      draw();
      return;
    }

    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();

      if (ball.waiting) {
        launchBall();
      }
    }
  }

  window.addEventListener("keydown", handleKeyDown);

  /* ============================================================
     UPDATE
     ============================================================ */

  function update(delta) {
    if (
      gameOver ||
      !ballLaunched ||
      ball.waiting
    ) {
      return;
    }

    const previousX = ball.x;
    const previousY = ball.y;

    ball.x += ball.vx * delta;
    ball.y += ball.vy * delta;

    if (ball.x - ball.radius <= 0) {
      ball.x = ball.radius;
      ball.vx = Math.abs(ball.vx);
      playTone(420);
    }

    if (ball.x + ball.radius >= W) {
      ball.x = W - ball.radius;
      ball.vx = -Math.abs(ball.vx);
      playTone(420);
    }

    if (ball.y - ball.radius <= 0) {
      ball.y = ball.radius;
      ball.vy = Math.abs(ball.vy);
      playTone(500);
    }

    handlePaddleCollision();

    if (!gameOver) {
      checkBrickCollisions(previousX, previousY);
    }

    if (ball.y - ball.radius > H && !gameOver) {
      loseLife();
    }
  }

  /* ============================================================
     GAME LOOP
     ============================================================ */

  function gameLoop(timestamp) {
    if (destroyed) return;

    if (!lastFrameTime) {
      lastFrameTime = timestamp;
    }

    const delta = Math.min(
      (timestamp - lastFrameTime) / 1000,
      .022
    );

    lastFrameTime = timestamp;

    update(delta);
    draw();

    animationFrame =
      window.requestAnimationFrame(gameLoop);
  }

  /* ============================================================
     RESIZE / VIEW CHANGES
     ============================================================ */

  function handleResize() {
    resizeCanvas();
    clampPaddle();

    if (ball.waiting) {
      ball.x = paddle.x + paddle.width / 2;
      ball.y = paddle.y - ball.radius - 3;
    }

    draw();
  }

  window.addEventListener(
    "resize",
    handleResize,
    { passive: true }
  );

  /*
   * Important for SPA/game-view switching:
   * if the game starts while its container is hidden,
   * ResizeObserver fixes the canvas when the view becomes visible.
   */
  if ("ResizeObserver" in window) {
    resizeObserver = new ResizeObserver(() => {
      if (!destroyed) handleResize();
    });

    resizeObserver.observe(
      root.querySelector(".brick-game-wrap")
    );
  }

  /* ============================================================
     CLEANUP
     ============================================================ */

  function destroy() {
    destroyed = true;
    gameVersion++;

    clearTransition();

    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    }

    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }

    canvas.removeEventListener(
      "pointermove",
      handlePointerMove
    );

    canvas.removeEventListener(
      "pointerdown",
      handlePointerDown
    );

    resetButton.removeEventListener(
      "click",
      reset
    );

    overlayRestart.removeEventListener(
      "click",
      reset
    );

    window.removeEventListener(
      "keydown",
      handleKeyDown
    );

    window.removeEventListener(
      "resize",
      handleResize
    );
  }

  /* ============================================================
     INITIALIZE
     ============================================================ */

  resetButton.addEventListener("click", reset);
  overlayRestart.addEventListener("click", reset);

  startGame();

  animationFrame =
    window.requestAnimationFrame(gameLoop);

  return {
    reset,
    destroy
  };
}
