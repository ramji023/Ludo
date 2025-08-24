import { homePoints } from "./utils/grid";
import { WebSocket } from "ws";
import { v4 as uuidv4 } from "uuid";
export class User {
  public id: string;
  public socket: WebSocket;
  public name: string;
  public color: string;
  public currentPosition: { pawns: string; position: string }[] = [];
  public prevPosition: { pawns: string; position: string }[] = [];
  constructor(
    socket: WebSocket,
    name: string,
    color: string,
  ) {
    this.socket = socket;
    this.id = uuidv4();
    this.name = name;
    this.color = color;
    homePoints[color].map((pos, index) => {
      const newObject = {
        pawns: `${this.color[0]}${index}`,
        position: pos,
      };
      this.currentPosition.push(newObject);
    });
    this.prevPosition = [...this.currentPosition];
  }

}
