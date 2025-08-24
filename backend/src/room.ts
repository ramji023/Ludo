import { User } from "./user";
import { v4 as uuidv4 } from "uuid";
export class Room {
  public roomId: string;
  public players: Map<string, User>;
  public hostId: string;
  public status: "waiting" | "playing" | "finished";
  constructor(user: User) {
    this.roomId = uuidv4();
    const map = new Map();
    this.players = map.set(user.id, user);
    this.hostId = user.id;
    this.status = "waiting";
  }

  addPlayer(player: User) {
    this.players.set(player.id, player);
  }

  // ensure that there should be 4 player
  canStart() {
    return this.players.size === 4;
  }

  // check if user is host
  isHost(id: string) {
       return this.hostId === id
  }

  // check if any user dont select same color
  checkColors() {
    
  }
}
