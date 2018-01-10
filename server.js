"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http = require("http");
let score1;
let clients = 0;
const app = express();
app.use(express.static(__dirname + '/public'));
const server = http.createServer(app);
server.listen(3000);
const io = require('socket.io')(server);
io.on('connection', function (socket) {
    let client1;
    let client2;
    socket.on('moveBar', function (message) {
        socket.broadcast.emit('moveBar', message);
    });
    socket.on('userConnect', function (message) {
        clients++;
        if (clients === 2) {
            //get to the game page
            io.sockets.emit('startGame', message);
            //start moving the ball from a client
            socket.emit('startBall', message);
        }
        else if (clients > 2) {
            socket.emit("alreadyPlaying", "sorry, there are already two players");
        }
    });
    socket.on('moveBall', function (message) {
        socket.broadcast.emit('moveBall', message);
    });
});
