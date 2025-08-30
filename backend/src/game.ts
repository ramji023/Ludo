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

const color: string[] = ["red", "blue", "green", "yellow"]; // color order
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

  private assignColor(allPlayers: Map<string, User>) {
    let index = 0;
    if (allPlayers.size === 2) {
      allPlayers.forEach((player) => {
        player.color = color[index];
        index += 2;
      });
    } else {
      allPlayers.forEach((player) => {
        player.color = color[index];
        index++;
      });
      return;
    }
  }

  private initializePosition(allPlayers: Map<string, User>) {
    allPlayers.forEach((player) => {
      const position = homePoints[player.color].map((pos, index) => {
        const newObject = {
          pawns: `${player.color[0]}${index}`,
          position: pos,
        };
        return newObject;
      });
      player.currentPosition = position;
      player.prevPosition = position;
    });
  }

  startGame(roomId: string, id: string, allPlayers: Map<string, User>) {
    this.roomId = roomId;
    this.rollTurn = id;
    allPlayers.forEach((player) => {
      this.players.set(player.id, player);
    });
    this.assignColor(allPlayers);
    this.initializePosition(allPlayers);
  }

  makeMove(roomId: string, pawn: string, player: User) {
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

        if (pawnPosition && pawnPrevPosition) {
          // if player in home area
          if (isHome(pawnPosition.position, currentPlayer.color)) {
            // calculate new position
            if (this.diceValue === 6) {
              const updatedPosition = startPoints[currentPlayer.color][0];
              console.log("updated position", updatedPosition);

              //update the currentposition and prevPosition of pawns
              pawnPrevPosition.position = pawnPosition.position;
              pawnPosition.position = updatedPosition;

              //updated the roll turn
              const id = this.checkNextTurn(player.id);
              if (id !== -1) {
                this.rollTurn = id;
                console.log("next rool turn id : ", id);
              }
              //broadcast the updated position to all the players
              this.broadCasting(
                roomId,
                player.id,
                player.color,
                pawn,
                updatedPosition
              );
              return;
            } else {
              //updated the roll turn
              const id = this.checkNextTurn(player.id);
              if (id !== -1) {
                this.rollTurn = id;
                console.log("next rool turn id : ", id);
              }
              //broadcast the updated position to all the players
              this.broadCasting(
                roomId,
                player.id,
                player.color,
                pawn,
                pawnPosition.position
              );
            }
          } else if (
            isPath(pawnPosition.position, currentPlayer.color) !== null
          ) {
            const index = isPath(pawnPosition.position, currentPlayer.color);
            if (index !== null && this.diceValue) {
              // calculate new position
              console.log("index in global path array : ", index);
              const updatedPosition = globalGamePath[index + this.diceValue];
              console.log(
                "updated position in global path path array : ",
                updatedPosition
              );
              //update the currentposition and prevPosition of pawns
              pawnPrevPosition.position = pawnPosition.position;
              pawnPosition.position = updatedPosition;
              //updated the roll turn
              const id = this.checkNextTurn(player.id);
              if (id !== -1) {
                this.rollTurn = id;
                console.log("next rool turn id : ", id);
              }
              //broadcast the updated position to all the players
              this.broadCasting(
                roomId,
                player.id,
                player.color,
                pawn,
                updatedPosition
              );
              return;
            }
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
    if (this.diceValue === 6) return id; // if dice value 6 then dont change roll turn
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
    color: string,
    pawn: string,
    updatedPosition: string
  ) {
    console.log("broadcasting function called");
    this.players.forEach((player) => {
      player.socket.send(
        JSON.stringify({
          type: MOVED_MAKE,
          payload: {
            roomId: roomId,
            id: id,
            color: color,
            pawn: pawn,
            pawnPosition: updatedPosition,
            rollTurn: this.rollTurn,
          },
        })
      );
    });
  }
}
