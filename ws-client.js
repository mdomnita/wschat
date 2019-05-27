var ws;
var connectInt;
var retrying = false;
var quit = false;

function setTitle(title) {
    document.querySelector('#title').innerHTML = title;
}

function printMessage(message) {
    //check if message is from me, server or other person
    var p = document.createElement('p');
    if (message.type && message.type === 'me') {
        p.className = 'mine'
        p.innerText = message.nickname+": " + message.msg;
    }
    else if (message.type && message.type === 'server') {
        p.innerText = "Server: " + message.msg;
    }
    else p.innerText = message.nickname+": " + message.msg;
    document.querySelector('div.messages').appendChild(p);
}

var connect = function(){
 try {
    ws = new WebSocket("ws://localhost:3000");
    // treat connection states
    ws.onopen = function() {
        setTitle("Connected");
        if (connectInt) {
            clearTimeout(connectInt);
        }
        var p = document.createElement('p');
        p.className = 'connect';
        p.innerText = "Connected to server";
        retrying = false;
        document.querySelector('div.messages').appendChild(p);
    };

    ws.onclose = function() {
        if (!retrying) {
            setTitle("DISCONNECTED");
            var p = document.createElement('p');
            p.className = 'connect';
            p.innerText = "Disconnected. Please try again later";
            document.querySelector('div.messages').appendChild(p);
        }
        retrying = true;
        clearTimeout(connectInt);
        // try to reconnect every 3 secs after disconnect if user did not quit with command
        if (!quit) connectInt = setTimeout(connect,3000);
    };

    ws.onerror = function() {
        if (!retrying) {
            setTitle("DISCONNECTED");
            var p = document.createElement('p');
            p.className = 'connect';
            p.innerText = "SOcket Error. Disconnected. Please try again later";
            document.querySelector('div.messages').appendChild(p);
        }
        retrying = true;
        clearTimeout(connectInt);
        if (!quit) connectInt = setTimeout(connect,3000);
    };

    ws.onmessage = function(payload) {
        var data = JSON.parse(payload.data);
        printMessage(data);
    };
 }
 catch (error) {
     console.log(error);
 }
 finally {
 }
}

connect();

//send message
document.forms[0].onsubmit = function () {
    var input = document.querySelector('#message');
    if (input.value === ':wq!') quit = true;
    var message = input.value;
    input.value = '';
    var input = document.querySelector('#nickname');
    var nickname = input.value;
    // send nickname and message as json string
    var toSend = {nickname:nickname,message:message}
    console.log("sending: "+JSON.stringify(toSend));
    ws.send(JSON.stringify(toSend));
};

//cursor blink fun
setInterval(function(){ 
    var label = document.querySelector('#cursor');
    var txt = label.innerText;
    if (txt === ">") label.innerText = '_'
        else label.innerText = '>'; 
}, 1000);