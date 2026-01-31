import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState, type RefObject } from "react";
import useSocketStore from "../../store/SocketStore";
import useWebSocket from "../../hooks/useSocket";
import { useNavigate } from "react-router-dom";

export function CreateRoom() {
  const navigate = useNavigate();
  const socket = useSocketStore((s) => s.socket); // to check wheather user is connected with socket or not
  const [showForm, setShowForm] = useState(true); //  track status of visibility of create-room-form
  const [webSocketUrl, setWebSocketUrl] = useState("");
  const { setShouldConnect, error } = useWebSocket(webSocketUrl); // useWebSocket hook to send connection request
  const [connecting, setIsConnecting] = useState(false); // manage state to track connection time

  const gameId = useSocketStore((s) => s.gameId); // show the game Id to host
  const players = useSocketStore((s) => s.players); // store all the players data
  const gameStatus = useSocketStore((s) => s.gameStatus); // store current game status
  // write effect to check wheather to show create-room-form or not
  useEffect(() => {
    // if user is not connected with socket then send connection request to websocket server
    if (!socket && webSocketUrl !== "") {
      // console.log("make should connect true");
      setShouldConnect(true);
    }
    if (socket) {
      // otherwise make false to showForm because user is authenticated
      setShowForm(false);
      setIsConnecting(false);
      setWebSocketUrl("");
    }
  }, [socket, webSocketUrl]);

  const usernameRef = useRef<HTMLInputElement>(null); // create ref to track user input value
  // write function to send connection request to websocket server and make false to showForm
  function createRoom(username: string) {
    // console.log("username : ",typeof username , "  ",username.length)
    if (typeof username !== "string" || username.length < 0) return;
    setIsConnecting(true); // make setIsConnecting true
    setWebSocketUrl(`ws://localhost:8080?username=${username}&type=host`);
    // console.log(`ws://localhost:8080?username=${username}&type=host`);
    usernameRef.current = null; // mark usernameRef null after setting websocket url
  }

  // write effect to run when game status became "start"
  useEffect(() => {
    if (gameStatus === "start") {
      navigate("/game");
    }
  }, [gameStatus]);

  // send start_game event to server to start the ludo game
  const handleStartGame = () => {
    if (socket) {
      socket.send(
        JSON.stringify({
          type: "start_game",
          data: {
            id: useSocketStore.getState().id,
            gameId: useSocketStore.getState().gameId,
          },
        }),
      );
    }
  };

  console.log("RENDER:", {
    socket,
    webSocketUrl,
    showForm,
  });
  return (
    <>
      {showForm ? (
        <CreateRoomForm
          createRoom={createRoom}
          nameref={usernameRef}
          isConnecting={connecting}
        />
      ) : (
        <>
          <div className="flex flex-col items-center gap-8">
            {/* coupon code box */}
            <div className="relative flex items-center">
              {/* Code Box */}
              <div className="bg-white pl-10 pr-10 py-6 shadow-2xl border-2 border-dashed border-black max-w-4xl">
                <div className="text-center">
                  <p
                    data-testid="game-id"
                    className="text-4xl font-mono font-bold text-black mb-2 wrap-break-word"
                  >
                    {gameId}
                  </p>
                  <p className="text-xs text-gray-700">
                    Share This Game Id with your friends
                  </p>
                </div>
              </div>
            </div>

            {/* Start Button */}
            <button
              data-testid="start-button-btn"
              onClick={handleStartGame}
              className="cursor-pointer relative group mt-4"
            >
              {/* Button Shadow */}
              <div className="absolute inset-0 bg-linear-to-b from-green-800 to-green-950 rounded-full transform translate-y-2" />

              {/* Button Main */}
              <div className="relative bg-linear-to-b from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 px-6 py-4 rounded-full transform transition-all duration-150 active:translate-y-2 group-hover:-translate-y-1 shadow-2xl border-t-4 border-green-300">
                <span className="text-white text-3xl font-black drop-shadow-lg">
                  START GAME
                </span>
                {/* Top Highlight */}
                <div className="absolute inset-x-0 top-0 h-6 bg-linear-to-b from-white/40 to-transparent rounded-t-full" />
              </div>
            </button>

            {/* Players List - Bottom Right */}
            <div className="fixed bottom-2 right-5 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border-2 border-orange-400 p-6 min-w-[280px]">
              <h3 className="text-lg font-bold text-gray-800 mb-4 text-center border-b-2 border-orange-300 pb-2">
                Joined Players ({(players && players.length) ?? 0})
              </h3>
              <div className="flex flex-col gap-2">
                {players &&
                  players.map((player) => (
                    <div
                      key={player.id}
                      className="flex items-center gap-2 bg-linear-to-r from-orange-50 to-white p-1 rounded-xl hover:shadow-md transition-shadow"
                    >
                      {/* Avatar Circle */}
                      <div
                        style={{
                          background: `linear-gradient(to bottom right, ${player.color}, ${player.color})`,
                        }}
                        className="w-6 h-6 rounded-full  flex items-center justify-center shadow-lg flex-shrink-0"
                      >
                        <span className="text-white text-lg font-bold">
                          {player.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      {/* Username */}
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-800 font-semibold truncate text-sm">
                          {player.id === useSocketStore.getState().id
                            ? `You (${useSocketStore.getState().type})`
                            : `${player.username} (${player.type})`}
                        </p>

                        <p className="text-xs text-green-600 font-medium">
                          ✓ Ready
                        </p>
                      </div>
                    </div>
                  ))}

                {/* Empty Slots */}
                {players &&
                  Array.from({ length: 4 - players.length }).map((_, index) => (
                    <div
                      key={`empty-${index}`}
                      className="flex items-center gap-2 bg-gray-50 p-1 rounded-xl opacity-50"
                    >
                      <div className="w-6 h-6 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center flex-shrink-0">
                        <span className="text-gray-400 text-lg">?</span>
                      </div>
                      <p className="text-gray-400 font-medium text-sm">
                        Waiting for player...
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export function CreateRoomForm({
  createRoom,
  nameref,
  isConnecting,
}: {
  createRoom: (username: string) => void;
  nameref: RefObject<HTMLInputElement | null>;
  isConnecting: boolean;
}) {
  // function to set the websocket url
  const handleCreateRoom = () => {
    if (nameref.current?.value) {
      createRoom(nameref.current.value);
    }
  };
  return (
    <>
      <div className="bg-white/90 backdrop-blur-sm px-12 py-10 rounded-3xl shadow-2xl border-4 border-orange-400">
        <div className="flex flex-col gap-8">
          <input
            type="text"
            ref={nameref}
            name="Username"
            placeholder="Enter your name"
            className="border-2 border-orange-400 px-5 py-2 rounded-xl text-black bg-gray-200"
          />
          <div className="flex justify-center items-center">
            <button
              onClick={handleCreateRoom}
              disabled={isConnecting}
              data-testid="create-room-btn"
              className={`min-w-45 px-4 py-2 rounded-xl font-semibold flex items-center justify-center gap-2 text-white transition-all ${
                isConnecting
                  ? "bg-orange-400 cursor-not-allowed"
                  : "bg-orange-500 cursor-pointer hover:bg-orange-600"
              }`}
            >
              {isConnecting ? (
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Create Room <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
