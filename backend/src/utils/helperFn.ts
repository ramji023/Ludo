import { pawnPositon } from "../type";
import {
  homePosition,
  pawnPosition,
  victoryBox,
  victoryPathMap,
} from "./pawnPath";

// function to  check wheather pawn is in home or not
export function isInHome(
  color: string,
  pawnId: string,
  pawnPosition: { x: number; y: number; index: number },
) {
  if (!(pawnId.charAt(0) === color.charAt(0))) {
    return false;
  }
  const result = homePosition[color].some(
    (pawn) =>
      pawn.x === pawnPosition.x &&
      pawn.y === pawnPosition.y &&
      pawn.index === pawnPosition.index,
  );

  return result;
}

// find the start point of a specific pawn
export function findStart(color: string, pawnId: string) {
  const position = pawnPosition.find((p) => {
    if (p.isHome && p.home === color) {
      return p;
    }
  });
  return {
    pawnId: pawnId,
    x: position?.x,
    y: position?.y,
    index: position?.index,
  };
}

// function to check wheather user is in main path or not
export function isInMainPath(
  color: string,
  pawnId: string,
  currentPawnPosition: { x: number; y: number; index: number },
) {
  if (!(pawnId.charAt(0) === color.charAt(0))) {
    return false;
  }

  const result = pawnPosition.findIndex(
    (p) =>
      p.x === currentPawnPosition.x &&
      p.y === currentPawnPosition.y &&
      p.index === currentPawnPosition.index,
  );

  return result;
}

// function to store all the movementpath in an array if pawn is in mainpath
export function createMovementPath(
  startIndex: number,
  diceValue: number,
  pawnColor: string,
) {
  const movementArray = [];
  const pathLength = pawnPosition.length;

  let index = startIndex;
  let inVictoryPath = false; // first mark the false to inVictoryPath
  let victoryIndex = -1; // set the -1 index of victory index

  movementArray.push(pawnPosition[index]);
  for (let i = 1; i <= diceValue; i++) {
    if (!inVictoryPath) {
      index = (index + 1) % pathLength;
      const cell = pawnPosition[index];
      // if cell is the gate of victory path
      if (isVictoryGate(cell, pawnColor)) {
        inVictoryPath = true; // make true to victory path
        victoryIndex = 0; // set the current index
        // movementArray.push(victoryPathMap[pawnColor][victoryIndex]);
        movementArray.push(cell);
      } else {
        //otherwise push the cell
        movementArray.push(cell);
      }
    } else {
       // if pawn reaches at the  end of victory path
      if (victoryIndex >= victoryPathMap[pawnColor].length) {
        const remainingSteps = diceValue - i + 1;

        // check if we can place pawn in victory center
        if (remainingSteps === 1) {
          const victoryCenter = getPolygonCenter(victoryBox[pawnColor]);
          if (victoryCenter) {
            movementArray.push(victoryCenter);
          }
        }
        break;
      }
      // if inVIctoryPath become true then start to add cell from victory box
      movementArray.push(victoryPathMap[pawnColor][victoryIndex]);
      victoryIndex++;
    }
  }

  return movementArray;
}

// function to check isVictoryPath start or not
function isVictoryGate(cell: any, pawnColor: string) {
  return cell.isVictoryPathStart === true && cell.victoryPath === pawnColor;
}

// function to check if pawn is in the victory path
export function isInVictoryPath(
  color: string,
  currentPawnPosition: { x: number; y: number; index: number },
) {
  const pos = victoryPathMap[color].findIndex(
    (victory) =>
      victory.x === currentPawnPosition.x &&
      victory.y === currentPawnPosition.y &&
      victory.index === currentPawnPosition.index,
  );

  return pos;
}

// function to calculate movement path in victory path
export function createMovementPathForVictory(
  startIndex: number,
  diceValue: number,
  pawnColor: string,
) {
  const movementArray = [];
  let index = startIndex;
  const path = victoryPathMap[pawnColor];

  for (let i = 0; i <= diceValue; i++) {
    // if pawn reaches at the  end of victory path
    if (index >= path.length) {
      const remainingSteps = diceValue - i + 1;

      // check if we can place pawn in victory center
      if (remainingSteps === 1) {
        const victoryCenter = getPolygonCenter(victoryBox[pawnColor]);
        if (victoryCenter) {
          movementArray.push(victoryCenter);
        }
      }
      break;
    }

    movementArray.push(path[index]);
    index++;
  }

  return movementArray.length > 0 ? movementArray : null;
}

// function to return kill pawn to their home
export function momentPath(
  fromPosition: pawnPositon,
  toPosition: pawnPositon, // final home position
) {
  const movementPath: any[] = [];

  const pathLength = pawnPosition.length;
  const color = fromPosition.color;

  let currentIndex = fromPosition.index;

  // find home gate index for this color
  const homeGateIndex = pawnPosition.find(
    (p) => p.isHome === true && p.home === color,
  )?.index;

  if (homeGateIndex === undefined) return movementPath;

  // always include starting position
  movementPath.push(pawnPosition[currentIndex]);

  // move backwards until we reach home gate
  while (currentIndex !== homeGateIndex) {
    currentIndex = (currentIndex - 1 + pathLength) % pathLength;
    movementPath.push(pawnPosition[currentIndex]);
  }

  // finally push actual home cell (inside base)
  movementPath.push(toPosition);

  return movementPath;
}

type Position = { x: number; y: number; index: number };
// get the free home position when there is a kill situation
export function getFreeHomePosition(
  color: string,
  pawns: { pawnId: string; position: Position }[],
): Position | undefined {
  return homePosition[color].find(
    (home) =>
      !pawns.some(
        (pawn) =>
          pawn.pawnId.charAt(0) === color.charAt(0) &&
          pawn.position.x === home.x &&
          pawn.position.y === home.y &&
          pawn.position.index === home.index,
      ),
  );
}

// // function to check wheather to enter into victory box or not
// function eligibleForVictoryBox(
//   remainingSteps: number,
//   currenPosition: { x: number; y: number; index: number },
//   color: string,
// ) {
//   // if it the is the last element of victory Path then run this
//   if (
//     currenPosition.index + 1 === victoryPathMap[color].length &&
//     remainingSteps === 1
//   ) {
//     return getPolygonCenter(victoryBox[color]);
//   }
// }

// helper function to get the center of polygon
function getPolygonCenter(points: string) {
  const index = -1;
  const coords = points.split(" ").map((p) => p.split(",").map(Number));

  const x = coords.reduce((sum, [x]) => sum + x, 0) / coords.length;
  const y = coords.reduce((sum, [, y]) => sum + y, 0) / coords.length;

  return { x, y, index };
}
