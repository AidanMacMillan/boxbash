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

function WaitingRoom(gameState) {
	this.game = 'waitingRoom';
	this.gameState = gameState;
	this.targetGameState = gameState;

	input = {enabled: true, left: false, right: false, jump: false}
	this.waitingText = document.createElement("h1");
	this.regions = regionSizes[0];
	this.targetRegions = regionSizes[0];
	this.waitingText.className = "waitingText";
	this.waitingText.innerHTML = "Waiting for " + (room.min - room.players.length) + " players...";
	canvasContainer.appendChild(this.waitingText);

	this.updateGameState = function(gameState) {
		this.targetGameState = gameState;
	}

	this.interpolate = function() {
		Object.keys(this.targetGameState.players).forEach(function(id) {
			if(id in gameState.players) {
				this.gameState.players[id].x += (this.targetGameState.players[id].x-this.gameState.players[id].x)*0.5;
				this.gameState.players[id].y += (this.targetGameState.players[id].y-this.gameState.players[id].y)*0.5;
			} else {
				this.gameState.players[id] = this.targetGameState.players[id];
			}
		}.bind(this));
	}

	this.update = function(deltaTime) {
		this.interpolate();

		ctx.clearRect(0,0,window.innerWidth, window.innerHeight);
		this.targetRegions = regionSizes[Object.keys(room.players).length];
		
		for(let i = 0; i<8; i++) {
			//Get id of player at index
			let id = Object.keys(room.players)[i];
			let gameState = this.gameState;

			//Lerp region to target region
			for(let j = 0; j<4; j++) {
				this.regions[i][j] += (this.targetRegions[i][j] - this.regions[i][j]) * 0.1;
			}

			//Set region variables
			let x = this.regions[i][0]*window.innerWidth;
			let y = this.regions[i][1]*window.innerHeight;
			let width = this.regions[i][2]*window.innerWidth;
			let height = this.regions[i][3]*window.innerHeight;
			
			let zoom = this.regions[0][2]*window.innerWidth/10;


			//Draw region
			ctx.save()
			ctx.beginPath();
			if(id in room.players) {
				ctx.fillStyle = room.players[id].color;
			}
			ctx.rect(x, y, width, height);
			ctx.fill();
			ctx.clip();

			ctx.fillStyle = 'rgba(0,0,0,0.1)';
			ctx.fillRect(x, y + height/2, width, height/2);

			//Draw player
			if(id in room.players && id in gameState.players) {
				if(socket.id == id) {
					ctx.strokeStyle = 'white';
					ctx.lineWidth = 10;
					ctx.stroke();
				}
				
				ctx.font = "24px Blinker";
				ctx.fillStyle = "white";
				ctx.textAlign = "center";
				ctx.fillText(room.players[id].nickname, x + width/2 + gameState.players[id].x*zoom, y + height/2 + -gameState.players[id].y*zoom - zoom - 24);
				
				ctx.fillStyle = "rgba(0,0,0,0.15)";
				ctx.fillRect(x + width/2 + gameState.players[id].x*zoom - 3 - zoom/2, y + height/2 + -gameState.players[id].y*zoom - zoom - 3, zoom+6, zoom+6)

				ctx.imageSmoothingEnabled = false;
				ctx.drawImage(room.players[id].skin, x + width/2 + gameState.players[id].x*zoom - zoom/2, y + height/2 + -gameState.players[id].y*zoom - zoom, zoom, zoom);
			}
			ctx.restore();
		}

		let waitingFor = room.min - Object.keys(room.players).length;
		if(waitingFor < 1) {
			this.waitingText.innerHTML = "Starting game in " + gameState.countdown + "...";
		} else if(waitingFor == 1) {
			if(this.waitingText.innerHTML != "Waiting for 1 more player!") {
				this.waitingText.innerHTML = "Waiting for 1 more player!";
			}
		} else {
			if(this.waitingText.innerHTML != "Waiting for " + waitingFor + " more players!") {
				this.waitingText.innerHTML = "Waiting for " + waitingFor + " more players!";
			}
		}
	}

	this.handleKeyDown = function(e) {
		switch(e.keyCode) {
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
	}

	this.handleKeyUp = function(e) {
		switch (e.keyCode) {
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
	}	

	this.handleFocus = function() {
		input.left = false;
		input.right = false;
		input.jump = false;
	}
}