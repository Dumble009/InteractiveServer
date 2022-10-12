const server = require("ws").Server;
const s = new server({ port: 5001 });

let unityClients = [];
let lastMsg = "";

s.on("connection", (ws) => {
  ws.on("message", (message) => {
    console.log("Received: " + message + "," + Date.now().toString());

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
