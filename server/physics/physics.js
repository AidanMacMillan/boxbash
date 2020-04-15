var Entity = require('./entity');

function Physics(gravity, bounds) {
	this.gravity = gravity;
	this.bounds = bounds;

	this.entities = {};

	this.addEntity = function(entityId, x, y, w, h, isStatic) {
		let entity = new Entity(x, y, w, h, isStatic);
		this.entities[entityId] = entity;
		return entity;
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
							entity.getLeft() < aEntity.getRight() &&
							entity.getRight() > aEntity.getLeft() &&
							entity.getBottom() < aEntity.getTop() &&
							entity.getTop() > aEntity.getBottom()) {
						
						if(aEntity.isStatic) {
							let dx = (aEntity.x-entity.x) / aEntity.width * 2;
							let dy = (aEntity.y-entity.y) / aEntity.height * 2;

							if(Math.abs(dx) > Math.abs(dy)) {
								if(dx < 0) {
									entity.x = aEntity.getRight() + entity.width/2;
								} else {
									entity.x = aEntity.getLeft() - entity.width/2;
								}
								entity.vX = -entity.vX;
							} else {
								if(dy < 0) {
									entity.y = aEntity.getTop() + entity.height/2;
								} else {
									entity.y = aEntity.getBottom() - entity.height/2;
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
				if(entity.getLeft() < this.bounds.left) {
					entity.x = this.bounds.left + entity.width/2;
					entity.vX = -entity.vX;
				}
				if(entity.getRight() > this.bounds.right) {
					entity.x = this.bounds.right - entity.width/2;
					entity.vX = -entity.vX;
				}
				if(entity.getTop() > this.bounds.top) {
					entity.y = this.bounds.top - entity.height/2;
					entity.vY = -entity.vY;
				}
				if(entity.getBottom() < this.bounds.bottom) {
					entity.y = this.bounds.bottom + entity.height/2;
					entity.vY = -entity.vY;
				}
			}
		}.bind(this));
	}
}

module.exports = Physics;