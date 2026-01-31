import { useEffect, useState } from "react";
import useSocketStore from "../store/SocketStore";

// custom hook to connect with websocket server
export default function useWebSocket(webSocketConnectionUrl: string) {
  const [shouldConnect, setShouldConnect] = useState(false); // make sure if user want to connect or not
  const setSocketInstance = useSocketStore((s) => s.setSocketInstance); // get the function to update the state of socket or store socket object
  const [error, setError] = useState(""); // write error state to manage error
  // write effect to send connection request to websocket server
  useEffect(() => {
    if (!shouldConnect) return;
    console.log("websocket url : ", webSocketConnectionUrl);
    const wss = new WebSocket(webSocketConnectionUrl); // send connection request to websocket server

    // if websocket connection open successfully then
    wss.onopen = () => {
      setSocketInstance(wss); // store instance in socket store
      // wss.send("New Web Connection Established");
    };

    // if closed then
    wss.onclose = (event) => {
      console.log("disconnected with websocket server");
      console.log("Code:", event.code, "Reason:", event.reason);
      setError("WebSocket connection is closed");
    };
  }, [webSocketConnectionUrl, shouldConnect]); // runs again whenever websocket connection url change or setShouldConnect change

  return { setShouldConnect, error };
}
