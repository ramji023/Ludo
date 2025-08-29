import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const Pawn = ({
  id,
  color,
  size = 40,
  movementPath,
  onFinish,
  onClick,
}: {
  id: string;
  color: string;
  size?: number;
  movementPath?: string[];   
  onFinish?: () => void;    
  onClick: () => void;
}) => {
  const [currentCell, setCurrentCell] = useState<string | null>(null);

  useEffect(() => {
    if (!movementPath || movementPath.length === 0) return;

    let step = 0;
    setCurrentCell(movementPath[0]); 

    const interval = setInterval(() => {
      step++;
      if (step < movementPath.length) {
        setCurrentCell(movementPath[step]);
      } else {
        clearInterval(interval);
        onFinish?.();
      }
    }, 500);

    return () => clearInterval(interval);
  }, [movementPath]);


  return (
    <motion.div
      key={id}
      layoutId={id} // lets Motion animate between grid cells
      className="flex items-center justify-center"
    >
      <svg
        className="cursor-pointer"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 744.09 1052.4"
        fill={color}
        height={size}
        width={size}
        onClick={onClick}
      >
        <path
          d="M304.66 1.7066c-111.06 0-201.06 85.329-201.06 190.64 
           0 78.193 49.628 145.36 120.66 174.78l-69.52 172.96-153.03 
           381.04h1.4336c-0.79006 2.3573-1.1946 4.7246-1.1946 7.1361 
           0 44.187 135.38 79.97 302.48 79.97s302.6-35.782 
           302.6-79.97c0-0.65223-0.0609-1.2772-0.11942-1.9257h0.83627
           l-1.792-4.5308c-0.35776-1.1759-0.76633-2.3504-1.3141-3.5114
           l-146.94-375.61-69.17-177.04c69.18-30.15 117.31-96.38 
           117.31-173.31 0-105.3-90.11-190.63-201.18-190.63z"
          stroke="black"
          strokeWidth="60"
        />
      </svg>
    </motion.div>
  );
};

export default Pawn;
