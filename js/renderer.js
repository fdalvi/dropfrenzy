var ctx;
var canvasWidth;
var canvasHeight;
var keys = [];
var FPS = 30;

// HTML5 onLoad event
window.onload = function() {
	// Grabbing reference to Canvas
	var canvas = document.getElementById('game');

    ctx = canvas.getContext('2d');
	canvasWidth = parseInt(canvas.width);
	canvasHeight = parseInt(canvas.height);

	// Initialize Game
	initGame(); 

	// Event Listeners for keys to avoid page scrolling
	window.addEventListener('keydown',handleKeyDown,true); 
	window.addEventListener('keyup',handleKeyUp,true);
	


	// Run game loop
	animate();
}

function initGame(){
	
}


window.requestAnimFrame = (function(callback) {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
	function(callback) {
		window.setTimeout(callback, 1000 / FPS);
	};
})();

function animate() {
	requestAnimFrame(function() {
		animate();
	});

	handleCollisions();
	updateElements();
	renderCanvas();
}

function renderCanvas()
{
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
	player.draw(ctx);
}

//Keyboard Handling
function handleKeyDown(evt){
	keys[evt.keyCode] = true;
}
function handleKeyUp(evt){
	keys[evt.keyCode] = false;
}

// disable vertical scrolling from arrows :)
document.onkeydown=function(){return event.keyCode!=38 && event.keyCode!=40}