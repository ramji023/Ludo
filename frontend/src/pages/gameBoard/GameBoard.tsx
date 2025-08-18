import { Board } from "./Board";
import { Dice } from "../../components/ui/Dice"; // your dice component
import { useState } from "react";

export default function GameBoard() {
  const [activePlayer, setActivePlayer] = useState<
    "red" | "blue" | "green" | "yellow"
  >("blue");

  return (
    <div  className=" flex items-center justify-center bg-[url('/lobby-assets/loby-bg.jpg')] ">
      <div className="w-[800px] relative">
        {/* Top-left player */}
        <div className="absolute top-4 left-4 flex flex-col items-center space-y-2">
          <div className="w-12 h-12 bg-red-200 rounded-full flex items-center justify-center shadow">
            <span className="font-bold text-red-600">R</span>
          </div>
          <Dice
            onRoll={(v) => console.log("Red rolled", v)}
            isActive={activePlayer === "red"}
          />
        </div>

        {/* Top-right player */}
        <div className="absolute top-4 right-4 flex flex-col items-center space-y-2">
          <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center shadow">
            <span className="font-bold text-blue-600">B</span>
          </div>
          <Dice
            onRoll={(v) => console.log("Blue rolled", v)}
            isActive={activePlayer === "blue"}
          />
        </div>

        {/* Bottom-left player */}
        <div className="absolute bottom-4 left-4 flex flex-col items-center space-y-2">
          <Dice
            onRoll={(v) => console.log("Green rolled", v)}
            isActive={activePlayer === "green"}
          />
          <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center shadow">
            <span className="font-bold text-yellow-600">Y</span>
          </div>
        </div>

        {/* Bottom-right player */}
        <div className="absolute bottom-4 right-4 flex flex-col items-center space-y-2">
          <Dice
            onRoll={(v) => console.log("Yellow rolled", v)}
            isActive={activePlayer === "yellow"}
          />
          <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center shadow">
            <span className="font-bold text-green-600">G</span>
          </div>
        </div>

        <div className="flex justify-center items-center ">
          <Board />
        </div>
      </div>
    </div>
  );
}
