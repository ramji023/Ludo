import LudoStar from "../icons/LudoStar";

interface PropType {
  posX: number;
  posY: number;
  width: number;
  height: number;
  fill: string;
  stroke: string;
  safeOrHome?: boolean;
}

export default function Rectangle({
  posX,
  posY,
  width,
  height,
  fill,
  stroke,
  safeOrHome,
}: PropType) {
  return (
    <>
      <rect
        x={posX}
        y={posY}
        width={width}
        height={height}
        fill={fill}
        stroke={stroke}
        strokeWidth={1.5}
      />

      {safeOrHome && <LudoStar x={posX + width / 2} y={posY + height / 2} />}
    </>
  );
}
