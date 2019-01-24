function Wbc(radius) {

this.r = radius;
this.maxHealth = ceil(map(this.r, 8, 20, 20, 45));
this.health = this.maxHealth;
this.id = nextWhiteCellId++;
this.pos = rndVectorWithinCircle();
this.target = createVector();
this.vel = createVector();
this.acc = createVector();
this.maxspeed = map(this.r, 8, 20, 1.01, 0.5);
this.dpf = map(this.r, 8, 20, 1, 2);
this.maxforce = 0.03;
this.framesAlive = 0;


Wbc.prototype.update = function() {
  this.pos.add(this.vel);
  this.vel.add(this.acc);
  this.acc.mult(0);
  this.checkCollisions();
  this.framesAlive++;
  if (this.framesAlive % 60 === 0) {
  	this.health--;
  }

  if (this.framesAlive % 300 === 0) {
    var chance = round(random(1,6));
    if (chance === 1) {
      this.reproduce();
    }
  }

}

Wbc.prototype.reproduce = function() {
  whiteCells.push(new Wbc(this.r));
}

Wbc.prototype.checkCollisions = function() {

  if (this.pos.dist(center)  >= width/2 - this.r) {
  		this.vel.add(p5.Vector.sub(center,this.pos).setMag(0.5));
  	}	


  for (var i = 0; i < whiteCells.length; i++) {
	var whiteCell = whiteCells[i];
	if (whiteCell.id === this.id) { continue; }
	if (this.pos.dist(whiteCell.pos) <= this.r+whiteCell.r) {
		this.vel.add(p5.Vector.sub(this.pos, whiteCell.pos).setMag(0.05));
	}

   }

}

Wbc.prototype.behaviors = function() {
  this.target = this.updateTarget();
  var seek = this.seek(this.target);
  this.applyForce(seek);
}

Wbc.prototype.updateTarget = function() {
  if (intruders.length < 1) { return center;}
  var closestTarget = intruders[0].pos;
  var shortestDistance = closestTarget.dist(this.pos);

  for (var i = 1; i < intruders.length; i++) {
  	var intruderPos = intruders[i].pos;
  	if (intruderPos.dist(this.pos) < shortestDistance) {
  		closestTarget = intruderPos;
  		shortestDistance = intruderPos.dist(this.pos);
  	}
    
  }
  
  return closestTarget;
  
}
  

Wbc.prototype.applyForce = function(f) {
	this.acc.add(f);
}

Wbc.prototype.seek = function(target) {
  var desired = p5.Vector.sub(target, this.pos);
  desired.setMag(this.maxspeed);
  var steer = p5.Vector.sub(desired, this.vel);
  steer.limit(this.maxforce);
  return steer;

}

Wbc.prototype.show = function() {
	var color = map(this.health, 0, this.maxHealth, 100, 255);
	fill(color, 170);
	noStroke();
	ellipse(this.pos.x, this.pos.y, this.r*2);
	fill(0,0,0,255);
	textSize(7);
	text(parseFloat(Math.round(this.r * 100) / 100).toFixed(1) +"\n" + this.health, this.pos.x-5, this.pos.y+2);

}

}

