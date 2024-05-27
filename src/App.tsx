import { useCallback, useEffect, useState } from "react";
import { checkWin, aiPlayer } from "./utils/gameLogic";
import Strike from "./strike";
import { ScoreBoard } from "./ScoreBoard";
import GameOverModel from "./GameOverModel";
import { gameSound } from "./utils/gameSound";

type move = "x" | "o" | "";
type GameBoard = move[];

const defaultGameBoard: GameBoard = new Array(9).fill("");

type GameState = {
  playerWin: null | move | "tie";
  winningPattern: null | number[];
  currPlayer: move;
  gameBoard: move[];
};

const intitalGameState: GameState = {
  currPlayer: "x",
  playerWin: null,
  winningPattern: null,
  gameBoard: defaultGameBoard,
};

export default function App() {
  const [score, setScore] = useState({ x: 0, o: 0, tie: 0 });
  const [isPlayer2Computer, setIsPlayer2Computer] = useState(true);
  const [gameState, setGameState] = useState<GameState>(intitalGameState);

  const draw = useCallback(
    (i: number) => {
      //if game is over or position is already filled return
      if (gameState.playerWin || gameState.gameBoard[i]) return;

      const newGameBoard = gameState.gameBoard.map((v, j) =>
        j === i ? gameState.currPlayer : v,
      );

      setGameState((p) => {
        return {
          ...p,
          gameBoard: newGameBoard,
          currPlayer: p.currPlayer === "x" ? "o" : "x",
        };
      });

      overGameIfAnyWin(newGameBoard);

      gameState.currPlayer === "x" ? gameSound.xSound() : gameSound.ySound();
    },
    [gameState],
  );

  //Reseting game to default
  const reset = () => {
    setGameState(intitalGameState);
    setScore({ x: 0, o: 0, tie: 0 });
  };

  //for restaring game
  const start = () => {
    setGameState((p) => ({ ...intitalGameState, currPlayer: p.currPlayer }));
  };

  const overGameIfAnyWin = (board: GameBoard) => {
    const { playerWin, patternMatch } = checkWin(board);
    if (!playerWin) return;
    playerWin === "tie" ? gameSound.drawSound() : gameSound.winSound();
    setGameState((p) => ({
      ...p,
      playerWin,
      winningPattern: patternMatch,
    }));

    setScore((p) => ({ ...p, [playerWin]: p[playerWin] + 1 }));
  };

  useEffect(() => {
    if (
      isPlayer2Computer &&
      gameState.currPlayer === "o" &&
      !gameState.playerWin
    ) {
      setTimeout(() => draw(aiPlayer(gameState.gameBoard) as number), 500);
    }
  }, [gameState, isPlayer2Computer, draw]);

  return (
    <div className=" absolute left-0 right-0 top-0 mx-auto min-h-screen bg-black">
      <main className="z-50 flex min-h-screen w-full flex-col items-center">
        {/*Game mode Selector*/}
        <div className=" mt-4 flex text-white">
          <button
            className={`border-r bg-neutral-700 px-6 ${!isPlayer2Computer && "opacity-45"}`}
            onClick={() => {
              reset();
              setIsPlayer2Computer(true);
            }}
          >
            1 Player
          </button>
          <button
            className={`bg-neutral-700 px-6 ${isPlayer2Computer && "opacity-45"}`}
            onClick={() => {
              reset();
              setIsPlayer2Computer(false);
            }}
          >
            2 Player
          </button>
        </div>

        {/*Current Player Turn showcase */}
        <p className=" mt-5 flex items-center gap-3 text-center text-lg font-bold tracking-wider text-white">
          Player
          <span
            style={{ color: gameState.currPlayer === "x" ? "red" : "blue" }}
            className="text-2xl uppercase"
          >
            {gameState.currPlayer}
          </span>
          Turns
        </p>

        {/* Game Board */}
        <section className=" mt-14">
          <div
            className={`grid h-[300px] w-[300px] grid-cols-3  grid-rows-3 gap-0.5 bg-white outline-none sm:w-[350px]`}
          >
            {gameState.gameBoard.map((move, i) => {
              return (
                <button
                  key={i}
                  className={`group relative flex cursor-pointer items-center justify-center bg-black text-[70px] font-bold
                 uppercase text-white
                `}
                  style={{
                    color: move === "x" ? "red" : "blue",
                  }}
                  onClick={() => draw(i)}
                  disabled={isPlayer2Computer && gameState.currPlayer === "o"}
                >
                  {/* If value is not exits then show curr player in with ghost effect on hover */}
                  {!move && (
                    <span className="absolute hidden uppercase text-neutral-200 opacity-10 group-hover:block">
                      {gameState.currPlayer}
                    </span>
                  )}
                  {move}
                  <Strike pattern={gameState.winningPattern || []} i={i} />
                </button>
              );
            })}
          </div>
        </section>

        <ScoreBoard score={score} isPlayer2Computer={isPlayer2Computer} />

        {gameState.playerWin && (
          <GameOverModel
            playerWin={gameState.playerWin}
            onReplyClick={start}
            onResetClick={reset}
            isPlayer2Computer={isPlayer2Computer}
          />
        )}
      </main>
    </div>
  );
}
