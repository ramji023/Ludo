import { TrophyIcon } from "../../icons/CrownIcon";

interface WonBadgeProps {
  rank: 1 | 2 | 3 | 4;
}

export function WonBadge({ rank }: WonBadgeProps) {
  return (
    <div className="relative w-40 h-40 flex items-center justify-center">
      {/* Trophy Icon */}
      <TrophyIcon />

      {/* Rank Number - Centered over trophy */}
      <span
        className="absolute text-black text-5xl font-extrabold drop-shadow-lg"
        style={{ top: "55%", left: "50%", transform: "translate(-50%, -50%)" }}
      >
        {rank}
      </span>
    </div>
  );
}
