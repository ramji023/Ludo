import useSocketStore from "../../store/SocketStore";

export function GameEnd() {
  const players = useSocketStore((s) => s.players);
  const winnerRank = useSocketStore((s) => s.winnerRank);

  if (!players || winnerRank.length === 0) return null;

  console.log("Game End component rendered");
  return (
    <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-30">
      <div className="bg-[#6b2d06] shadow-4xl p-8 w-90 max-h-100 max-w-100 overflow-y-auto">
        {/* body  */}
        <div className="text-center">
          <h1 className="text-6xl font-bold text-orange-500">GAME OVER</h1>
        </div>
      </div>
    </div>
  );
}
