import { cellStyle } from "../../types/board.type";
import { ludoStateContext } from "../../context/Ludo";
import { useContext, useEffect, useState } from "react";
import Pawn from "../../components/ui/Pawn";
import { getMovementPath } from "../../game_grids/grids";

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

  const [movementPath, setMovementPath] = useState<string[] | undefined>(
    undefined
  );
  const [pawnsHere, setPawnsHere] = useState<
    {
      color: string;
      id: string;
      position: string;
    }[]
  >();

  useEffect(() => {
    const pawnsHere =
      gameContext?.ludoState?.players
        .flatMap((player) =>
          player.pawns.map((pawn) => ({
            ...pawn,
            color: player.color,
          }))
        )
        .filter((pawn) => pawn.position === id) ?? [];
    console.log("all pawns data : ", pawnsHere);
    setPawnsHere(pawnsHere);
  }, [gameContext?.ludoState?.players]);

  // if user click to pawn
  function makeMove(id: string) {
    console.log("make move function called");
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

  // console.log("current ludo state : ", gameContext?.ludoState);
  // if server broadcast the move event
  useEffect(() => {
    console.log("enter into currentMove effect");
    if (
      gameContext &&
      gameContext.ludoState &&
      gameContext.ludoState.currentMove !== null
    ) {
      const currentMove = gameContext.ludoState.currentMove;
      const pawn = gameContext.ludoState.players
        .flatMap((player) => player.pawns)
        .find((p) => p.id === currentMove.pawnId);
      console.log("pawn is : ", pawn);
      const prePosition = pawn?.position ?? null;
      console.log("prevPosition of pawn is : ", prePosition);
      if (prePosition) {
        const arr = getMovementPath(
          currentMove.color,
          prePosition,
          currentMove.newPosition
        );

        console.log("movement path : ", arr);
        setMovementPath(arr);
      }
    }
  }, [gameContext?.ludoState?.currentMove]);

  // update position after completing the animation
  function updateNewPosition() {
    const currentMove = gameContext?.ludoState?.currentMove;

    if (!currentMove) return;

    gameContext?.setLudoState((curr) => ({
      ...curr,
      players: curr.players.map((player) => {
        // only update the player who made the move
        if (player.id === currentMove.playerId) {
          return {
            ...player,
            pawns: player.pawns.map((pawn) =>
              pawn.id === currentMove.pawnId
                ? { ...pawn, position: currentMove.newPosition } // update position
                : pawn
            ),
          };
        }
        return player;
      }),
    }));
  }

  return (
    <div
      id={id}
      className={`${cellStyle[type]} w-full h-full flex items-center justify-center relative`}
    >
      {/* safe cell marker */}
      {safe && <img src="/icons/star.svg" alt="safe" className="absolute w-full h-full"/>}

      {/* render pawn(s) */}
      <div
        className={`
    relative w-full h-full flex items-center justify-center 
    ${pawnsHere && pawnsHere.length > 1 ? "grid grid-cols-2 gap-1" : ""}
  `}
      >
        {pawnsHere &&
          pawnsHere.map((pawn) => {
            const isCurrentMove =
              gameContext?.ludoState?.currentMove?.pawnId === pawn.id;

            return (
              <Pawn
                key={pawn.id}
                id={pawn.id}
                color={pawn.color}
                onClick={() => makeMove(pawn.id)}
                movementPath={isCurrentMove ? movementPath : undefined}
                onFinish={() => {
                  //  update pawn position in global state
                  updateNewPosition();
                }}
              />
            );
          })}
      </div>
    </div>
  );
};
