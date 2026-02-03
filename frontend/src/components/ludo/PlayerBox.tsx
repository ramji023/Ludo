// <-------------------  PlayerBox component ---------------->
interface PlayerBoxProps {
  color: "red" | "blue" | "green" | "yellow";
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  player?: { id: string; username: string } | undefined;
}

export default function PlayerBox({ color, position, player }: PlayerBoxProps) {
  const colorStyles = {
    red: "bg-[#fe0000]",
    blue: "bg-[#0dceff]",
    green: "bg-[#029834]",
    yellow: "bg-[#ffcf04]",
  };

  const positionStyles = {
    "top-left": "-top-25 sm:top-0 -left-0 sm:-left-18 md:-left-20",
    "top-right": "-top-25 sm:top-0 -right-0 sm:-right-18 md:-right-20",
    "bottom-left": "-bottom-25 sm:bottom-0 -left-0 sm:-left-18 md:-left-20",
    "bottom-right": "-bottom-25 sm:bottom-0 -right-0 sm:-right-18 md:-right-20",
  };

  const currentPlayerTurn = useSocketStore((s) => s.currentPlayerTurn); // current player turn

  // check isActive status
  const isActive =
    player !== undefined &&
    currentPlayerTurn !== null &&
    player.id === currentPlayerTurn;

  return (
    <div
      className={`absolute ${positionStyles[position]} flex flex-col gap-1 sm:gap-2 items-center`}
    >
      {/*player name box */}
      <div
        className={`w-10 h-10 sm:w-12 sm:h-12 border-2 rounded-4xl flex items-center justify-center text-white text-lg sm:text-2xl font-bold ${colorStyles[color]}
        ${isActive ? "border-orange-500 border-3 shadow-2xl hover:scale-105 active:scale-95 " : "border-gray-400"}
      `}
      >
        {player?.username[0].toUpperCase()}
      </div>

      {/* dice box*/}
      <div
        className={`flex items-center justify-center
        ${isActive ? "border-orange-500 shadow-xl" : "border-gray-400"}
      `}
      >
        <Dice color={color} playerId={player?.id} />
      </div>
    </div>
  );
}

// <------------------  Dice component  ----------------------->
import { useEffect, useRef, useState } from "react";
import useSocketStore from "../../store/SocketStore";
import { checkIfAllPawnsInHome } from "../../helperFN";

interface DiceProps {
  color: "red" | "blue" | "green" | "yellow";
  playerId?: string;
}

function Dice({ color, playerId }: DiceProps) {
  const players = useSocketStore((s) => s.players);
  const currentPlayerTurn = useSocketStore((s) => s.currentPlayerTurn);
  const id = useSocketStore((s) => s.id);
  const currentDiceValue = useSocketStore((s) => s.currentDiceValue); // store current dice value data
  const [diceValue, setDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const startTimeRef = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<number | null>(null);

  const [hasRolled, setHasRolled] = useState(false); // just track that active player can rolled dice only one time

  // make sure only authenticate user can roll the dice
  const isActive = id === currentPlayerTurn && playerId === currentPlayerTurn;

  //write function to send rollDice event to websocket server
  function rollDice() {
    if (isRolling || hasRolled) return;
    // make setIsRolling true
    // stop previous sound
    useSocketStore
      .getState()
      .audioManager?.stop(
        "https://res.cloudinary.com/dqr7qcgch/video/upload/v1756981643/start_mudwqg.mp3",
      );

    // play dice sound
    useSocketStore
      .getState()
      .audioManager?.play(
        "https://res.cloudinary.com/dqr7qcgch/video/upload/v1756981643/rolling_cssnt7.mp3",
      );
    setIsRolling(true);
    console.log("make setIsRolling true");
    startTimeRef.current = Date.now();
    //start changing dice values randomly
    intervalRef.current = window.setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
    }, 100);
    // send roll_dice event to websocket server
    console.log("send roll_dice event to server");
    useSocketStore.getState().socket?.send(
      JSON.stringify({
        type: "roll_dice",
        data: {
          id: useSocketStore.getState().id,
          gameId: useSocketStore.getState().gameId,
        },
      }),
    );
  }

  //write effect when got the currentDiceValue from server
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // if current dice value is valid
    if (currentDiceValue > 0 && playerId === currentPlayerTurn) {
      const elapsed_time = Date.now() - startTimeRef.current;
      console.log("elapsed time : ", elapsed_time);
      const remaining_time = Math.max(0, 500 - elapsed_time);
      console.log("remaining time : ", remaining_time);

      timeoutRef.current = setTimeout(() => {
        // stop the random interval
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setDiceValue(currentDiceValue);
        setIsRolling(false);
        // stop dice sound
        useSocketStore
          .getState()
          .audioManager?.stop(
            "https://res.cloudinary.com/dqr7qcgch/video/upload/v1756981643/rolling_cssnt7.mp3",
          );
        setHasRolled(true);

        // send this event if dice value !== 6 and all pawn is in home
        if (currentDiceValue !== 6 && currentDiceValue > 0) {
          const result = checkIfAllPawnsInHome(id!, color!, players!);
          if (result) {
            useSocketStore.getState().socket?.send(
              JSON.stringify({
                type: "passed-turn",
                data: {
                  id: id,
                  gameId: useSocketStore.getState().gameId,
                },
              }),
            );
          }
        }
        timeoutRef.current = null;
      }, remaining_time);
    }

    return () => {
      if (timeoutRef.current) {
        console.log("it will never run");
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [currentDiceValue, playerId, currentPlayerTurn]);

  //  whenever currentPlayerTurn has changed just make false to hasMoved
  useEffect(() => {
    if (currentPlayerTurn) {
      setHasRolled(false);
    }
  }, [currentPlayerTurn, currentDiceValue]);

  // function to render the dots on dice
  const renderDots = () => {
    const dotClass = "w-2 h-2 bg-white rounded-full absolute";

    return (
      <div className="relative w-full h-full">
        {/* NEW BLOCK: diceValue > 6 */}
        {diceValue > 6 && (
          <>
            <div
              className={`${dotClass} top-1/2 left-1/2 -translate-x-2 -translate-y-1/2`}
            />
            <div
              className={`${dotClass} top-1/2 left-1/2 translate-x-2 -translate-y-1/2`}
            />
          </>
        )}

        {/* Dot 1: Top-Left */}
        {(diceValue === 2 ||
          diceValue === 3 ||
          diceValue === 4 ||
          diceValue === 5 ||
          diceValue === 6) && <div className={`${dotClass} top-2 left-2`} />}

        {/* Dot 2: Top-Right */}
        {(diceValue === 4 || diceValue === 5 || diceValue === 6) && (
          <div className={`${dotClass} top-2 right-2`} />
        )}

        {/* Dot 3: Center */}
        {(diceValue === 1 || diceValue === 3 || diceValue === 5) && (
          <div
            className={`${dotClass} top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}
          />
        )}

        {/* Dot 4: Bottom-Left */}
        {(diceValue === 4 || diceValue === 5 || diceValue === 6) && (
          <div className={`${dotClass} bottom-2 left-2`} />
        )}

        {/* Dot 5: Bottom-Right */}
        {(diceValue === 2 ||
          diceValue === 3 ||
          diceValue === 4 ||
          diceValue === 5 ||
          diceValue === 6) && (
          <div className={`${dotClass} bottom-2 right-2`} />
        )}

        {/* Dot 6: Middle-Left */}
        {diceValue === 6 && (
          <div className={`${dotClass} top-1/2 left-2 -translate-y-1/2`} />
        )}

        {/* Dot 7: Middle-Right */}
        {diceValue === 6 && (
          <div className={`${dotClass} top-1/2 right-2 -translate-y-1/2`} />
        )}
      </div>
    );
  };

  const bgColors = {
    red: "bg-[#fe0000]",
    blue: "bg-[#0dceff]",
    green: "bg-[#029834]",
    yellow: "bg-[#ffcf04]",
  };

  return (
    <div
      data-testid="dice"
      className={`w-10 h-10 sm:w-12 sm:h-12 ${bgColors[color]} rounded transition-all relative
      ${
        isActive && !isRolling && !hasRolled
          ? "cursor-pointer hover:scale-105 active:scale-95 shadow-lg"
          : "pointer-events-none opacity-60 grayscale cursor-not-allowed border-2 border-gray-400"
      }
      `}
      onClick={isActive && !isRolling && !hasRolled ? rollDice : undefined}
    >
      <div
        className={isRolling ? "animate-spin w-full h-full" : "w-full h-full"}
      >
        {renderDots()}
      </div>
    </div>
  );
}
