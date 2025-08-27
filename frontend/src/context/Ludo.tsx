import React, { createContext, useEffect, type ReactElement } from "react";
import { useState } from "react";
import { useSocket } from "../hooks/useSocket";

interface PawnState {
  id: string;
  position: number;
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
  pawns: {
    [playerId: string]: { [pawnId: string]: number };
  };
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
    pawns: {},
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
              myPlayerId: data.payload.id,
              roomId: data.payload.roomId,
            }));
            setMessages((curr) => [...curr, data.message]);
            break;
          case "game_started":
            setLudoState((curr) => ({
              ...curr,
              rollTurn: data.payload.rollTurn,
              players: curr.players.map((player) => ({
                ...player,
                ...data.payload.players,
              })),
            }));
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
