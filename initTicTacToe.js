console.log("TTT FILE LOADED");

export function initTicTacToe({
  state,
  dom,
  playTone,
  vibrate,
  showToast
}) {
  console.log("TTT: module initialized");

  const styleId = "tictactoe-local-styles";

  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      .ttt-screen[data-game="tictactoe"] {
        width: 100%;
        max-width: 520px;
        margin: 0 auto;
        padding: clamp(8px, 1.8vh, 16px);
        gap: clamp(8px, 1.5vh, 14px);
        box-sizing: border-box;
      }
      .ttt-screen[data-game="tictactoe"] .ttt-header {
        margin-bottom: 0;
      }
      .ttt-screen[data-game="tictactoe"] .ttt-board {
        width: min(
          100%,
          380px,
          max(180px, calc((100svh - 275px) * 0.95)),
          max(180px, calc((100dvh - 275px) * 0.95))
        );
        aspect-ratio: 1 / 1;
        gap: clamp(6px, 1.2vh, 9px);
        margin: 0 auto;
      }
      .ttt-screen[data-game="tictactoe"] .ttt-cell {
        aspect-ratio: 1;
        font-size: clamp(1.8rem, 6vh, 3.2rem);
        border-radius: clamp(10px, 2vh, 18px);
      }
      .ttt-screen[data-game="tictactoe"] .ttt-footer {
        margin-top: auto;
      }
      @media (max-height: 760px) {
        .ttt-screen[data-game="tictactoe"] {
          padding: 8px 12px;
          gap: 7px;
        }
        .ttt-screen[data-game="tictactoe"] .ttt-header h3 {
          font-size: 1.15rem;
        }
        .ttt-screen[data-game="tictactoe"] .ttt-status {
          min-height: 34px;
          padding: 4px 8px;
          font-size: 0.72rem;
        }
        .ttt-screen[data-game="tictactoe"] .ttt-board {
          width: min(
            100%,
            340px,
            max(170px, calc((100svh - 225px) * 0.95)),
            max(170px, calc((100dvh - 225px) * 0.95))
          );
        }
        .ttt-screen[data-game="tictactoe"] .ttt-cell {
          font-size: clamp(1.6rem, 5vh, 2.6rem);
          border-radius: 13px;
        }
        .ttt-screen[data-game="tictactoe"] .ttt-new-round {
          min-height: 34px;
          padding: 0 10px;
          font-size: 0.72rem;
        }
      }
      @media (max-height: 620px) {
        .ttt-screen[data-game="tictactoe"] {
          padding: 6px 10px;
          gap: 5px;
        }
        .ttt-screen[data-game="tictactoe"] .ttt-header h3 {
          font-size: 1.05rem;
        }
        .ttt-screen[data-game="tictactoe"] .ttt-status {
          min-height: 30px;
          padding: 3px 6px;
          font-size: 0.65rem;
        }
        .ttt-screen[data-game="tictactoe"] .ttt-board {
          width: min(
            100%,
            280px,
            max(150px, calc((100svh - 175px) * 0.95)),
            max(150px, calc((100dvh - 175px) * 0.95))
          );
          gap: 5px;
        }
        .ttt-screen[data-game="tictactoe"] .ttt-cell {
          font-size: clamp(1.3rem, 4.5vh, 2rem);
          border-radius: 9px;
        }
        .ttt-screen[data-game="tictactoe"] .ttt-footer {
          font-size: 0.6rem;
        }
        .ttt-screen[data-game="tictactoe"] .ttt-new-round {
          min-height: 28px;
          padding: 0 8px;
          font-size: 0.66rem;
        }
      }
    `;
    document.head.appendChild(style);
  }

  /* ============================================================
     TIC-TAC-TOE
     ============================================================ */

  const TTT_WINNING_LINES = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  /* ============================================================
     RESULT TIMER
     ============================================================ */

  let resultTimer = null;

  const scheduleResultModal = (callback) => {
    window.clearTimeout(resultTimer);

    resultTimer = window.setTimeout(() => {
      /*
       * Do not show the result modal if the player
       * already left Tic-Tac-Toe.
       */
      if (state.activeGame?.id !== "tictactoe") {
        return;
      }

      callback();
    }, 300);
  };

  /* ============================================================
     RESET
     ============================================================ */

  const resetTicTacToe = () => {
    console.log("TTT: reset");

    window.clearTimeout(resultTimer);
    resultTimer = null;

    state.ticTacToe.board =
      Array(9).fill(null);

    state.ticTacToe.currentPlayer = "X";
    state.ticTacToe.gameOver = false;
    state.ticTacToe.winner = null;
    state.ticTacToe.winningCells = [];

    renderTicTacToe();
  };

  /* ============================================================
     WINNER CHECK
     ============================================================ */

  const getTicTacToeWinner = () => {
    const board =
      state.ticTacToe.board;

    for (const line of TTT_WINNING_LINES) {
      const [a, b, c] = line;

      if (
        board[a] &&
        board[a] === board[b] &&
        board[a] === board[c]
      ) {
        return {
          player: board[a],
          cells: line
        };
      }
    }

    return null;
  };

  /* ============================================================
     SCORE
     ============================================================ */

  const updateTicTacToeScore = () => {
    dom.gameScore.classList.remove(
      "is-hidden"
    );

    dom.scoreLabelLeft.textContent =
      "X";

    dom.scoreValueLeft.textContent =
      state.ticTacToe.scores.X;

    dom.scoreLabelCenter.textContent =
      "Draws";

    dom.scoreValueCenter.textContent =
      state.ticTacToe.scores.draws;

    dom.scoreLabelRight.textContent =
      "O";

    dom.scoreValueRight.textContent =
      state.ticTacToe.scores.O;
  };

  /* ============================================================
     RESULT MODAL
     ============================================================ */

  const showTicTacToeResult = (
    result,
    player = null
  ) => {
    if (result === "win") {
      dom.modalIcon.textContent =
        player === "X"
          ? "❌"
          : "⭕";

      dom.modalKicker.textContent =
        "Winner";

      dom.modalTitle.textContent =
        `${player} wins!`;

      dom.modalMessage.textContent =
        `Great line-up. ${player} connected three first.`;

      playTone(760);

      vibrate([
        25,
        40,
        25
      ]);
    } else {
      dom.modalIcon.textContent =
        "🤝";

      dom.modalKicker.textContent =
        "Good game";

      dom.modalTitle.textContent =
        "It's a draw";

      dom.modalMessage.textContent =
        "No winner this round. Give it another shot.";

      playTone(420);

      vibrate(20);
    }

    dom.modalStats.innerHTML = `
      <div class="modal-stat">
        <span>X wins</span>
        <strong>
          ${state.ticTacToe.scores.X}
        </strong>
      </div>

      <div class="modal-stat">
        <span>O wins</span>
        <strong>
          ${state.ticTacToe.scores.O}
        </strong>
      </div>

      <div class="modal-stat">
        <span>Draws</span>
        <strong>
          ${state.ticTacToe.scores.draws}
        </strong>
      </div>
    `;

    dom.modalPrimary.textContent =
      "Play again";

    dom.modalSecondary.textContent =
      "Arcade";

    dom.modal.classList.remove(
      "is-hidden"
    );
  };

  /* ============================================================
     MOVE
     ============================================================ */

  const handleTicTacToeMove = (index) => {
    const game =
      state.ticTacToe;

    if (game.gameOver) {
      return;
    }

    if (game.board[index]) {
      return;
    }

    game.board[index] =
      game.currentPlayer;

    playTone(
      game.currentPlayer === "X"
        ? 540
        : 460
    );

    vibrate(10);

    /* ----------------------------------------------------------
       WIN
       ---------------------------------------------------------- */

    const result =
      getTicTacToeWinner();

    if (result) {
      game.gameOver = true;

      game.winner =
        result.player;

      game.winningCells =
        result.cells;

      game.scores[result.player] += 1;

      updateTicTacToeScore();

      renderTicTacToe();

      scheduleResultModal(() => {
        showTicTacToeResult(
          "win",
          result.player
        );
      });

      return;
    }

    /* ----------------------------------------------------------
       DRAW
       ---------------------------------------------------------- */

    if (game.board.every(Boolean)) {
      game.gameOver = true;

      game.winner = "draw";

      game.winningCells = [];

      game.scores.draws += 1;

      updateTicTacToeScore();

      renderTicTacToe();

      scheduleResultModal(() => {
        showTicTacToeResult("draw");
      });

      return;
    }

    /* ----------------------------------------------------------
       NEXT PLAYER
       ---------------------------------------------------------- */

    game.currentPlayer =
      game.currentPlayer === "X"
        ? "O"
        : "X";

    renderTicTacToe();
  };

  /* ============================================================
     RENDER BOARD
     ============================================================ */

  const renderTicTacToe = () => {
    console.log("TTT: render");

    const game =
      state.ticTacToe;

    const screen =
      document.createElement("section");

    screen.className =
      "ttt-screen";
    screen.dataset.game =
      "tictactoe";

    const statusText =
      game.gameOver
        ? game.winner === "draw"
          ? "It's a draw!"
          : `${game.winner} wins!`
        : `${game.currentPlayer}'s turn`;

    screen.innerHTML = `
      <div class="ttt-header">
        <div>
          <p class="eyebrow">
            Two player
          </p>

          <h3>
            Tic-Tac-Toe
          </h3>
        </div>

        <div
          class="ttt-status"
          aria-live="polite"
        >
          <span
            class="ttt-status-mark"
            aria-hidden="true"
          >
            ${
              game.gameOver
                ? "🏆"
                : game.currentPlayer === "X"
                  ? "❌"
                  : "⭕"
            }
          </span>

          <span>
            ${statusText}
          </span>
        </div>
      </div>

      <div
        class="ttt-board"
        role="grid"
        aria-label="Tic-Tac-Toe board"
      >
        ${game.board
          .map((cell, index) => {
            const isWinningCell =
              game.winningCells.includes(
                index
              );

            const label = cell
              ? `Cell ${index + 1}: ${cell}`
              : `Cell ${index + 1}: empty`;

            return `
              <button
                class="ttt-cell ${
                  cell
                    ? `mark-${cell.toLowerCase()}`
                    : ""
                } ${
                  isWinningCell
                    ? "is-winning"
                    : ""
                }"
                type="button"
                role="gridcell"
                data-ttt-cell="${index}"
                aria-label="${label}"
                ${
                  cell || game.gameOver
                    ? "disabled"
                    : ""
                }
              >
                ${
                  cell === "X"
                    ? "❌"
                    : cell === "O"
                      ? "⭕"
                      : ""
                }
              </button>
            `;
          })
          .join("")}
      </div>

      <div class="ttt-footer">
        <span>
          First to connect three wins
        </span>

        <button
          type="button"
          class="button button-quiet ttt-new-round"
        >
          New round
        </button>
      </div>
    `;

    dom.gameStage.replaceChildren(
      screen
    );

    updateTicTacToeScore();

    /* ----------------------------------------------------------
       BOARD EVENTS
       ---------------------------------------------------------- */

    screen
      .querySelectorAll("[data-ttt-cell]")
      .forEach((cell) => {
        cell.addEventListener(
          "click",
          () => {
            const index =
              Number(
                cell.dataset.tttCell
              );

            handleTicTacToeMove(index);
          }
        );
      });

    /* ----------------------------------------------------------
       NEW ROUND
       ---------------------------------------------------------- */

    const newRoundButton =
      screen.querySelector(
        ".ttt-new-round"
      );

    newRoundButton.addEventListener(
      "click",
      () => {
        vibrate(15);

        playTone(560);

        resetTicTacToe();

        showToast(
          "New Tic-Tac-Toe round"
        );
      }
    );
  };

  /* ============================================================
     PUBLIC MODULE API
     ============================================================ */

  return {
    reset: resetTicTacToe,
    render: renderTicTacToe,

    /*
     * Intentionally resets when opening TTT.
     * This is the desired arcade behavior:
     * leave game → return → fresh round.
     */
    start: resetTicTacToe,

    /*
     * API preserved for future app-level cleanup.
     */
    destroy: () => {
      window.clearTimeout(resultTimer);
      resultTimer = null;
    }
  };
}
