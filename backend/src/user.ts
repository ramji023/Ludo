import { v4 as uuidv4 } from "uuid";
import { WebSocket } from "ws";

export default class User {
  id: string;
  username: string;
  socket: WebSocket;
  type: "host" | "player";
  color: null | string;
  pawnPosition: {
    pawnId: string;
    position: { x: number; y: number; index: number };
  }[];
  hasWon:boolean;
  constructor(username: string, type: "host" | "player", socket: WebSocket) {
    this.id = uuidv4();
    this.username = username;
    this.type = type;
    this.socket = socket;
    this.color = null;
    this.pawnPosition = [];
    this.hasWon = false;
  }
}
