var socket = io({transports: ['websocket'], reconnection: false});
var room = {};
var game = {game: 'none'};

socket.emit('registerPlayer', {
	room: location.pathname.substr(1),
	nickname: localStorage.getItem('nickname'),
	skin: localStorage.getItem('skin')
});

socket.on('updateRoom', function(rm) {
	Object.keys(rm.players).forEach(function(id) {
		let dataURL = rm.players[id].skin;
		let skin = new Image;
		skin.src = dataURL;

		rm.players[id].skin = skin;
	})
	room = rm;
});

socket.on('gameState', function(gameState) {
	if(game.game != gameState.game) {
		startGame(gameState);
	} else {
		game.updateGameState(gameState);
	}
})

function startGame(gameState) {
	canvasContainer.innerHTML = "";
	switch(gameState.game) {
		case 'waitingRoom':
			game = new WaitingRoom(gameState);
			break;
		case 'pong':
			game = new Pong(gameState);
			info.style.animation = '5s showBoard';
			break;
		case 'snake':
			game = new Snake(gameState);
			info.style.animation = '5s showBoard';
			break;
	}
}

//Disconnection
var disconnected = document.getElementById('disconnected');
var refresh = document.getElementById('refresh');

socket.on('disconnect', function(data) {
	disconnected.style.animation = "5s showDisconnected";
	disconnected.style.display = "block";
});

refresh.addEventListener('click', function() {
	location.reload();
})

//Canvas
var canvasContainer = document.getElementById('canvasContainer');
var canvas = document.getElementById('mainCanvas');
var ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener('resize', function() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
})