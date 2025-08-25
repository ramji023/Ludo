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
import { MOVED_MAKE } from "./messages";
export class Game {
  public roomId: string;
  public diceValue: number | null;
  public players: Map<string, User>;
  public rollTurn: string | null;
  constructor() {
    this.roomId = "";
    this.diceValue = null;
    this.players = new Map();
    this.rollTurn = null;
  }

  startGame(roomId: string, id: string, allPlayers: Map<string, User>) {
    this.roomId = roomId;
    this.rollTurn = id;
    allPlayers.forEach((player) => {
      this.players.set(player.id, player);
    });
  }

  makeMove(roomId: string, diceValue: number, pawn: string, player: User) {
    if (roomId === this.roomId && player.id === this.rollTurn) {
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
          isHome(pawnPosition.position, currentPlayer.color) &&
          diceValue === 6
        ) {
          // calculate new position
          const updatedPosition = startPoints[currentPlayer.color][0];
          //boadcast the position to all the user

          //update the currentposition and prevPosition of pawns
          pawnPrevPosition.position = pawnPosition.position;
          pawnPosition.position = updatedPosition;

          //updated the roll turn
          const id = this.checkNextTurn(player.id);
          if (id !== -1) {
            this.rollTurn = id;
          }
          //broadcast the updated position to all the players
          this.broadCasting(roomId, player.id, pawn, updatedPosition);
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
  }
  // check game is over or not
  isGameOver() {
    return false;
  }

  // assign nextTurn after making move
  private checkNextTurn(id: string) {
    const ids = Array.from(this.players.keys());
    const index = ids.indexOf(id);

    if (index >= 0) {
      return ids[(index + 1) % ids.length];
    }

    return -1;
  }

  //broadcasting move to all the players
  private broadCasting(
    roomId: string,
    id: string,
    pawn: string,
    updatedPosition: string
  ) {
    this.players.forEach((player) => {
      player.socket.send(
        JSON.stringify({
          type: MOVED_MAKE,
          payload: {
            roomId: roomId,
            id: id,
            pawn: pawn,
            pawnPosition: updatedPosition,
            rollTurn: this.rollTurn,
          },
        })
      );
    });
  }
}
