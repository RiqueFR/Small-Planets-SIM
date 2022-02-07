//import * as p5 from "./p5.js"
var fpsMax = 60;

var pause = true;

var buttonPlay;
var buttonClear;

function setup() {
	createCanvas(800, 600);
	background(0);

	frameRate(fpsMax);

	buttonPlay = createButton("Play");
	buttonPlay.mousePressed(handlePlay);
	buttonClear = createButton("Clear");
	buttonClear.mousePressed(clearGrid);
}

function handlePlay() {
	pause = !pause;
	let text;
	if(pause) text = "Play";
	else text = "Pause";
	buttonPlay.html(text);
}

function clearGrid() {
}

function draw() {
	if(pause == true) return; // when game paused don't render
}
