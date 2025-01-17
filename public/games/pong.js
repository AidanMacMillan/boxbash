function Pong(gameState) {
	this.game = 'pong';
	this.gameState = gameState;
	this.targetGameState = gameState;

	input = {enabled: true, left: false, right: false, up: false, down: false};

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
			this.gameState.ball.x += (this.targetGameState.ball.x-this.gameState.ball.x)*0.5;
			this.gameState.ball.y += (this.targetGameState.ball.y-this.gameState.ball.y)*0.5;
		}.bind(this));
	}

	this.update = function() {
		this.interpolate();
		ctx.clearRect(0,0,window.innerWidth, window.innerHeight);

		//Set play size variables
		let zoom = (Math.min(window.innerWidth, window.innerHeight*2)-100)/20;
		let x = window.innerWidth/2-zoom*10;
		let y = window.innerHeight/2-zoom*5;
		let width = zoom*20;
		let height = zoom*10;

		//Draw background
		ctx.fillStyle = 'hsl(0, 100%, 40%)';
		ctx.fillRect(0,0,window.innerWidth/2, window.innerHeight);
		ctx.fillStyle = 'hsl(195, 100%, 40%)';
		ctx.fillRect(window.innerWidth/2,0,window.innerWidth/2, window.innerHeight);

		ctx.fillStyle = 'hsl(0, 100%, 50%)';
		ctx.fillRect(x+zoom/2, y, width/2-zoom/2, height);
		ctx.fillStyle = 'hsl(195, 100%, 50%)';
		ctx.fillRect(x+width/2, y, width/2-zoom/2, height);

		//Draw goals
		//Goal 1
		ctx.fillStyle = 'white';
		ctx.fillRect(x, y+zoom*2.5, zoom/2, zoom*5);

		let goalGlow = ctx.createLinearGradient(x+zoom/2, 0, x+zoom, 0);
		goalGlow.addColorStop(0, "rgba(255,255,255,0.5)");
		goalGlow.addColorStop(1, "rgba(255,255,255,0)");
		ctx.fillStyle = goalGlow;
		ctx.fillRect(x+zoom/2, y+zoom*2.5, zoom/2, zoom*5);

		//Goal 2
		ctx.fillStyle = 'white';
		ctx.fillRect(x+width-zoom/2, y+zoom*2.5, zoom/2, zoom*5);

		goalGlow = ctx.createLinearGradient(x+width-zoom, 0, x+width-zoom/2, 0);
		goalGlow.addColorStop(0, "rgba(255,255,255,0)");
		goalGlow.addColorStop(1, "rgba(255,255,255,0.5)");
		ctx.fillStyle = goalGlow;
		ctx.fillRect(x+width-zoom, y+zoom*2.5, zoom/2, zoom*5);
		
		//Draw Centerline
		ctx.lineWidth = zoom/10;
		ctx.strokeStyle = 'white';
		ctx.beginPath();
		ctx.moveTo(window.innerWidth/2, 0);
		ctx.lineTo(window.innerWidth/2, window.innerHeight);
		ctx.stroke();

		//Draw Ball
		let ballX = x + width/2 + this.gameState.ball.x * zoom - zoom/4;
		let ballY = y + height/2 + this.gameState.ball.y * zoom - zoom/4;
		ctx.fillStyle = 'white';
		ctx.fillRect(ballX, ballY, zoom/2, zoom/2);
		let ballGlow = ctx.createRadialGradient(ballX+zoom/4, ballY+zoom/4, 0, ballX+zoom/4, ballY+zoom/4, zoom);
		ballGlow.addColorStop(0, "rgba(255,255,255,0.5)");
		ballGlow.addColorStop(1, "rgba(255,255,255,0)");
		ctx.fillStyle = ballGlow;
		ctx.fillRect(ballX-zoom/4*3, ballY-zoom/4*3, zoom*2, zoom*2);

		//Draw Players
		Object.keys(this.gameState.players).forEach(function(id) {
			let playerX = x + width/2 + this.gameState.players[id].x * zoom - zoom/2;
			let playerY = y + height/2 + this.gameState.players[id].y * zoom - zoom/2;

			if(socket.id == id) {
				ctx.fillStyle = "white";
			} else {
				ctx.fillStyle = "rgba(0,0,0,0.15)";
			}	
			ctx.fillRect(playerX - zoom/20, playerY - zoom/20, zoom+zoom/10, zoom+zoom/10);

			ctx.imageSmoothingEnabled = false;
			ctx.drawImage(room.players[id].skin, playerX, playerY, zoom, zoom);
		}.bind(this));
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
				input.up = true;
				break;
			case 40:
			case 83: // S
				input.down = true;
				break;
		}
	}

	this.handleKeyUp = function(e) {
		switch (e.keyCode) {
			case 37: // Left
			case 65: // A
				input.left = false;
				break;
			case 39:
			case 68: // D
				input.right = false;
				break;
			case 38:
			case 87: // W
				input.up = false;
				break;
			case 40:
			case 83: // S
				input.down = false;
				break;
		}
	}

	this.handleFocus = function() {
		console.log("test");
		input.left = false;
		input.right = false;
		input.up = false;
		input.down = false;
	}
}