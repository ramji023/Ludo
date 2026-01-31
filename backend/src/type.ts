import Users from "./user";

export interface pawnPositon {
  playerId: string;
  color: string;
  pawnId: string;
  x: number;
  y: number;
  index: number;
}

export type KillResult = {
  killedPlayer: Users;
  killedPawn: {
    pawnId: string;
    position: { x: number; y: number; index: number };
  };
};

export interface ChatMessages {
  messageId: string;
  userId: string;
  username: string;
  message: string;
  timestamp: number;
  color: string;
}
