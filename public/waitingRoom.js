var player = {
	nickname: 0,
	x: 0,
	y: 0,
	velX: 0,
	velY: 0
};

var gameState = {
	players: []
};

var input = {
	left: false,
	right: false,
	jump: false,
};

var jumped = false;

var lastTime = 0;

/*
const regionSizes = [
	[[0,0,1,1],[1,0,0,1],[1,0,0,1],[1,0,0,1],[0,1,1,0],[1,1,0,0],[1,1,0,0],[1,1,0,0]],
	[[0,0,1,1],[1,0,0,1],[1,0,0,1],[1,0,0,1],[0,1,1,0],[1,1,0,0],[1,1,0,0],[1,1,0,0]],
	[[0,0,1/2,1],[1/2,0,1/2,1],[1,0,0,1],[1,0,0,1],[0,1,1,0],[1,1,0,0],[1,1,0,0],[1,1,0,0]],
	[[0,0,1/3,1],[1/3,0,1/3,1],[2/3,0,1/3,1],[1,0,0,1],[0,1,1,0],[1,1,0,0],[1,1,0,0],[1,1,0,0]],
	[[0,0,1/4,1],[1/4,0,1/4,1],[2/4,0,1/4,1],[3/4,0,1/4,1],[0,1,1,0],[1,1,0,0],[1,1,0,0],[1,1,0,0]],
	[[0,0,1/4,1/2],[1/4,0,1/4,1/2],[2/4,0,1/4,1/2],[3/4,0,1/4,1/2],[0,1/2,1,1/2],[1,1/2,0,1/2],[1,1/2,0,1/2],[1,1/2,0,1/2]],
	[[0,0,1/4,1/2],[1/4,0,1/4,1/2],[2/4,0,1/4,1/2],[3/4,0,1/4,1/2],[0,1/2,1/2,1/2],[1/2,1/2,1/2,1/2],[1,1/2,0,1/2],[1,1/2,0,1/2]],
	[[0,0,1/4,1/2],[1/4,0,1/4,1/2],[2/4,0,1/4,1/2],[3/4,0,1/4,1/2],[0,1/2,1/3,1/2],[1/3,1/2,1/3,1/2],[2/3,1/2,1/3,1/2],[1,1/2,0,1/2]],
	[[0,0,1/4,1/2],[1/4,0,1/4,1/2],[2/4,0,1/4,1/2],[3/4,0,1/4,1/2],[0,1/2,1/4,1/2],[1/4,1/2,1/4,1/2],[2/4,1/2,1/4,1/2],[3/4,1/2,1/4,1/2]]
]*/

const regionSizes = [
	[[0,0,1,1],[1,0,0,1],[0,1,1,0],[1,1,0,0],[1,0,0,1],[1,1,0,0],[1,0,0,1],[1,1,0,0]],
	[[0,0,1,1],[1,0,0,1],[0,1,1,0],[1,1,0,0],[1,0,0,1],[1,1,0,0],[1,0,0,1],[1,1,0,0]],
	[[0,0,1/2,1],[1/2,0,1/2,1],[0,1,1,0],[1,1,0,0],[1,0,0,1],[1,1,0,0],[1,0,0,1],[1,1,0,0]],
	[[0,0,1/2,1/2],[1/2,0,1/2,1/2],[0,1/2,1,1/2],[1,1/2,0,1/2],[1,0,0,1],[1,1,0,0],[1,0,0,1],[1,1,0,0]],
	[[0,0,1/2,1/2],[1/2,0,1/2,1/2],[0,1/2,1/2,1/2],[1/2,1/2,1/2,1/2],[1,0,0,1],[1,1,0,0],[1,0,0,1],[1,1,0,0]],
	[[0,0,1/3,1/2],[1/3,0,1/3,1/2],[0,1/2,1/3,1/2],[1/3,1/2,1/3,1/2],[2/3,0,1/3,1],[2/3,1,1/3,0],[1,0,0,1],[1,1,0,0]],
	[[0,0,1/3,1/2],[1/3,0,1/3,1/2],[0,1/2,1/3,1/2],[1/3,1/2,1/3,1/2],[2/3,0,1/3,1/2],[2/3,1/2,1/3,1/2],[1,0,0,1],[1,1,0,0]],
	[[0,0,1/4,1/2],[1/4,0,1/4,1/2],[0,1/2,1/4,1/2],[1/4,1/2,1/4,1/2],[2/4,0,1/4,1/2],[2/4,1/2,1/4,1/2],[3/4,0,1/4,1],[3/4,1,1/4,0]],
	[[0,0,1/4,1/2],[1/4,0,1/4,1/2],[0,1/2,1/4,1/2],[1/4,1/2,1/4,1/2],[2/4,0,1/4,1/2],[2/4,1/2,1/4,1/2],[3/4,0,1/4,1/2],[3/4,1/2,1/4,1/2]]
]

var regions = regionSizes[0];
var targetRegions = regionSizes[0];
var waitingText = document.createElement("h1");

init();
function init() {
	waitingText.className = "waitingText";
	waitingText.innerHTML = "Waiting for " + (room.min - room.players.length) + " players...";
	canvasContainer.appendChild(waitingText);
}

window.requestAnimationFrame(update);
function update(time) {
	deltaTime = (time - lastTime)/1000;
	lastTime = time;

	ctx.clearRect(0,0,window.innerWidth, window.innerHeight);

	targetRegions = regionSizes[Object.keys(room.players).length];

	for(let i = 0; i<8; i++) {
		for(let j = 0; j<4; j++) {
			regions[i][j] += (targetRegions[i][j] - regions[i][j]) * 0.1;
		}

		let id = Object.keys(room.players)[i];
		let zoom = regions[0][2]*window.innerWidth/10;

		ctx.save()
		ctx.beginPath();
		if(i < Object.keys(room.players).length) {
			ctx.fillStyle = room.players[id].color;
		}
	
		ctx.rect(regions[i][0]*window.innerWidth, regions[i][1]*window.innerHeight,
			regions[i][2]*window.innerWidth, regions[i][3]*window.innerHeight);
		ctx.fill();
		ctx.clip();

		ctx.fillStyle = 'rgba(0,0,0,0.1)';
		ctx.fillRect(regions[i][0]*window.innerWidth, regions[i][1]*window.innerHeight+regions[i][3]*window.innerHeight/2,
			regions[i][2]*window.innerWidth, regions[i][3]*window.innerHeight/2);
		
		if(i<Object.keys(gameState.players).length && i<Object.keys(room.players).length) {
			if(socket.id == id) {
				ctx.strokeStyle = 'white';
				ctx.lineWidth = 10;
				ctx.stroke();
			}
		
			ctx.imageSmoothingEnabled = false;
			ctx.font = "24px Blinker";
			ctx.fillStyle = "white";
			ctx.textAlign = "center";
			ctx.fillText(room.players[id].nickname, 
				regions[i][0]*window.innerWidth + regions[i][2]*window.innerWidth/2 + gameState.players[id].x*zoom, 
				regions[i][1]*window.innerHeight + regions[i][3]*window.innerHeight/2 + -gameState.players[id].y*zoom - zoom - 24);

			ctx.fillRect(regions[i][0]*window.innerWidth + regions[i][2]*window.innerWidth/2 + gameState.players[id].x*zoom - 1 - zoom/2,
				regions[i][1]*window.innerHeight + regions[i][3]*window.innerHeight/2 + -gameState.players[id].y*zoom - zoom - 1,
				zoom+2,zoom+2)
			ctx.drawImage(room.players[id].skin, regions[i][0]*window.innerWidth + regions[i][2]*window.innerWidth/2 + gameState.players[id].x*zoom - zoom/2,
				regions[i][1]*window.innerHeight + regions[i][3]*window.innerHeight/2 + -gameState.players[id].y*zoom - zoom,
				zoom,zoom);
		}

		ctx.restore();		
	}

	let waitingFor = room.min - Object.keys(room.players).length;
	if(waitingFor < 1) {
		if(waitingText.innerHTML != "Starting game!") {
			waitingText.innerHTML = "Starting game!";
		}
	} else if(waitingFor == 1) {
		if(waitingText.innerHTML != "Waiting for 1 more player...") {
			waitingText.innerHTML = "Waiting for 1 more player...";
		}
	} else {
		if(waitingText.innerHTML != "Waiting for " + waitingFor + " more players...") {
			waitingText.innerHTML = "Waiting for " + waitingFor + " more players...";
		}
	}

	window.requestAnimationFrame(update);
}

setInterval(function() {
  socket.emit('input', input);
}, 1000 / 60);

socket.on('gameState', function(gs) {
	gameState = gs;
})

document.addEventListener('keydown', function(event) {
	switch (event.keyCode) {
		case 39:
			input.right = true;
			break;
		case 37: // Left
		case 65: // A
			input.left = true;
			break;
		case 39:
		case 68: // D
			input.right = true;
			break;
		case 38:
		case 87: // W
			input.jump = true;
			break;
	}
});
  document.addEventListener('keyup', function(event) {
	switch (event.keyCode) {
		case 37:
		case 65: // A
			input.left = false;
			break;
		case 39:
		case 68: // D
			input.right = false;
			break;
	case 38:
	case 87: // W
		input.jump = false;
		break;
	}
});