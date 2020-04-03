var WaitingRoom = require('./waitingRoom');
var BlendIn = require('./blendIn');

function GameManager() {
	this.gameState = new WaitingRoom();
	this.input = {};
}

module.exports = GameManager