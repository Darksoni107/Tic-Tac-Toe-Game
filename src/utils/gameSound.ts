import xSoundFile from "../assets/x-click-sound.mp3";
import ySoundFile from "../assets/y-click-sound.mp3";
import gameOverSoundFile from "../assets/game-over-sound.wav";
import drawSoundFile from "../assets/draw-sound.wav";

export const gameSound = {
  xSound: () => new Audio(xSoundFile).play(),
  ySound: () => new Audio(ySoundFile).play(),
  winSound: () => new Audio(gameOverSoundFile).play(),
  drawSound: () => new Audio(drawSoundFile).play(),
};
