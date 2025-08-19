import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

import { GameManager } from "./gameManager";
import { CREATE_ROOM, INIT_GAME } from "./messages";
wss.on("connection", function (ws) {
  
  

  ws.on("error", function (err) {
    console.error(err);
  });
});
