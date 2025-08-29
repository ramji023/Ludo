import { WebSocket } from "ws";
import {
  CREATE_ROOM,
  GAME_STARTED,
  JOIN_ROOM,
  MAKE_MOVE,
  ROLL_DICE,
  ROLLED_DICE,
  ROOM_CREATED,
  ROOM_JOINED,
  START_GAME,
} from "./messages";
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
    socket.send(JSON.stringify({ msg: "user added to the server" }));
    this.addHandler(socket);
  }

  private addHandler(socket: WebSocket) {
    // user send an event to server
    socket.on("message", (message) => {
      const parsedMessage = JSON.parse(message.toString());
      /* 
      parsedMessage = {
           "type" : "create_room",
           "payload" : {
             
           }
      }
           */

      // if host send create room event
      if (parsedMessage.type === CREATE_ROOM) {
        this.createRoom(socket, parsedMessage);
      }

      // if player send join room event
      if (parsedMessage.type === JOIN_ROOM) {
        this.joinRoom(socket, parsedMessage);
      }

      // if host start the game
      if (parsedMessage.type === START_GAME) {
        this.startGame(socket, parsedMessage);
      }

      // if player roll dice
      if (parsedMessage.type === ROLL_DICE) {
        this.rollDice(socket, parsedMessage);
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
    /*
    "payload" : {
      "name" : "Zassicca"
      "color" : "blue"
    }
    */
    const user = new User(socket, payload.name, payload.color);

    console.log("user object after creating room : ", user);
    const room = new Room(user); // create a new room object
    console.log("room object after creating room : ", room);
    // room.initializeRoom(payload.id, user);
    this.rooms.set(room.roomId, room); // set the new room in game manager class

    //broadcast room created event to client
    socket.send(
      JSON.stringify({
        type: ROOM_CREATED,
        payload: { roomId: room.roomId, userId: user.id },
        message: `${user.name} has joined the game`,
      })
    );
  }

  // when someone join the room
  joinRoom(socket: WebSocket, parsedMessage: any) {
    const payload = parsedMessage.payload;
    /*
    "payload" : {
      "name" : "Bob"
      "color" : "green"
      "roomId" : "..."
    }
    */

    // check user is joinee or host
    const user = new User(socket, payload.name, payload.color);
    console.log("user object after joining room : ", user);

    const room = this.rooms.get(payload.roomId);
    if (room) {
      room.addPlayer(user);
      //broadcast joined room event to client
      room?.players.forEach((player, playerId) => {
        player.socket.send(
          JSON.stringify({
            type: ROOM_JOINED,
            payload: {
              id: user.id,
              roomId: room.roomId,
            },
            message: `${user.name} has joined the game`,
          })
        );
      });
    }
    console.log("room object after joining room : ", room);
  }

  // when host start to play game
  startGame(socket: WebSocket, parsedMessage: any) {
    const payload = parsedMessage.payload;
    /*
    "payload" : {
      "id" : "..."
      "roomId" : "..."
    }
    */
    //  console.log("hit the start game checkpoint 0")
    const room = this.rooms.get(payload.roomId);
    //  console.log("hit the start game checkpoint 1",room)
    // check if user is host or not
    if (room && room.isHost(payload.id)) {
      // console.log("hit the start game checkpoint 2")
      // check there should be 4 player
      // if (!room.canStart()) {
      //   return;
      // }
      console.log("hit the start game checkpoint 3");
      room.status = "playing";
      const users = room.players;
      if (users) {
        const game = new Game();
        game.startGame(payload.roomId, payload.id, users);
        this.games.set(payload.roomId, game);
        console.log("game object after starting the game : ", game);

        //broadcast start game event to all the players
        interface playerArray {
          id: string;
          name: string;
          color: string;
          currentpawnsPosition: {
            pawns: string;
            position: string;
          }[];
        }
        let players: playerArray[] = [];
        game.players.forEach((player, playerId) => {
          players.push({
            id: player.id,
            name: player.name,
            color: player.color,
            currentpawnsPosition: player.currentPosition,
          });
        });

        game.players.forEach((player) => {
          player.socket.send(
            JSON.stringify({
              type: GAME_STARTED,
              payload: { players: players },
              rollTurn: game.rollTurn,
            })
          );
        });
      }
    }
  }

  // when host roll the dice
  rollDice(socket: WebSocket, parsedMessage: any) {
    const payload = parsedMessage.payload;
    const game = this.games.get(payload.roomId);
    if (game && game.players.get(payload.id) && game.rollTurn === payload.id) {
      const newVal = Math.floor(Math.random() * 6) + 1;
      game.diceValue = newVal;
      game.players.forEach((player) => {
        player.socket.send(
          JSON.stringify({
            type: ROLLED_DICE,
            payload: {
              playerId: payload.id,
              roomId: payload.roomId,
              diceValue: newVal,
            },
          })
        );
      });
    }
  }

  // when player make move
  makeMove(socket: WebSocket, parsedMessage: any) {
    console.log("hit the make move  event in server side")
    const payload = parsedMessage.payload;
    /*
    "payload" : {
      "id" : "..."
      "roomId" : "..."
      "pawn" : ""
    }
    */
    const room = this.rooms.get(payload.roomId);
    if (room) {
      const user = room.players.get(payload.id);
      if (user && user.socket === socket) {
        const game = this.games.get(payload.roomId);
        if (game && !game.isGameOver()) {
           console.log("called the makeMove function on server side")
          game.makeMove(payload.roomId, payload.pawn, user);
        }
      }
    }
  }
}
