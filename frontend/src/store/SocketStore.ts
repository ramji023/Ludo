import { create } from "zustand";
import { type SocketStoreType } from "../types/types";

const useSocketStore = create<SocketStoreType>((set) => ({
  socket: null, // socket instance
  id: null, //  user unique id
  username: null, // user username
  type: "player", // user type wheather he is "host" or "player"
  color: null, // user home color
  gameId: null, // game specific id
  gameStatus: null, // game current status it can be "create" | "wait" | "start" | "end"
  players: null, // store all the players data including user as an array of object {id,username}
  currentPlayerTurn: null, // store current player turn id
  currentDiceValue: -1,
  movementData: null, // store the movement data of pawn
  killMovementData: null, // store the movement data of killed pawn
  chatMessages: [], // array to store all the messages
  setSocketInstance: (socket: WebSocket) => {
    set({ socket }); // store the socket object in socket

    // handle all messages events from server side
    socket.onmessage = (event) => {
      const parsedDataObject = JSON.parse(event.data);

      switch (parsedDataObject.type) {
        // got this event when host create the game
        case "init_game":
          set({
            id: parsedDataObject.data.id,
            username: parsedDataObject.data.username,
            gameId: parsedDataObject.data.gameId,
            gameStatus: parsedDataObject.data.gameStatus,
            type: parsedDataObject.data.type,
            players: parsedDataObject.data.players,
            color: parsedDataObject.data.color,
          });
          break;
        // got this event when player joined the game
        case "player_joined":
          set({
            id: parsedDataObject.data.id,
            username: parsedDataObject.data.username,
            gameId: parsedDataObject.data.gameId,
            gameStatus: parsedDataObject.data.gameStatus,
            type: parsedDataObject.data.type,
            players: parsedDataObject.data.players,
            color: parsedDataObject.data.color,
          });
          break;
        // got this event when any player joined the game then got all updated player data
        case "all_players":
          set({ players: parsedDataObject.data.players });
          break;

        // got this event when server is ready to start the game
        case "game_started":
          set({
            players: parsedDataObject.data.players,
            currentPlayerTurn: parsedDataObject.data.currentPlayerTurn,
            gameStatus: parsedDataObject.data.gameStatus,
          });
          break;

        case "dice_rolled":
          set({ currentDiceValue: parsedDataObject.data.diceValue });
          break;

        case "made_move":
          set({
            movementData: {
              playerId: parsedDataObject.data.playerId,
              pawnId: parsedDataObject.data.pawnId,
              movement: parsedDataObject.data.movement.map((mov: any) => ({
                x: mov.x,
                y: mov.y,
                index: mov.index,
              })),
            },
          });
          console.log(
            "movement data came from server : ",
            useSocketStore.getState().movementData,
          );
          break;

        case "pawn_killed":
          set({
            killMovementData: {
              playerId: parsedDataObject.data.playerId,
              pawnId: parsedDataObject.data.pawnId,
              movement: parsedDataObject.data.movement.map((mov: any) => ({
                x: mov.x,
                y: mov.y,
                index: mov.index,
              })),
            },
          });
          console.log("Kill movement data received");
          break;

        case "update_players":
          set({
            players: parsedDataObject.data.players,
            currentPlayerTurn: parsedDataObject.data.currentPlayerTurn,
            movementData: null,
            killMovementData: null,
            currentDiceValue: -1,
          });
          break;

        case "send_chat_message":
          // store all the messages
          set({
            chatMessages: [
              ...useSocketStore.getState().chatMessages,
              parsedDataObject.data.messages,
            ],
          });
          break;
      }
    };
  },
}));

export default useSocketStore;
