import { useState } from "react";
import { AvatarBox } from "./Avatars";

export const Form = () => {
  const [isRoomCreated, setIsRoomCreated] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [showAvatars, setShowAvatars] = useState(false);

  return (
    <div className="flex justify-center items-center h-[400px] font-poppins">
      <form
        className="bg-white p-6 rounded-xl shadow-md w-80 text-center"
        onSubmit={(e) => {
          e.preventDefault();
          alert("Form submitted!");
        }}
      >
        <h2 className="mb-5 text-lg font-semibold">Room Form</h2>

        {/* Show input only if room is not created */}
        {!isRoomCreated && (
          <input
            type="text"
            placeholder="Enter Room Code"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            className="w-full p-2 rounded-md border border-gray-300 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        )}

        {/* Create Room button only before room is created */}
        {!isRoomCreated && (
          <button
            type="button"
            onClick={() => setIsRoomCreated(true)}
            className="w-full p-2 mb-3 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition"
          >
            Create Room
          </button>
        )}

        {/* Show AvatarBox when toggled */}
        {showAvatars && <AvatarBox />}

        {/* Choose Avatar button (always visible) */}
        <button
          type="button"
          onClick={() => setShowAvatars((prev) => !prev)}
          className="w-full p-2 mb-3 rounded-md bg-green-500 text-white hover:bg-green-600 transition"
        >
          Choose Avatar
        </button>

        {/* Submit button only after room is created */}

        <button
          type="submit"
          className="w-full p-2 rounded-md bg-yellow-500 text-white hover:bg-yellow-600 transition"
        >
          Join Game
        </button>
      </form>
    </div>
  );
};
