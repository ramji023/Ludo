import { User } from "./user";
import {
  homePoints,
  isHome,
  isPath,
  isSafe,
  isStart,
  isVictory,
  isVictoryPath,
} from "./utils/grid";
export class Game {
  private roomId: string;
  private diceValue: number | null;
  private players: Map<string, User>;
  constructor() {
    this.roomId = "";
    this.diceValue = null;
    this.players = new Map();
  }

  startGame(roomId: string, player: User) {
    this.roomId = roomId;
    this.players.set(player.id, player);
  }

  makeMove(roomId: string, diceValue: number, pawn: string, player: User) {
    const currentPlayer = this.players.get(player.id);
    if (currentPlayer) {
      const currentPosition = currentPlayer.currentPosition;
      const pawnPosition = currentPosition.find((obj, i) => obj.pawns === pawn);
      // if player in home area
      if (pawnPosition && isHome(pawnPosition.position, currentPlayer.color)) {
      }
      // if player in safe place
      if (pawnPosition && isSafe(pawnPosition.position, currentPlayer.color)) {
      }
      // if player in start point
      if (pawnPosition && isStart(pawnPosition.position, currentPlayer.color)) {
      }
      // if player in path
      if (pawnPosition && isPath(pawnPosition.position, currentPlayer.color)) {
      }
      // if player in victory path
      if (
        pawnPosition &&
        isVictoryPath(pawnPosition.position, currentPlayer.color)
      ) {
      }
      // if player in victory box
      if (
        pawnPosition &&
        isVictory(pawnPosition.position, currentPlayer.color)
      ) {
      }
    }
  }
}
