export default function VictoryBox() {
  return (
    <>
        {/*  red pointing up  */}
        <polygon
          points="240,360 360,360 300,300"
          fill="#fe0000"
          stroke="black"
          strokeWidth="1.5"
        />
        {/*   blue victory box  */}
        <polygon
          points="240,240 240,360 300,300"
          fill="#0dceff"
          stroke="black"
          strokeWidth="1.5"
        />
        {/*  green victory box  */}
        <polygon
          points="360,240 360,360 300,300"
          fill="#029834"
          stroke="black"
          strokeWidth="1.5"
        />
        {/*  yellow victory box  */}
        <polygon
          points="240,240 360,240 300,300"
          fill="#ffcf04"
          stroke="black"
          strokeWidth="1.5"
        />
    </>
  );
}
