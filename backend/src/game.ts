import { v4 as uuidv4 } from "uuid";
import User from "./user";
import { homePosition, pawnPosition } from "./utils/pawnPath";
import { ChatMessages, KillResult, pawnPositon } from "./type";
import { getFreeHomePosition, isInHome, momentPath } from "./utils/helperFn";
import { broadcast } from "./broadcaster";
import { PLAYER_LEFT } from "./events";

const LUDO_TURN_ORDER = ["red", "blue", "yellow", "green"] as const;

export default class Game {
  gameId: string;
  status: "create" | "wait" | "start" | "end";
  players: Map<string, User> = new Map();
  colors: string[] = ["blue", "green", "red", "yellow"]; // store to assign color to each player and then make it null
  currentDiceValue: number; // store currnet dice value
  currentPlayerTurn: string[]; // store array of player-ids who has a current turn to roll dice
  currentTurnIndex: number; // Track whose turn it is
  fromPosition: pawnPositon | null = null;
  toPosition: pawnPositon | null = null;
  chatMessages: ChatMessages[] = [];
  winnerRank: { playerId: string; rank: number }[] = [];
  // when host initialize game then create new game and add host in User Map
  constructor(user: User) {
    this.gameId = uuidv4();
    this.players.set(user.id, user);
    this.status = "create";
    this.currentDiceValue = -1;
    this.currentPlayerTurn = [];
    this.currentTurnIndex = 0;
  }

  // handler to add player in players map
  addPlayer(user: User) {
    this.players.set(user.id, user);
  }

  // get customize player data
  playerData() {
    // return customizable data of all players
    return [...this.players.values()].map((player) => ({
      id: player.id,
      username: player.username,
      type: player.type,
      color: player.color,
      pawnPosition: player.pawnPosition,
      hasWon: player.hasWon,
    }));
  }

  // start the game like assign the current position of all pawns for all players
  startGame() {
    // assign current pawns position to all players
    for (const player of this.players.values()) {
      const color = player.color; // store the color
      if (color) {
        // assign start position to every player
        homePosition[color].forEach((pawn, index) => {
          player.pawnPosition.push({
            pawnId: `${color[0]}${index}`,
            position: { x: pawn.x, y: pawn.y, index: pawn.index },
          });
        });
      }
      // decide current player turn
      this.currentPlayerTurn = this.getTurnOrder();
      this.currentTurnIndex = 0;
      this.status = "start";
    }
  }

  // private function to get the turn order based on LUDO_TURN_ORDER
  private getTurnOrder(): string[] {
    const playersArray = Array.from(this.players.values());

    // Sort players by their color's position in LUDO_TURN_ORDER
    playersArray.sort((a, b) => {
      const colorA = a.color || "";
      const colorB = b.color || "";

      const indexA = LUDO_TURN_ORDER.indexOf(colorA as any);
      const indexB = LUDO_TURN_ORDER.indexOf(colorB as any);

      return indexA - indexB;
    });

    // Return array of player IDs in correct order
    return playersArray.map((p) => p.id);
  }

  //  function to update pawn position
  updatePawnPosition(playerId: string) {
    const player = this.players.get(playerId); // get the player with respective id
    if (
      player?.id === this.fromPosition?.playerId &&
      player?.id === this.toPosition?.playerId
    ) {
      const pawn = player?.pawnPosition.find(
        (pawn) => pawn.pawnId === this.fromPosition?.pawnId,
      );
      // if pawn is exist then update this toPosition object
      if (pawn) {
        pawn.position.x = this.toPosition?.x as number;
        pawn.position.y = this.toPosition?.y as number;
        pawn.position.index = this.toPosition?.index as number;
      }
    }
  }

  //  function to check if there is any kill situation or not
  isThereKill(playerPosition: pawnPositon): KillResult | undefined {
    const landingCell = pawnPosition[playerPosition.index];
    console.log("that cell data : ", landingCell);
    if (landingCell?.isSafe) return;
    for (const player of this.players.values()) {
      if (player.id === playerPosition.playerId) continue;
      for (const pawn of player.pawnPosition) {
        if (
          pawn.position.x === playerPosition.x &&
          pawn.position.y === playerPosition.y &&
          pawn.position.index === playerPosition.index
        ) {
          // this.sendPawnToHome(player, pawn);
          return {
            killedPlayer: player,
            killedPawn: pawn,
          };
        }
      }
    }
  }

  sendPawnToHome(
    player: User,
    killedPawn: {
      pawnId: string;
      position: {
        x: number;
        y: number;
        index: number;
      };
    },
  ) {
    // code here
    // first set fromPosition and toPosition
    this.fromPosition = {
      playerId: player.id,
      pawnId: killedPawn.pawnId,
      color: player.color as string,
      x: killedPawn.position.x,
      y: killedPawn.position.y,
      index: killedPawn.position.index,
    };

    console.log("from position : ", this.fromPosition);
    const color = player.color as string;

    const freeHome = getFreeHomePosition(color, player.pawnPosition);

    if (freeHome) {
      console.log("Free home cell:", freeHome);
    }

    console.log("free home : ", freeHome);
    if (!freeHome) return;

    this.toPosition = {
      playerId: player.id,
      pawnId: killedPawn.pawnId,
      color: player.color as string,
      x: freeHome.x,
      y: freeHome.y,
      index: freeHome.index,
    };

    console.log("target position : ", this.toPosition);
    const movementPath = momentPath(this.fromPosition, this.toPosition); // create moment path
    return movementPath;
  }

  checkIfAllPawnsInHome(userId: string): boolean {
    const player = this.players.get(userId);

    if (!player || !player.pawnPosition) {
      return false;
    }

    // Check if ALL pawns are in home position
    const allInHome = player.pawnPosition.every((pawn) => {
      const pawnPosition = pawn.position;
      return isInHome(player.color as string, pawn.pawnId, pawnPosition);
    });

    return allInHome;
  }
  // function to add the message
  addMessage(userId: string, username: string, message: string, color: string) {
    this.chatMessages.push({
      messageId: uuidv4(),
      userId,
      username,
      message,
      timestamp: Date.now(),
      color,
    });

    return this.chatMessages[this.chatMessages.length - 1];
  }

  // get recent messages only
  getRecentMessages(limit = 50) {
    return this.chatMessages.slice(-limit);
  }

  // Add to your Games class or WholeLogic

  checkVictory(playerId: string): boolean {
    const player = [...this.players.values()].find((p) => p.id === playerId);

    if (!player) return false;

    // victory means all four pawns at -1 index
    const allPawnsInVictory = player.pawnPosition.every(
      (pawn) => pawn.position.index === -1,
    );

    return allPawnsInVictory;
  }

  // check if player is present in game or not
  hasPlayer(playerId: string): boolean {
    return [...this.players.values()].some((player) => player.id === playerId);
  }

  removePlayer(playerId: string): void {
    const player = [...this.players.values()].find(
      (player) => player.id === playerId,
    );

    if (!player) {
      console.log(`Player ${playerId} not found in game ${this.gameId}`);
      return;
    }

    // Remove the player
    this.players.delete(player.id);
    console.log(`Player ${player.username} removed from game ${this.gameId}`);

    // Optional: Notify other players
    const message = {
      type: PLAYER_LEFT,
      message:"a player left the game",
      data: {
        remainingPlayers: this.playerData(),
      },
    };

    // broadcast the left player message
    broadcast(this.players, message);
  }
}
