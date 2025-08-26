import { WebSocketServer } from "ws";
import { v4 as uuidv4 } from 'uuid';
const wss = new WebSocketServer({ port: 8080 });

import { GameManager } from "./gameManager";
const newGameManager = new GameManager();
wss.on("connection", function (ws) {
  console.log("someone join the connection")
  newGameManager.addUser(ws); // new user send first request to server

  ws.on("close",function(){
    console.log("someone leave the connection")
  })

  ws.on("error", function (err) {
    console.error(err);
  });
});
