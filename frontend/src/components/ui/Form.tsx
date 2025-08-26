import { useContext, useEffect, useRef, useState } from "react";
import { AvatarBox } from "./Avatars";
import { ludoStateContext } from "../../context/Ludo";
export const Form = () => {
  const ludoContext = useContext(ludoStateContext);

  const [isRoomCreated, setIsRoomCreated] = useState(true);
  const newRoomRef = useRef<HTMLInputElement>(null);
  const joinRoomRef = useRef<HTMLInputElement>(null);

  // const [showAvatars, setShowAvatars] = useState(false);

  // send request to create the room
  function createRoom() {
    ludoContext?.ludoState?.connection?.send(
      JSON.stringify({
        type: "create_room",
        payload: {
          name: "Zassicca",
          color: "red",
        },
      })
    );
    setIsRoomCreated(false);
  }

  useEffect(() => {
    if (newRoomRef.current) {
      newRoomRef.current.value = ludoContext?.ludoState?.roomId ?? "";
    }
  }, [ludoContext?.ludoState]);

  return (
    <div className="flex justify-center items-center h-[400px] font-poppins">
      <div className="bg-white p-6 rounded-xl shadow-md w-80 text-center">
        <h2 className="mb-5 text-lg font-semibold">Room Form</h2>

        {/* Show input only if user wants to join room */}
        {isRoomCreated && (
          <input
            ref={joinRoomRef}
            type="text"
            placeholder="Enter Room Code"
            className="w-full p-2 rounded-md border border-gray-300 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        )}

        {/* Show input only if user wants to create room */}
        {!isRoomCreated && (
          <input
            ref={newRoomRef}
            type="text"
            value={newRoomRef?.current?.value}
            placeholder="Enter Room Code"
            className="w-full p-2 rounded-md border border-gray-300 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        )}
        {/* Create Room button only before room is created */}

        <button
          type="button"
          onClick={createRoom}
          className="w-full p-2 mb-3 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition"
        >
          Create Room
        </button>

        {/* Show AvatarBox when toggled */}
        {/* {showAvatars && <AvatarBox />} */}

        {/* Choose Avatar button (always visible) */}
        {/* <button
          type="button"
          onClick={() => setShowAvatars((prev) => !prev)}
          className="w-full p-2 mb-3 rounded-md bg-green-500 text-white hover:bg-green-600 transition"
        >
          Choose Avatar
        </button> */}

        {/* Submit button only after room is created */}

        <button className="w-full p-2 rounded-md bg-yellow-500 text-white hover:bg-yellow-600 transition">
          Join Game
        </button>
      </div>
    </div>
  );
};
