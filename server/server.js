const express = require('express');
const app = express();
const cors = require('cors')
// Socket connection

app.use(cors())

/* Creates new HTTP server for socket */
var socketServer = require('http').createServer(app);
var io = require('socket.io')(socketServer);

io.set('transports', [ 'websocket' ]);

/* Listen for socket connection on port 3002 */
socketServer.listen(3002, '0.0.0.0', function(){
	console.log('Socket server listening on : 3002');
});

// socketServer.listen(3002, '0.0.0.0');

// var socket = io.listen(socketServer);

io.sockets.on('connection', (socket) => {
  console.log('Socket connection established');
  socket.on('room', function(room) {
  	console.log('joined ' + room);
  	socket.join(room);
  	socket.on('updateSquare', (data) => {
		console.log(data);
		socket.in(room).emit('updateSquare', data);
	});
  });
});


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/html/test.html');
});

