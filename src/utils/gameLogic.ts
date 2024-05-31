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

//Return true if all place have truthy value in a array
export const isAllPostionFill = (gameBoard: Array<unknown>) => {
  return gameBoard.every((v) => v);
};

//Return all empty places in a array
const getAllEmptyPlaces = <T>(gameBoard: Array<T>) => {
  const emptyPlaces: number[] = [];
  gameBoard.forEach((v, i) => {
    if (!v) emptyPlaces.push(i);
  });
  return emptyPlaces;
};

export function checkWin(gameBoard: GameBoard) {
  //Finding for any winning pattern match the current game state.
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

export function aiPlayer(
  gameBoard: GameBoard,
  maxDepth = Infinity,
  isAiPlaying = true,
): { score: number; index: number } {
  const emptyPlaces = getAllEmptyPlaces(gameBoard);
  const { playerWin } = checkWin(gameBoard);

  if (playerWin === "x") return { score: -1, index: -1 };
  if (playerWin === "tie") return { score: 0, index: -1 };
  if (playerWin === "o") return { score: 1, index: -1 };
  if (maxDepth <= 0) return { score: 0, index: -1 };

  //Calculating the score for each empty place
  const moves = [];
  for (const value of emptyPlaces) {
    const boardCopy = [...gameBoard];
    boardCopy[value] = isAiPlaying ? "o" : "x";
    moves.push({
      index: value,
      score: aiPlayer(boardCopy, maxDepth - 1, !isAiPlaying).score,
    });
  }

  //Finding best move for current state
  if (isAiPlaying) {
    // Maxmizing the score if ai playing
    const bestMove = moves.reduce((prev, current) =>
      prev.score > current.score ? prev : current,
    );
    return { index: bestMove.index, score: bestMove.score };
  } else {
    //Minimizing the score if human playing
    const bestMove = moves.reduce((prev, current) =>
      prev.score < current.score ? prev : current,
    );
    return { index: bestMove.index, score: bestMove.score };
  }
}
