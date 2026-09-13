// initHangman.js

export default function initHangman(root, options = {}) {
  const {
    playTone = () => {},
    vibrate = () => {}
  } = options;

  /* ============================================================
     LOCAL STYLES
     ============================================================ */

  const styleId = "hangman-local-styles";

  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");

    style.id = styleId;

    style.textContent = `
      .hangman-screen {
        --hangman-accent: #8b5cf6;
        --hangman-accent-strong: #7c3aed;
        --hangman-success: #22c55e;
        --hangman-danger: #ef4444;

        width: 100%;
        max-width: 560px;
        margin: 0 auto;
        padding: 4px 0 12px;

        color: inherit;

        user-select: none;
        -webkit-user-select: none;
        overflow: hidden;
      }

      .hangman-screen *,
      .hangman-screen *::before,
      .hangman-screen *::after {
        box-sizing: border-box;
      }

      /* ========================================================
         HEADER
         ======================================================== */

      .hangman-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;

        margin-bottom: 8px;
      }

      .hangman-header h3 {
        margin: 1px 0 0;

        font-size: clamp(1.2rem, 4.5vw, 1.55rem);
        line-height: 1.05;
      }

      .hangman-header .eyebrow {
        margin: 0;
        font-size: 0.62rem;
      }

      .hangman-badges {
        display: flex;
        gap: 5px;
      }

      .hangman-score-box {
        min-width: 58px;
        padding: 5px 7px;

        text-align: center;

        border-radius: 9px;

        background: rgba(139,92,246,0.10);
        border: 1px solid rgba(139,92,246,0.22);
      }

      .hangman-score-label {
        display: block;

        font-size: 0.5rem;
        font-weight: 900;

        letter-spacing: 0.07em;
        text-transform: uppercase;

        opacity: 0.56;
      }

      .hangman-score-value {
        display: block;

        margin-top: 1px;

        font-size: 0.88rem;
        font-weight: 950;
        line-height: 1.1;
      }

      /* ========================================================
         GAME CARD
         ======================================================== */

      .hangman-card {
        position: relative;

        width: 100%;

        padding: 10px;

        border-radius: 18px;

        background:
          linear-gradient(
            145deg,
            rgba(139,92,246,0.13),
            rgba(124,58,237,0.055)
          );

        border: 1px solid rgba(139,92,246,0.17);

        box-shadow:
          0 12px 32px rgba(0,0,0,0.13);
      }

      /* ========================================================
         INFO
         ======================================================== */

      .hangman-info {
        display: flex;
        align-items: center;
        justify-content: space-between;

        gap: 7px;

        margin-bottom: 7px;
      }

      .hangman-category {
        display: inline-flex;
        align-items: center;

        min-height: 25px;

        padding: 3px 8px;

        border-radius: 999px;

        background: rgba(139,92,246,0.11);
        border: 1px solid rgba(139,92,246,0.18);

        color: var(--hangman-accent);

        font-size: 0.62rem;
        font-weight: 900;
        letter-spacing: 0.03em;
      }

      .hangman-difficulty {
        font-size: 0.62rem;
        font-weight: 900;
        opacity: 0.58;
      }

      /* ========================================================
         HANGMAN DRAWING
         ======================================================== */

      .hangman-drawing {
        position: relative;

        display: flex;
        align-items: center;
        justify-content: center;

        width: 100%;
        height: clamp(130px, 31vw, 160px);

        margin-bottom: 2px;

        border-radius: 13px;

        background: rgba(0,0,0,0.065);

        overflow: hidden;
      }

      .hangman-svg {
        width: min(185px, 62vw);
        height: clamp(125px, 29vw, 150px);

        overflow: visible;
      }

      .hangman-part {
        fill: none;

        stroke: currentColor;
        stroke-width: 6;
        stroke-linecap: round;
        stroke-linejoin: round;

        opacity: 0;

        transition: opacity 180ms ease;
      }

      .hangman-part.is-visible {
        opacity: 1;
      }

      .hangman-rope {
        stroke: var(--hangman-danger);
      }

      /* ========================================================
         WORD
         ======================================================== */

      .hangman-word {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;

        gap: 4px;

        min-height: 43px;

        margin: 5px 0 5px;
        padding: 2px;

        max-width: 100%;
        overflow: hidden;
      }

      .hangman-letter {
        display: flex;
        align-items: center;
        justify-content: center;

        flex: 0 0 clamp(20px, 6vw, 31px);

        width: clamp(20px, 6vw, 31px);
        height: clamp(28px, 7.5vw, 38px);

        border-bottom: 2px solid currentColor;

        font-size: clamp(0.95rem, 5vw, 1.35rem);
        font-weight: 950;
        line-height: 1;
      }

      .hangman-letter.is-revealed {
        color: var(--hangman-success);
        border-bottom-color: var(--hangman-success);
      }

      .hangman-letter.is-missed {
        color: var(--hangman-danger);
      }

      /* ========================================================
         STATUS
         ======================================================== */

      .hangman-status {
        display: flex;
        align-items: center;
        justify-content: center;

        gap: 5px;

        min-height: 22px;

        margin-bottom: 4px;

        font-size: 0.7rem;
        font-weight: 800;

        line-height: 1.2;
        text-align: center;
      }

      .hangman-status strong {
        color: var(--hangman-accent);
      }

      /* ========================================================
         KEYBOARD
         ======================================================== */

      .hangman-keyboard {
        display: grid;

        grid-template-columns: repeat(7, minmax(0, 1fr));

        gap: 4px;

        margin-top: 5px;
      }

      .hangman-key {
        appearance: none;

        width: 100%;
        min-width: 0;
        min-height: 34px;

        padding: 0 2px;

        border: 1px solid rgba(255,255,255,0.09);
        border-radius: 7px;

        background: rgba(255,255,255,0.065);

        color: inherit;

        font: inherit;
        font-size: clamp(0.68rem, 2.5vw, 0.76rem);
        font-weight: 950;

        cursor: pointer;
        touch-action: manipulation;

        transition:
          transform 100ms ease,
          background 120ms ease,
          opacity 120ms ease;
      }

      .hangman-key:active {
        transform: scale(0.91);
      }

      .hangman-key:hover:not(:disabled) {
        background: rgba(139,92,246,0.15);
      }

      .hangman-key:disabled {
        cursor: default;
        opacity: 0.38;
      }

      .hangman-key.is-correct {
        background: rgba(34,197,94,0.17);
        border-color: rgba(34,197,94,0.28);
        color: var(--hangman-success);
      }

      .hangman-key.is-wrong {
        background: rgba(239,68,68,0.13);
        border-color: rgba(239,68,68,0.23);
        color: var(--hangman-danger);
      }

      /* ========================================================
         BUTTONS
         ======================================================== */

      .hangman-actions {
        display: grid;

        grid-template-columns: repeat(2, minmax(0, 1fr));

        gap: 6px;

        margin-top: 7px;
      }

      .hangman-action {
        appearance: none;

        min-height: 37px;

        padding: 5px 8px;

        border-radius: 10px;

        border: 1px solid rgba(139,92,246,0.21);

        background: rgba(139,92,246,0.08);

        color: inherit;

        font: inherit;
        font-size: 0.7rem;
        font-weight: 900;

        cursor: pointer;
        touch-action: manipulation;
      }

      .hangman-action.primary {
        border: 0;

        background: var(--hangman-accent);
        color: #fff;

        box-shadow:
          0 5px 14px rgba(139,92,246,0.20);
      }

      .hangman-action:active {
        transform: scale(0.97);
      }

      .hangman-action[data-back] {
        display: none !important;
      }


      /* ========================================================
         OVERLAY
         ======================================================== */

      .hangman-overlay {
        position: absolute;

        inset: 0;

        z-index: 30;

        display: flex;
        align-items: center;
        justify-content: center;

        padding: 10px;

        border-radius: 18px;

        background: rgba(15,10,25,0.82);

        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px);

        opacity: 0;
        visibility: hidden;

        transition:
          opacity 180ms ease,
          visibility 180ms ease;
      }

      .hangman-overlay.is-visible {
        opacity: 1;
        visibility: visible;
      }

      .hangman-overlay-card {
        width: min(100%, 270px);

        padding: 18px 13px;

        text-align: center;

        border-radius: 17px;

        background: rgba(255,255,255,0.085);
        border: 1px solid rgba(255,255,255,0.13);

        color: #fff;

        box-shadow:
          0 18px 45px rgba(0,0,0,0.28);
      }

      .hangman-overlay-icon {
        font-size: 2.35rem;
        line-height: 1;

        margin-bottom: 6px;
      }

      .hangman-overlay-card h4 {
        margin: 0 0 4px;

        font-size: 1.3rem;
      }

      .hangman-overlay-card p {
        margin: 0 0 10px;

        font-size: 0.72rem;
        opacity: 0.72;
      }

      .hangman-overlay-stats {
        display: grid;

        grid-template-columns: repeat(2, minmax(0, 1fr));

        gap: 6px;

        margin-bottom: 11px;
      }

      .hangman-overlay-stat {
        padding: 7px;

        border-radius: 9px;

        background: rgba(255,255,255,0.065);
      }

      .hangman-overlay-stat span {
        display: block;

        font-size: 0.5rem;
        font-weight: 800;

        letter-spacing: 0.07em;
        text-transform: uppercase;

        opacity: 0.55;
      }

      .hangman-overlay-stat strong {
        display: block;

        margin-top: 2px;

        font-size: 0.95rem;
      }

      .hangman-overlay-button {
        appearance: none;

        min-height: 37px;

        padding: 7px 19px;

        border: 0;
        border-radius: 999px;

        background: var(--hangman-accent);

        color: #fff;

        font: inherit;
        font-size: 0.72rem;
        font-weight: 900;

        cursor: pointer;
      }

      /* ========================================================
         FOOTER
         ======================================================== */

      .hangman-footer {
        display: flex;
        justify-content: space-between;

        gap: 7px;

        margin-top: 6px;

        font-size: 0.6rem;
        line-height: 1.1;

        opacity: 0.5;
      }

      .hangman-footer strong {
        color: var(--hangman-accent);
        opacity: 1;
      }

      /* ========================================================
         VERY SMALL SCREENS
         ======================================================== */

      @media (max-width: 380px) {
        .hangman-screen {
          padding-bottom: 8px;
        }

        .hangman-card {
          padding: 8px;
          border-radius: 15px;
        }

        .hangman-header {
          margin-bottom: 6px;
        }

        .hangman-score-box {
          min-width: 52px;
          padding: 4px 5px;
        }

        .hangman-drawing {
          height: 122px;
          border-radius: 11px;
        }

        .hangman-svg {
          height: 115px;
          width: 160px;
        }

        .hangman-keyboard {
          gap: 3px;
        }

        .hangman-key {
          min-height: 31px;
          border-radius: 6px;
        }

        .hangman-actions {
          gap: 5px;
        }

        .hangman-action {
          min-height: 34px;
        }
      }

      /* ========================================================
         REDUCED MOTION
         ======================================================== */

      @media (prefers-reduced-motion: reduce) {
        .hangman-part,
        .hangman-key,
        .hangman-overlay {
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
      class="hangman-screen"
      data-game="hangman"
    >

      <div class="hangman-header">

        <div>
          <p class="eyebrow">Game</p>
          <h3>Hangman</h3>
        </div>

        <div class="hangman-badges">

          <div class="hangman-score-box">
            <span class="hangman-score-label">Score</span>
            <strong
              class="hangman-score-value"
              data-score
            >0</strong>
          </div>

          <div class="hangman-score-box">
            <span class="hangman-score-label">Streak</span>
            <strong
              class="hangman-score-value"
              data-streak
            >0</strong>
          </div>

        </div>

      </div>

      <div class="hangman-card">

        <div class="hangman-info">

          <span
            class="hangman-category"
            data-category
          >Category</span>

          <span
            class="hangman-difficulty"
            data-difficulty
          >Easy</span>

        </div>

        <div
          class="hangman-drawing"
          aria-hidden="true"
        >

          <svg
            class="hangman-svg"
            viewBox="0 0 240 200"
          >

            <path
              class="hangman-part"
              data-part="0"
              d="M35 180H205"
            />

            <path
              class="hangman-part"
              data-part="1"
              d="M65 180V25H155"
            />

            <path
              class="hangman-part"
              data-part="2"
              d="M155 25V50"
            />

            <circle
              class="hangman-part"
              data-part="3"
              cx="155"
              cy="70"
              r="21"
            />

            <path
              class="hangman-part"
              data-part="4"
              d="M155 91V135"
            />

            <path
              class="hangman-part"
              data-part="5"
              d="M155 105L125 122"
            />

            <path
              class="hangman-part"
              data-part="6"
              d="M155 105L185 122"
            />

            <path
              class="hangman-part"
              data-part="7"
              d="M155 135L130 165"
            />

            <path
              class="hangman-part"
              data-part="8"
              d="M155 135L180 165"
            />

          </svg>

        </div>

        <div
          class="hangman-word"
          data-word
          aria-label="Hidden word"
        ></div>

        <div
          class="hangman-status"
          data-status
          aria-live="polite"
        >
          Guess the word!
        </div>

        <div
          class="hangman-keyboard"
          data-keyboard
        ></div>

        <div class="hangman-actions">

          <button
            type="button"
            class="hangman-action primary"
            data-new-word
          >
            New Word
          </button>

          <button
            type="button"
            class="hangman-action"
            data-back
          >
            Back to Arcade
          </button>

        </div>

        <div
          class="hangman-overlay"
          data-overlay
        >

          <div class="hangman-overlay-card">

            <div
              class="hangman-overlay-icon"
              data-overlay-icon
            >🎉</div>

            <h4 data-overlay-title>
              You Win!
            </h4>

            <p data-overlay-message>
              Great job!
            </p>

            <div class="hangman-overlay-stats">

              <div class="hangman-overlay-stat">
                <span>Score</span>
                <strong data-final-score>0</strong>
              </div>

              <div class="hangman-overlay-stat">
                <span>Streak</span>
                <strong data-final-streak>0</strong>
              </div>

            </div>

            <button
              type="button"
              class="hangman-overlay-button"
              data-overlay-new
            >
              New Word
            </button>

          </div>

        </div>

      </div>

      <div class="hangman-footer">

        <span>
          Find the hidden word
        </span>

        <span>
          Attempts:
          <strong data-attempts>9</strong>
        </span>

      </div>

    </section>
  `;

  /* ============================================================
     ELEMENTS
     ============================================================ */

  const categoryElement =
    root.querySelector("[data-category]");

  const difficultyElement =
    root.querySelector("[data-difficulty]");

  const drawingParts =
    root.querySelectorAll("[data-part]");

  const wordElement =
    root.querySelector("[data-word]");

  const statusElement =
    root.querySelector("[data-status]");

  const keyboardElement =
    root.querySelector("[data-keyboard]");

  const scoreElement =
    root.querySelector("[data-score]");

  const streakElement =
    root.querySelector("[data-streak]");

  const attemptsElement =
    root.querySelector("[data-attempts]");

  const newWordButton =
    root.querySelector("[data-new-word]");

  const backButton =
    root.querySelector("[data-back]");

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

  const finalStreak =
    root.querySelector("[data-final-streak]");

  const overlayNewButton =
    root.querySelector("[data-overlay-new]");

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

  const MAX_ATTEMPTS = 9;

  const BEST_SCORE_KEY =
    "miniArcade.hangman.best";

  const ALPHABET =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  /* ============================================================
     WORD DATA
     ============================================================ */

  const WORD_DATA = [
    "65,78,73,77,65,76,83",
    "69,76,69,80,72,65,78,84",
    "67,82,79,67,79,68,73,76,69",
    "80,69,78,71,85,73,78",
    "71,73,82,65,70,70,69",
    "68,79,76,80,72,73,78",
    "75,65,78,71,65,82,79,79",
    "66,85,84,84,69,82,70,76,89",
    "68,79,76,80,72,73,78",
    "83,81,85,73,82,82,69,76",
    "68,79,76,80,72,73,78",
    "67,72,73,77,80,65,78,90,69,69",
    "72,73,80,80,79,80,79,84,65,77,85,83",
    "66,85,84,84,69,82,70,76,89",
    "80,79,82,67,85,80,73,78,69",
    "83,69,65,72,79,82,83,69",
    "84,79,82,84,79,73,83,69",
    "71,79,82,73,76,76,65",
    "70,76,65,77,73,78,71,79",
    "72,65,77,83,84,69,82",

    "78,65,84,85,82,69",
    "77,79,85,78,84,65,73,78",
    "82,65,73,78,66,79,87",
    "84,72,85,78,68,69,82,83,84,79,77",
    "87,65,84,69,82,70,65,76,76",
    "79,67,69,65,78",
    "86,79,76,67,65,78,79",
    "70,79,82,69,83,84",
    "77,69,65,68,79,87",
    "76,65,78,68,83,67,65,80,69",
    "87,65,84,69,82,70,65,76,76",
    "87,65,84,69,82,70,65,76,76",
    "87,73,76,68,70,76,79,87,69,82",
    "77,79,85,78,84,65,73,78",
    "87,73,76,68,76,73,70,69",
    "84,72,85,78,68,69,82,83,84,79,77",

    "65,73,82,80,79,82,84",
    "67,65,83,84,76,69",
    "77,79,85,78,84,65,73,78",
    "66,69,65,67,72",
    "86,73,76,76,65,71,69",
    "76,73,66,82,65,82,89",
    "67,65,78,89,79,78",
    "67,65,78,65,76",
    "70,79,82,84,82,69,83,83",
    "68,69,83,69,82,84",
    "83,84,65,68,73,85,77",
    "77,65,82,75,69,84",
    "83,84,65,68,73,85,77",
    "86,73,76,76,65,71,69",
    "67,73,84,89",
    "67,79,85,78,84,82,89",
    "82,69,83,79,82,84",
    "72,65,82,66,79,82",
    "66,65,82,67,69,76,79,78,65",
    "65,68,86,69,78,84,85,82,69",

    "77,79,76,69,67,85,76,69",
    "65,84,79,77",
    "69,78,69,82,71,89",
    "80,76,65,78,69,84",
    "77,73,78,69,82,65,76",
    "79,82,66,73,84",
    "66,73,79,76,79,71,89",
    "67,72,69,77,73,83,84,82,89",
    "86,79,76,67,65,78,79",
    "71,69,78,69,84,73,67,83",
    "84,69,76,69,83,67,79,80,69",
    "80,72,89,83,73,67,83",
    "65,83,84,82,79,78,79,77,89",
    "80,76,65,78,69,84,65,82,89",
    "69,67,79,76,79,71,89",

    "80,73,90,90,65",
    "80,65,83,84,65",
    "66,85,82,71,69,82",
    "78,79,79,68,76,69,83",
    "67,72,69,69,83,69",
    "80,79,80,67,79,82,78",
    "83,65,78,68,87,73,67,72",
    "67,72,79,67,79,76,65,84,69",
    "67,82,65,78,66,69,82,82,89",
    "80,73,78,69,65,80,80,76,69",
    "77,85,83,72,82,79,79,77",
    "80,73,78,69,65,80,80,76,69",
    "83,80,65,71,72,69,84,84,73",
    "84,65,67,79,83",
    "80,79,84,65,84,79",
    "67,72,79,67,79,76,65,84,69",

    "67,79,77,80,85,84,69,82",
    "82,79,66,79,84,73,67,83",
    "83,77,65,82,84,80,72,79,78,69",
    "75,69,89,66,79,65,82,68",
    "83,79,70,84,87,65,82,69",
    "65,76,71,79,82,73,84,72,77",
    "68,65,84,65,66,65,83,69",
    "78,69,84,87,79,82,75",
    "73,78,84,69,82,78,69,84",
    "80,82,79,71,82,65,77,77,73,78,71",
    "68,73,71,73,84,65,76",
    "75,69,89,66,79,65,82,68",
    "83,69,82,86,69,82",
    "67,79,77,80,73,76,69,82",

    "70,79,79,84,66,65,76,76",
    "66,65,83,75,69,84,66,65,76,76",
    "86,79,76,76,69,89,66,65,76,76",
    "84,69,78,78,73,83",
    "67,82,73,67,75,69,84",
    "82,85,78,78,73,78,71",
    "83,87,73,77,77,73,78,71",
    "83,75,65,84,73,78,71",
    "66,65,83,69,66,65,76,76",
    "71,79,76,70",
    "82,85,71,66,89",
    "67,89,67,76,73,78,71",
    "77,65,82,65,84,72,79,78",
    "80,79,78,71",
    "83,75,65,84,69,66,79,65,82,68",
    "67,72,65,77,80,73,79,78,83,72,73,80",

    "86,65,67,65,84,73,79,78",
    "83,85,73,84,67,65,83,69",
    "72,79,84,69,76",
    "72,79,83,84,69,76",
    "76,85,71,71,65,71,69",
    "84,82,65,86,69,76",
    "66,65,67,75,80,65,67,75,73,78,71",
    "76,65,78,68,77,65,82,75",
    "66,65,71,71,65,71,69",
    "67,82,85,73,83,69",
    "65,68,86,69,78,84,85,82,69",
    "67,65,77,80,73,78,71",
    "80,65,83,83,80,79,82,84",
    "65,73,82,80,76,65,78,69",
    "80,65,83,83,80,79,82,84",
    "68,69,83,84,73,78,65,84,73,79,78",

    "66,65,67,75,80,65,67,69",
    "87,65,76,76,69,84",
    "87,65,76,76,69,84",
    "77,73,82,82,79,82",
    "67,76,79,67,75",
    "80,69,78,67,73,76",
    "84,69,76,69,80,72,79,78,69",
    "67,65,77,69,82,65",
    "84,65,66,76,69",
    "67,72,65,73,82",
    "80,73,76,76,79,87",
    "66,79,79,75,67,65,83,69",
    "78,79,84,69,66,79,79,75",
    "83,85,73,84,67,65,83,69",
    "66,65,67,75,80,65,67,75",
    "72,69,65,68,80,72,79,78,69",

    "68,79,67,84,79,82",
    "84,69,65,67,72,69,82",
    "69,78,71,73,78,69,69,82",
    "65,82,84,73,83,84",
    "80,72,79,84,79,71,82,65,80,72,69,82",
    "77,85,83,73,67,73,65,78",
    "74,79,85,82,78,65,76,73,83,84",
    "68,69,83,73,71,78,69,82",
    "80,73,76,79,84",
    "65,82,67,72,73,84,69,67,84",
    "83,67,73,69,78,84,73,83,84",
    "65,67,67,79,85,78,84,65,78,84",
    "77,65,78,65,71,69,82",
    "80,82,79,71,82,65,77,77,69,82",

    "65,68,86,69,78,84,85,82,69",
    "67,85,82,73,79,83,73,84,89",
    "73,77,65,71,73,78,65,84,73,79,78",
    "65,68,86,69,78,84,85,82,79,85,83",
    "67,72,65,76,76,69,78,71,69",
    "68,73,83,67,79,86,69,82,89",
    "69,88,80,76,79,82,65,84,73,79,78",
    "73,78,83,80,73,82,65,84,73,79,78",
    "67,82,69,65,84,73,86,73,84,89",
    "75,78,79,87,76,69,68,71,69",
    "65,77,66,73,84,73,79,78",
    "68,69,84,69,82,77,73,78,65,84,73,79,78",
    "82,69,83,73,76,73,69,78,67,69",
    "67,79,77,77,85,78,73,84,89",
    "68,73,86,69,82,83,73,84,89",
    "68,73,83,67,73,80,76,73,78,69",
    "65,68,86,69,78,84,85,82,69",
    "80,69,82,83,80,69,67,84,73,86,69",
    "73,77,80,82,69,83,83,73,79,78",
    "67,79,78,83,73,83,84,69,78,67,89",
    "80,82,79,66,76,69,77",
    "83,84,82,65,84,69,71,89",
    "67,72,65,76,76,69,78,71,69",
    "68,73,83,67,73,80,76,73,78,69",
    "67,82,69,65,84,73,86,69,78,69,83,83"
  ];

  /* ============================================================
     WORD DECODER
     ============================================================ */

  function decodeWord(encoded) {
    return encoded
      .split(",")
      .map((code) =>
        String.fromCharCode(Number(code))
      )
      .join("")
      .toUpperCase();
  }

  function getDifficulty(word) {
    const length = word.length;

    if (length >= 8 && length <= 9) {
      return "Easy";
    }

    if (length >= 10 && length <= 11) {
      return "Medium";
    }

    if (length >= 12) {
      return "Hard";
    }

    return null;
  }

  const CATEGORY_RANGES = [
    { category: "Animals", start: 0, end: 20 },
    { category: "Nature", start: 20, end: 36 },
    { category: "Places", start: 36, end: 56 },
    { category: "Science", start: 56, end: 71 },
    { category: "Food", start: 71, end: 87 },
    { category: "Technology", start: 87, end: 100 },
    { category: "Sports", start: 100, end: 116 },
    { category: "Travel", start: 116, end: 132 },
    { category: "Objects", start: 132, end: 148 },
    { category: "Professions", start: 148, end: 162 },
    { category: "General", start: 162, end: WORD_DATA.length }
  ];

  function getCategory(index) {
    const group = CATEGORY_RANGES.find(
      (entry) =>
        index >= entry.start &&
        index < entry.end
    );

    return group
      ? group.category
      : "General";
  }

  const WORD_BANK =
    WORD_DATA
      .map((encoded, index) => {
        const word = decodeWord(encoded);

        return {
          word,
          category: getCategory(index),
          difficulty: getDifficulty(word)
        };
      })
      .filter((entry) => entry.difficulty);

  /* ============================================================
     STATE
     ============================================================ */

  let currentWord = "";
  let currentCategory = "";
  let currentDifficulty = "";

  let guessedLetters = new Set();

  let wrongGuesses = 0;
  let score = 0;
  let streak = 0;

  let bestScore = readBestScore();

  let gameFinished = false;
  let destroyed = false;

  let lastWord = "";

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
     WORD SELECTION
     ============================================================ */

  function getRandomWord() {
    if (!WORD_BANK.length) {
      return null;
    }

    let candidates = WORD_BANK.filter(
      (entry) => entry.word !== lastWord
    );

    if (!candidates.length) {
      candidates = WORD_BANK;
    }

    return candidates[
      Math.floor(
        Math.random() * candidates.length
      )
    ];
  }

  /* ============================================================
     UI
     ============================================================ */

  function updateScoreUI() {
    scoreElement.textContent = String(score);
    streakElement.textContent = String(streak);

    attemptsElement.textContent =
      String(
        Math.max(
          0,
          MAX_ATTEMPTS - wrongGuesses
        )
      );

    if (appScore) {
      appScore.textContent = String(score);
    }

    if (appBest) {
      appBest.textContent = String(bestScore);
    }

    if (appStatus) {
      appStatus.textContent =
        `${Math.max(
          0,
          MAX_ATTEMPTS - wrongGuesses
        )}`;
    }

    if (appScoreLabel) {
      appScoreLabel.textContent = "Score";
    }

    if (appBestLabel) {
      appBestLabel.textContent = "Best";
    }

    if (appStatusLabel) {
      appStatusLabel.textContent = "Lives";
    }
  }

  function setStatus(text) {
    statusElement.textContent = text;
  }

  function hideOverlay() {
    overlay.classList.remove("is-visible");
  }

  /* ============================================================
     DRAWING
     ============================================================ */

  function renderDrawing() {
    drawingParts.forEach((part, index) => {
      part.classList.toggle(
        "is-visible",
        index <= wrongGuesses - 1
      );
    });
  }

  /* ============================================================
     WORD
     ============================================================ */

  function renderWord() {
    wordElement.replaceChildren();

    for (const letter of currentWord) {
      const element =
        document.createElement("span");

      element.className =
        "hangman-letter";

      if (
        guessedLetters.has(letter) ||
        gameFinished
      ) {
        element.textContent = letter;

        element.classList.add(
          "is-revealed"
        );

        if (
          !guessedLetters.has(letter)
        ) {
          element.classList.add(
            "is-missed"
          );
        }
      }

      wordElement.append(element);
    }
  }

  /* ============================================================
     KEYBOARD
     ============================================================ */

  function renderKeyboard() {
    keyboardElement.replaceChildren();

    for (const letter of ALPHABET) {
      const button =
        document.createElement("button");

      button.type = "button";
      button.className = "hangman-key";
      button.textContent = letter;
      button.dataset.letter = letter;

      const guessed =
        guessedLetters.has(letter);

      button.disabled =
        guessed || gameFinished;

      if (guessed) {
        if (currentWord.includes(letter)) {
          button.classList.add(
            "is-correct"
          );
        } else {
          button.classList.add(
            "is-wrong"
          );
        }
      }

      button.addEventListener(
        "click",
        handleLetterClick
      );

      keyboardElement.append(button);
    }
  }

  /* ============================================================
     GAME CHECK
     ============================================================ */

  function isWordComplete() {
    for (const letter of currentWord) {
      if (!guessedLetters.has(letter)) {
        return false;
      }
    }

    return true;
  }

  /* ============================================================
     LETTER GUESS
     ============================================================ */

  function guessLetter(letter) {
    if (destroyed || gameFinished) {
      return;
    }

    const normalized =
      String(letter).toUpperCase();

    if (
      !ALPHABET.includes(normalized) ||
      guessedLetters.has(normalized)
    ) {
      return;
    }

    guessedLetters.add(normalized);

    if (currentWord.includes(normalized)) {
      playTone(560);
      vibrate(8);

      setStatus("Nice! Keep going.");

      renderWord();
      renderKeyboard();

      if (isWordComplete()) {
        finishWin();
        return;
      }
    } else {
      wrongGuesses++;

      playTone(180);
      vibrate(25);

      if (wrongGuesses >= MAX_ATTEMPTS) {
        finishLoss();
        return;
      }

      setStatus(
        `Wrong letter — ${
          MAX_ATTEMPTS - wrongGuesses
        } attempts left`
      );

      renderDrawing();
      renderWord();
      renderKeyboard();
    }

    updateScoreUI();
  }

  function handleLetterClick(event) {
    if (destroyed) {
      return;
    }

    guessLetter(
      event.currentTarget.dataset.letter
    );
  }

  /* ============================================================
     FINISH STATES
     ============================================================ */

  function finishWin() {
    if (gameFinished) {
      return;
    }

    gameFinished = true;

    streak++;

    const difficultyBonus =
      currentDifficulty === "Hard"
        ? 3
        : currentDifficulty === "Medium"
          ? 2
          : 1;

    const remainingBonus =
      Math.max(
        0,
        MAX_ATTEMPTS - wrongGuesses
      );

    const wordBonus =
      currentWord.length * 10;

    score +=
      100 +
      wordBonus +
      remainingBonus * 10 +
      difficultyBonus * 25;

    if (score > bestScore) {
      bestScore = score;
      saveBestScore();
    }

    setStatus(
      "Perfect! You found the word!"
    );

    playTone(880);
    vibrate([25, 40, 55]);

    renderWord();
    renderKeyboard();
    renderDrawing();
    updateScoreUI();

    showOverlay("win");
  }

  function finishLoss() {
    if (gameFinished) {
      return;
    }

    gameFinished = true;
    streak = 0;

    setStatus(
      `The word was ${currentWord}`
    );

    playTone(120);
    vibrate(100);

    renderWord();
    renderKeyboard();
    renderDrawing();
    updateScoreUI();

    showOverlay("loss");
  }

  /* ============================================================
     OVERLAY
     ============================================================ */

  function showOverlay(type) {
    if (type === "win") {
      overlayIcon.textContent = "🎉";
      overlayTitle.textContent = "You Win!";
      overlayMessage.textContent =
        `You found ${currentWord}!`;
    } else {
      overlayIcon.textContent = "💀";
      overlayTitle.textContent = "Game Over";
      overlayMessage.textContent =
        `The word was ${currentWord}.`;
    }

    finalScore.textContent = String(score);
    finalStreak.textContent = String(streak);

    overlay.classList.add("is-visible");
  }

  /* ============================================================
     NEW WORD
     ============================================================ */

  function startGame() {
    if (destroyed) {
      return;
    }

    const entry = getRandomWord();

    if (!entry) {
      setStatus("No words available.");
      return;
    }

    currentWord = entry.word;
    currentCategory = entry.category;
    currentDifficulty = entry.difficulty;

    lastWord = currentWord;

    guessedLetters = new Set();

    wrongGuesses = 0;
    gameFinished = false;

    categoryElement.textContent =
      currentCategory;

    difficultyElement.textContent =
      currentDifficulty;

    hideOverlay();

    renderDrawing();
    renderWord();
    renderKeyboard();

    setStatus("Guess the word!");

    updateScoreUI();
  }

  /* ============================================================
     KEYBOARD INPUT
     ============================================================ */

  function handleKeyDown(event) {
    if (destroyed) {
      return;
    }

    const target = event.target;

    if (
      target &&
      (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      )
    ) {
      return;
    }

    const key =
      String(event.key).toUpperCase();

    if (ALPHABET.includes(key)) {
      event.preventDefault();
      guessLetter(key);
    }
  }

  /* ============================================================
     BUTTONS
     ============================================================ */

  function handleNewWord() {
    startGame();
  }

  function handleOverlayNewWord() {
    startGame();
  }

  function handleBack() {
    if (destroyed) {
      return;
    }

    root.dispatchEvent(
      new CustomEvent(
        "miniArcade:backToArcade",
        {
          bubbles: true
        }
      )
    );
  }

  /* ============================================================
     EVENTS
     ============================================================ */

  window.addEventListener(
    "keydown",
    handleKeyDown
  );

  newWordButton.addEventListener(
    "click",
    handleNewWord
  );

  overlayNewButton.addEventListener(
    "click",
    handleOverlayNewWord
  );

  backButton.addEventListener(
    "click",
    handleBack
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

    window.removeEventListener(
      "keydown",
      handleKeyDown
    );

    newWordButton.removeEventListener(
      "click",
      handleNewWord
    );

    overlayNewButton.removeEventListener(
      "click",
      handleOverlayNewWord
    );

    backButton.removeEventListener(
      "click",
      handleBack
    );

    keyboardElement
      .querySelectorAll("button")
      .forEach((button) => {
        button.removeEventListener(
          "click",
          handleLetterClick
        );
      });

    guessedLetters.clear();

    currentWord = "";
    currentCategory = "";
    currentDifficulty = "";

    gameFinished = true;

    root.innerHTML = "";
  }

  /* ============================================================
     INITIALIZE
     ============================================================ */

  startGame();

  return {
    reset,
    destroy
  };
}
