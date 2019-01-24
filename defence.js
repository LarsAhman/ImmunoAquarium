function Defence() {

this.id = nextDefenceId++;
this.health = 600;
//
//

this.pos = rndVectorWithinCircle();
this.r = 25;


Defence.prototype.show = function() {
	fill(0, 200, 120, 160);
	stroke(255);
	rectMode(CENTER);
	rect(this.pos.x, this.pos.y, this.r*2, this.r*2, 20);
	fill(0,0,0,255);
	noStroke();
	textSize(7);
	text(round(this.health)+"", this.pos.x-4, this.pos.y+2);
}

 Defence.prototype.update = function() {
 	this.checkHealth();
 }

 Defence.prototype.checkHealth = function() {
 	for (var i = 0; i < intruders.length; i++) {
 		var intr = intruders[i];
 		if (this.pos.dist(intr.pos) < this.r + intr.limbWidth) {
 		  this.health = this.health - intr.dpf;
 		}
 	}
 }

 Defence.prototype.death = function() {
 	for (var i = 0; i < intruders.length; i++) {
 		var intr = intruders[i];
 		if (this.pos.dist(intr.pos) <= intr.limbWidth + this.r) {
 			intr.healToFull();
 		}
 	}
 }
  
}