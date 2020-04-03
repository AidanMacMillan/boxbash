var GameManager = require('./gameManager');

const VALID = 0;
const EXISTS = 1;
const BAD_REQUEST = 2;

function Room(min, max) {
	this.players = [];
	this.min = min;
	this.max = max;
	this.gameManager = new GameManager();

	this.registerPlayer = function(id, nickname, skin) {
		this.players.push({id: id, nickname: nickname, skin: skin});
		this.gameManager.gameState.onRegisterPlayer(id);
	}

	this.disconnectPlayer = function(id) {
		for(let i = 0; i < this.players.length; i++) {
			if(id == this.players[i].id) {
				this.players.splice(i,1);
				break;
			}
		}
		this.gameManager.gameState.onDisconnectPlayer(id);
	}

	this.setInput = function(id, input) {
		this.gameManager.input[id] = input;
	}

	this.getRoom = function() {
		return {
			players: this.players,
			min: this.min,
			max: this.max
		}
	}

	this.isValid = function(roomName, rooms) {
		if(this.min >= 2 && this.min <= this.max && this.max <= 8) {
			if(roomName in rooms) {
				return EXISTS;
			} else {
				return VALID;
			}
		}
		return BAD_REQUEST;
	}
}

module.exports = {
	Room: Room,
	VALID: VALID,
	EXISTS: EXISTS,
	BAD_REQUEST
};