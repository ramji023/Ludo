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
  currentTurn: string;
  diceValue: number | null;
  pawns: {
    [playerId: string]: { [pawnId: string]: number };
  };
  winner: string | null;
}

interface ludoContextType {
  ludoState: LudoStateType | null;
  setLudoState: React.Dispatch<React.SetStateAction<LudoStateType>>;
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
    currentTurn: "",
    diceValue: null,
    pawns: {},
    winner: null,
  });

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
              myPlayerId: data.payload.userId,
              roomId: data.payload.roomId,
            }));
            break;
        }
      };
    }
  }, [socket]);

  return (
    <ludoStateContext.Provider value={{ ludoState, setLudoState }}>
      {children}
    </ludoStateContext.Provider>
  );
};
