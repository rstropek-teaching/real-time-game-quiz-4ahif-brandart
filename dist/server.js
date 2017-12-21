"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http = require("http");
const sio = require("socket.io");
const app = express();
app.use(express.static(__dirname + '/public'));
const server = http.createServer(app);
server.listen(3000);
sio(server).on('connection', function (socket) {
    socket.on('moveBar', function (message) {
        socket.broadcast.emit('moveBar', message);
    });
});
