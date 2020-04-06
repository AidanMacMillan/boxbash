function Snake() {
	this.game = 'snake';
	this.init = function() {
		input = {enabled: true};
	}

	this.update = function() {
		ctx.clearRect(0,0,window.innerWidth, window.innerHeight);

		let zoom = (Math.min(window.innerWidth, window.innerHeight)-100)/24;
		let x = window.innerWidth/2-zoom*12;
		let y = window.innerHeight/2-zoom*12;
		let width = zoom*24;
		let height = zoom*24;

		ctx.fillStyle = 'rgb(40,40,50)';
		ctx.fillRect(0,0,window.innerWidth, window.innerHeight);
		ctx.fillStyle = 'rgb(50,50,60)';
		ctx.fillRect(x, y, width, height);

		for(let i = 0; i<24; i++) {
			for(let j = 0; j<24; j++) {
				let id = gameState.grid[i][j];
				if(id != "") {
					ctx.fillStyle = room.players[id].color;
					ctx.fillRect(x + i*zoom, y + j*zoom, zoom, zoom);
				}
			}
		}

		Object.keys(gameState.players).forEach(function(id) {
			if(gameState.players[id].alive) {
				ctx.imageSmoothingEnabled = false;
				ctx.drawImage(room.players[id].skin, x + gameState.players[id].x * zoom, y + gameState.players[id].y * zoom, zoom, zoom);		
			}
		});
	}

	this.handleKeyDown = function(e) {
		switch(e.keyCode) {
			case 37: // Left
			case 65:
				input.dir = 2;
				break;
			case 39:
			case 68: // Right
				input.dir = 0;
				break;
			case 38:
			case 87: // Up
				input.dir = 3;
				break;
			case 40:
			case 83: // Down
				input.dir = 1;
				break;
		}
	}

	this.handleKeyUp = function(e) {
		
	}

	this.handleFocus = function() {

	}
}