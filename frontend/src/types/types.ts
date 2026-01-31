export interface SocketStoreType {
  socket: WebSocket | null;
  id: string | null;
  username: string | null;
  type: "host" | "player";
  color: string | null;
  gameId: string | null;
  gameStatus: null | "create" | "wait" | "start" | "end";
  players:
    | {
        id: string;
        username: string;
        type: string;
        color: string;
        hasWon:boolean;
        pawnPosition:
          | {
              pawnId: string;
              position: {
                x: number;
                y: number;
                index: number;
              };
            }[]
          | [];
      }[]
    | null;
  currentPlayerTurn: string | null;
  currentDiceValue: number;
  movementData: {
    playerId: string;
    pawnId: string;
    movement: {
      x: number;
      y: number;
      index: number;
    }[];
  } | null;
  killMovementData: {
    playerId: string;
    pawnId: string;
    movement: {
      x: number;
      y: number;
      index: number;
    }[];
  } | null;
  chatMessages: {
    messageId: string;
    userId: string;
    username: string;
    message: string;
    timestamp: number;
    color: string;
  }[];
  winnerRank: { playerId: string; rank: number }[] ;
  setSocketInstance: (socket: WebSocket) => void;
}

export interface Player {
  id: string;
  username: string;
  type: string;
  color: string;
  pawnPosition:
    | []
    | {
        pawnId: string;
        position: {
          x: number;
          y: number;
          index: number;
        };
      }[];
}

export interface Pawn {
  pawnId: string;
  position: {
    x: number;
    y: number;
    index: number;
  };
}

export interface Players {
  id: string;
  username: string;
  type: string;
  color: string;
  hasWon:boolean;
  pawnPosition:
    | {
        pawnId: string;
        position: {
          x: number;
          y: number;
          index: number;
        };
      }[]
    | [];
}

