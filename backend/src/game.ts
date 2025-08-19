import { User } from "./user";
import {} from "./utils/grid"
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

  makeMove(roomId:string,diceValue:number,pawn:string,player:User){
      const currentPlayer = this.players.get(player.id)
      if(currentPlayer){
        const currentPosition = currentPlayer.currentPosition
        
        // if player in home area

        // if player in safe place

        // if player in start point

        // if player in path

        // if player in victory path

        // if player in victory box

      }
  }
}
