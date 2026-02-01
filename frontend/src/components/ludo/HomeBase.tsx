import Rectangle from "../Rectangle";
import Circle from "../Circle";
import {
  blueHomePosition,
  greenHomePosition,
  redHomePosition,
  yellowHomePosition,
} from "../../pawnPath";
import useSocketStore from "../../store/SocketStore";
import { WonBadge } from "../badges/WonBadge";
import { useEffect } from "react";

const BADGE_BOX = 160;

const HOME_BASE_CENTERS = {
  blue: { x: 120, y: 120 },
  yellow: { x: 480, y: 120 },
  red: { x: 120, y: 480 },
  green: { x: 480, y: 480 },
} as const;

export default function HomeBase() {
  const players = useSocketStore((s) => s.players);
  const winnerRank = useSocketStore((s) => s.winnerRank);

  useEffect(() => {
    console.log("winner rank : ",winnerRank)
    if (winnerRank.length > 0 && winnerRank.length <= 3) {
      useSocketStore
        .getState()
        .audioManager?.play(
          "https://res.cloudinary.com/dqr7qcgch/video/upload/v1769922435/ochoochogift-winner-laugh-154997_pcmr4d.mp3",3000
        );
    }
  }, [winnerRank]);

  return (
    <>
      {/* Blue home base */}
      <Rectangle
        posX={0}
        posY={0}
        width={240}
        height={240}
        fill="#0dceff"
        stroke="black"
      />

      {/* blue home position  */}
      {blueHomePosition.map((b) => (
        <Circle posX={b.x} posY={b.y} radius={25} fill="white" stroke="black" />
      ))}

      {/* Yellow home base */}
      <Rectangle
        posX={360}
        posY={0}
        width={240}
        height={240}
        fill="#ffcf04"
        stroke="black"
      />

      {/* yellow home position  */}
      {yellowHomePosition.map((y) => (
        <Circle posX={y.x} posY={y.y} radius={25} fill="white" stroke="black" />
      ))}

      {/* Red home base */}
      <Rectangle
        posX={0}
        posY={360}
        width={240}
        height={240}
        fill="#fe0000"
        stroke="black"
      />
      {/* rea home position  */}
      {redHomePosition.map((r) => (
        <Circle posX={r.x} posY={r.y} radius={25} fill="white" stroke="black" />
      ))}

      {/* Green home base */}
      <Rectangle
        posX={360}
        posY={360}
        width={240}
        height={240}
        fill="#029834"
        stroke="black"
      />

      {/* green home position  */}
      {greenHomePosition.map((g) => (
        <Circle posX={g.x} posY={g.y} radius={25} fill="white" stroke="black" />
      ))}

      {/* Player Win Badges */}
      {players && (
        <g>
          {(
            Object.keys(HOME_BASE_CENTERS) as Array<
              keyof typeof HOME_BASE_CENTERS
            >
          ).map((color) => {
            const player = players.find((p) => p.color === color);
            const winner = winnerRank.find((w) => w.playerId === player?.id);

            if (!winner) return null;

            const { x, y } = HOME_BASE_CENTERS[color];

            return (
              <foreignObject
                key={color}
                x={x - BADGE_BOX / 2}
                y={y - BADGE_BOX / 2}
                width={BADGE_BOX}
                height={BADGE_BOX}
                overflow="visible"
              >
                <div className="w-full h-full flex items-center justify-center">
                  <WonBadge rank={winner.rank as 1 | 2 | 3 | 4} />
                </div>
              </foreignObject>
            );
          })}
        </g>
      )}
    </>
  );
}

/**
 * 

export const homeBaseCenters = [
  { color: "blue", x: 120, y: 120 },
  { color: "yellow", x: 480, y: 120 },
  { color: "red", x: 120, y: 480 },
  { color: "green", x: 480, y: 480 },
];


export const victoryPawns = [
  //  Red pawns
  { color: "red", x: 300, y: 340, index: -1 },
  { color: "red", x: 300, y: 340, index: -1 },
  { color: "red", x: 300, y: 340, index: -1 },
  { color: "red", x: 300, y: 340, index: -1 },

  //  Blue pawns
  { color: "blue", x: 260, y: 300, index: -1 },
  { color: "blue", x: 260, y: 300, index: -1 },
  { color: "blue", x: 260, y: 300, index: -1 },
  { color: "blue", x: 260, y: 300, index: -1 },

  //  Green pawns
  { color: "green", x: 340, y: 300, index: -1 },
  { color: "green", x: 340, y: 300, index: -1 },
  { color: "green", x: 340, y: 300, index: -1 },
  { color: "green", x: 340, y: 300, index: -1 },

  //  Yellow pawns
  { color: "yellow", x: 300, y: 260, index: -1 },
  { color: "yellow", x: 300, y: 260, index: -1 },
  { color: "yellow", x: 300, y: 260, index: -1 },
  { color: "yellow", x: 300, y: 260, index: -1 },
];

 */
