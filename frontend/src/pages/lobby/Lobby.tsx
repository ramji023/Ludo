import { motion } from "framer-motion";

export default function Lobby() {
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
        <div className="bg-white/10 backdrop-blur-md border border-white/30 rounded shadow-xl p-6 w-80 text-center">
          <h2 className="text-xl font-semibold mb-4">Waiting Area</h2>
          <div className="space-y-2 mb-6">
            <p>
              <span className="font-semibold">Bob</span> has joined
            </p>
            <p>
              <span className="font-semibold">Alice</span> has joined
            </p>
            <p>
              <span className="font-semibold">You</span> are waiting...
            </p>
          </div>
          <button className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-2 rounded-xl shadow-lg">
            Start Playing
          </button>
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
