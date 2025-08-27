import { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ludoStateContext } from "../../context/Ludo";
export const Form = () => {
  const ludoContext = useContext(ludoStateContext);
  const navigate = useNavigate();
  const nameRef = useRef<HTMLInputElement>(null);
  const colorRef = useRef<HTMLSelectElement>(null);
  const joinRoomRef = useRef<HTMLInputElement>(null);

  // const [showAvatars, setShowAvatars] = useState(false);

  // send request to create the room
  function createRoom() {
    if (nameRef.current && colorRef.current) {
      if (nameRef.current.value && colorRef.current.value) {
        ludoContext?.ludoState?.connection?.send(
          JSON.stringify({
            type: "create_room",
            payload: {
              name: nameRef.current.value,
              color: colorRef.current.value,
            },
          })
        );
      } else {
        console.log("something is wrong with creating  room");
      }
    }
  }

  //send request to join the room
  function joinRoom() {
    if (nameRef.current && colorRef.current &&  joinRoomRef.current) {
      if (nameRef.current.value && colorRef.current.value && joinRoomRef.current.value) {
        ludoContext?.ludoState?.connection?.send(
          JSON.stringify({
            type: "join_room",
            payload: {
              name: nameRef.current.value,
              color: colorRef.current.value,
              roomId:joinRoomRef.current.value
            },
          })
        );
      } else {
        console.log("something is wrong with creating  room");
      }
    }
  }

  //update the new room code in newRoom input element
  useEffect(() => {
    if (ludoContext?.ludoState?.roomId !== "") {
      navigate("/lobby");
    }
  }, [ludoContext?.ludoState]);

  return (
    <div className="flex justify-center items-center h-[400px] font-poppins">
      <div className="bg-white p-6 rounded-xl shadow-md w-80 text-center">
        <h2 className="mb-5 text-lg font-semibold">Room Form</h2>
        {/* show input to user to enter the name */}
        <input
          ref={nameRef}
          type="text"
          placeholder="Enter Name"
          className="w-full p-2 rounded-md border border-gray-300 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {/* select color  */}
        <select
          ref={colorRef}
          name="color"
          id="color"
          className="w-full p-2 rounded-md border border-gray-300 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="red" className="text-red-500 ">
            Red
          </option>
          <option value="yellow" className="text-yellow-500 ">
            Yellow
          </option>
          <option value="green" className="text-green-500 ">
            Green
          </option>
          <option value="blue" className="text-blue-500 ">
            Blue
          </option>
        </select>
        {/* Show input only if user wants to join room */}
        <input
          ref={joinRoomRef}
          type="text"
          placeholder="Enter Room Code"
          className="w-full p-2 rounded-md border border-gray-300 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {/* Create Room button only before room is created */}
        <button
          type="button"
          onClick={joinRoom}
          className="w-full p-2 mb-3 rounded-md bg-yellow-500 text-white hover:bg-yellow-600 transition"
        >
          Join Room{" "}
        </button>
        {/* Submit button only after room is created */}
        <button
          onClick={createRoom}
          className="w-full p-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition"
        >
          Create New Room
        </button>
      </div>
    </div>
  );
};
