import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  // when user click to create room button
  function createRoom() {
    navigate("create-room");  // navigate to create-room page
  }

  // when user click to join room button
  function joinRoom() {
    navigate("join-room");  // navigate to join-room page
  }

  return (
    <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 md:gap-12 px-4">
      {/* create room button */}
      <button onClick={createRoom} className="relative group cursor-pointer w-full sm:w-auto max-w-xs sm:max-w-none">
        {/* button shadow on bottom and left side */}
        <div className="absolute inset-0 bg-linear-to-b from-orange-800 to-orange-950 rounded-xl sm:rounded-2xl transform translate-y-1 sm:translate-y-2 -translate-x-1 sm:-translate-x-2 skew-x-[-10deg]" />

        {/* main content */}
        <div className="relative bg-linear-to-b from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 px-4 py-4 sm:px-6 sm:py-6 rounded-xl sm:rounded-2xl transform transition-all duration-150 active:translate-y-1 sm:active:translate-y-2 group-hover:-translate-y-1 shadow-2xl border-t-2 sm:border-t-4 border-orange-300 skew-x-[-10deg]">
          <span className="text-white text-2xl sm:text-3xl md:text-4xl font-black tracking-wide sm:tracking-widest drop-shadow-lg inline-block skew-x-10">
            CREATE ROOM
          </span>
          {/* top highlight*/}
          <div className="absolute inset-x-0 top-0 h-6 sm:h-8 bg-linear-to-b from-white/40 to-transparent rounded-t-xl sm:rounded-t-2xl" />
        </div>
      </button>

      {/* Join Room Button */}
      <button onClick={joinRoom} className="relative group cursor-pointer w-full sm:w-auto max-w-xs sm:max-w-none">
        {/* button shadow on bottom and left side */}
        <div className="absolute inset-0 bg-linear-to-b from-orange-800 to-orange-950 rounded-xl sm:rounded-2xl transform translate-y-1 sm:translate-y-2 -translate-x-1 sm:-translate-x-2 skew-x-[-10deg]" />

        {/* main button content */}
        <div className="relative bg-linear-to-b from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 px-4 py-4 sm:px-6 sm:py-6 rounded-xl sm:rounded-2xl transform transition-all duration-150 active:translate-y-1 sm:active:translate-y-2 group-hover:-translate-y-1 shadow-2xl border-t-2 sm:border-t-4 border-orange-300 skew-x-[-10deg]">
          <span className="text-white text-2xl sm:text-3xl md:text-4xl font-black tracking-wide sm:tracking-widest drop-shadow-lg inline-block skew-x-10">
            JOIN ROOM
          </span>
          {/* top highlight */}
          <div className="absolute inset-x-0 top-0 h-6 sm:h-8 bg-linear-to-b from-white/40 to-transparent rounded-t-xl sm:rounded-t-2xl" />
        </div>
      </button>
    </div>
  );
}
