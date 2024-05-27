//Tic Tac toe Winnign logic
type move = "x" | "o" | "";

type GameBoard = move[];

const winningPatterns = [
  // Horizontal winning patterns
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // Vertical winning patterns
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // Diagonal winning patterns
  [0, 4, 8],
  [2, 4, 6],
];

function selectRandom<T>(array: T[] = []) {
  if (array.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

export const isAllPostionFill = (gameBoard: Array<unknown>) =>
  gameBoard.every((v) => v);

const getAllEmptyPlaces = (gameBoard: GameBoard) => {
  const emptyPlaces: number[] = [];
  gameBoard.forEach((v, i) => {
    if (!v) emptyPlaces.push(i);
  });
  return emptyPlaces;
};

export function checkWin(gameBoard: GameBoard) {
  const patternMatch =
    winningPatterns.find((pattern) => {
      const firstValue = gameBoard[pattern[0]];
      return pattern.every((i) => firstValue && firstValue === gameBoard[i]);
    }) || null;

  if (!patternMatch && isAllPostionFill(gameBoard)) {
    return { patternMatch: null, playerWin: "tie" as const };
  }

  return {
    patternMatch,
    playerWin: patternMatch ? gameBoard[patternMatch[0]] : null,
  };
}

//Simple logic for computer player.
export function aiPlayer(gameBoard: GameBoard): number | null {
  const emptyPlaces = getAllEmptyPlaces(gameBoard);

  if (emptyPlaces.length === 0) return null;

  //Checking if putting any value make computer wins.
  for (const value of emptyPlaces) {
    const boardCopy = gameBoard.slice();
    boardCopy[value] = "o";
    const { playerWin } = checkWin(boardCopy);
    if (playerWin === "o") return value;
  }

  //Checking if putting any value make human wins.
  for (const value of emptyPlaces) {
    const boardCopy = gameBoard.slice();
    boardCopy[value] = "x";
    const { playerWin } = checkWin(boardCopy);
    if (playerWin === "x") return value;
  }

  // Choose a random move if no immediate winning or blocking move is found
  return selectRandom(emptyPlaces);
}

// export function proAiPlayer(
//   gameBoard: GameBoard,
//   isMinimizing = false,
// ): number {
//   const emptyPlaces = getAllEmptyPlaces(gameBoard);
//   const { playerWin } = checkWin(gameBoard);
//   if (playerWin === "x") -1;
//   if (playerWin === "o") 1;
//   if (playerWin === "tie") 0;

//   const moves: { [key: string]: number } = {};

//   for (const value of emptyPlaces) {
//     const boardCopy = gameBoard.slice();
//     boardCopy[value] = isMinimizing ? "x" : "o";
//     moves[value + ""] = proAiPlayer(boardCopy, !isMinimizing);
//   }

//   if (isMinimizing) {
//     let bestMove: number;
//     let scoreAcc: number = Infinity;
//     Object.entries(moves).forEach(([key, value]) => {
//       if (isMinimizing) {
//       } else {
//         bestMove = Math.max(bestMove, value);
//       }
//     });
//   }
// }
