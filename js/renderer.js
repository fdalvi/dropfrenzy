var keys = [];
var FPS = 60;
var messageY = 620;
var endAnimationFinished;
var gamePaused;

window.onload = function() {
	$("#gameBoard").hide();
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
function startGame(multiplayerGame) {
	$("#startSelection").hide();
	$("#restartSelection").hide();
	$("#gameBoard").show();
	// Initialize Game
	initGame(multiplayerGame); 

	// Event Listeners for keys to avoid page scrolling
	window.addEventListener('keydown',handleKeyDown,true); 
	window.addEventListener('keyup',handleKeyUp,true);
	
	// Run game loop
	animate();
}

function initGame(multiplayerGame){
	messageY = 620;
	keys = [];
	gameEnded = false;
	gamePaused = false;
	score = 0;
	endAnimationFinished = false;

	initPhysics(multiplayerGame);
}


window.requestAnimFrame = (function(callback) {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
	function(callback) {
		window.setTimeout(callback, 1000 / FPS);
	};
})();

function animate() {
	if(!(gameEnded && noLedgesLeft() && endAnimationFinished)) {
		if(!gamePaused) {
			requestAnimFrame(function() {
				animate();
			});

		}
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
	{
		player.draw();
		//console.log("remote player x " + remotePlayers[0].x);
		if(isMultiplayerGame) {
			clientPlayer.x = remotePlayers[0].x;
			clientPlayer.y = remotePlayers[0].y;
			clientPlayer.draw();
		}
		//Player.prototype.draw.call(remotePlayers[0]);
	}
	//console.log(ledges.length);
	ledges.forEach(function(currentLedge) {
		currentLedge.draw();
	});
	if(isClient)
		ledges = hostLedges;
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