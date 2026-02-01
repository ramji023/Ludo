import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState, type RefObject } from "react";
import useSocketStore from "../../store/SocketStore";
import useWebSocket from "../../hooks/useSocket";
import { useNavigate } from "react-router-dom";

export function JoinRoom() {
  const navigate = useNavigate();
  const socket = useSocketStore((s) => s.socket); // to check wheather user is connected with socket or not
  const [showForm, setShowForm] = useState(true); //  track status of visibility of join-room-form
  const [webSocketUrl, setWebSocketUrl] = useState("");
  const { setShouldConnect, error } = useWebSocket(webSocketUrl); // useWebSocket hook to send connection request
  const [connecting, setIsConnecting] = useState(false); // manage state to track connection time

  const players = useSocketStore((s) => s.players); // track all of the player data
  const gameStatus = useSocketStore((s) => s.gameStatus); // track current game status
  // write effect to check wheather to show join-room-form or not
  useEffect(() => {
    // if user is not connected with socket then send connection request to websocket server
    if (!socket && webSocketUrl !== "") {
      // console.log("make should connect true");
      setShouldConnect(true);
    }
    if (socket) {
      // otherwise make false to showForm because user is authenticated
      setShowForm(false);
      useSocketStore
        .getState()
        .audioManager?.play(
          "https://res.cloudinary.com/dqr7qcgch/video/upload/v1756981644/lobbySound_vufxrq.mp3",
        );
      setIsConnecting(false);
      setWebSocketUrl("");
    }
  }, [socket, webSocketUrl]);

  // write effect to run when game status became "start"
  useEffect(() => {
    if (gameStatus === "start") {
      useSocketStore
        .getState()
        .audioManager?.play(
          "https://res.cloudinary.com/dqr7qcgch/video/upload/v1756981644/lobbySound_vufxrq.mp3",
        );
      navigate("/game");
    }
  }, [gameStatus]);

  const usernameRef = useRef<HTMLInputElement>(null); // create ref to track user input value
  const gameIdRef = useRef<HTMLInputElement>(null); // create ref to track user gameId value

  // write function to send connection request to websocket server and make false to showForm
  function joinRoom(username: string, gameId: string) {
    // console.log("username : ",typeof username , "  ",username.length)
    if (
      typeof username !== "string" ||
      username.length < 0 ||
      gameId.length < 0
    )
      return;
    setIsConnecting(true); // make setIsConnecting true
    setWebSocketUrl(
      `ws://localhost:8080?username=${username}&type=player&gameId=${gameId}`,
    );
    // console.log(`ws://localhost:8080?username=${username}&type=host`);
    usernameRef.current = null; // mark usernameRef null after setting websocket url
  }

  return (
    <>
      {showForm ? (
        <JoinRoomForm
          joinRoom={joinRoom}
          nameref={usernameRef}
          gameIdRef={gameIdRef}
          isConnecting={connecting}
        />
      ) : (
        <div className="flex flex-col items-center gap-8">
          {/* waiting message box */}
          <div className="bg-white/90 backdrop-blur-sm px-16 py-12 rounded-3xl shadow-2xl border-4 border-orange-400">
            <div className="text-center">
              {/* Animated Dots */}
              <div className="flex justify-center gap-3 mb-6">
                <div
                  className="w-4 h-4 bg-orange-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0s" }}
                />
                <div
                  className="w-4 h-4 bg-orange-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
                <div
                  className="w-4 h-4 bg-orange-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                />
              </div>

              {/* Main Text */}
              <h2 className="text-4xl font-black text-gray-800 mb-2">
                WAITING FOR HOST
              </h2>
              <p className="text-xl text-gray-600">to start the game</p>
            </div>
          </div>

          {/* Decorative Loading Circle */}
          <div className="relative w-22 h-22">
            <div className="absolute inset-0 border-8 border-orange-200 rounded-full" />
            <div className="absolute inset-0 border-8 border-orange-500 rounded-full border-t-transparent animate-spin" />
          </div>

          {/* Players List - Bottom Right */}
          <div className="fixed bottom-2 right-5 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border-2 border-orange-400 p-6 min-w-[280px]">
            <h3 className="text-lg font-bold text-gray-800 mb-4 text-center border-b-2 border-orange-300 pb-2">
              Joined Players ({(players && players.length) ?? 0}/4)
            </h3>
            <div className="flex flex-col gap-2">
              {players &&
                players.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center gap-2 bg-linear-to-r from-orange-50 to-white p-1 rounded-xl hover:shadow-md transition-shadow"
                  >
                    {/* Avatar Circle */}
                    <div className="w-6 h-6 rounded-full bg-linear-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg flex-shrink-0">
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
      )}
    </>
  );
}

export function JoinRoomForm({
  joinRoom,
  nameref,
  gameIdRef,
  isConnecting,
}: {
  joinRoom: (username: string, gameId: string) => void;
  nameref: RefObject<HTMLInputElement | null>;
  gameIdRef: RefObject<HTMLInputElement | null>;
  isConnecting: boolean;
}) {
  // function to set the websocket url
  const handleJoinRoom = () => {
    if (nameref.current?.value && gameIdRef.current?.value) {
      joinRoom(nameref.current.value, gameIdRef.current.value);
    }
  };

  return (
    <>
      <div className="bg-white/90 backdrop-blur-sm px-12 py-10 rounded-3xl shadow-2xl border-4 border-orange-400">
        <div className="flex flex-col gap-6">
          <div className=" flex  flex-col gap-4">
            <input
              type="text"
              ref={nameref}
              name="Username"
              placeholder="Enter your name"
              className="border-2 border-orange-400 px-5 py-2 rounded-xl text-black bg-gray-200"
            />

            <input
              type="text"
              ref={gameIdRef}
              name="roomId"
              placeholder="Enter Game Id"
              className="border-2 border-orange-400 px-5 py-2  rounded-xl text-black bg-gray-200"
            />
          </div>
          <div className="flex justify-center items-center">
            <button
              onClick={handleJoinRoom}
              disabled={isConnecting}
              data-testid="join-room-btn"
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
                  Join Room <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
