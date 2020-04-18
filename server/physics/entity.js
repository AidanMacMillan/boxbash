function Entity(x, y, w, h, isStatic) {
	this.x = x;
	this.y = y;
	this.width = w;
	this.height = h;
	this.isStatic = isStatic;

	this.vX = 0;
	this.vY = 0;
	this.mass = 1;
	this.drag = 0;
	this.friction = 0;
	this.bounds = false;

	this.onCollision = function(){};
	
	this.getLeft = function() {
		return this.x - this.width/2;
	}
	
	this.getRight = function() {
		return this.x + this.width/2;
	}

	this.getTop = function() {
		return this.y + this.height/2;
	}

	this.getBottom = function() {
		return this.y - this.height/2;
	}
}

module.exports = Entity;