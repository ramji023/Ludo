interface PropType {
  posX: number;
  posY: number;
  radius: number;
  fill: string;
  stroke: string;
}

export default function Circle({ posX, posY, radius, fill, stroke }: PropType) {
  return (
    <>
        <circle
          cx={posX}
          cy={posY}
          r={radius}
          fill={fill}
          stroke={stroke}
          strokeWidth={2}
        />
    </>
  );
}
