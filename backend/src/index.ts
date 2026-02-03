import { WebSocketServer } from "ws";
import url from "url";
const wss = new WebSocketServer({ port: 8080 });

import { GameManager } from "./gameManager";
const newWholeLogic = new GameManager();
wss.on("connection", function (ws, req) {
  console.log("someone join the connection");

  const parsedUrl = url.parse(req.url as string, true).query; // parse the url to get query parameters
  // if user type is host then add user as a host
  if (parsedUrl.username && parsedUrl.type === "host") {
    newWholeLogic.addHost(parsedUrl.username as string, ws);
  }

  // if user type is player then add user as a player
  if (parsedUrl.username && parsedUrl.type === "player" && parsedUrl.gameId) {
    // first check that gameId is correct or not
    const game = newWholeLogic.validGameId(parsedUrl.gameId as string);
    if (!game) {
      // return error response to client
      return;
    }
    newWholeLogic.addUser(parsedUrl.username as string, game, ws);
  }
  // newGameManager.addUser(ws); // new user send first request to server

  ws.on("message", (e) => {
    newWholeLogic.handleMessages(ws, e.toString()); // call message handler to handle all the messages
  });
  ws.on("close", function (event) {
    console.log("someone leave the connection");
    newWholeLogic.handleRemove(ws);
  });

  ws.on("error", function (err) {
    console.error(err);
  });
});
