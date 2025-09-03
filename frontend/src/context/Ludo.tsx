import React, { createContext, useEffect, type ReactElement } from "react";
import { useState } from "react";
import { useSocket } from "../hooks/useSocket";

interface PawnState {
  id: string;
  position: string;
}

interface PlayerState {
  id: string;
  name: string;
  color: string;
  pawns: PawnState[];
}

interface LudoStateType {
  connection: WebSocket | null;
  roomId: string;
  isHost: boolean;
  status: "waiting" | "in-progress" | "finished";
  players: PlayerState[];
  myPlayerId: string;
  color: string;
  currentTurn: string;
  diceValue: number | null;
  currentMove: {
    playerId: string;
    color: string;
    pawnId: string;
    newPosition: string;
  } | null;
  rollTurn: string;
  winner: string | null;
}

interface ludoContextType {
  ludoState: LudoStateType | null;
  setLudoState: React.Dispatch<React.SetStateAction<LudoStateType>>;
  messages: string[];
}

export const ludoStateContext = createContext<ludoContextType | null>(null);

export const LudoStateContextProvider = ({
  children,
}: {
  children: ReactElement;
}) => {
  const [ludoState, setLudoState] = useState<LudoStateType>({
    connection: null,
    roomId: "",
    isHost: false,
    status: "waiting",
    players: [],
    myPlayerId: "",
    color: "",
    currentTurn: "",
    diceValue: null,
    currentMove: null,
    winner: null,
    rollTurn: "",
  });
  const [messages, setMessages] = useState<string[]>([]);
  const { socket } = useSocket();

  // first time run when re-render
  useEffect(() => {
    if (!socket) return;
    if (socket) {
      setLudoState((curr) => ({ ...curr, connection: socket }));

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        switch (data.type) {
          case "room_created":
            setLudoState((curr) => ({
              ...curr,
              isHost: true,
              myPlayerId: data.payload.userId,
              roomId: data.payload.roomId,
            }));
            setMessages((curr) => [...curr, data.message]);
            break;
          case "room_joined":
            setLudoState((curr) => ({
              ...curr,
              myPlayerId:
                curr.myPlayerId === "" ? data.payload.id : curr.myPlayerId,
              roomId: curr.roomId === "" ? data.payload.roomId : curr.roomId,
            }));
            setMessages((curr) => [...curr, data.message]);
            break;
          case "game_started":
            setLudoState((curr) => ({
              ...curr,
              rollTurn: data.rollTurn,
              players: data.payload.players.map(
                (player: {
                  id: string;
                  name: string;
                  color: string;
                  currentpawnsPosition: { pawns: string; position: string }[];
                }) => ({
                  id: player.id,
                  name: player.name,
                  color: player.color,
                  pawns: player.currentpawnsPosition.map((pawn) => ({
                    id: pawn.pawns,
                    position: pawn.position,
                  })),
                })
              ),
            }));
            break;
          case "rolled_dice":
            setLudoState((curr) => ({
              ...curr,
              diceValue: data.payload.diceValue,
            }));
            break;
          case "skipped_move":
            setLudoState((curr) => ({
              ...curr,
              rollTurn: data.payload.nextTurn,
            }));
            break;
          case "moved_make":
            setLudoState((curr) => {
              if (data.payload.roomId !== curr.roomId) return curr;
              return {
                ...curr,
                currentMove: {
                  playerId: data.payload.id,
                  color: data.payload.color,
                  pawnId: data.payload.pawn,
                  newPosition: data.payload.pawnPosition,
                },
                rollTurn: data.payload.rollTurn,
              };
            });
            break;
        }
      };
    }
  }, [socket]);

  return (
    <ludoStateContext.Provider value={{ ludoState, setLudoState, messages }}>
      {children}
    </ludoStateContext.Provider>
  );
};
