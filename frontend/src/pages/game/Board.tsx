import HomeBase from "../../components/ludo/HomeBase";
import PawnPosition from "../../components/ludo/Pawn";
import PawnPath from "../../components/ludo/PawnPath";
import VictoryBox from "../../components/ludo/victoryBox";
import PlayerBox from "../../components/ludo/PlayerBox";
import useSocketStore from "../../store/SocketStore";

export default function Board() {
  // const gameStatus = useSocketStore((s) => s.gameStatus);
  const players = useSocketStore((s) => s.players);
  if (!players) return null;

  const getPlayerByColor = (color: string) => {
    const player = players.find((p) => p.color === color);
    return player ? { id: player.id, username: player.username } : undefined;
  };

  return (
    <div className="flex items-center justify-center h-screen px-2 py-16 sm:py-4">
      <div className="relative w-[calc(100vw-1rem)] sm:w-[500px] md:w-[600px] aspect-square">
        <svg
          data-testid="game-board"
          width="100%"
          height="100%"
          viewBox="0 0 600 600"
          className="bg-white border-2 border-black md:rounded"
          preserveAspectRatio="xMidYMid meet"
        >
          <HomeBase />
          <VictoryBox />
          <PawnPath />
          <PawnPosition />
        </svg>

        <PlayerBox
          color="blue"
          position="top-left"
          player={getPlayerByColor("blue")}
        />
        <PlayerBox
          color="yellow"
          position="top-right"
          player={getPlayerByColor("yellow")}
        />
        <PlayerBox
          color="red"
          position="bottom-left"
          player={getPlayerByColor("red")}
        />
        <PlayerBox
          color="green"
          position="bottom-right"
          player={getPlayerByColor("green")}
        />
      </div>
    </div>
  );
}
