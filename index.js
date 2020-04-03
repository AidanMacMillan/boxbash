const express = require('express');
const app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var Rooms = require('./room');
let Room = Rooms.Room;

var WaitingRoom = require('./public/waitingRoomShared').GameState;

rooms = {}

app.use(express.urlencoded({
	extended: true
}));
app.use(express.json());

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

app.get('/:room', function(req, res) {
	let roomName = req.params.room;
	if(roomName in rooms) {
		res.sendFile(__dirname + '/play.html');
	} else {
		res.redirect('/create/' + roomName);
	}
});

app.get('/create/:room', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

app.get('/join/:room', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

app.get('*', function(req, res) {
	res.redirect('/');
});

app.post('/createRoom', function(req, res) {
	let createdRoom = new Room(req.body.min, req.body.max);

	switch(createdRoom.isValid(req.body.roomName, rooms)) {
		case Rooms.VALID:
			rooms[req.body.roomName] = createdRoom;
			rooms[req.body.roomName].gameState = new WaitingRoom();
			res.send("Success");
			break;
		case Rooms.EXISTS:
			res.status(500).send("Room Already Exists.");
			break;
		case Rooms.BAD_REQUEST:
			res.status(400).send("Bad Request");
			break;
	}
});

io.on('connection', function(socket) {

	socket.on('registerPlayer', function(data) {
		rooms[data.room].registerPlayer(socket.id, data.nickname, data.skin);
		socket.join(data.room);
		socket.room = data.room;

		io.to(socket.room).emit('updateRoom', rooms[socket.room].getRoom());
	});

	socket.on('input', function(input) {
		rooms[socket.room].setInput(socket.id, input);
	})

	socket.on('disconnect', function() {
		if('room' in socket) {
			rooms[socket.room].disconnectPlayer(socket.id);
			io.to(socket.room).emit('updateRoom', rooms[socket.room].getRoom());
		}
	});

});

setInterval(function() {
	Object.keys(rooms).forEach(function(key) {
		if(rooms[key].gameState) {
			rooms[key].gameState.update(rooms[key].input);
			io.to(key).emit('gameState', rooms[key].gameState.getGameState());
		}
	})
}, 1000 / 60);

http.listen(3000, function() {
	console.log('listening on *:3000');
});