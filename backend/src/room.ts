import { User } from "./user";
export class Room {
  private roomId: string;
  public players: Map<string, User>;
  public hostId?: string;
  constructor() {
    this.roomId = "";
    this.players = new Map();
  }
  initializeRoom(roomId: string, player: User) {
    this.roomId = roomId;
    this.players.set(player.id, player);
    this.hostId = player.id;
  }

  addPlayer(player: any) {
    this.players.set(player.id, player);
  }
}
