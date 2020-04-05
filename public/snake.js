function Snake() {
	this.game = 'snake';
	this.init = function() {
		input = {enabled: true, left: false, right: false, up: false, down: false};
	}

	this.update = function() {
		ctx.clearRect(0,0,window.innerWidth, window.innerHeight);

		let zoom = (Math.min(window.innerWidth, window.innerHeight)-100)/16;
		
		ctx.fillStyle = 'rgb(40,40,50)';
		ctx.fillRect(0,0,window.innerWidth, window.innerHeight);
		ctx.fillStyle = 'rgb(50,50,60)';
		ctx.fillRect(window.innerWidth/2-zoom*8, window.innerHeight/2-zoom*8, zoom*8, zoom*8);
	}

	this.handleKeyDown = function(e) {

	}

	this.handleKeyUp = function(e) {

	}

	this.handleFocus = function() {

	}
}