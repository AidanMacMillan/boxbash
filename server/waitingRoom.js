function WaitingRoom() {
	this.players = {};

	this.onRegisterPlayer = function(id) {
		this.players[id] = {id: id, x: 0, y: 0, velX: 0, velY: 0}
	}
	this.onDisconnectPlayer = function(id) {
		delete this.players[id];
	}
	this.update = function(input) {
		Object.keys(this.players).forEach(function(key) {
			player = this.players[key];

			//Gravity
			player.velY -= 0.3;

			//Input
			if(input[key]) {
				if(input[key].left) {
					player.velX -= 0.3;
					if(player.velX < -8) {
						player.velX = -8;
					}
				}
				if(input[key].right) {
					player.velX += 0.3;
					if(player.velX > 8) {
						player.velX = 8;
					}
				}
				if(input[key].right == input[key].left && player.y == 0) {
					player.velX *= 0.95;
				}
				if(input[key].jump && player.y == 0) {
					player.velY = 5;
				}
			}

			//Movement
			if(player.velY < -20) {
				player.velY = -20;
			}

			//Position
			player.x += player.velX/60;
			player.y += player.velY/60;

			//Collisions
			if(player.y < 0) {
				player.y = 0;
				player.velY = 0;
			}
			if(player.x > 4.5) {
				player.x = 4.5;
				player.velX = -player.velX;
			}
			if(player.x < -4.5) {
				player.x = -4.5;
				player.velX = -player.velX;
			}
		}.bind(this));
	}

	this.getGameState = function() {
		return {
			players: this.players
		};
	}
}

module.exports = WaitingRoom