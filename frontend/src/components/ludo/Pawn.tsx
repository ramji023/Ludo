import useSocketStore from "../../store/SocketStore";
import PawnIcon from "../../icons/PawnIcon";
import type { Pawn, Player } from "../../types/types";
import { useEffect, useState } from "react";
import {
  checkIfAllPawnsInHome,
  checkIfPawnInHome,
  getPawnOffset,
  normalizePawnPosition,
} from "../../helperFN";
// <---------------  render pawn based on position  --------------->

export default function PawnPosition() {
  const id = useSocketStore((s) => s.id);
  const color = useSocketStore((s) => s.color);
  const currentDiceValue = useSocketStore((s) => s.currentDiceValue);
  const currentPlayerTurn = useSocketStore((s) => s.currentPlayerTurn);
  const players = useSocketStore((s) => s.players); // track all the pawn positions of all players
  const movementData = useSocketStore((s) => s.movementData); // track movement array of all the object of {x,y,index} to perform movement
  const killMovementData = useSocketStore((s) => s.killMovementData); // track movement array of all the object of {x,y,index} to perform kill movement
  const [isMoving, setIsMoving] = useState(false); // to track wheather pawn is moving or not
  const [hasMoved, setHasMoved] = useState(false); // to make sure that player can click on single pawn at single turn

  // just create local state to animate pawn
  const [animatedPawn, setAnimatedPawn] = useState<{
    pawnId: string;
    x: number;
    y: number;
  } | null>(null);

  // separate state for killed pawn animation so it doesn't overwrite the mover's animation
  const [animatedKillPawn, setAnimatedKillPawn] = useState<{
    pawnId: string;
    x: number;
    y: number;
  } | null>(null);

  // run this effect when movement data arrives
  useEffect(() => {
    if (!movementData) return;

    console.log("movement of pawn start");
    setAnimatedPawn({
      pawnId: movementData.pawnId,
      x: movementData.movement[0].x,
      y: movementData.movement[0].y,
    });
    const { pawnId, movement } = movementData;
    let step = 1;

    setIsMoving(true);

    const interval = setInterval(() => {
      const pos = movement[step];
      //play pawn movement sound
      useSocketStore
        .getState()
        .audioManager?.play(
          "https://res.cloudinary.com/dqr7qcgch/video/upload/v1769921271/move-itcn9d_8oJkSMIx_v7k1cn.mp3",
          300,
        );
      console.log("movement is happening", pos);
      setAnimatedPawn({
        pawnId,
        x: pos.x,
        y: pos.y,
      });
      console.log("steps : " + step + " animated pawn data : " + animatedPawn);
      console.log("steps : " + step);

      if (step === movement.length - 1) {
        clearInterval(interval);
        setIsMoving(false);
        sendToServer();
        console.log("movement completed !!!");
      }
      step++;
    }, 300);

    return () => clearInterval(interval);
  }, [movementData]);

  // run this effect when killMovement data arrives
  useEffect(() => {
    if (!killMovementData) return;

    console.log("Kill movement start");
    setAnimatedKillPawn({
      pawnId: killMovementData.pawnId,
      x: killMovementData.movement[0].x,
      y: killMovementData.movement[0].y,
    });

    const { pawnId, movement } = killMovementData;
    let step = 1;
    setIsMoving(true);

    const interval = setInterval(() => {
      const pos = movement[step];
      //play kill pawn movement sound
      useSocketStore
        .getState()
        .audioManager?.play(
          "https://res.cloudinary.com/dqr7qcgch/video/upload/v1769921939/snake-hiss-4-quicksoundscom-ypwaqg_OPdi99Xh_qs1vku.mp3",
        );
      console.log("Kill movement happening", pos);
      setAnimatedKillPawn({
        pawnId,
        x: pos.x,
        y: pos.y,
      });

      if (step === movement.length - 1) {
        clearInterval(interval);
        setIsMoving(false);
        sendKillAnimationDone(); // function for kill
        console.log("Kill movement completed!");
      }
      step++;
    }, 100);

    return () => clearInterval(interval);
  }, [killMovementData]);

  // function to notify to server that movement is completed
  function sendToServer() {
    useSocketStore.getState().socket?.send(
      JSON.stringify({
        type: "movement_done",
        data: {
          id: id,
          gameId: useSocketStore.getState().gameId,
          pawnId: movementData?.pawnId,
        },
      }),
    );
  }
  // function to notify to server that kill movement is completed
  function sendKillAnimationDone() {
    useSocketStore.getState().socket?.send(
      JSON.stringify({
        type: "kill_animation_done",
        data: {
          id: useSocketStore.getState().id,
          killedId: useSocketStore.getState().killMovementData?.playerId,
          gameId: useSocketStore.getState().gameId,
        },
      }),
    );
  }

  // if user click to any pawn
  function movePawn(player: Player, pawn: Pawn) {
    // console.log("movePawn function run");
    // console.log("player id : ", player.id, "   ", player.username);
    // console.log("pawn data : ", pawn);
    setHasMoved(true); // mark setHasMoved true so player can not click on another his pawn

    // send clickable pawn data to websocket server
    if (useSocketStore.getState().socket) {
      useSocketStore.getState().socket?.send(
        JSON.stringify({
          type: "make_move",
          data: {
            id: id,
            gameId: useSocketStore.getState().gameId,
            pawnId: pawn.pawnId,
            position: pawn.position,
          },
        }),
      );
    }
  }

  //  whenever currentPlayerTurn has changed just make false to hasMoved
  useEffect(() => {
    if (currentPlayerTurn) {
      setHasMoved(false);
      setAnimatedPawn(null);
      // clear the kill animation state after done so it doesn't linger
      setAnimatedKillPawn(null);
      setIsMoving(false);
    }
  }, [currentPlayerTurn, currentDiceValue]);
  return (
    <>
      {players &&
        players.map((player) => {
          return player.pawnPosition.map((p) => {
            // find pawns on the same board cell
            const sameCellPawns = player.pawnPosition.filter(
              (q) =>
                q.position.x === p.position.x &&
                q.position.y === p.position.y &&
                q.position.index === p.position.index,
            );

            const indexInCell = sameCellPawns.findIndex(
              (q) => q.pawnId === p.pawnId,
            );

            const isMyTurn = player.id === id && id === currentPlayerTurn;
            const isPawnInHome = checkIfPawnInHome(p.position, player.color);
            const isValidClick =
              isMyTurn &&
              !hasMoved &&
              !isMoving &&
              !(isPawnInHome && currentDiceValue !== 6);

            const isAnimating = animatedPawn?.pawnId === p.pawnId;
            const isKillAnimating = animatedKillPawn?.pawnId === p.pawnId;
            const rawPos = isAnimating
              ? { x: animatedPawn.x, y: animatedPawn.y }
              : isKillAnimating
                ? { x: animatedKillPawn!.x, y: animatedKillPawn!.y }
                : { x: p.position.x, y: p.position.y };

            const basePos = normalizePawnPosition(rawPos.x, rawPos.y);

            const offset = getPawnOffset(sameCellPawns.length, indexInCell);

            const displayX = basePos.x + offset.dx;
            const displayY = basePos.y + offset.dy;

            return (
              <Pawn
                movePawn={() => movePawn(player, p)}
                isInVictoryBox={p.position.index === -1}
                key={p.pawnId}
                x={displayX}
                y={displayY}
                color={player.color}
                isValidClick={isValidClick}
              />
            );
          });
        })}
    </>
  );
}

// <-----------------------------------------   Pawn Component   ---------------------------------------------->
interface PawnProps {
  x: number;
  y: number;
  color: string;
  movePawn: () => void;
  isValidClick: boolean;
  isInVictoryBox: boolean;
}

function Pawn({
  x,
  y,
  color,
  movePawn,
  isValidClick,
  isInVictoryBox,
}: PawnProps) {
  const pawnColors: Record<string, string> = {
    red: "#C62828",
    blue: "#0077A8",
    green: "#2E7D32",
    yellow: "#F9A825",
  };

  return (
    <g
      data-testid="pawn"
      data-clickable={isValidClick ? "true" : "false"}
      transform={`translate(${x - 15}, ${y - 18})`}
      onClick={movePawn}
      className={`${isValidClick && !isInVictoryBox ? `cursor-pointer` : `pointer-events-none`} `}
    >
      <PawnIcon
        fill={pawnColors[color]}
        stroke="#000000"
        strokeWidth={20}
        size={35}
      />
    </g>
  );
}
