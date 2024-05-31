import xSoundFile from "../assets/Toom Click.wav";
import ySoundFile from "../assets/Cloud Click.wav";
import gameOverSoundFile from "../assets/game-over-sound.wav";
import drawSoundFile from "../assets/draw-sound.wav";

const xSound = new Audio(xSoundFile);
const ySound = new Audio(ySoundFile);
const winSound = new Audio(gameOverSoundFile);
const drawSound = new Audio(drawSoundFile);

xSound.preload = "auto";
ySound.preload = "auto";
winSound.preload = "auto";
drawSound.preload = "auto";

export const gameSound = {
  xSound: () => xSound.play(),
  ySound: () => ySound.play(),
  winSound: () => winSound.play(),
  drawSound: () => drawSound.play(),
};
