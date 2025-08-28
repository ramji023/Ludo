import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { ludoStateContext } from "../../context/Ludo";
const diceDotPositions: Record<number, string[]> = {
  1: ["center"],
  2: ["top-left", "bottom-right"],
  3: ["top-left", "center", "bottom-right"],
  4: ["top-left", "top-right", "bottom-left", "bottom-right"],
  5: ["top-left", "top-right", "center", "bottom-left", "bottom-right"],
  6: [
    "top-left",
    "top-right",
    "middle-left",
    "middle-right",
    "bottom-left",
    "bottom-right",
  ],
};

const dotClasses: Record<string, string> = {
  "top-left": "absolute top-2 left-2",
  "top-right": "absolute top-2 right-2",
  "middle-left": "absolute top-1/2 -translate-y-1/2 left-2",
  "middle-right": "absolute top-1/2 -translate-y-1/2 right-2",
  "bottom-left": "absolute bottom-2 left-2",
  "bottom-right": "absolute bottom-2 right-2",
  center: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
};
interface DicePropType {
  onRoll: (value: number) => void;
  isActive: boolean; // which player can roll the dice
  isRolled: boolean; // which player turn
  playerId: string | undefined;
  roomId: string | undefined;
  socket: WebSocket | null | undefined;
}
export const Dice = ({
  onRoll,
  isActive,
  isRolled,
  playerId,
  roomId,
  socket,
}: DicePropType) => {
  const ludoState = useContext(ludoStateContext);
  const [value, setValue] = useState<number>(1);
  const [isRolling, setIsRolling] = useState<boolean>(false);

  const roll = () => {
    if (!isActive || isRolling) return;

    socket?.send(
      JSON.stringify({
        type: "roll_dice",
        payload: {
          id: playerId,
          roomId: roomId,
        },
      })
    );
  };

  useEffect(() => {
    if (
      isRolled && 
      ludoState &&
      ludoState.ludoState &&
      ludoState.ludoState.diceValue !== null
    ) {
      setIsRolling(true);
      const newVal = ludoState.ludoState.diceValue;
      setTimeout(() => {
        setValue(newVal);
        setIsRolling(false);
        onRoll(newVal);
      }, 600);
    }
  }, [ludoState?.ludoState?.diceValue]);
  return (
    <div className="flex flex-col items-center space-y-2">
      <motion.div
        onClick={roll}
        className={`w-12 h-12 bg-white rounded relative
    ${isRolled ? "ring-2 ring-yellow-400 opacity-100" : ""}  
    ${isActive ? "cursor-pointer" : "opacity-50 cursor-not-allowed"}
         `}
        animate={
          isRolling
            ? { rotate: [0, 360, 720], scale: [1, 1.3, 1] }
            : { rotate: 0, scale: 1 }
        }
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        {diceDotPositions[value].map((pos, idx) => (
          <span
            key={idx}
            className={`${dotClasses[pos]} w-2 h-2 bg-black rounded-full`}
          />
        ))}
      </motion.div>
    </div>
  );
};
