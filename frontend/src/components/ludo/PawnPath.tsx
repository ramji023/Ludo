import {
  blueVictoryPath,
  colors,
  greenVictoryPath,
  pawnPosition,
  redVictoryPath,
  yellowVictoryPath,
} from "../../pawnPath";
import Rectangle from "../Rectangle";

export default function PawnPath() {
  return (
    <>
      {/* command pawn position  */}
      {pawnPosition.map((p) => (
        <Rectangle
          posX={p.x}
          posY={p.y}
          width={40}
          height={40}
          fill={p.isHome ? colors[p.home] : "white"}
          stroke="black"
          safeOrHome={p.isSafe || p.isHome}
        />
      ))}

      {/* red victory path boxes  */}
      {redVictoryPath.map((p) => (
        <Rectangle
          posX={p.x}
          posY={p.y}
          width={40}
          height={40}
          fill="#fe0000"
          stroke="black"
        />
      ))}

      {/* blue victory path box  */}
      {blueVictoryPath.map((p) => (
        <Rectangle
          posX={p.x}
          posY={p.y}
          width={40}
          height={40}
          fill="#0dceff"
          stroke="black"
        />
      ))}

      {/* yellow victory path box  */}
      {yellowVictoryPath.map((p) => (
        <Rectangle
          posX={p.x}
          posY={p.y}
          width={40}
          height={40}
          fill="#ffcf04"
          stroke="black"
        />
      ))}

      {/* green victory path box  */}
      {greenVictoryPath.map((p) => (
        <Rectangle
          posX={p.x}
          posY={p.y}
          width={40}
          height={40}
          fill="#029834"
          stroke="black"
        />
      ))}
    </>
  );
}
