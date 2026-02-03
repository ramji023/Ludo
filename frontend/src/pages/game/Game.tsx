import { useEffect, useState } from "react";
import TextBoxIcon from "../../icons/TextBoxIcon";
import Board from "./Board";
import Chatbox from "./ChatBox";
import useSocketStore from "../../store/SocketStore";
import { GameEnd } from "../../components/badges/GameEnd";
import ExitIcon from "../../icons/ExitIcon";
import { useNavigate } from "react-router-dom";

export default function Game() {
  const gameStatus = useSocketStore((s) => s.gameStatus);
  const [openChatBox, setOpenChatBox] = useState(false); // manage to toggle chatbox
  const [unreadMessages, setUnreadMessages] = useState(0); // track unread messages
  const chatMessages = useSocketStore((s) => s.chatMessages); // array to store all the messages got from server side

  //write clean-up effect
  useEffect(() => {
    return () => {
      useSocketStore.getState().resetSocketSession(); // reset whole socket session
    };
  }, []);

  useEffect(() => {
    if (gameStatus === "start") {
      // run the audio when game component navigate to "game" page
      useSocketStore
        .getState()
        .audioManager?.play(
          "https://res.cloudinary.com/dqr7qcgch/video/upload/v1756981643/start_mudwqg.mp3",
          1500,
        );
    }
  }, []);
  // function to close the box
  function closeChatBox() {
    setOpenChatBox(false);
  }

  useEffect(() => {
    if (chatMessages.length > 0 && !openChatBox) {
      setUnreadMessages((prev) => prev + 1);
    }
  }, [chatMessages]);

  // when game status become "end" then run this effect
  useEffect(() => {
    if (gameStatus === "end") {
      useSocketStore
        .getState()
        .audioManager?.play(
          "https://res.cloudinary.com/dqr7qcgch/video/upload/v1769923713/winning-218995_rtzqnf.mp3",
          5000,
        );
    }
  }, [gameStatus]);

  const navigate = useNavigate();
  return (
    <>
      <div className="relative min-h-screen overflow-hidden bg-black/90">
        {/*background image*/}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/ludo-bg/ludo-bg (3).jpg')",
          }}
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40" />
        {/* ludo logo  */}
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-20 flex items-center gap-2">
          <img
            src="/ludo-bg/ludo_logo.png"
            alt="Ludo Master Logo"
            className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-25 lg:h-25 object-contain"
          />
        </div>
        <div className="relative z-20 flex transition-all duration-500 ease-in-out shadow-6xl ">
          {/* ludo board */}
          <div
            className={`transition-all duration-500 ${openChatBox ? "w-full md:w-[calc(100%-15rem)]" : "w-full"}`}
          >
            <Board />
          </div>

          {/*chatbox slide in right side */}
          <div
            className={`
    fixed top-auto bottom-0 lg:top-0 lg:bottom-auto right-0 
    h-[40vh] lg:h-screen 
    transition-transform duration-500 
    border-2 border-orange-500 rounded-t-2xl lg:rounded-none
    ${openChatBox ? "translate-y-0" : "translate-y-full lg:translate-y-0 lg:translate-x-full"}
    w-full sm:w-96 lg:w-80 shadow-xl z-30 bg-gray-900
  `}
          >
            <Chatbox closeBox={closeChatBox} />
          </div>
        </div>

        {/* toggle button*/}

        {!openChatBox && (
          <div
            onClick={() => {
              setOpenChatBox(true);
              setUnreadMessages(0);
            }}
            className="fixed bottom-1 right-1 sm:bottom-4 sm:right-4 z-30 cursor-pointer"
          >
            <div className="relative">
              <div className="scale-75 sm:scale-100">
                <TextBoxIcon />
              </div>

              {unreadMessages > 0 && (
                <span
                  className="
            absolute -top-1 -right-1 sm:-top-2 sm:-right-2
            min-w-5 h-5 sm:min-w-6 sm:h-6 px-1
            flex items-center justify-center
            rounded-full
            bg-red-600 text-white
            text-xs sm:text-md font-bold
            shadow-md
          "
                >
                  {unreadMessages > 99 ? "99+" : unreadMessages}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
      {gameStatus === "end" && <GameEnd />}

      <div
        onClick={() => {
          useSocketStore.getState().resetSocketSession();
          navigate("/");
        }}
        className="fixed bottom-1 left-1 sm:bottom-4 sm:right-4 z-30 cursor-pointer"
      >
        <div className="scale-75 sm:scale-100">
          <ExitIcon />
        </div>
      </div>
    </>
  );
}
