import { cellStyle } from "../../types/board.type";
import { ludoStateContext } from "../../context/Ludo";
import { useContext, useEffect } from "react";
import Pawn from "../../components/ui/Pawn";

export const Cell = ({
  type,
  id,
  safe,
}: {
  id: string;
  type: string;
  safe?: string;
}) => {
  const gameContext = useContext(ludoStateContext);

  // Flatten all pawns from all players
  const pawnsHere =
    gameContext?.ludoState?.players
      .flatMap((player) =>
        player.pawns.map((pawn) => ({
          ...pawn,
          color: player.color,
        }))
      )
      .filter((pawn) => pawn.position === id) ?? [];

  // console.log("all pawns here : ", pawnsHere);
  useEffect(() => {
    if (pawnsHere.length > 0) {
      // console.log(`Cell ${id} has pawns:`, pawnsHere);
    }
  }, [gameContext?.ludoState?.players]);

  // if user click to pawn
  function makeMove(id: string) {
    console.log("make move function called")
    if (
      gameContext &&
      gameContext.ludoState?.myPlayerId &&
      gameContext.ludoState.connection
    ) {
      gameContext.ludoState.connection.send(
        JSON.stringify({
          type: "make_move",
          payload: {
            id: gameContext.ludoState.myPlayerId,
            roomId: gameContext.ludoState.roomId,
            pawn: id,
          },
        })
      );
    }
  }
  return (
    <div
      id={id}
      className={`${cellStyle[type]} w-full h-full flex items-center justify-center relative`}
    >
      {/* safe cell marker */}
      {safe && <img src="/icons/star.svg" alt="safe" />}

      {/* render pawn(s) */}
      <div
        className={`
    relative w-full h-full flex items-center justify-center 
    ${pawnsHere.length > 1 ? "grid grid-cols-2 gap-1" : ""}
  `}
      >
        {pawnsHere.map((pawn, index) => (
          <Pawn
            key={pawn.id}
            color={pawn.color}
            onClick={() => 
              makeMove(pawn.id)
            }
          />
        ))}
      </div>
    </div>
  );
};
