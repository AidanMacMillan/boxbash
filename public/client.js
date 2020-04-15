var socket = io({transports: ['websocket'], reconnection: false});
var room = {};
var game = {game: 'none'};
var input = {enabled: true};

//Socket
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

//Game Management
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

window.requestAnimationFrame(update);
var lastTime = 0;
function update(time) {
	deltaTime = (time - lastTime)/1000;
	lastTime = time;

	if(game.game != 'none') {
		game.update(deltaTime);
	}
	window.requestAnimationFrame(update);
}

setInterval(function() {
	socket.emit('input', input);
}, 1000 / 60);


//Input Handling
document.addEventListener('keydown', function(e) {
	if(input.enabled && game.game != 'none') {
		game.handleKeyDown(e);
	}
	if(e.keyCode == 9) {
		e.preventDefault();
	}
});

document.addEventListener('keyup', function(e) {
	if(e.keyCode == 13) {
		chatMessage.focus();
	}
	if(input.enabled && game.game != 'none') {
		game.handleKeyUp(e);
	}
});

document.addEventListener('focus', function() {
	input.enabled = false;
	if(game.game != 'none') {
		game.handleFocus();
	}
}, true);

document.addEventListener('blur', function() {
	if(document.activeElement == document.body) {
		input.enabled = true;
	}
}, true);

//Scoreboard Screen

//Info Screen
var info = document.getElementById('info');

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