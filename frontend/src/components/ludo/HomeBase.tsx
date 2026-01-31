import Rectangle from "../Rectangle";
import Circle from "../Circle";
import {
  blueHomePosition,
  greenHomePosition,
  redHomePosition,
  yellowHomePosition,
} from "../../pawnPath";

export default function HomeBase() {
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
    </>
  );
}
