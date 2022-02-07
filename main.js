var fpsMax = 60;

var pause = true;

var buttonPlay;
var buttonClear;

var planets = [];

var timeVel = 1;
var pixelScale = 1/1000; // 1000 km is 1 pixel
var gravitation = 6.67408 * (10**(-11));
console.log(gravitation);

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
		// s = so + vt
		this.x += this.velocity.x*pixelScale*timeVel*deltaTime/1000000;
		this.y += this.velocity.y*pixelScale*timeVel*deltaTime/1000000;
		
		for(let planet of planets) {
			if(planet != this) {
				// check if planets colide
				this.checkColision(planet);
			}
		}
	}

	accelerate(vel) {
		this.velocity.add(vel/3.6);
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
				// universal gravitation
				// F = GMm/d2
				// a = GM/d2
				// Units:
				// F => N
				// M => Kg
				// d => m
				// a => m/s2
				let mass = planet.mass;
				let distance_vet = createVector(planet.x, planet.y).sub(createVector(this.x, this.y));
				let distance = distance_vet.mag(); //distance value come in pixels
				let distanceMeters = distance*(1/pixelScale)*1000;

				// acceleration => m/s2
				let acceleration = gravitation * mass / (distanceMeters*distanceMeters);

				// transforming it in a vector
				let acceleration_vet = distance_vet.normalize().setMag(acceleration);
				res.add(acceleration_vet);
			}
		}
		// v = v0 + at
		let velocityToAdd = res.mult(timeVel*(deltaTime/1000));
		// should be m/s
		this.velocity.add(velocityToAdd);
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
	let moonHeight = 0;
	planets.push(new Planet(width/2, -70 + height/2, 6.5, (5*10**24)));
	planets.push(new Planet(width/2, 70 + height/2, 6.5, (5*10**24)));
	planets.push(new Planet(width/2, moonHeight + height/2, 1.75, (7.36*10**22)));

	background(0);
	for(let planet of planets) {
		planet.draw();
	}
	//planets[0].velocity.add(0,-1);
	//planets[1].velocity.add(0,1);
	planets[1].accelerate(3670,0);
	timeVel = 60000;

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
