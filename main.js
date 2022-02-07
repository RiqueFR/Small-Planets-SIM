var fpsMax = 60;

var pause = true;

var buttonPlay;
var buttonClear;

var planets = [];

class Planet {
	constructor(center_x, center_y, radius, colour = 255) {
		this.x = center_x;
		this.y = center_y;
		this.radius = radius;
		this.colour = colour;
		this.velocity = createVector(0, 0);
	}

	draw() {
		fill(this.colour);
		circle(this.x, this.y, this.radius);
	}

	move() {
		this.x += this.velocity.x;
		this.y += this.velocity.y;
	}
}


function setup() {
	createCanvas(800, 600);
	background(0);

	frameRate(fpsMax);

	buttonPlay = createButton("Play");
	buttonPlay.mousePressed(handlePlay);
	buttonClear = createButton("Clear");
	buttonClear.mousePressed(clearPlanets);

	planets.push(new Planet(50, 50, 30));
	planets.push(new Planet(140, 30, 20));
	planets.push(new Planet(400, 500, 100));
	planets.push(new Planet(280, 20, 60));
}

function handlePlay() {
	pause = !pause;
	let text;
	if(pause) text = "Play";
	else text = "Pause";
	buttonPlay.html(text);
}

function clearPlanets() {
	for(let i = 0; i < planets.length; i++) {
		delete planets[i];
	}
	planets = [];
}

function draw() {
	// all initial draw should go here
	background(0);
	for(let planet of planets) {
		planet.draw();
	}
	
	if(pause == true) return; // when game paused don't render

	// all the logics should go here
	for(let planet of planets) {
		planet.move();
	}
}
