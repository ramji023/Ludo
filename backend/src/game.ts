import WebSocket from "ws";
import { User } from "./user";
import {
  globalGamePath,
  homePoints,
  isHome,
  isPath,
  isSafe,
  isStart,
  isVictory,
  isVictoryPath,
  startPoints,
} from "./utils/grid";
export class Game {
  private roomId: string;
  private diceValue: number | null;
  private players: Map<string, User>;
  private rollTurn: WebSocket | null;
  constructor() {
    this.roomId = "";
    this.diceValue = null;
    this.players = new Map();
    this.rollTurn = null;
  }

  startGame(roomId: string, player: User) {
    this.roomId = roomId;
    this.players.set(player.id, player);
    this.rollTurn = player.socket;
  }

  makeMove(roomId: string, diceValue: number, pawn: string, player: User) {
    const currentPlayer = this.players.get(player.id);
    if (currentPlayer) {
      const pawnPosition = currentPlayer.currentPosition.find(
        (obj, i) => obj.pawns === pawn
      );
      const pawnPrevPosition = currentPlayer.prevPosition.find(
        (obj, i) => obj.pawns === pawn
      );
      console.log("current position of player is : ", pawnPosition);
      console.log("previous position of player is : ", pawnPrevPosition);
      // if player in home area
      if (
        pawnPosition &&
        pawnPrevPosition &&
        isHome(pawnPosition.position, currentPlayer.color)
      ) {
        // calculate new position
        const updatedPosition = startPoints[currentPlayer.color][0];
        //boadcast the position to all the user

        //update the currentposition and prevPosition of pawns
        pawnPrevPosition.position = pawnPosition.position;
        pawnPosition.position = updatedPosition;
      }
      // if player in start point
      if (pawnPosition && pawnPrevPosition) {
        const index = isStart(pawnPosition.position, player.color);
        if (index) {
          // calculate new position
          const updatedPosition = globalGamePath[index + diceValue];
          //boadcast the position to all the user

          //update the currentposition and prevPosition of pawns
          pawnPrevPosition.position = pawnPosition.position;
          pawnPosition.position = updatedPosition;
        }
      }
      // if player in path
      if (pawnPosition && pawnPrevPosition) {
        const index = isPath(pawnPosition.position, currentPlayer.color);
        if (index) {
          // calculate new position
          const updatedPosition = globalGamePath[index + diceValue];
          //boadcast the position to all the user

          //update the currentposition and prevPosition of pawns
          pawnPrevPosition.position = pawnPosition.position;
          pawnPosition.position = updatedPosition;
        }
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

  // check game is over or not
  isGameOver() {
    return false;
  }
}
