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
