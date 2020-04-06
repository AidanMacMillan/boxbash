var State = require('./gameState');

var WaitingRoom = require('./waitingRoom');
var Snake = require('./snake');

function GameManager(room) {
	this.room = room;
	this.gameState = new WaitingRoom(room);
	this.input = {};

	this.update = function(io, key) {
		if(this.gameState.state == State.INFO) {

		}
		else if(this.gameState.state == State.ENDED) {
			
		} 
		else if(this.gameState.state == State.NEXT) {
			this.gameState = new Snake(room);
			io.to(key).emit('startGame', this.gameState.getGameState());
		}
		else {
			this.gameState.update(this.input);
			io.to(key).emit('gameState', this.gameState.getGameState());
		}
	}

	this.onConnectPlayer = function(id) {
		if(this.gameState.game == "waitingRoom") {
			this.gameState.onConnectPlayer(id);
		}
	}

	this.onDisconnectPlayer = function(id) {
		this.gameState.onDisconnectPlayer(id);
	}
}

module.exports = GameManager