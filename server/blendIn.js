function Dummy() {
	this.x = 2;
}

function BlendIn(players) {
	this.minPlayers = 2;
	this.maxPlayers = 8;

	this.players = [];
	this.dummies = [];

	for(let i = 0; i<16; i++) {
		dummies.push(new Dummy());
	}
	/*
	this.init() {

	}

	this.update() {

	}*/
}

module.exports = BlendIn