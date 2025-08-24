import { User } from "./user";
import { v4 as uuidv4 } from "uuid";
export class Room {
  public roomId: string;
  public players: Map<string, User>;
  public hostId: string;
  constructor(user: User) {
    this.roomId = uuidv4();
    const map = new Map();
    this.players = map.set(user.id, user);
    this.hostId = user.id;
  }
  /*
  initializeRoom(roomId: string, player: User) {
    this.roomId = roomId;
    this.players.set(player.id, player);
  }
* */
  addPlayer(player: User) {
    this.players.set(player.id, player);
  }
}
