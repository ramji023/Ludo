export const globalGamePath = [
  "r6c1",
  "r6c2",
  "r6c3",
  "r6c4",
  "r6c5",
  "r5c6",
  "r4c6",
  "r3c6",
  "r2c6",
  "r1c6",
  "r0c6",
  "r0c7",
  "r0c8",
  "r1c8",
  "r2c8",
  "r3c8",
  "r4c8",
  "r5c8",
  "r6c9",
  "r6c10",
  "r6c11",
  "r6c12",
  "r6c13",
  "r6c14",
  "r7c14",
  "r8c14",
  "r8c13",
  "r8c12",
  "r8c11",
  "r8c10",
  "r8c9",
  "r9c8",
  "r10c8",
  "r11c8",
  "r12c8",
  "r13c8",
  "r14c8",
  "r14c7",
  "r14c6",
  "r13c6",
  "r12c6",
  "r11c6",
  "r10c6",
  "r9c6",
  "r8c5",
  "r8c4",
  "r8c3",
  "r8c2",
  "r8c1",
  "r8c0",
  "r7c0",
  "r6c0",
];

export const victoryPaths: Record<string, string[]> = {
  blue: ["r5c7", "r4c7", "r3c7", "r2c7", "r1c7"],
  green: ["r7c9", "r7c10", "r7c11", "r7c12", "r7c13"],
  yellow: ["r9c7", "r10c7", "r11c7", "r12c7", "r13c7"],
  red: ["r7c5", "r7c4", "r7c3", "r7c2", "r7c1"],
};

type homePoints = Record<string, string[]>;
export const homePoints: homePoints = {
  red: ["r1c1", "r1c4", "r4c1", "r4c4"],
  blue: ["r1c10", "r1c13", "r4c10", "r4c13"],
  green: ["r10c10", "r10c13", "r13c10", "r13c13"],
  yellow: ["r10c1", "r10c4", "r13c1", "r13c4"],
};

export const startPoints: Record<string, string[]> = {
  red: ["r6c1"],
  blue: ["r1c8"],
  green: ["r8c13"],
  yellow: ["r13c6"],
};

export const safePoints = ["r8c2", "r2c6", "r6c12", "r12c8"];

export const victoryBox: Record<string, string[]> = {
  red: [],
  blue: [],
  green: [],
  yellow: [],
};

export function isHome(position: string, color: string) {
  if (homePoints[color].includes(position)) {
    return true;
  }

  return false;
}

export function isSafe(position: string, color: string) {
  if (safePoints.includes(position)) {
    return true;
  }

  return false;
}

export function isPath(position: string, color: string) {
  const globalPosition = globalGamePath.findIndex((path) => path === position);

  if (globalPosition >= 0) return globalPosition;

  return null;
}

export function isVictoryPath(position: string, color: string) {
  const globalPosition = victoryPaths[color].findIndex(
    (path) => path === position
  );

  if (globalPosition >= 0) return globalPosition;

  return null;
}

export function isStart(position: string, color: string) {
  const pawnPosition = homePoints[color][0];
  const globalArrayIndex = globalGamePath.findIndex((path)=>path===pawnPosition)
  if(globalArrayIndex >= 0){
    return globalArrayIndex
  }

  return null;
}

export function isVictory(position: string, color: string) {
  if (victoryBox[color].includes(position)) {
    return true;
  }

  return false;
}
