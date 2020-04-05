var GameManager = require('./gameManager');

const VALID = 0;
const EXISTS = 1;
const BAD_REQUEST = 2;

function Room(min, max) {
	this.players = {};
	this.min = min;
	this.max = max;
	this.gameManager = new GameManager(this);
	this.availableColors = [
		'hsl(0, 100%, 50%)',
		'hsl(30, 100%, 50%)',
		'hsl(75, 100%, 50%)',
		'hsl(105, 100%, 50%)',
		'hsl(180, 100%, 50%)',
		'hsl(220, 100%, 50%)',
		'hsl(285, 100%, 60%)',
		'hsl(300, 100%, 50%)'
	];

	this.connectPlayer = function(id, nickname, skin) {
		let colorIndex = Math.floor(Math.random() * this.availableColors.length);
		this.players[id] = {nickname: nickname, skin: skin, score: 0, color: this.availableColors[colorIndex]};
		this.availableColors.splice(colorIndex, 1);
		this.gameManager.onConnectPlayer(id);
	}

	this.disconnectPlayer = function(id) {
		this.availableColors.push(this.players[id].color);
		delete this.players[id];
		this.gameManager.onDisconnectPlayer(id);
	}

	this.setInput = function(id, input) {
		this.gameManager.input[id] = input;
	}

	this.getRoom = function() {
		return {
			players: this.players,
			min: this.min,
			max: this.max,
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