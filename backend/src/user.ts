import { homePoints } from "./utils/grid";
import { WebSocket } from "ws";
export class User {
  public id: string;
  public socket: WebSocket;
  private isHost: boolean = false;
  public name: string;
  public color: string;
  public currentPosition: { pawns: string; position: string; }[] = [];
  public prevPosition: { pawns: string; position: string; }[] = [];
  constructor(
    socket: WebSocket,
    id: string,
    name: string,
    color: string,
    isHost?: boolean
  ) {
    this.socket = socket;
    this.id = id;
    if (isHost) {
      this.isHost = isHost;
    }
    this.name = name;
    this.color = color;
    homePoints.color.map((pos,index)=>{
      const newObject = {
        pawns : `${this.color[0]}${index}`,
        position : pos
      }
      this.currentPosition.push(newObject)
    })
    this.prevPosition = [...this.currentPosition]
  }
}
