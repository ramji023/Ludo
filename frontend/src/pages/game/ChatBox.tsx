import { useEffect, useRef } from "react";
import { Send } from "lucide-react";
import Menu from "../../icons/Menu";
import useSocketStore from "../../store/SocketStore";

export default function Chatbox({ closeBox }: { closeBox: () => void }) {
  const colorStyles: Record<string, string> = {
    red: "bg-[#fe0000]",
    blue: "bg-[#0dceff]",
    green: "bg-[#029834]",
    yellow: "bg-[#ffcf04]",
  };

  const chatMessages = useSocketStore((s) => s.chatMessages); // array to store all the messages got from server side
  const messageRef = useRef<HTMLInputElement | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null); // Add this

  // Auto-scroll to bottom when new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  function sendMessage() {
    if (messageRef.current) {
      const msg = messageRef.current.value;
      useSocketStore.getState().socket?.send(
        JSON.stringify({
          type: "send_chat_message",
          data: {
            id: useSocketStore.getState().id,
            gameId: useSocketStore.getState().gameId,
            message: msg,
          },
        }),
      );
      messageRef.current.value = "";
    }
  }
  return (
    <div className="h-full flex flex-col rounded-xl">
      {/* Header */}
      <div
        onClick={closeBox}
        className=" bg-orange-500 p-1 py-2 border-b-2 cursor-pointer "
      >
        <Menu />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {chatMessages.length === 0 && (
          <>
            <p className="text-white text-center text-lg">
              There is no messages
            </p>
          </>
        )}

        {chatMessages.length > 0 &&
          chatMessages.map((msg) => (
            <div key={msg.messageId} className="flex gap-2">
              <div
                className={`w-8 h-8 ${colorStyles[msg.color]} rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}
              >
                {msg.username[0]}
              </div>
              <div className="flex-1">
                <div className="text-orange-400 text-sm font-semibold">
                  {msg.username}
                </div>
                <div className="bg-gray-800 text-white rounded-lg p-2 mt-1 text-sm">
                  {msg.message}
                </div>
              </div>
            </div>
          ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t-2 border-orange-500 bg-gray-900">
        <div className="flex gap-2">
          <input
            type="text"
            ref={messageRef}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 bg-gray-800 text-white border-2 border-orange-500 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-400"
          />
          <button
            onClick={sendMessage}
            className=" text-white mx-2 rounded-lg transition-colors"
          >
            <Send size={30} fill="#ef6407" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
