import { Board } from "./Board";
import { Dice } from "../../components/ui/Dice"; // your dice component
import { useContext, useEffect, useState } from "react";
import { ludoStateContext } from "../../context/Ludo";
import { img } from "motion/react-client";
export default function GameBoard() {
  const gameState = useContext(ludoStateContext);
  const [activePlayer, setActivePlayer] = useState("");
  const [players, setPlayers] = useState<
    { id: string; name: string; color: string }[]
  >([]);

  useEffect(() => {
    if (gameState?.ludoState?.players) {
      setPlayers(gameState.ludoState.players);
    }
  }, [gameState?.ludoState?.players]);

  useEffect(() => {
    if (gameState?.ludoState?.rollTurn) {
      console.log("roll turn inside useEffect", gameState.ludoState.rollTurn);
      setActivePlayer(gameState.ludoState.rollTurn);
    }
  }, [gameState?.ludoState?.rollTurn]);

  // positions for 4 players
  const positions: Record<string, string> = {
    red: "absolute top-4 left-4", // Player 1
    blue: "absolute top-4 right-4", // Player 2
    yellow: "absolute bottom-4 left-4", // Player 3
    green: "absolute bottom-4 right-4", // Player 4
  };
  // console.log("players data :", players);
  // console.log("active player turn id :", activePlayer);
  console.log("roll turn outside useEffect", gameState?.ludoState?.myPlayerId);
  return (
    <div className=" flex items-center justify-center bg-[url('/lobby-assets/loby-bg.jpg')] ">
      <div className="w-[800px] relative">
        {players.map((player, index) => (
          <div
            key={player.id}
            className={`${
              positions[player.color]
            } flex flex-col items-center space-y-2`}
          >
            {/* Avatar */}
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center shadow bg-gray-200 `}
            >
              {sessionStorage.getItem("avatar") &&
              player.id === gameState?.ludoState?.myPlayerId ? (
                <img
                  src={`${sessionStorage.getItem(
                    "avatar"
                  )} sessionStorage.getItem("avatar")`}
                  alt="no image"
                  className="w-17 h-17"
                />
              ) : (
                <span className={`font-bold text-2xl text-${player.color}-500`}>
                  {player.name[0].toUpperCase()}
                </span>
              )}
            </div>

            {/* Dice */}
            <Dice
              playerId={gameState?.ludoState?.myPlayerId}
              roomId={gameState?.ludoState?.roomId}
              socket={gameState?.ludoState?.connection}
              onRoll={(v) => console.log(`${player.name} rolled`, v)}
              isRolled={activePlayer === player.id}
              isActive={
                activePlayer === gameState?.ludoState?.myPlayerId &&
                player.id === gameState?.ludoState?.myPlayerId
              }
            />
          </div>
        ))}

        <div className="flex justify-center items-center ">
          <Board />
        </div>
      </div>
    </div>
  );
}
