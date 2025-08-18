import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", function (ws) {
  ws.send("Hello");
  ws.on("error", function (err) {
    console.error(err);
  });
});
