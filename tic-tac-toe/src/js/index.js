const BoardValues = {
  EMPTY: 0,
  X: 1,
  O: 2,
};
const FIRST_PLAYER = 1;
const SECOND_PLAYER = 2;
const DRAW = 3;

let currentPlayer = FIRST_PLAYER;
let board = getEmptyBoard();
let winner = null;

const boardEl = document.querySelector(".board");
const playerSpan = document.querySelector(".player-turn__player");
const modalOverlay = document.querySelector(".modal-overlay");
const modalText = document.querySelector(".modal-text");

function render() {
  if (winner === null) {
    modalOverlay.classList.remove("modal-overlay_shown");
  } else {
    modalOverlay.classList.add("modal-overlay_shown");
    if (winner !== DRAW) {
      modalText.innerHTML = `Player ${winner} won!`;
    } else {
      modalText.innerHTML = "Draw!";
    }
  }
  for (let i = 0; i < board.length; i += 1) {
    for (let j = 0; j < board[i].length; j += 1) {
      const childNum = i * board.length + j;
      const cellElement = boardEl.children.item(childNum);
      if (board[i][j] === BoardValues.X) {
        cellElement.innerHTML = "X";
      } else if (board[i][j] === BoardValues.O) {
        cellElement.innerHTML = "O";
      } else {
        cellElement.innerHTML = "";
      }
    }
  }
  playerSpan.innerHTML = currentPlayer;
}

function getEmptyBoard() {
  return [
    [BoardValues.EMPTY, BoardValues.EMPTY, BoardValues.EMPTY],
    [BoardValues.EMPTY, BoardValues.EMPTY, BoardValues.EMPTY],
    [BoardValues.EMPTY, BoardValues.EMPTY, BoardValues.EMPTY],
  ];
}

function makeTurn(x, y) {
  if (board[x][y] !== BoardValues.EMPTY) {
    return;
  }
  if (currentPlayer === FIRST_PLAYER) {
    board[x][y] = BoardValues.X;
    currentPlayer = SECOND_PLAYER;
  } else {
    board[x][y] = BoardValues.O;
    currentPlayer = FIRST_PLAYER;
  }

  winner = checkWinner();
  if (winner === null && checkBoardFull()) {
    winner = DRAW;
  }
}

function restart() {
  board = getEmptyBoard();
  winner = null;
  currentPlayer = FIRST_PLAYER;
}

function checkBoardFull() {
  for (let i = 0; i < board.length; i += 1) {
    for (let j = 0; j < board[i].length; j += 1) {
      if (board[i][j] === BoardValues.EMPTY) {
        return false;
      }
    }
  }
  return true;
}

function checkWinner() {
  for (let i = 0; i < board.length; i += 1) {
    const lineWinner = checkLineWinner(board[i]);
    if (lineWinner !== null) {
      return lineWinner;
    }
  }
  for (let i = 0; i < board.length; i += 1) {
    const column = [board[0][i], board[1][i], board[2][i]];
    const columnWinner = checkLineWinner(column);
    if (columnWinner !== null) {
      return columnWinner;
    }
  }
  const diagonal1 = [board[0][0], board[1][1], board[2][2]];
  const diagonal1Winner = checkLineWinner(diagonal1);
  if (diagonal1Winner !== null) {
    return diagonal1Winner;
  }
  const diagonal2 = [board[0][2], board[1][1], board[2][0]];
  return checkLineWinner(diagonal2);
}

function checkLineWinner(line) {
  if (line.every((v) => v === BoardValues.X)) {
    return FIRST_PLAYER;
  }
  if (line.every((v) => v === BoardValues.O)) {
    return SECOND_PLAYER;
  }
  return null;
}

document.querySelectorAll(".board__cell").forEach((el, i) => {
  const x = Math.floor(i / board.length);
  const y = i % board.length;
  el.addEventListener("click", () => {
    makeTurn(x, y);
    render();
  });
});

document.querySelectorAll(".restart-button").forEach((btn) => {
  btn.addEventListener("click", () => {
    restart();
    render();
  });
});
