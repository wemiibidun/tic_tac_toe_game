export function applyCalculateWiner(squares) {
  const WIN_CONDITION = [
    //possible winning positions
    //rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    //columns
    [2, 5, 8],
    [0, 4, 8],
    //diagonals
    [2, 4, 6],
  ];

  //how to check for winner
  for (let i = 0; i < WIN_CONDITION.length; i++) {
    const [x, y, z] = WIN_CONDITION[i];

    if (squares[x] && squares[x] === squares[y] && squares[y] === squares[z]) {
      return squares[x];
    }
  }
  return null;
}
