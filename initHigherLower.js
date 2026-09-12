export default function initHigherLower(root) {
  console.log("HIGHER LOWER FILE LOADED");

  /* ============================================================
     LOCAL STYLES
     ============================================================ */

  root.innerHTML = `
    <style>
      .hl7-game {
        --hl-accent: #fbbf24;
        --hl-green: #4ade80;
        --hl-red: #fb7185;
        --hl-orange: #fb923c;

        width: 100%;
        max-width: 680px;
        margin: 0 auto;
        padding: 6px 0 12px;
        box-sizing: border-box;

        /* Prevent accidental horizontal overflow */
        min-width: 0;
        overflow: hidden;
      }

      .hl7-game *,
      .hl7-game *::before,
      .hl7-game *::after {
        box-sizing: border-box;
      }

      /* --------------------------------------------------------
         HEADER
         -------------------------------------------------------- */

      .hl7-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 13px;
        min-width: 0;
      }

      .hl7-header > div:first-child {
        min-width: 0;
      }

      .hl7-eyebrow {
        margin: 0 0 3px;
        font-size: 0.7rem;
        font-weight: 800;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        opacity: 0.55;
      }

      .hl7-title {
        margin: 0;
        font-size: clamp(1.4rem, 5vw, 2.15rem);
        line-height: 1;
        letter-spacing: -0.045em;
      }

      .hl7-badge {
        flex: 0 0 auto;

        display: inline-flex;
        align-items: center;
        gap: 6px;

        padding: 7px 10px;
        border-radius: 999px;

        border: 1px solid rgba(255,255,255,0.09);
        background: rgba(255,255,255,0.045);

        font-size: 0.74rem;
        font-weight: 800;
        white-space: nowrap;
      }

      .hl7-badge-icon {
        font-size: 0.95rem;
      }

      /* --------------------------------------------------------
         SCORE
         -------------------------------------------------------- */

      .hl7-score {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 8px;
        margin-bottom: 10px;
      }

      .hl7-score-box {
        min-width: 0;
        padding: 8px 6px;
        text-align: center;

        border-radius: 14px;
        border: 1px solid rgba(255,255,255,0.07);
        background: rgba(255,255,255,0.035);
      }

      .hl7-score-box span {
        display: block;
        margin-bottom: 3px;

        font-size: 0.64rem;
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        opacity: 0.52;
      }

      .hl7-score-box strong {
        display: block;
        font-size: 1.35rem;
        line-height: 1;
      }

      .hl7-score-box.is-best strong {
        color: var(--hl-accent);
      }

      /* --------------------------------------------------------
         MESSAGE
         -------------------------------------------------------- */

      .hl7-result {
        min-height: 38px;

        display: grid;
        place-items: center;

        padding: 3px 8px;

        text-align: center;
        font-size: clamp(0.86rem, 3vw, 1.02rem);
        font-weight: 800;

        line-height: 1.2;

        transition:
          color 160ms ease,
          transform 160ms ease;
      }

      .hl7-result.is-win {
        color: var(--hl-green);
        animation: hl7-pop 260ms ease-out;
      }

      .hl7-result.is-draw {
        color: var(--hl-accent);
        animation: hl7-pop 260ms ease-out;
      }

      @keyframes hl7-pop {
        0% {
          opacity: 0;
          transform: scale(0.9);
        }

        100% {
          opacity: 1;
          transform: scale(1);
        }
      }

      /* --------------------------------------------------------
         CARD STAGE
         --------------------------------------------------------

         IMPORTANT:
         The old version used a fixed card width on desktop.
         Because the card has aspect-ratio: 0.69, that created
         a very tall card and caused vertical overflow.

         The new version sizes the card from HEIGHT first.
         This makes short laptop/PC screens safe.
      */

      .hl7-card-stage {
        min-height: 0;

        display: grid;
        place-items: center;

        padding: 3px 0 10px;

        perspective: 900px;

        /* Never let the stage create a huge fixed vertical area */
        overflow: visible;
      }

      .hl7-card {
        position: relative;

        /*
         * Height is now the primary responsive dimension.
         *
         * - smaller screens -> smaller card
         * - tall screens -> larger card
         * - never below 210px
         * - never above 285px
         */
        height: clamp(
          210px,
          31vh,
          285px
        );

        width: auto;
        aspect-ratio: 0.69;

        min-width: 0;
        max-width: calc(100% - 20px);

        border-radius: clamp(
          19px,
          2.8vh,
          25px
        );

        display: flex;
        align-items: center;
        justify-content: center;

        color: #111827;

        background:
          linear-gradient(
            145deg,
            #ffffff 0%,
            #f7f8fc 100%
          );

        box-shadow:
          0 20px 45px rgba(0,0,0,0.25),
          0 6px 16px rgba(0,0,0,0.14),
          inset 0 0 0 1px rgba(0,0,0,0.04);

        border: 1px solid rgba(255,255,255,0.8);

        overflow: hidden;

        transform-style: preserve-3d;

        transition:
          transform 180ms ease,
          box-shadow 180ms ease;
      }

      .hl7-card::before {
        content: "";
        position: absolute;
        inset: 8px;

        border: 1px solid rgba(0,0,0,0.08);
        border-radius: 15px;

        pointer-events: none;
      }

      .hl7-card::after {
        content: "";
        position: absolute;
        inset: 0;

        background:
          linear-gradient(
            125deg,
            rgba(255,255,255,0.55),
            transparent 38%
          );

        pointer-events: none;
      }

      .hl7-card.is-red {
        color: #e11d48;
      }

      .hl7-card.is-black {
        color: #111827;
      }

      /* --------------------------------------------------------
         CARD CORNERS
         -------------------------------------------------------- */

      .hl7-corner {
        position: absolute;
        z-index: 3;

        display: flex;
        flex-direction: column;
        align-items: center;

        line-height: 0.9;
        font-weight: 950;
      }

      .hl7-corner-top {
        top: 17px;
        left: 18px;
      }

      .hl7-corner-bottom {
        right: 18px;
        bottom: 17px;
        transform: rotate(180deg);
      }

      .hl7-corner-rank {
        font-size: clamp(
          1.35rem,
          4.5vh,
          1.85rem
        );
      }

      .hl7-corner-suit {
        margin-top: 3px;
        font-size: clamp(
          0.95rem,
          3.2vh,
          1.25rem
        );
      }

      /* --------------------------------------------------------
         BIG CENTER SUIT
         -------------------------------------------------------- */

      .hl7-center {
        position: relative;
        z-index: 2;

        display: grid;
        place-items: center;

        /*
         * Scale from card height rather than viewport width.
         * This keeps the symbol proportional when the card
         * shrinks on short screens.
         */
        font-size: clamp(
          4.2rem,
          11vh,
          6.8rem
        );

        line-height: 1;
        font-weight: 400;

        text-shadow:
          0 5px 14px rgba(0,0,0,0.08);

        transform: translateY(3px);
      }

      /* --------------------------------------------------------
         REVEAL
         -------------------------------------------------------- */

      .hl7-card.is-revealing {
        animation:
          hl7-card-reveal
          360ms
          cubic-bezier(.2,.8,.2,1);
      }

      @keyframes hl7-card-reveal {
        0% {
          opacity: 0.5;
          transform:
            translateY(10px)
            scale(0.88)
            rotateY(15deg);
        }

        55% {
          opacity: 1;
          transform:
            translateY(-4px)
            scale(1.035)
            rotateY(-4deg);
        }

        100% {
          opacity: 1;
          transform:
            translateY(0)
            scale(1)
            rotateY(0);
        }
      }

      /* --------------------------------------------------------
         CHOICES
         -------------------------------------------------------- */

      .hl7-choices {
        display: grid;
        grid-template-columns: repeat(
          2,
          minmax(0, 1fr)
        );

        gap: 10px;

        width: 100%;
        max-width: 560px;

        margin: 0 auto;
      }

      .hl7-choice {
        appearance: none;
        border: 1px solid rgba(255,255,255,0.08);

        min-height: 64px;
        padding: 9px 10px;

        border-radius: 17px;

        display: flex;
        align-items: center;
        justify-content: center;

        gap: 8px;

        min-width: 0;

        color: #fff;
        background: rgba(255,255,255,0.055);

        font: inherit;
        font-size: clamp(
          0.78rem,
          2.5vw,
          0.95rem
        );

        font-weight: 950;
        letter-spacing: 0.07em;

        cursor: pointer;

        box-shadow:
          0 6px 16px rgba(0,0,0,0.11);

        transition:
          transform 140ms ease,
          background 140ms ease,
          border-color 140ms ease,
          opacity 140ms ease;
      }

      .hl7-choice-icon {
        flex: 0 0 auto;

        font-size: 1.3rem;
        line-height: 1;
      }

      .hl7-choice[data-choice="higher"] {
        --choice: var(--hl-green);
      }

      .hl7-choice[data-choice="lower"] {
        --choice: var(--hl-orange);
      }

      .hl7-choice:hover:not(:disabled) {
        transform: translateY(-3px);

        background: color-mix(
          in srgb,
          var(--choice) 12%,
          transparent
        );

        border-color: color-mix(
          in srgb,
          var(--choice) 40%,
          transparent
        );
      }

      .hl7-choice:active:not(:disabled) {
        transform:
          translateY(1px)
          scale(0.98);
      }

      .hl7-choice:disabled {
        opacity: 0.38;
        cursor: not-allowed;
      }

      /* --------------------------------------------------------
         FOOTER
         -------------------------------------------------------- */

      .hl7-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;

        gap: 10px;

        margin-top: 12px;

        min-width: 0;
      }

      .hl7-run-message {
        min-width: 0;

        font-size: 0.76rem;
        font-weight: 750;
        opacity: 0.62;

        line-height: 1.2;
      }

      .hl7-reset {
        appearance: none;
        border: 0;
        border-radius: 999px;

        flex: 0 0 auto;

        padding: 8px 12px;

        color: inherit;
        background: rgba(255,255,255,0.055);

        font: inherit;
        font-size: 0.74rem;
        font-weight: 800;

        cursor: pointer;

        transition:
          transform 140ms ease,
          background 140ms ease;
      }

      .hl7-reset:hover {
        transform: translateY(-2px);
        background: rgba(255,255,255,0.09);
      }

      .hl7-reset:active {
        transform: translateY(0);
      }

      /* --------------------------------------------------------
         LIGHT THEME
         -------------------------------------------------------- */

      [data-theme="light"] .hl7-badge,
      [data-theme="light"] .hl7-score-box,
      [data-theme="light"] .hl7-choice,
      [data-theme="light"] .hl7-reset {
        border-color: rgba(0,0,0,0.07);
        background: rgba(0,0,0,0.035);
      }

      [data-theme="light"] .hl7-card {
        box-shadow:
          0 20px 40px rgba(31,41,55,0.15),
          0 6px 14px rgba(31,41,55,0.08),
          inset 0 0 0 1px rgba(0,0,0,0.04);
      }

      /* --------------------------------------------------------
         SMALL PHONES
         -------------------------------------------------------- */

      @media (max-width: 520px) {
        .hl7-game {
          padding-top: 1px;
          padding-bottom: 8px;
        }

        .hl7-header {
          margin-bottom: 9px;
          gap: 8px;
        }

        .hl7-title {
          font-size: clamp(
            1.3rem,
            7vw,
            1.55rem
          );
        }

        .hl7-badge {
          padding: 6px 8px;
          font-size: 0.66rem;
        }

        .hl7-score {
          gap: 6px;
          margin-bottom: 7px;
        }

        .hl7-score-box {
          padding: 7px 5px;
          border-radius: 12px;
        }

        .hl7-score-box span {
          font-size: 0.59rem;
        }

        .hl7-score-box strong {
          font-size: 1.2rem;
        }

        .hl7-result {
          min-height: 34px;
          font-size: 0.84rem;
        }

        .hl7-card-stage {
          padding: 1px 0 7px;
        }

        .hl7-card {
          height: clamp(
            190px,
            31vh,
            255px
          );
        }

        .hl7-corner-top {
          top: 14px;
          left: 15px;
        }

        .hl7-corner-bottom {
          right: 15px;
          bottom: 14px;
        }

        .hl7-center {
          font-size: clamp(
            3.8rem,
            11vh,
            5.9rem
          );
        }

        .hl7-choice {
          min-height: 58px;
          padding: 8px 7px;
          border-radius: 15px;
        }

        .hl7-choice-icon {
          font-size: 1.15rem;
        }

        .hl7-footer {
          flex-direction: column;
          justify-content: center;
          text-align: center;
          margin-top: 9px;
        }

        .hl7-run-message {
          width: 100%;
        }

        .hl7-reset {
          width: 100%;
          max-width: 260px;
        }
      }

      /* --------------------------------------------------------
         VERY SHORT PHONES / LANDSCAPE
         -------------------------------------------------------- */

      @media (max-height: 680px) {
        .hl7-game {
          padding-top: 0;
          padding-bottom: 5px;
        }

        .hl7-header {
          margin-bottom: 7px;
        }

        .hl7-score {
          margin-bottom: 4px;
        }

        .hl7-result {
          min-height: 30px;
        }

        .hl7-card {
          height: clamp(
            175px,
            29vh,
            225px
          );
        }

        .hl7-card-stage {
          padding-top: 0;
          padding-bottom: 5px;
        }

        .hl7-choice {
          min-height: 52px;
        }

        .hl7-footer {
          margin-top: 7px;
        }
      }

      /* --------------------------------------------------------
         VERY SHORT DESKTOP / LAPTOP
         -------------------------------------------------------- */

      @media (min-width: 521px) and (max-height: 760px) {
        .hl7-game {
          padding-top: 2px;
          padding-bottom: 6px;
        }

        .hl7-header {
          margin-bottom: 8px;
        }

        .hl7-score {
          margin-bottom: 5px;
        }

        .hl7-result {
          min-height: 32px;
        }

        .hl7-card {
          height: clamp(
            185px,
            28vh,
            235px
          );
        }

        .hl7-card-stage {
          padding-top: 0;
          padding-bottom: 6px;
        }

        .hl7-choice {
          min-height: 58px;
        }

        .hl7-footer {
          margin-top: 8px;
        }
      }

      /* --------------------------------------------------------
         TALLER DESKTOP
         -------------------------------------------------------- */

      @media (min-width: 800px) and (min-height: 761px) {
        .hl7-card {
          height: clamp(
            230px,
            31vh,
            285px
          );
        }

        .hl7-choice {
          min-height: 70px;
          font-size: 0.96rem;
        }
      }

      /* --------------------------------------------------------
         REDUCED MOTION
         -------------------------------------------------------- */

      @media (prefers-reduced-motion: reduce) {
        .hl7-card,
        .hl7-choice,
        .hl7-reset {
          transition: none;
        }

        .hl7-card.is-revealing,
        .hl7-result.is-win,
        .hl7-result.is-draw {
          animation: none;
        }
      }
    </style>

    <section
      class="hl7-game"
      data-game="higher-lower"
    >
      <header class="hl7-header">
        <div>
          <p class="hl7-eyebrow">Game</p>
          <h3 class="hl7-title">Higher or Lower</h3>
        </div>

        <div class="hl7-badge">
          <span
            class="hl7-badge-icon"
            aria-hidden="true"
          >
            🃏
          </span>
          <span>STREAK</span>
        </div>
      </header>

      <div class="hl7-score">
        <div class="hl7-score-box">
          <span>Streak</span>
          <strong data-current-streak>0</strong>
        </div>

        <div class="hl7-score-box is-best">
          <span>Best</span>
          <strong data-best-streak>0</strong>
        </div>

        <div class="hl7-score-box">
          <span>Cards</span>
          <strong data-cards-left>51</strong>
        </div>
      </div>

      <div
        class="hl7-result"
        data-result
        aria-live="polite"
      >
        Will the next card be higher or lower?
      </div>

      <div class="hl7-card-stage">
        <div
          class="hl7-card"
          data-card
          aria-label="Current card"
        >
          <div class="hl7-corner hl7-corner-top">
            <span
              class="hl7-corner-rank"
              data-card-rank
            >?</span>

            <span
              class="hl7-corner-suit"
              data-card-suit
            >?</span>
          </div>

          <div
            class="hl7-center"
            data-card-center
            aria-hidden="true"
          >
            🃏
          </div>

          <div class="hl7-corner hl7-corner-bottom">
            <span
              class="hl7-corner-rank"
              data-card-rank-bottom
            >?</span>

            <span
              class="hl7-corner-suit"
              data-card-suit-bottom
            >?</span>
          </div>
        </div>
      </div>

      <div class="hl7-choices">
        <button
          type="button"
          class="hl7-choice"
          data-choice="higher"
        >
          <span
            class="hl7-choice-icon"
            aria-hidden="true"
          >▲</span>

          <span>HIGHER</span>
        </button>

        <button
          type="button"
          class="hl7-choice"
          data-choice="lower"
        >
          <span
            class="hl7-choice-icon"
            aria-hidden="true"
          >▼</span>

          <span>LOWER</span>
        </button>
      </div>

      <div class="hl7-footer">
        <span
          class="hl7-run-message"
          data-run-message
        >
          Build your streak
        </span>

        <button
          type="button"
          class="hl7-reset"
          data-reset-hl
        >
          ↻ Play Again
        </button>
      </div>
    </section>
  `;

  /* ============================================================
     ELEMENTS
     ============================================================ */

  const cardElement =
    root.querySelector("[data-card]");

  const cardRank =
    root.querySelector("[data-card-rank]");

  const cardSuit =
    root.querySelector("[data-card-suit]");

  const cardRankBottom =
    root.querySelector("[data-card-rank-bottom]");

  const cardSuitBottom =
    root.querySelector("[data-card-suit-bottom]");

  const cardCenter =
    root.querySelector("[data-card-center]");

  const result =
    root.querySelector("[data-result]");

  const currentStreakElement =
    root.querySelector("[data-current-streak]");

  const bestStreakElement =
    root.querySelector("[data-best-streak]");

  const cardsLeftElement =
    root.querySelector("[data-cards-left]");

  const runMessage =
    root.querySelector("[data-run-message]");

  const choiceButtons =
    root.querySelectorAll("[data-choice]");

  const resetButton =
    root.querySelector("[data-reset-hl]");

  /* ============================================================
     DECK
     ============================================================ */

  const SUITS = [
    {
      symbol: "♥",
      name: "Hearts",
      color: "red"
    },
    {
      symbol: "♦",
      name: "Diamonds",
      color: "red"
    },
    {
      symbol: "♣",
      name: "Clubs",
      color: "black"
    },
    {
      symbol: "♠",
      name: "Spades",
      color: "black"
    }
  ];

  const RANKS = [
    { name: "A", value: 1 },
    { name: "2", value: 2 },
    { name: "3", value: 3 },
    { name: "4", value: 4 },
    { name: "5", value: 5 },
    { name: "6", value: 6 },
    { name: "7", value: 7 },
    { name: "8", value: 8 },
    { name: "9", value: 9 },
    { name: "10", value: 10 },
    { name: "J", value: 11 },
    { name: "Q", value: 12 },
    { name: "K", value: 13 }
  ];

  const BEST_STREAK_KEY =
    "miniArcade.higherLower.bestStreak";

  let deck = [];
  let currentCard = null;
  let currentStreak = 0;
  let bestStreak = readBestStreak();
  let gameOver = false;

  let runToken = 0;
  let revealTimer = null;
  let nextChoiceTimer = null;

  /* ============================================================
     STORAGE
     ============================================================ */

  function readBestStreak() {
    try {
      const value =
        Number(
          localStorage.getItem(
            BEST_STREAK_KEY
          )
        );

      return Number.isFinite(value) &&
        value >= 0
        ? Math.floor(value)
        : 0;
    } catch (error) {
      return 0;
    }
  }

  function saveBestStreak() {
    try {
      localStorage.setItem(
        BEST_STREAK_KEY,
        String(bestStreak)
      );
    } catch (error) {
      // Storage may be unavailable.
    }
  }

  /* ============================================================
     TIMERS
     ============================================================ */

  function clearTimers() {
    if (revealTimer !== null) {
      window.clearTimeout(
        revealTimer
      );

      revealTimer = null;
    }

    if (nextChoiceTimer !== null) {
      window.clearTimeout(
        nextChoiceTimer
      );

      nextChoiceTimer = null;
    }
  }

  /* ============================================================
     DECK
     ============================================================ */

  function createDeck() {
    const newDeck = [];

    SUITS.forEach((suit) => {
      RANKS.forEach((rank) => {
        newDeck.push({
          suit: suit.symbol,
          suitName: suit.name,
          color: suit.color,
          rank: rank.name,
          value: rank.value
        });
      });
    });

    return newDeck;
  }

  function shuffle(cards) {
    for (
      let i = cards.length - 1;
      i > 0;
      i -= 1
    ) {
      const j =
        Math.floor(
          Math.random() * (i + 1)
        );

      [
        cards[i],
        cards[j]
      ] = [
        cards[j],
        cards[i]
      ];
    }

    return cards;
  }

  function drawCard() {
    if (!deck.length) {
      return null;
    }

    return deck.pop();
  }

  /* ============================================================
     CARD
     ============================================================ */

  function renderCard(card) {
    if (!card) {
      return;
    }

    cardRank.textContent =
      card.rank;

    cardSuit.textContent =
      card.suit;

    cardRankBottom.textContent =
      card.rank;

    cardSuitBottom.textContent =
      card.suit;

    cardCenter.textContent =
      card.suit;

    cardElement.classList.toggle(
      "is-red",
      card.color === "red"
    );

    cardElement.classList.toggle(
      "is-black",
      card.color === "black"
    );

    cardElement.setAttribute(
      "aria-label",
      `${card.rank} of ${card.suitName}`
    );
  }

  /* ============================================================
     SCORE
     ============================================================ */

  function updateScore() {
    currentStreakElement.textContent =
      currentStreak;

    bestStreakElement.textContent =
      bestStreak;

    cardsLeftElement.textContent =
      deck.length;
  }

  /* ============================================================
     BUTTONS
     ============================================================ */

  function setChoicesEnabled(enabled) {
    choiceButtons.forEach(
      (button) => {
        button.disabled =
          !enabled;
      }
    );
  }

  /* ============================================================
     ANIMATION
     ============================================================ */

  function animateReveal(callback, token) {
    cardElement.classList.remove(
      "is-revealing"
    );

    void cardElement.offsetWidth;

    cardElement.classList.add(
      "is-revealing"
    );

    revealTimer =
      window.setTimeout(
        () => {
          revealTimer = null;

          if (token !== runToken) {
            return;
          }

          callback();
        },
        180
      );
  }

  /* ============================================================
     START
     ============================================================ */

  function startGame() {
    clearTimers();

    runToken += 1;

    deck =
      shuffle(
        createDeck()
      );

    currentStreak = 0;
    gameOver = false;

    currentCard =
      drawCard();

    cardElement.classList.remove(
      "is-revealing"
    );

    result.classList.remove(
      "is-win",
      "is-draw"
    );

    result.textContent =
      "Will the next card be higher or lower?";

    runMessage.textContent =
      "Build your streak";

    if (currentCard) {
      renderCard(
        currentCard
      );
    }

    setChoicesEnabled(
      Boolean(currentCard)
    );

    updateScore();
  }

  /* ============================================================
     PLAY ROUND
     ============================================================ */

  function playRound(choice) {
    if (
      gameOver ||
      !currentCard ||
      (choice !== "higher" &&
        choice !== "lower")
    ) {
      return;
    }

    setChoicesEnabled(false);

    const previousCard =
      currentCard;

    const nextCard =
      drawCard();

    if (!nextCard) {
      gameOver = true;

      result.textContent =
        "Deck complete! 🏆";

      runMessage.textContent =
        `Final streak: ${currentStreak}.`;

      updateScore();

      return;
    }

    currentCard =
      nextCard;

    const token =
      runToken;

    animateReveal(
      () => {
        renderCard(
          nextCard
        );

        const isHigher =
          nextCard.value >
          previousCard.value;

        const isLower =
          nextCard.value <
          previousCard.value;

        const isTie =
          nextCard.value ===
          previousCard.value;

        const correct =
          (choice === "higher" &&
            isHigher) ||
          (choice === "lower" &&
            isLower);

        /* ------------------------------------------------------
           TIE
           ------------------------------------------------------ */

        if (isTie) {
          gameOver = true;

          result.classList.remove(
            "is-win"
          );

          result.classList.add(
            "is-draw"
          );

          result.textContent =
            "Same rank — run over!";

          runMessage.textContent =
            currentStreak > 0
              ? `Run ended at ${currentStreak}.`
              : "Start another run!";

          updateScore();

          return;
        }

        /* ------------------------------------------------------
           CORRECT
           ------------------------------------------------------ */

        if (correct) {
          currentStreak += 1;

          if (
            currentStreak >
            bestStreak
          ) {
            bestStreak =
              currentStreak;

            saveBestStreak();
          }

          result.classList.remove(
            "is-draw"
          );

          result.classList.add(
            "is-win"
          );

          result.textContent =
            choice === "higher"
              ? "Higher! 🎉"
              : "Lower! 🎉";

          runMessage.textContent =
            currentStreak >= 5
              ? "🔥 You're on fire!"
              : "Keep going...";

          updateScore();

          if (!deck.length) {
            gameOver = true;

            nextChoiceTimer =
              window.setTimeout(
                () => {
                  nextChoiceTimer =
                    null;

                  if (
                    token !==
                    runToken
                  ) {
                    return;
                  }

                  result.textContent =
                    "Deck complete! 🏆";

                  result.classList.remove(
                    "is-win"
                  );

                  runMessage.textContent =
                    `Final streak: ${currentStreak}.`;

                  setChoicesEnabled(
                    false
                  );
                },
                500
              );

            return;
          }

          nextChoiceTimer =
            window.setTimeout(
              () => {
                nextChoiceTimer =
                  null;

                if (
                  token !==
                  runToken
                ) {
                  return;
                }

                result.textContent =
                  "Next card — Higher or Lower?";

                result.classList.remove(
                  "is-win"
                );

                setChoicesEnabled(
                  true
                );
              },
              500
            );

          return;
        }

        /* ------------------------------------------------------
           WRONG
           ------------------------------------------------------ */

        gameOver = true;

        result.classList.remove(
          "is-win",
          "is-draw"
        );

        result.textContent =
          `Wrong! Your streak was ${currentStreak}.`;

        runMessage.textContent =
          currentStreak > 0
            ? `Run ended at ${currentStreak}.`
            : "Start another run!";

        updateScore();

        setChoicesEnabled(false);
      },
      token
    );
  }

  /* ============================================================
     EVENTS
     ============================================================ */

  choiceButtons.forEach(
    (button) => {
      button.addEventListener(
        "click",
        () => {
          playRound(
            button.dataset.choice
          );
        }
      );
    }
  );

  resetButton.addEventListener(
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
      clearTimers();
      runToken += 1;
    }
  };
}
