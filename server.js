var https = require("https");
var fs = require("fs");

let app = https
  .createServer(
    {
      key: fs.readFileSync(
        "/etc/letsencrypt/live/adaoiwudi-1.mydns.jp/privkey.pem"
      ),
      cert: fs.readFileSync(
        "/etc/letsencrypt/live/adaoiwudi-1.mydns.jp/fullchain.pem"
      ),
    },
    (req, res) => {
      res.writeHead(200);
      res.end("Success!\n");
    }
  )
  .listen(5001);

const server = require("ws").Server;
const s = new server({ server: app });

let unityClients = [];
let lastMsg = "";

s.on("connection", (ws) => {
  ws.on("message", (message) => {
    console.log("Received: " + message + "," + new Date().getTime().toString());

    msgString = message.toString();
    if (message.toString() === "Unity") {
      unityClients.push(ws);
      console.log("accept new UnityClient : count " + unityClients.length);
    } else if (message.toString() == "Require") {
      unityClients.forEach((unityWS) => {
        unityWS.send(lastMsg);
      });
    } else {
      console.log("cache message");
      lastMsg = msgString;
    }
  });

  ws.on("close", (message) => {
    console.log("Close : " + message);
    idx = unityClients.indexOf(ws);
    if (idx >= 0) {
      unityClients.splice(idx, 1);
      console.log("remove closed UnityClient : count " + unityClients.length);
    }
  });
});

console.log("run server");
