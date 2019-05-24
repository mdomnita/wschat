# wschat
Node JS and websocket chat implementation example

To use, run: 

- npm install

- node ws.js

- open index.html in browser
    index.html uses ws-client.js to send/receive messages

The client will connect to localhost websocket and you can set a nickname and send/receive messages.

Other clients can connect too and chat through the websocket

The disconnect command from the client is :wq!

The client will automatically try to reconnect if server goes down.

All message exchange is done only through websocket and server is created using the basic ws: Node.js WebSocket library

Node.js has to be installed on the system and the browser has to be compatible with websocket
