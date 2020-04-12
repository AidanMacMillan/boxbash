var State = require('./gameState'); 
var Physics = require('./physics'); 

function Pong(room) {
	this.game = "pong";
	this.players = {};
	this.physics = new Physics(0, {left: -10, right: 10, bottom: -5, top: 5});

	//Add physics players
	Object.keys(room.players).forEach(function(id) {
		this.players[id] = {x: 0, y: 0};
		this.physics.addEntity(id, 0, 0, 1, 1, 0, 0, false);
	}.bind(this));

	//Add ball
	this.physics.addEntity('ball', 2, 2, 0.5, 0.5, 1, 0, false);
	this.physics.entities['ball'].mass = 0.5;

	setTimeout(function() {
		this.state = State.STARTING;
	}.bind(this), 4000);

	this.update = function(input) {
		Object.keys(this.players).forEach(function(key) {
			let player = this.physics.entities[key];

			//Input
			if(input[key]) {
				if(input[key].left) {
					player.vX -= 1;
					if(player.vX < -8) {
						player.vX = -8;
					}
				}
				if(input[key].right) {
					player.vX += 1;
					if(player.vX > 8) {
						player.vX = 8;
					}
				}
				if(input[key].right == input[key].left) {
					player.vX *= 0.9;
				}
				if(input[key].up) {
					player.vY -= 1;
					if(player.vY < -8) {
						player.vY = -8;
					}
				}
				if(input[key].down) {
					player.vY += 1;
					if(player.vY > 8) {
						player.vY = 8;
					}
				}
				if(input[key].up == input[key].down) {
					player.vY *= 0.9;
				}
			}
		}.bind(this));

		this.physics.update();

		Object.keys(this.players).forEach(function(key) {
			this.players[key].x = this.physics.entities[key].x;
			this.players[key].y = this.physics.entities[key].y;
		}.bind(this));
	}

	this.getGameState = function() {
		return {
			game: this.game,
			players: this.players,
			ball: {x: this.physics.entities['ball'].x, y: this.physics.entities['ball'].y},
			state: this.state
		};
	}
}

module.exports = Pong