console.log("TTT FILE LOADED");

export function initTicTacToe({
  state,
  dom,
  playTone,
  vibrate,
  showToast
}) {
  console.log("TTT: module initialized");

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
     RESET
     ============================================================ */

  const resetTicTacToe = () => {
    console.log("TTT: reset");

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

      window.setTimeout(() => {
        showTicTacToeResult(
          "win",
          result.player
        );
      }, 300);

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

      window.setTimeout(() => {
        showTicTacToeResult("draw");
      }, 300);

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
    start: resetTicTacToe
  };
}
