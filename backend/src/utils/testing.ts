import { WebSocket } from "ws";
import Games from "../game";
import {
  createMovementPath,
  createMovementPathForVictory,
  isInMainPath,
  isInVictoryPath,
  momentPath,
} from "./helperFn";
import Users from "../user";

const pos = isInMainPath("green", "g1", { x: 520, y: 240, index: 23 });

// console.log("pos of pawn is : ", pos);

// if (typeof pos === "number" && pos !== null && pos !== undefined) {
//   console.log("enter in pos block");
//   // first store all the movements in an array
//   const movementsPath = createMovementPath(pos, 4, "green");
//   console.log("movement path if pawn is in main path : ", movementsPath);
// }

const victoryPos = isInVictoryPath("blue", { x: 80, y: 280, index: 1 });

if (
  typeof victoryPos === "number" &&
  victoryPos !== null &&
  victoryPos !== undefined
) {
  console.log("enter in victory pos block");
  // calculate movement path
  const movementsPath = createMovementPathForVictory(victoryPos, 4, "blue");
  console.log("movement path if pawn is in victory path : ", movementsPath);
}

// check kill moment path properly

// const killedPawn = {
//   pawnId: "b2",
//   position: {
//     x: 320,
//     y: 360,
//     index: 32,
//   },
// };

// const sendPawnToHome = () => {};

// const checkKillPath = momentPath(
//   {
//     playerId: "1",
//     pawnId: "b0",
//     color: "blue",
//     x: 320,
//     y: 200,
//     index: 18,
//   },
//   {
//     playerId: "1",
//     pawnId: "b1",
//     color: "blue",
//     x: 60,
//     y: 60,
//     index: 0,
//   },
// );

// console.log("check kill path is : ", checkKillPath);
