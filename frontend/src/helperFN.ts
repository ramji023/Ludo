import type { Player, Players } from "./types/types";

const PATH_SIZE = 40;
const HOME_RADIUS = 25;

export function normalizePawnPosition(x: number, y: number) {
  // If this looks like a rectangle top-left (path box)
  // path positions will always align on 40px grid
  if (x % PATH_SIZE === 0 && y % PATH_SIZE === 0) {
    return {
      x: x + PATH_SIZE / 2,
      y: y + PATH_SIZE / 2,
    };
  }

  // Otherwise assume circle/home (already centered)
  return { x, y };
}

const PAWN_SIZE = 35;
const OVERLAP = PAWN_SIZE * 0.35; // ~12px

export function getPawnOffset(total: number, index: number) {
  if (total <= 1) return { dx: 0, dy: 0 };

  // 2 pawns → left / right
  if (total === 2) {
    return {
      dx: index === 0 ? -OVERLAP / 2 : OVERLAP / 2,
      dy: 0,
    };
  }

  // 3 pawns → triangle
  if (total === 3) {
    const offsets = [
      { dx: 0, dy: -OVERLAP / 2 },
      { dx: -OVERLAP / 2, dy: OVERLAP / 2 },
      { dx: OVERLAP / 2, dy: OVERLAP / 2 },
    ];
    return offsets[index];
  }

  // 4 pawns (max in Ludo) → square
  const offsets = [
    { dx: -OVERLAP / 2, dy: -OVERLAP / 2 },
    { dx: OVERLAP / 2, dy: -OVERLAP / 2 },
    { dx: -OVERLAP / 2, dy: OVERLAP / 2 },
    { dx: OVERLAP / 2, dy: OVERLAP / 2 },
  ];

  return offsets[index];
}


import { homePosition } from "./pawnPath"; // adjust path as needed

export function checkIfAllPawnsInHome(
  userId: string,
  userColor: string,
  players: Players[],
): boolean {
  // Find the player by userId
  const player = players.find((p) => p.id === userId);

  if (!player) {
    console.log(`Player with id ${userId} not found`);
    return false;
  }

  // If no pawns on the board, all are in home
  if (player.pawnPosition.length === 0) {
    console.log(`Player ${userColor}: No pawns on board. All in home.`);
    return true;
  }

  // Get the home positions for this player's color
  const homePositions = homePosition[userColor];

  if (!homePositions) {
    console.log(`Home positions not found for color ${userColor}`);
    return false;
  }

  // Check if all pawns currently on the board are at home positions
  const allInHome = player.pawnPosition.every((pawn) => {
    return homePositions.some(
      (homePos) =>
        homePos.x === pawn.position.x &&
        homePos.y === pawn.position.y &&
        homePos.index === pawn.position.index,
    );
  });

  console.log(
    `Player ${userColor}: ${player.pawnPosition.length}/4 pawns on board. All in home: ${allInHome}`,
  );

  return allInHome;
}


export function checkIfPawnInHome(
  pawnPosition: { x: number; y: number; index: number },
  playerColor: string
): boolean {
  const homePositions = homePosition[playerColor];

  if (!homePositions) {
    return false;
  }

  return homePositions.some(
    (homePos) =>
      homePos.x === pawnPosition.x &&
      homePos.y === pawnPosition.y &&
      homePos.index === pawnPosition.index
  );
}