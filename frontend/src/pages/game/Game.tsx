import { useEffect, useState } from "react";
import TextBoxIcon from "../../icons/TextBoxIcon";
import Board from "./Board";
import Chatbox from "./ChatBox";
import useSocketStore from "../../store/SocketStore";
import { GameEnd } from "../../components/badges/GameEnd";

export default function Game() {
  const gameStatus = useSocketStore((s) => s.gameStatus);
  const [openChatBox, setOpenChatBox] = useState(false); // manage to toggle chatbox
  const [unreadMessages, setUnreadMessages] = useState(0); // track unread messages
  const chatMessages = useSocketStore((s) => s.chatMessages); // array to store all the messages got from server side

  // function to close the box
  function closeChatBox() {
    setOpenChatBox(false);
  }

  useEffect(() => {
    if (chatMessages.length > 0 && !openChatBox) {
      setUnreadMessages((prev) => prev + 1);
    }
  }, [chatMessages]);
  return (
    <>
      <div className="relative min-h-screen overflow-hidden bg-black/90">
        {/* ludo logo  */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
          <img
            src="/ludo-bg/ludo_logo.png"
            alt="Ludo Master Logo"
            className="w-25 h-25 object-contain"
          />
        </div>
        <div className="relative z-20 flex transition-all duration-500 ease-in-out">
          {/* ludo board */}
          <div
            className={`transition-all duration-500 ${openChatBox ? "w-[calc(100%-15rem)]" : "w-full"}`}
          >
            <Board />
          </div>

          {/*chatbox slide in right side */}
          <div
            className={`
             fixed top-0 right-0 h-screen transition-transform duration-500 border-2 border-orange-500 
             ${openChatBox ? "translate-x-0" : "translate-x-full"}
             w-80 shadow-xl z-20
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
            className="fixed bottom-4 right-4 z-30 cursor-pointer"
          >
            <div className="relative">
              <TextBoxIcon />

              {unreadMessages > 0 && (
                <span
                  className="
            absolute -top-2 -right-2
            min-w-6 h-6 px-1
            flex items-center justify-center
            rounded-full
            bg-red-600 text-white
            text-md font-bold
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
    </>
  );
}
