import {
  globalGamePath,
  victoryPaths,
  homePoints,
  startPoints,
  safePoints,
} from "../../game_grids/grids";
import { checkType } from "../../utils/helper";
import { Cell } from "./Cell";

export const Board = () => {
  return (
    <>
        <div className="grid grid-cols-15 grid-rows-15 border-black w-[640px] max-h-screen">
          {Array.from({ length: 15 * 15 }).map((_, index) => {
            const row = Math.floor(index / 15);
            const col = index % 15;
            const cell = `r${row}c${col}`;
            const type = checkType(cell, victoryPaths);
            const homeType = checkType(cell, homePoints);
            const startPoint = checkType(cell, startPoints);
            if (globalGamePath.includes(cell)) {
              if (startPoint) {
                return <Cell key={index} type={startPoint} id={cell} />;
              }
              if (safePoints.includes(cell)) {
                return <Cell key={index} type="path" safe="safe" id={cell} />;
              }
              return <Cell key={index} type="path" id={cell} />;
            } else if (type) {
              return <Cell key={index} type={type} id={cell} />;
            } else if (homeType) {
              return <Cell key={index} type={homeType} id={cell} />;
            } else if (startPoint) {
              return <Cell key={index} type={startPoint} id={cell} />;
            } else {
              return <Cell key={index} type="none" id={cell} />;
            }
          })}
        </div>

    </>
  );
};
