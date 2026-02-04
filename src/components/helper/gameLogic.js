const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export function calculateWinner(squares) {
  for (let i = 0; i < WIN_LINES.length; i += 1) {
    const [x, y, z] = WIN_LINES[i];
    if (squares[x] && squares[x] === squares[y] && squares[y] === squares[z]) {
      return squares[x];
    }
  }
  return null;
}

export function getWinningLine(squares) {
  for (let i = 0; i < WIN_LINES.length; i += 1) {
    const [x, y, z] = WIN_LINES[i];
    if (squares[x] && squares[x] === squares[y] && squares[y] === squares[z]) {
      return WIN_LINES[i];
    }
  }
  return null;
}

export function isBoardFull(squares) {
  return squares.every(Boolean);
}

function getAvailableMoves(squares) {
  const moves = [];
  for (let i = 0; i < squares.length; i += 1) {
    if (!squares[i]) moves.push(i);
  }
  return moves;
}

function getRandomMove(squares) {
  const moves = getAvailableMoves(squares);
  if (!moves.length) return null;
  return moves[Math.floor(Math.random() * moves.length)];
}

function minimax(board, depth, isMaximizing) {
  const winner = calculateWinner(board);
  if (winner === "O") return 10 - depth;
  if (winner === "X") return depth - 10;
  if (isBoardFull(board)) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    const moves = getAvailableMoves(board);
    for (let i = 0; i < moves.length; i += 1) {
      const index = moves[i];
      board[index] = "O";
      const score = minimax(board, depth + 1, false);
      board[index] = null;
      bestScore = Math.max(bestScore, score);
    }
    return bestScore;
  }

  let bestScore = Infinity;
  const moves = getAvailableMoves(board);
  for (let i = 0; i < moves.length; i += 1) {
    const index = moves[i];
    board[index] = "X";
    const score = minimax(board, depth + 1, true);
    board[index] = null;
    bestScore = Math.min(bestScore, score);
  }
  return bestScore;
}

function getBestMove(squares) {
  let bestScore = -Infinity;
  let move = null;
  const moves = getAvailableMoves(squares);

  for (let i = 0; i < moves.length; i += 1) {
    const index = moves[i];
    squares[index] = "O";
    const score = minimax(squares, 0, false);
    squares[index] = null;
    if (score > bestScore) {
      bestScore = score;
      move = index;
    }
  }

  return move;
}

export function getComputerMove(squares, mode) {
  if (mode === "cpu-easy") return getRandomMove(squares);
  if (mode === "cpu-hard") return getBestMove(squares);
  return null;
}
