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

window.requestAnimationFrame(update);
function update(time) {
	deltaTime = (time - lastTime)/1000;
	lastTime = time;

	ctx.clearRect(0,0,window.innerWidth, window.innerHeight);

	targetRegions = regionSizes[room.players.length];

	for(let i = 0; i<8; i++) {
		for(let j = 0; j<4; j++) {
			regions[i][j] += (targetRegions[i][j] - regions[i][j]) * 0.1;
		}
		ctx.fillStyle = 'hsl(' + i*(360/8) + ',100%,50%)';
		ctx.strokeStyle = 'hsl(' + i*(360/8) + ',100%,75%)';
		ctx.save()
		ctx.beginPath();
		ctx.rect(regions[i][0]*window.innerWidth, regions[i][1]*window.innerHeight,
			regions[i][2]*window.innerWidth, regions[i][3]*window.innerHeight);
		ctx.fill();
		ctx.clip();

		let zoom = regions[0][2]*window.innerWidth/10;
		if(i<gameState.players.length && i<room.players.length) {
			if(socket.id == gameState.players[i].id) {
				ctx.lineWidth = 10;
				ctx.stroke();
			}
		
			ctx.fillStyle = 'rgb(255,255,255)';
			ctx.imageSmoothingEnabled = false;
			ctx.font = "24px Blinker";
			ctx.fillStyle = "white";
			ctx.textAlign = "center";
			ctx.fillText(room.players[i].nickname, 
				regions[i][0]*window.innerWidth + regions[i][2]*window.innerWidth/2 + gameState.players[i].x*zoom, 
				regions[i][1]*window.innerHeight + regions[i][3]*window.innerHeight/2 + -gameState.players[i].y*zoom - zoom/2 - 24);

			ctx.fillRect(regions[i][0]*window.innerWidth + regions[i][2]*window.innerWidth/2 + gameState.players[i].x*zoom - 1 - zoom/2,
				regions[i][1]*window.innerHeight + regions[i][3]*window.innerHeight/2 + -gameState.players[i].y*zoom - 1 - zoom/2,
				zoom+2,zoom+2)
			ctx.drawImage(room.players[i].skin, regions[i][0]*window.innerWidth + regions[i][2]*window.innerWidth/2 + gameState.players[i].x*zoom - zoom/2,
				regions[i][1]*window.innerHeight + regions[i][3]*window.innerHeight/2 + -gameState.players[i].y*zoom - zoom/2,
				zoom,zoom);
		}
		ctx.restore();

		ctx.imageSmoothingEnabled = true;
		ctx.font = "48px Blinker";
		ctx.fillStyle = "white";
		ctx.textAlign = "center";
		ctx.fillText("Waiting for Players", window.innerWidth/2, 60);
	}

	/*
	if('players' in gameState) {
		Object.keys(gameState.players).forEach(function(key) {
			ctx.imageSmoothingEnabled = false;
			ctx.drawImage(room.players[key].skin, gameState.players[key].x*50, -gameState.players[key].y*50, 50, 50);
		});
	}*/

	window.requestAnimationFrame(update);
}

setInterval(function() {
  socket.emit('input', input);
  input.jump = false;
}, 1000 / 60);

socket.on('gameState', function(gs) {
	gameState = gs;
})

document.addEventListener('keydown', function(event) {
	switch (event.keyCode) {
		case 65: // A
			input.left = true;
			break;
		case 87: // W
			if(!jumped) {
				input.jump = true;
			}
			jumped = true;
			break;
		case 68: // D
			input.right = true;
			break;
	}
});
  document.addEventListener('keyup', function(event) {
	switch (event.keyCode) {
	  case 65: // A
		input.left = false;
		break;
	  case 68: // D
		input.right = false;
		break;
	case 87: // W
		jumped = false;
		break;
	}
});