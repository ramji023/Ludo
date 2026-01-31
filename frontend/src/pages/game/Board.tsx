import { useState } from "react";
import HomeBase from "../../components/ludo/HomeBase";
import PawnPosition from "../../components/ludo/Pawn";
import PawnPath from "../../components/ludo/PawnPath";
import VictoryBox from "../../components/ludo/victoryBox";
import PlayerBox from "../../components/ludo/PlayerBox";
import useSocketStore from "../../store/SocketStore";
// export const playerBoxPosition = {
//   blue: "top-left",
//   yellow: "top-right",
//   red: "bottom-left",
//   green: "bottom-right",
// };
export default function Board() {
  const players = useSocketStore((s) => s.players);
  if (!players) return null;

  const getPlayerByColor = (color: string) => {
    const player = players.find((p) => p.color === color);
    return player ? { id: player.id } : undefined;
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative">
        <svg
         data-testid="game-board"
          width="600"
          height="600"
          viewBox="0 0 600 600"
          className="bg-white border-2 border-black rounded-4xl"
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
