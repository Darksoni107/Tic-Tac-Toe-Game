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
  currTurn: move;
  gameBoard: move[];
};

const intitalGameState: GameState = {
  currTurn: "x",
  playerWin: null,
  winningPattern: null,
  gameBoard: defaultGameBoard,
};

export default function App() {
  const [score, setScore] = useState({ x: 0, o: 0, tie: 0 });
  const [isPlayer2Ai, setIsPlayer2Ai] = useState(true);
  const [difficulty, setDifficulty] = useState(1);
  const [gameState, setGameState] = useState<GameState>(intitalGameState);

  const draw = useCallback(
    (i: number) => {
      //if game is over or position is already filled return
      if (gameState.playerWin || gameState.gameBoard[i]) return;

      const newGameBoard = gameState.gameBoard.map((v, j) =>
        j === i ? gameState.currTurn : v,
      );

      setGameState((p) => {
        return {
          ...p,
          gameBoard: newGameBoard,
          currTurn: p.currTurn === "x" ? "o" : "x",
        };
      });

      overGameIfAnyWin(newGameBoard);

      gameState.currTurn === "x" ? gameSound.xSound() : gameSound.ySound();
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
    setGameState((p) => ({ ...intitalGameState, currTurn: p.currTurn }));
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

    setScore((p) => ({ ...p, [playerWin]: p[playerWin] }));
  };

  useEffect(() => {
    if (isPlayer2Ai && gameState.currTurn === "o" && !gameState.playerWin) {
      setTimeout(
        () => draw(aiPlayer(gameState.gameBoard, difficulty).index as number),
        300,
      );
    }
  }, [gameState, isPlayer2Ai, draw, difficulty]);

  return (
    <div className=" absolute left-0 right-0 top-0 mx-auto min-h-screen bg-black">
      <main className="z-50 flex min-h-screen w-full flex-col items-center">
        {/*Game mode Selector*/}

        <div className=" mt-4 text-white">
          <div className=" flex">
            <button
              className={`border-r bg-neutral-700 px-6 ${!isPlayer2Ai && "opacity-45"}`}
              onClick={() => {
                reset();
                setIsPlayer2Ai(true);
              }}
            >
              1 Player
            </button>
            <button
              className={`bg-neutral-700 px-6 ${isPlayer2Ai && "opacity-45"}`}
              onClick={() => {
                reset();
                setIsPlayer2Ai(false);
              }}
            >
              2 Player
            </button>
            {isPlayer2Ai && (
              <select
                title="Difficulty level"
                className="ml-1 cursor-pointer bg-neutral-700 px-2 text-sm"
                onChange={(e) => {
                  reset();
                  setDifficulty(+e.target.value);
                }}
                value={difficulty}
              >
                <option value={1}>Easy</option>
                <option value={3}>Medium</option>
                <option value={6}>Hard</option>
                <option value={Infinity}>Expert</option>
              </select>
            )}
          </div>
        </div>

        {/*Current Player Turn showcase */}
        <p className=" mt-5 flex items-center gap-3 text-center text-lg font-bold tracking-wider text-white">
          Player
          <span
            style={{ color: gameState.currTurn === "x" ? "red" : "blue" }}
            className="text-2xl uppercase"
          >
            {gameState.currTurn}
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
                  className={`group relative flex cursor-pointer items-center justify-center bg-black text-[70px] font-bold uppercase text-white
                  active:animate-pulse
                `}
                  style={{
                    color: move === "x" ? "red" : "blue",
                  }}
                  onClick={() => draw(i)}
                  disabled={isPlayer2Ai && gameState.currTurn === "o"}
                >
                  {/* If value is not exits then show curr player in with ghost effect on hover */}
                  {!move && (
                    <span className="absolute hidden uppercase text-neutral-200 opacity-10 group-hover:block">
                      {gameState.currTurn}
                    </span>
                  )}
                  {move}
                  <Strike pattern={gameState.winningPattern || []} i={i} />
                </button>
              );
            })}
          </div>
        </section>

        <ScoreBoard score={score} isPlayer2Computer={isPlayer2Ai} />

        {gameState.playerWin && (
          <GameOverModel
            playerWin={gameState.playerWin}
            onReplyClick={start}
            onResetClick={reset}
          />
        )}
      </main>
    </div>
  );
}
