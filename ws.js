var WebSocketServer = require("ws").Server;
const WebSocket = require('ws');
var wss = new WebSocketServer({ port: 3000 });

wss.on("connection", function(ws) {
	ws.send(JSON.stringify({msg:'Welcome!',type:'server'}));
    
	ws.on("message", function(message) {
        console.log(message);
        var data = JSON.parse(message);
		if (data.message === ':wq!') {
			ws.close();
		} else {
			wss.clients.forEach(function(client) {
                var myMsg;
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    if (data.nickname === undefined || data.nickname === '') data.nickname = 'Others';
                    myMsg = JSON.stringify({msg:data.message,type:'other',nickname:data.nickname});
                }
                if (client === ws && client.readyState === WebSocket.OPEN) {
                    if (data.nickname === undefined || data.nickname === '') data.nickname = 'Me';
                    myMsg = JSON.stringify({msg:data.message,type:'me',nickname:data.nickname});
                }
                if (myMsg) client.send(myMsg, function(error) {
                    if (error != null) console.log("there's an error!");
                });
			});

		}

	});
});