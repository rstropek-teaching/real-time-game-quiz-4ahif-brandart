import * as express from 'express';
import * as http from 'http';
import * as sio from 'socket.io'

const app = express();
app.use(express.static(__dirname + '/public'));
const server = http.createServer(app);
server.listen(3000);

sio(server).on('connection', function (socket) {
    socket.on('moveBar', function (message) {
        socket.broadcast.emit('moveBar', message);
    });
});