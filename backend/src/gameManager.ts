import { WebSocket } from "ws";
import { CREATE_ROOM, JOIN_ROOM, MAKE_MOVE, START_GAME } from "./messages";
import { User } from "./user";
import { Room } from "./room";
import { Game } from "./game";
export class GameManager {
  private rooms: Map<string, Room>;
  private users: WebSocket[];
  private games: Map<string, Game>;
  constructor() {
    this.rooms = new Map();
    this.users = [];
    this.games = new Map();
  }

  addUser(socket: WebSocket) {
    this.users.push(socket);
    this.addHandler(socket);
  }

  private addHandler(socket: WebSocket) {
    socket.on("message", (message) => {
      const parsedMessage = JSON.parse(message.toString());

      // if client send create room event
      if (parsedMessage.type === CREATE_ROOM) {
        this.createRoom(socket, parsedMessage);
      }
      // if client send join room event
      if (parsedMessage.type === JOIN_ROOM) {
        this.joinRoom(socket, parsedMessage);
      }

      // if host start the game
      if (parsedMessage.type === START_GAME) {
        this.startGame(socket, parsedMessage);
      }

      // if player make move
      if (parsedMessage.type === MAKE_MOVE) {
        this.makeMove(socket, parsedMessage);
      }
    });
  }

  // when host create the room
  createRoom(socket: WebSocket, parsedMessage: any) {
    const payload = parsedMessage.payload;
    const user = new User(
      socket,
      payload.id,
      payload.name,
      parsedMessage.color,
      payload.isHost
    );
    const room = new Room();
    room.initializeRoom(payload.id, user);
    this.rooms.set(payload.roomId, room);
  }

  // when someone join the room
  joinRoom(socket: WebSocket, parsedMessage: any) {
    const payload = parsedMessage.payload;
    const user = new User(
      socket,
      payload.id,
      payload.name,
      parsedMessage.color
    );

    const room = this.rooms.get(payload.roomId);
    if (room) {
      room.addPlayer(user);
    }
  }

  // when host start to play game
  startGame(socket: WebSocket, parsedMessage: any) {
    const payload = parsedMessage.payload;
    // check if user is host or not
    const room = this.rooms.get(payload.roomId);
    if (room && room.hostId === payload.id) {
      const user = room.players.get(payload.id);
      if (user) {
        const game = new Game();
        game.startGame(payload.roomId, user);
        this.games.set(payload.roomId, game);
      }
    }
  }

  // when player make move
  makeMove(socket: WebSocket, parsedMessage: any) {
    const payload = parsedMessage.payload;
    const room = this.rooms.get(payload.roomId);
    if (room) {
      const user = room.players.get(payload.id);
      if (user && user.socket === socket) {
        const game = this.games.get(payload.roomId);
        if (game) {
          game.makeMove(payload.roomId, payload.diceValue,payload.pawns, user);
        }
      }
    }
  }
}
