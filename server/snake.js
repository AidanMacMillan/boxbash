var State = require('./gameState'); 

function Snake(room) {
	this.game = "snake";
	this.minPlayers = 2;
	this.maxPlayers = 8;

	this.spawnSpots = [[3,10,0],[3,13,0],[20,10,2],[20,13,2],[10,3,1],[13,3,1],[10,20,3],[13,20,3]];
	this.players = {};
	this.state = State.INFO;
	this.grid = [];
	
	for(let i = 0; i<24; i++) {
		this.grid.push(Array(24).fill(""));
	}

	Object.keys(room.players).forEach(function(key) {
		let spawnIndex = Math.floor(Math.random()*this.spawnSpots.length);
		this.players[key] = {x: this.spawnSpots[spawnIndex][0], y: this.spawnSpots[spawnIndex][1], dir: this.spawnSpots[spawnIndex][2]};
		this.players[key].alive = true;
		this.players[key].trail = [];
		this.players[key].lastX = this.players[key].x;
		this.players[key].lastY = this.players[key].y;
		this.spawnSpots.splice(spawnIndex, 1);
	}.bind(this));

	setTimeout(function() {
		this.state = State.STARTING;
	}.bind(this), 4000);

	this.update = function(input) {

		let alive = 0;
		Object.keys(this.players).forEach(function(key) {
			if(this.players[key].alive) {
				alive++;
			}
		}.bind(this));

		if(alive < 2) {
			this.state = State.NEXT;
		}
		
		Object.keys(this.players).forEach(function(key) {
			let player = this.players[key];

			if(player.lastX < 0 || player.lastX > 23 || player.lastY < 0 || player.lastY > 23) {
				player.alive = false;
				this.removePlayer(key);
			}

			if(player.alive) {
				switch(player.dir) {
					case 0:
						if(Math.ceil(player.x) != player.lastX) {	
							this.grid[player.lastX][player.lastY] = key;
	
							if('dir' in input[key] && input[key].dir != 2) {
								this.checkInput(input[key].dir, player);
							} else {
								player.lastX = Math.ceil(player.x);
								player.x += 1/15;
							}
							
							this.checkDeath(player.lastX, player.lastY,key);
						} else {
							player.x += 1/15;
						}
						break;
					case 1:
						if(Math.ceil(player.y) != player.lastY) {
							this.grid[player.lastX][player.lastY] = key;
	
							if('dir' in input[key] && input[key].dir != 3) {
								this.checkInput(input[key].dir, player);
							} else {
								player.lastY = Math.ceil(player.y);
								player.y += 1/15;
							}
							this.checkDeath(player.lastX, player.lastY,key);
						} else {
							player.y += 1/15;
						}
						break;
					case 2:
						if(Math.floor(player.x) != player.lastX) {
							this.grid[player.lastX][player.lastY] = key;
	
							if('dir' in input[key] && input[key].dir != 0) {
								this.checkInput(input[key].dir, player);
							} else {
								player.lastX = Math.floor(player.x);
								player.x -= 1/15;
							}
							this.checkDeath(player.lastX, player.lastY,key);
						} else {
							player.x -= 1/15;
						}
						break;
					case 3:
						if(Math.floor(player.y) != player.lastY) {
							this.grid[player.lastX][player.lastY] = key;

							if('dir' in input[key] && input[key].dir != 1) {
								this.checkInput(input[key].dir, player);
							} else {
								player.lastY = Math.floor(player.y);
								player.y -= 1/15;
							}
							this.checkDeath(player.lastX, player.lastY,key);
						} else {
							player.y -= 1/15;
						}
						break;
				}
			}			
		}.bind(this));
	}

	this.checkDeath = function (x,y,key) {
		if(this.grid[x][y] !== "") {
			this.removePlayer(key);
			this.players[key].alive = false;
		}
	}

	this.removePlayer = function(key) {
		for(let x = 0; x<24; x++) {
			for(let y = 0; y<24; y++) {
				if(this.grid[x][y] == key) {
					this.grid[x][y] = "";
				}
			}
		}
	}

	this.checkInput = function(dir, player) {
		switch(dir) {
			case 0:
				player.x += 1/15;
				player.lastX = Math.ceil(player.x);
				player.y = Math.round(player.y);
				player.dir = 0;
				break;
			case 1:
				player.y += 1/15;
				player.lastY = Math.ceil(player.y);
				player.x = Math.round(player.x);
				player.dir = 1;
				break;
			case 2:
				player.x -= 1/15;
				player.lastX = Math.floor(player.x);
				player.y = Math.round(player.y);
				player.dir = 2;
				break;
			case 3:
				player.y -= 1/15;
				player.lastY = Math.floor(player.y);
				player.x = Math.round(player.x);
				player.dir = 3;
				break;
				
		}
	}

	this.getGameState = function() {
		return {
			game: this.game,
			grid: this.grid,
			players: this.players,
			state: this.state
		}
	}

	this.onDisconnectPlayer = function() {

	}
}

module.exports = Snake