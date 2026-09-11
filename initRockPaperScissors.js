export default function initRockPaperScissors(root) {
  root.innerHTML = `
    <style>
      [data-game="rock-paper-scissors"] .rps-choice-row {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 14px;
        width: 100%;
        margin-top: 22px;
      }

      [data-game="rock-paper-scissors"] .rps-choice {
        min-height: 170px;
        padding: 18px 10px;
        border-radius: 22px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 10px;
        cursor: pointer;
        transition:
          transform 0.18s ease,
          box-shadow 0.18s ease,
          border-color 0.18s ease;
      }

      [data-game="rock-paper-scissors"] .rps-choice:hover {
        transform: translateY(-4px);
      }

      [data-game="rock-paper-scissors"] .rps-choice:active {
        transform: scale(0.96);
      }

      [data-game="rock-paper-scissors"] .rps-choice-icon {
        display: block;
        font-size: clamp(3.8rem, 10vw, 5.5rem);
        line-height: 1;
        filter: drop-shadow(0 8px 12px rgba(0, 0, 0, 0.18));
      }

      [data-game="rock-paper-scissors"] .rps-choice-label {
        display: block;
        font-size: 0.95rem;
        font-weight: 800;
        letter-spacing: 0.04em;
      }

      [data-game="rock-paper-scissors"] .rps-result-choices {
        font-size: 2.5rem;
      }

      [data-game="rock-paper-scissors"] .rps-result-choice {
        display: inline-block;
        min-width: 42px;
        text-align: center;
      }

      @media (max-width: 560px) {
        [data-game="rock-paper-scissors"] .rps-choice-row {
          gap: 9px;
        }

        [data-game="rock-paper-scissors"] .rps-choice {
          min-height: 145px;
          padding: 14px 6px;
          border-radius: 18px;
        }

        [data-game="rock-paper-scissors"] .rps-choice-icon {
          font-size: clamp(3.2rem, 16vw, 4.5rem);
        }

        [data-game="rock-paper-scissors"] .rps-choice-label {
          font-size: 0.8rem;
        }
      }
    </style>

    <section
      data-game="rock-paper-scissors"
      class="ttt-screen"
    >
      <div class="ttt-header">
        <div>
          <p class="eyebrow">Game</p>
          <h3>Rock Paper Scissors</h3>
        </div>

        <div class="ttt-status">
          <span
            class="ttt-status-mark"
            aria-hidden="true"
          >
            ✊
          </span>

          <span>RPS</span>
        </div>
      </div>

      <div class="game-score">
        <div class="score-unit">
          <span>You</span>
          <strong data-player-score>0</strong>
        </div>

        <div class="score-unit score-unit-center">
          <span>Result</span>
          <strong>VS</strong>
        </div>

        <div class="score-unit">
          <span>Computer</span>
          <strong data-computer-score>0</strong>
        </div>
      </div>

      <div
        class="status-line"
        data-result
        aria-live="polite"
      >
        Choose your move
      </div>

      <!-- BIG RPS CHOICES -->
      <div class="rps-choice-row">

        <button
          type="button"
          class="button button-primary rps-choice"
          data-choice="rock"
          aria-label="Choose Rock"
        >
          <span
            class="rps-choice-icon"
            aria-hidden="true"
          >
            🪨
          </span>

          <span class="rps-choice-label">
            Rock
          </span>
        </button>

        <button
          type="button"
          class="button button-primary rps-choice"
          data-choice="paper"
          aria-label="Choose Paper"
        >
          <span
            class="rps-choice-icon"
            aria-hidden="true"
          >
            📄
          </span>

          <span class="rps-choice-label">
            Paper
          </span>
        </button>

        <button
          type="button"
          class="button button-primary rps-choice"
          data-choice="scissors"
          aria-label="Choose Scissors"
        >
          <span
            class="rps-choice-icon"
            aria-hidden="true"
          >
            ✂️
          </span>

          <span class="rps-choice-label">
            Scissors
          </span>
        </button>

      </div>

      <div class="ttt-footer">
        <span class="rps-result-choices">
          <span
            class="rps-result-choice"
            data-player-choice
            aria-label="Your choice"
          >
            ❔
          </span>

          <span aria-hidden="true">vs</span>

          <span
            class="rps-result-choice"
            data-computer-choice
            aria-label="Computer choice"
          >
            ❔
          </span>
        </span>

        <button
          type="button"
          class="button button-quiet ttt-new-round"
          data-reset-rps
        >
          New Round
        </button>
      </div>
    </section>
  `;

  const playerScore =
    root.querySelector("[data-player-score]");

  const computerScore =
    root.querySelector("[data-computer-score]");

  const result =
    root.querySelector("[data-result]");

  const playerChoice =
    root.querySelector("[data-player-choice]");

  const computerChoice =
    root.querySelector("[data-computer-choice]");

  const choices = {
    rock: "🪨",
    paper: "📄",
    scissors: "✂️"
  };

  let playerPoints = 0;
  let computerPoints = 0;

  function getComputerChoice() {
    const values = [
      "rock",
      "paper",
      "scissors"
    ];

    return values[
      Math.floor(
        Math.random() * values.length
      )
    ];
  }

  function getResult(player, computer) {
    if (player === computer) {
      return "draw";
    }

    if (
      (player === "rock" &&
        computer === "scissors") ||
      (player === "paper" &&
        computer === "rock") ||
      (player === "scissors" &&
        computer === "paper")
    ) {
      return "win";
    }

    return "lose";
  }

  function playRound(player) {
    const computer =
      getComputerChoice();

    const roundResult =
      getResult(player, computer);

    playerChoice.textContent =
      choices[player];

    computerChoice.textContent =
      choices[computer];

    if (roundResult === "win") {
      playerPoints += 1;

      result.textContent =
        "You win! 🎉";

      result.classList.add(
        "is-win"
      );

      result.classList.remove(
        "is-draw"
      );
    } else if (roundResult === "lose") {
      computerPoints += 1;

      result.textContent =
        "Computer wins!";

      result.classList.remove(
        "is-win",
        "is-draw"
      );
    } else {
      result.textContent =
        "It's a draw!";

      result.classList.add(
        "is-draw"
      );

      result.classList.remove(
        "is-win"
      );
    }

    playerScore.textContent =
      playerPoints;

    computerScore.textContent =
      computerPoints;
  }

  function reset() {
    playerPoints = 0;
    computerPoints = 0;

    playerScore.textContent = "0";
    computerScore.textContent = "0";

    playerChoice.textContent = "❔";
    computerChoice.textContent = "❔";

    result.textContent =
      "Choose your move";

    result.classList.remove(
      "is-win",
      "is-draw"
    );
  }

  root
    .querySelectorAll("[data-choice]")
    .forEach((button) => {
      button.addEventListener(
        "click",
        () => {
          playRound(
            button.dataset.choice
          );
        }
      );
    });

  root
    .querySelector("[data-reset-rps]")
    .addEventListener(
      "click",
      reset
    );

   /* ============================================================
     PUBLIC API
     ============================================================ */

  return {
    reset,

    destroy() {
      // No timers or global listeners to clean up.
    }
  };
}

