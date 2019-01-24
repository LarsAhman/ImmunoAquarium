var whiteCells = [];
var intruders = [];
var defences = [];
var nextWhiteCellId = 0;
var nextIntruderId = 0;
var nextDefenceId = 0;
var edge;
var center;
var edgeRadius;
var mutation = 0.02;

function setup() {
  var fps = 60;
  frameRate(fps);
  createCanvas(600, 600);

  center = createVector(0, 0);
  edgeRadius = width/2;

  var whiteCellNumber = 10;

  var intruderNumber = 10;

  var defenceNumber = 1;
  
  for (var i = 0; i < defenceNumber; i++) {
    defences.push(new Defence());
  }

  for (var i = 0; i < whiteCellNumber; i++) {
    whiteCells.push(new Wbc(random(8,20)));
  }
  for (var i = 0; i < intruderNumber; i++) {
    intruders.push(new Intruder(random(5,20), random(40,100)));
  }

}

function mousePressed() {
      

}

function draw() {

  translate(width/2, height/2);

  background(150,100,100);


  fill(80, 80, 80);
  noStroke();
  edge = ellipse(0, 0, width, height);
  for (var i = 0; i < defences.length; i++) {
    var d = defences[i];
    if (d.health <= 0) {
      d.death();
      defences.splice(i,1);
      defences.push(new Defence());
    }
    //d.behaviors();
    d.update();
    d.show();
  }


  for (var i = 0; i < whiteCells.length; i++) {
    var w = whiteCells[i];
    if (w.health <= 0) {
      whiteCells.splice(i,1);
    }
    w.behaviors();
    w.update();
    w.show();
  }

  for (var i = 0; i < intruders.length; i++) {
    var intr = intruders[i];
    intr.behaviors();
    if (intr.health <= 0) {
     intruders.splice(i,1); 
    }

    intr.update();
    intr.show();
  }


}

function rndVectorWithinCircle() {
  

  var x = random(-width/2,width/2);

  var y = random(-(sqrt(pow(edgeRadius,2) - pow(x,2))), sqrt(pow(edgeRadius,2) - pow(x,2)));

  return createVector(x, y);
}