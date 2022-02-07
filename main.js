var fpsMax = 60;

var pause = true;

var buttonPlay;
var buttonClear;

var planets = [];

var timeVel = 1;
var pixelScale = 0.5*0.001; // 1 km is 0.5 pixel
var kms = 1.0/3600;
var acceleration_scale = 0.5*(10**(-10));
var gravitation = 6.67408 * (10**(-11));
console.log(gravitation, acceleration_scale);

class Planet {
	constructor(center_x, center_y, radius, mass, colour = 255) {
		this.x = center_x;
		this.y = center_y;
		this.radius = radius;
		this.mass = mass;
		this.colour = colour;
		this.velocity = createVector(0, 0);
	}

	draw() {
		fill(this.colour);
		circle(this.x, this.y, this.radius*2);
	}

	move() {
		this.x += this.velocity.x*pixelScale*timeVel*deltaTime/1000;
		this.y += this.velocity.y*pixelScale*timeVel*deltaTime/1000;
		
		for(let planet of planets) {
			if(planet != this) {
				// check if planets colide
				this.checkColision(planet);
			}
		}
	}

	checkColision(planet) {
		let x = this.x - planet.x;
		let y = this.y - planet.y;
		let radius = this.radius + planet.radius;
		if( ((x*x) + (y*y)) <= (radius*radius)) {
			let dist = ((x*x)+(y*y))**0.5;
			let overlap = 0.5 * (dist - this.radius - planet.radius);
			this.x -= overlap * (this.x - planet.x) / dist;
			this.y -= overlap * (this.y - planet.y) / dist;

			planet.x += overlap * (this.x - planet.x) / dist;
			planet.y += overlap * (this.y - planet.y) / dist;
		}
	}

	update() {
		let res = createVector(0, 0);
		for(let planet of planets) {
			if(planet != this) {
				let mass = planet.mass;
				let distance_vet = createVector(planet.x, planet.y).sub(createVector(this.x, this.y));
				let distance = distance_vet.mag();
				//console.log(distance);
				let acceleration = gravitation * mass / ((distance*distance) * 1000000);
				//console.log(acceleration);
				let acceleration_vet = distance_vet.normalize().setMag(acceleration*timeVel*pixelScale*deltaTime/1000000);
				//console.log(acceleration_vet);
				res.add(acceleration_vet);
			}
		}
		//console.log(res);
		this.velocity.add(res);
	}
}


function setup() {
	createCanvas(1024, 720);
	background(0);

	frameRate(fpsMax);

	buttonPlay = createButton("Play");
	buttonPlay.mousePressed(handlePlay);
	buttonClear = createButton("Clear");
	buttonClear.mousePressed(clearPlanets);

	//planets.push(new Planet(100, 100, 30, (5*10**24)));
	//planets.push(new Planet(500, 500, 20, (5*10**24)));
	//planets.push(new Planet(500, 0, 100, (5*10**24)));
	//planets.push(new Planet(400, 200, 60, (5*10**24)));
	planets.push(new Planet(width/2, height/2, 6.5, (5*10**24)));
	planets.push(new Planet(width/2, 200 + height/2, 1.75, (7.36*10**22)));

	background(0);
	for(let planet of planets) {
		planet.draw();
	}
	//planets[0].velocity.add(0,-1);
	//planets[1].velocity.add(0,1);
	planets[1].velocity.add(1,0);
	timeVel = 5000;

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
		// only render planets if they are visible
		if(planet.x+planet.radius >= 0 && planet.x-planet.radius <= width &&
		   planet.y+planet.radius >= 0 && planet.y-planet.radius <= height)
			planet.draw();
	}
	
	if(pause == true) return; // when game paused don't render

	// all the logics should go here
	for(let planet of planets) {
		planet.move();
	}
	
	for(let planet of planets) {
		planet.update();
	}
}
