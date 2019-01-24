function Intruder(radius, fleeRange) {

  this.limbWidth = radius;
  this.maxHealth = map(this.limbWidth, 5, 20, 160, 400);
  this.health = this.maxHealth;
  this.id = nextIntruderId++;
  this.pos = rndVectorWithinCircle();
  this.target = createVector();
  this.vel = createVector();
  this.acc = createVector();
  this.maxspeed = map(this.limbWidth, 5, 20, 1.3, 0.8);
  this.maxforce = 0.03;
  this.dpf = map(this.limbWidth, 5, 20, 0.5, 2)
  this.fleeRange = fleeRange;
  this.framesAlive = 0;

  Intruder.prototype.update = function() {
    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.acc.mult(0);
    this.checkCollisions();
    this.checkHealth();
    this.framesAlive++;

    if (this.framesAlive % 300 === 0) {
    	var chance = round(random(1,4));
    	if (chance === 1) {
    		this.reproduce();
    	}
    }
    
  }

  Intruder.prototype.reproduce = function() {
    intruders.push(new Intruder(this.limbWidth, this.fleeRange));
  }


  Intruder.prototype.checkCollisions = function() {

  	if (this.pos.dist(center)  >= width/2 - this.limbWidth) {
  		this.vel.add(p5.Vector.sub(center,this.pos).setMag(0.5));
  	}		

  }
  
  Intruder.prototype.checkHealth = function() {
  	for (var i = 0; i < whiteCells.length; i++) {
  		var whiteCell = whiteCells[i];
  		if (this.pos.dist(whiteCell.pos) < this.limbWidth+ whiteCell.r) {
  			this.health = this.health - whiteCell.dpf;
  		}
  	}

  }

  Intruder.prototype.behaviors = function() {
    this.target = this.updateTarget();
    var seek = this.seek(this.target);
    this.applyForce(seek);
  }

  Intruder.prototype.updateTarget = function() {
  	if (whiteCells.length < 1) { return center;}
    var closestTarget = whiteCells[0].pos;
    var shortestDistance = closestTarget.dist(this.pos);

    for (var i = 1; i < whiteCells.length; i++) {
    	var whiteCellPos = whiteCells[i].pos;
    	if (whiteCellPos.dist(this.pos) < shortestDistance) {
    		closestTarget = whiteCellPos;
    		shortestDistance = whiteCellPos.dist(this.pos);
    	} 
    }
    if (shortestDistance>this.fleeRange && defences.length > 0) { return this.findClosestDefence(); }
    var v  = p5.Vector.sub(this.pos, closestTarget);
    return v.add(this.pos);
  }

  Intruder.prototype.findClosestDefence = function() {

   var closestTarget = defences[0].pos;
   var shortestDistance = closestTarget.dist(this.pos);
    for (var i = 0; i < defences.length; i++) {
    	var defencePos = defences[i].pos;
    	var distance = defencePos.dist(this.pos);
    	if (distance < shortestDistance) {
    		closestTarget = defencePos;
    		shortestDistance = distance;
    	}
    }
    return closestTarget;

  }

  
  Intruder.prototype.applyForce = function(f) {
	this.acc.add(f);
  }

  Intruder.prototype.seek = function(target) {
    var desired = p5.Vector.sub(target, this.pos);
    desired.setMag(this.maxspeed);
    var steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxforce);
    return steer;

}

  Intruder.prototype.show = function() {
  	beginShape();
  	fill(map(this.health, 0, this.maxHealth, 150, 255), 0, 0, 200);
  	noStroke();
  	ellipse(this.pos.x, this.pos.y-this.limbWidth/3, this.limbWidth/2, this.limbWidth);
  	ellipse(this.pos.x, this.pos.y+this.limbWidth/3, this.limbWidth/2, this.limbWidth);
  	ellipse(this.pos.x-this.limbWidth/3, this.pos.y, this.limbWidth, this.limbWidth/2);
  	ellipse(this.pos.x+this.limbWidth/3, this.pos.y, this.limbWidth, this.limbWidth/2);
  	fill(0,0,0,255);
  	text(parseFloat(Math.round(this.fleeRange * 100) / 100).toFixed(1), this.pos.x-5, this.pos.y+2);
  	endShape();
  }

  Intruder.prototype.healToFull = function() {
  	this.health = this.maxHealth;
  }

}