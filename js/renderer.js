var keys = [];
var FPS = 60;
var messageY = 620;
var endAnimationFinished;

window.onload = function() {
	$("#gameBoard").hide();
	$("#restartSelection").hide();
}
function startGame() {
	$("#startSelection").hide();
	$("#restartSelection").hide();
	$("#gameBoard").show();
	// Initialize Game
	initGame(); 

	// Event Listeners for keys to avoid page scrolling
	window.addEventListener('keydown',handleKeyDown,true); 
	window.addEventListener('keyup',handleKeyUp,true);
	
	// Run game loop
	animate();
}

function initGame(){
	messageY = 620;
	keys = [];
	gameEnded = false;
	score = 0;
	endAnimationFinished = false;

	initPhysics();
}


window.requestAnimFrame = (function(callback) {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
	function(callback) {
		window.setTimeout(callback, 1000 / FPS);
	};
})();

function animate() {
	if(!(gameEnded && noLedgesLeft() && endAnimationFinished)) {
		requestAnimFrame(function() {
			animate();
		});
	} else { 
		$("#restartSelection").show();
	}
	

	
	updateElements();
	if(!gameEnded) {
		handleCollisions();
	}
	renderCanvas();
}

function renderCanvas()
{
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
	if(!gameEnded)
		player.draw();
	ledges.forEach(function(currentLedge) {
		currentLedge.draw();
	});
	drawScore();
	if(gameEnded)
		gameEnd();
}

function drawScore()
{
	ctx.font = 'bold 16px Exo';
	ctx.fillStyle = "black";
	ctx.fillText(score, 10, 20);
}

function gameEnd()
{
	ctx.font = 'bold 36px Exo';
	ctx.fillStyle = "black";
	if(messageY < 280) {
		ctx.fillText("The End!", 140, messageY);
		endAnimationFinished = true;
	}
	else {
		ctx.fillText("The End!", 140, messageY);
		messageY -= 2;
	}
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