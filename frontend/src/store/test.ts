// Add this helper function to test the end-game and winner functionality

import AudioManager from "../audioManager";
import useSocketStore from "./SocketStore";

export const simulateGameWon = () => {
  useSocketStore.setState({
    players: [
      {
        id: "player-1",
        username: "Player 1",
        type: "host",
        color: "red",
        pawnPosition: [
          { pawnId: "r1", position: { x: 300, y: 340, index: -1 } },
          { pawnId: "r2", position: { x: 300, y: 340, index: -1 } },
          { pawnId: "r3", position: { x: 300, y: 340, index: -1 } },
          { pawnId: "r4", position: { x: 300, y: 340, index: -1 } },
        ],
        hasWon: true,
      },
      {
        id: "player-2",
        username: "Player 2",
        type: "player",
        color: "blue",
        pawnPosition: [
          { pawnId: "b1", position: { x: 60, y: 60, index: 0 } },
          { pawnId: "b2", position: { x: 180, y: 60, index: 1 } },
          { pawnId: "b3", position: { x: 60, y: 180, index: 2 } },
          { pawnId: "b4", position: { x: 180, y: 180, index: 3 } },
        ],
        hasWon: false,
      },
      {
        id: "player-3",
        username: "Player 3",
        type: "player",
        color: "green",
        pawnPosition: [
          { pawnId: "g1", position: { x: 420, y: 420, index: 0 } },
          { pawnId: "g2", position: { x: 540, y: 420, index: 1 } },
          { pawnId: "g3", position: { x: 420, y: 540, index: 2 } },
          { pawnId: "g4", position: { x: 540, y: 540, index: 3 } },
        ],
        hasWon: false,
      },
      {
        id: "player-4",
        username: "Player 4",
        type: "player",
        color: "yellow",
        pawnPosition: [
          { pawnId: "y1", position: { x: 420, y: 60, index: 0 } },
          { pawnId: "y2", position: { x: 540, y: 60, index: 1 } },
          { pawnId: "y3", position: { x: 420, y: 180, index: 2 } },
          { pawnId: "y4", position: { x: 540, y: 180, index: 3 } },
        ],
        hasWon: false,
      },
    ],
    currentPlayerTurn: "player-2",
    audioManager: new AudioManager(),
    winnerRank: [{ playerId: "player-1", rank: 1 }],
  });
};

export const simulateGameEnded = () => {
  useSocketStore.setState({
    players: [
      {
        id: "player-1",
        username: "Player 1",
        type: "host",
        color: "red",
        pawnPosition: [
          { pawnId: "r1", position: { x: 300, y: 340, index: -1 } },
          { pawnId: "r2", position: { x: 300, y: 340, index: -1 } },
          { pawnId: "r3", position: { x: 300, y: 340, index: -1 } },
          { pawnId: "r4", position: { x: 300, y: 340, index: -1 } },
        ],
        hasWon: true,
      },
      {
        id: "player-2",
        username: "Player 2",
        type: "player",
        color: "blue",
        pawnPosition: [
          { pawnId: "b1", position: { x: 260, y: 300, index: -1 } },
          { pawnId: "b2", position: { x: 260, y: 300, index: -1 } },
          { pawnId: "b3", position: { x: 260, y: 300, index: -1 } },
          { pawnId: "b4", position: { x: 260, y: 300, index: -1 } },
        ],
        hasWon: true,
      },
      {
        id: "player-3",
        username: "Player 3",
        type: "player",
        color: "green",
        pawnPosition: [
          { pawnId: "g1", position: { x: 340, y: 300, index: -1 } },
          { pawnId: "g2", position: { x: 340, y: 300, index: -1 } },
          { pawnId: "g3", position: { x: 340, y: 300, index: -1 } },
          { pawnId: "g4", position: { x: 340, y: 300, index: -1 } },
        ],
        hasWon: true,
      },
      {
        id: "player-4",
        username: "Player 4 (Last)",
        type: "player",
        color: "yellow",
        pawnPosition: [
          { pawnId: "y1", position: { x: 420, y: 60, index: 0 } },
          { pawnId: "y2", position: { x: 540, y: 60, index: 1 } },
          { pawnId: "y3", position: { x: 420, y: 180, index: 2 } },
          { pawnId: "y4", position: { x: 540, y: 180, index: 3 } },
        ],
        hasWon: false,
      },
    ],
    currentPlayerTurn: "player-4",
    gameStatus: "end",
    audioManager: new AudioManager(),
    winnerRank: [
      { playerId: "player-1", rank: 1 },
      { playerId: "player-2", rank: 2 },
      { playerId: "player-3", rank: 3 },
    ],
  });
};
