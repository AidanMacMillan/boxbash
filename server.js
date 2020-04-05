const express = require('express');
const app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var Rooms = require('./server/room');
let Room = Rooms.Room;

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
		rooms[data.room].connectPlayer(socket.id, data.nickname, data.skin);
		socket.join(data.room);
		socket.room = data.room;

		io.to(socket.room).emit('updateRoom', rooms[socket.room].getRoom());
	});

	socket.on('message', function(msg) {
		io.to(socket.room).emit('message', {id: socket.id, msg: msg});
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
		if(rooms[key].gameManager.gameState) {
			rooms[key].gameManager.gameState.update(rooms[key].gameManager.input);
			io.to(key).emit('gameState', rooms[key].gameManager.gameState.getGameState());
		}
	})
}, 1000 / 60);

const PORT = process.env.PORT || 3000;
http.listen(PORT, function() {
	console.log('Server listening on port ' + PORT);
});