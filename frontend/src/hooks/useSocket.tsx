import { useEffect, useState } from "react";

export const useSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const wss = new WebSocket("ws://localhost:8080");
    wss.onopen = function () {
      console.log("connected");
      setSocket(wss);
    };

    wss.onclose = function () {
      console.log("disconnected");
      setSocket(null);
    };

    return () => {
      wss.close();
    };
  }, []);

  return {socket};
};
