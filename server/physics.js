function Physics(gravity, bounds) {
	this.gravity = gravity;
	this.bounds = bounds;

	this.entities = {};

	//Non static entity
	this.addEntity = function(entityId, x, y, w, h, vX, vY, isStatic) {
		this.entities[entityId] = {x: x, y: y, width: w, height: h, vX: vX, vY: vY, isStatic: isStatic};
		this.entities[entityId].mass = 1;
		this.entities[entityId].drag = 0;
		this.entities[entityId].friction = 0;
		this.entities[entityId].noCollision = [];
		this.entities[entityId].onCollision = function(){};
	}

	this.update = function() {
		Object.keys(this.entities).forEach(function(id) {
			let entity = this.entities[id];

			if(!entity.isStatic) {
				entity.vX *= 1-entity.drag;
				entity.vY *= 1-entity.drag;

				//Update positions
				entity.x += entity.vX/60;
				entity.y += entity.vY/60;

				//Entity collisions
				Object.keys(this.entities).forEach(function(aId) {
					let aEntity = this.entities[aId];

					if(aId != id && 
							this.getLeft(entity) < this.getRight(aEntity) &&
							this.getRight(entity) > this.getLeft(aEntity) &&
							this.getBottom(entity) < this.getTop(aEntity) &&
							this.getTop(entity) > this.getBottom(aEntity)) {
						
						if(aEntity.isStatic) {
							let dx = (aEntity.x-entity.x) / aEntity.width * 2;
							let dy = (aEntity.y-entity.y) / aEntity.height * 2;

							if(Math.abs(dx) > Math.abs(dy)) {
								if(dx < 0) {
									entity.x = this.getRight(aEntity) + entity.width/2;
								} else {
									entity.x = this.getLeft(aEntity) - entity.width/2;
								}
								entity.vX = -entity.vX;
							} else {
								if(dy < 0) {
									entity.y = this.getTop(aEntity) + entity.height/2;
								} else {
									entity.y = this.getBottom(aEntity) - entity.height/2;
								}
								entity.vY = -entity.vY;
							}
						} else {
							let dx = (aEntity.x-entity.x);
							let dy = (aEntity.y-entity.y);

							if(Math.abs(dx)/aEntity.width > Math.abs(dy)/aEntity.height) {
								let xDiff = Math.sign(dx) * ((entity.width+aEntity.width/2)-Math.abs(dx))/4;  
								entity.x -= xDiff;
								aEntity.x += xDiff;

								let tmp = entity.vX;
								entity.vX = aEntity.vX * aEntity.mass/entity.mass;
								aEntity.vX = tmp * entity.mass/aEntity.mass;
								
							} else {
								let yDiff = Math.sign(dy) * ((entity.height+aEntity.height/2)-Math.abs(dy))/4;  
								entity.y -= yDiff;
								aEntity.y += yDiff;

								let tmp = entity.vY;
								entity.vY = aEntity.vY * aEntity.mass/entity.mass;
								aEntity.vY = tmp * entity.mass/aEntity.mass;
							}
						}

						entity.onCollision(aId);
					}

				}.bind(this));
			}
		}.bind(this));

		Object.keys(this.entities).forEach(function(id) {
			let entity = this.entities[id];
			if(!entity.isStatic) {
				//Bounds collision
				if(this.getLeft(entity) < this.bounds.left) {
					entity.x = this.bounds.left + entity.width/2;
					entity.vX = -entity.vX;
				}
				if(this.getRight(entity) > this.bounds.right) {
					entity.x = this.bounds.right - entity.width/2;
					entity.vX = -entity.vX;
				}
				if(this.getTop(entity) > this.bounds.top) {
					entity.y = this.bounds.top - entity.height/2;
					entity.vY = -entity.vY;
				}
				if(this.getBottom(entity) < this.bounds.bottom) {
					entity.y = this.bounds.bottom + entity.height/2;
					entity.vY = -entity.vY;
				}
			}
		}.bind(this));
	}

	this.getLeft = function(entity) {
		return entity.x - entity.width/2;
	}

	this.getRight = function(entity) {
		return entity.x + entity.width/2;
	}

	this.getTop = function(entity) {
		return entity.y + entity.height/2;
	}

	this.getBottom = function(entity) {
		return entity.y - entity.height/2;
	}
}

module.exports = Physics