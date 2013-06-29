var keys = [];
var FPS = 60;
var messageY = 620;
var endAnimationFinished;
var gamePaused;
var prevFrameTime;
var currFrameTime;

window.onload = function() {
	//$("#gameBoard").hide();
	$("#restartSelection").hide();

	$(document).bind('keydown', 'space', function () {
		if(!gameEnded) {
			if(gamePaused) {
				gamePaused = false;
				animate();
			} else {
				gamePaused = true;
			}
		}

	});
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
	
	prevFrameTime = (new Date()).getTime();

	// Run game loop
	animate();
}

function initGame(){
	messageY = 620;
	keys = [];
	gameEnded = false;
	gamePaused = false;
	score = 0;
	endAnimationFinished = false;
	gameFrame = 0;

	initPhysics();
}


window.requestAnimFrame = (function(callback) {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
	function(callback) {
		window.setTimeout(callback, 1000 / FPS);
	};
})();

function animate() {
	gameFrame++;

	if(!(gameEnded && noLedgesLeft() && endAnimationFinished)) {
		if(!gamePaused) {
			requestAnimFrame(function() {
				animate();
			});
		}
	} else { 
		$("#restartSelection").show();
		addNewScore(score);
	}

	updateElements();
	if(!gameEnded) {
		handleCollisions();
	}
	renderCanvas();

	//Update FPS
	currFrameTime = (new Date()).getTime();
	currentFPS = ((1000/(currFrameTime - prevFrameTime)) | 0);
	hostDeltaTime = 60.0/currentFPS;
	prevFrameTime = currFrameTime;

}

function renderCanvas()
{
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
	if(!gameEnded)
	{
		player.draw();
		if(isMultiplayerGame) {
			remotePlayer.x = remotePlayers[0].x;
			remotePlayer.y = remotePlayers[0].y;
			remotePlayer.canFall = remotePlayers[0].canFall;
			remotePlayer.draw();
			
		}
	}
	ledges.forEach(function(currentLedge) {
		currentLedge.draw();
	});
	drawScore();
	drawFPS();
	if(gameEnded)
		gameEnd();
}

function drawScore()
{
	ctx.font = 'bold 16px Exo';
	ctx.textAlign = 'left';
	ctx.fillStyle = 'black';
	ctx.fillText(score, 10, 20);
}

function drawFPS()
{
	ctx.font = 'bold 16px Exo';
	ctx.textAlign = 'right';
	ctx.fillStyle = 'lightgray';
	ctx.fillText(currentFPS, 390, 20);
}

function gameEnd()
{
	ctx.font = 'bold 36px Exo';
	ctx.textAlign = 'center';
	ctx.fillStyle = 'black';
	if(messageY < 280) {
		ctx.fillText("The End!", 200, messageY);
		if(isMultiplayerGame) {
			ctx.fillText(endMessage, 200, messageY + 45);
		}
		endAnimationFinished = true;
	}
	else {
		ctx.fillText("The End!", 200, messageY);
		if(isMultiplayerGame) {
			ctx.fillText(endMessage, 200, messageY + 45);
		}
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