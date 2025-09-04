import { motion } from "motion/react";
import { useEffect } from "react";
import { ludoStateContext } from "../../context/Ludo";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useSound } from "../../hooks/useSound";

export default function Lobby() {
  // play the lobby sound
  const { playSound, stopSound } = useSound(
    "https://res.cloudinary.com/dqr7qcgch/video/upload/v1756981644/lobbySound_vufxrq.mp3",
    { loop: true }
  );
  useEffect(() => {
    playSound();
    return () => {
      stopSound();
    };
  }, []);

  const navigate = useNavigate();
  const ludoState = useContext(ludoStateContext);

  const state = ludoState?.ludoState;

  // console.log("messages from server : ",ludoState?.messages)
  // host start the game
  function startGame() {
    if (state && state.connection) {
      state.connection.send(
        JSON.stringify({
          type: "start_game",
          payload: {
            id: state.myPlayerId,
            roomId: state.roomId,
          },
        })
      );
    }
  }

  //update the new room code in newRoom input element
  useEffect(() => {
    // console.log(state?.players)
    if (state?.players.length === 2) {
      navigate("/game");
    }
    // navigate("/game");
  }, [state]);

  if (state?.myPlayerId !== "" && state?.roomId !== "") {
    return (
      <div className="relative w-screen h-screen overflow-hidden">
        <img
          src="/lobby-assets/loby-bg.jpg"
          alt="Lobby Background"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/40"></div>

        {/* Center Transparent Box */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-20">
          <div className="bg-white/10 backdrop-blur-md border border-white/30 rounded shadow-xl p-6 w-[50%] text-center">
            <h2 className="text-2xl font-semibold mb-4">Waiting Area</h2>

            {/* Room ID Box */}
            {state?.isHost && (
              <div className="bg-black/30 border border-white/20 rounded-lg p-4">
                <p className="text-sm opacity-80 mb-1">
                  Share with your friend
                </p>
                <p className="text-2xl font-bold tracking-wider">
                  {state.roomId}
                </p>
              </div>
            )}

            <div className="space-y-2 mb-6">
              {ludoState?.messages.map((message, index) => (
                <p className="font-bold font-poppins text-lg" key={index}>
                  {message}
                </p>
              ))}
            </div>
            {state?.isHost && (
              <button
                onClick={startGame}
                className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-2 rounded-xl shadow-lg"
              >
                Start Playing
              </button>
            )}
          </div>
        </div>

        {/* Floating Ludo Assets */}
        <motion.img
          src="/lobby-assets/bluePawn.png"
          alt="Pawn Blue"
          className="absolute w-14"
          initial={{ x: "100vw", y: 400, rotate: 0 }}
          animate={{ x: -100, rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        <motion.img
          src="/lobby-assets/redPawn.png"
          alt="Pawn Blue"
          className="absolute w-14"
          initial={{ x: "100vw", y: 400, rotate: 0 }}
          animate={{ x: -100, rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        <motion.img
          src="/lobby-assets/greenPawn.png"
          alt="Pawn Yellow"
          className="absolute w-10"
          initial={{ y: -100, x: 300, opacity: 0 }}
          animate={{ y: "100vh", opacity: 1 }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        />
        <motion.img
          src="/lobby-assets/dice.png"
          alt="Pawn Green"
          className="absolute w-14"
          initial={{ y: "100vh", x: "80vw" }}
          animate={{ y: -100 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <div className="text-6xl flex justify-center items-center font-bold font-poppins h-screen">
      404 page
    </div>
  );
}
