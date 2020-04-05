var State = require('./gameState'); 

function Snake() {
	this.game = "snake";
	this.minPlayers = 2;
	this.maxPlayers = 8;

	this.players = {};
	this.state = 0;

	setTimeout(function() {
		this.state = State.STARTING;
	}.bind(this), 4000);

	this.update = function() {

	}

	this.getGameState = function() {
		return {
			game: this.game,
			players: this.players,
			state: this.state
		}
	}

	this.onDisconnectPlayer = function() {

	}
}

module.exports = Snake