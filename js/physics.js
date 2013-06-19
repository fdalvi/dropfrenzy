var gameSpeed;
var lowestLedge;
//var gameEnded = false;

// Creating class for Player
function Player (color) {
	this.color = color;
	this.x = 10;
	this.y =  20;
	this.radius = 10;
	this.canFall = true;
	this.playerSpeed = 5;
	this.draw = function() {
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
		ctx.fillStyle = color;
		ctx.fill();
		ctx.lineWidth = 2;
		ctx.strokeStyle = '#003300';
		ctx.stroke();
	};
}

// Creating class for Ledge
function Ledge (x,y,length) {
	this.x = x;
	this.y = y;
	this.height = 10;
	this.width = length;
	this.color = "#A00";
	this.draw = function() {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
	};
	this.collides = function(somePlayer) {
		// Check if the player(somePlayer) is ON the ledge
		if(this.x <= somePlayer.x + somePlayer.radius && this.x + this.width >= somePlayer.x )	{
			if(this.y <= somePlayer.y + somePlayer.radius && this.y + this.height >= somePlayer.y + somePlayer.radius) {
				return true;
			} else {
				return ((somePlayer.y+somePlayer.radius < this.y) && ((somePlayer.y+somePlayer.radius+gameSpeed+score/1000) > this.y));
			}

		} else {
			return false;
		}
	}
}



// Create collection to hold all ledges on screen
//var ledges = [];

// Create collection to hold all players on screen

//var player;
//players.push(player);

var bounds; 

function initPhysics(multiplayerGame) {
	gameSpeed = 2;
 	lowestLedge = -1; // No Ledge

	// Create collection to hold all ledges on screen
	ledges = [];

	// Create collection to hold all remote players on screen
	remotePlayers = [];
	player = new Player('green');
	if(multiplayerGame)
	{
		isMultiplayerGame = true;
		var newPlayer = new Player('yellow');
		console.log("physics " + typeof(remotePlayers));
		clientPlayer = new Player('yellow');
		remotePlayers.push(newPlayer);

	} else {
		isMultiplayerGame = false;
	}
	//players.push(player);
	bounds = {
		hMax: canvasWidth-player.radius,
		hMin: player.radius,
		vMax: canvasHeight-player.radius,
		vMin: player.radius
	};

}

function handleCollisions()
{
	var continueCheckCollisions = true;
	ledges.forEach(function(currentLedge) {
		if(continueCheckCollisions) {
			if(currentLedge.collides(player)) {
				player.y = currentLedge.y - player.radius;
				currentLedge.color = "#00A";
				player.canFall=false;

				// Do not check with the rest of the ledges
				continueCheckCollisions = false;
			} else {
				player.canFall=true;
				currentLedge.color = "#A00";
			}
		}
	});

	if(isMultiplayerGame) {
		var continueCheckCollisions = true;
		ledges.forEach(function(currentLedge) {
			if(continueCheckCollisions) {
				if(currentLedge.collides(clientPlayer)) {
					clientPlayer.y = currentLedge.y - clientPlayer.radius;
					currentLedge.color = "#00A";
					clientPlayer.canFall=false;

					// Do not check with the rest of the ledges
					continueCheckCollisions = false;
				} else {
					clientPlayer.canFall=true;
					currentLedge.color = "#A00";
				}
			}
		});
	}
}

function updateElements()
{
	var ledgesOnScreen = [];

	// Update all ledges positions
	lowestLedge -= gameSpeed;
	ledges.forEach(function(currentLedge) {
		currentLedge.y -= gameSpeed + score/1000;
		if(currentLedge.y > -20) {
			ledgesOnScreen.push(currentLedge);
		}
	});

	ledges = [];
	ledges = ledgesOnScreen.slice();
	ledgesOnScreen = [];


	// Add new Ledges and remove ledges outside the board. Also, update their positions
	if(lowestLedge < 540 && !gameEnded)
	{
		lowestLedge = 620;
		switch(Math.floor(Math.random()*4))
		{
			case 0:
			// Gap on right
			var ledge = new Ledge(0,620,200);
			ledges.push(ledge);
			break;
			case 1:
			// Gap in between
			ledge = new Ledge(0,620,250);
			ledges.push(ledge);
			ledge = new Ledge(300,620,200);
			ledges.push(ledge);
			break;
			case 2:
			// Gap on left
			ledge = new Ledge(200,620,200);
			ledges.push(ledge);
			break;
			case 3:
			// Gap on both sides
			ledge = new Ledge(100,620,200);
			ledges.push(ledge);
			break;
			default:
		}
	}

	//Updating player position
	if(keydown.left) {
		player.x -= player.playerSpeed;
	}

	if(keydown.right) {
		player.x += player.playerSpeed;
	}

	if (player.canFall) {
		score += player.playerSpeed;
		player.y += player.playerSpeed;
	} else {
		player.y -= gameSpeed + score/1000;
	}

	if(isMultiplayerGame) {
		if(clientPlayer.canFall) {
			clientPlayer.y += clientPlayer.playerSpeed;
		} else {
			clientPlayer.y -= gameSpeed + score/1000;
		}

	}

	// Checking for boundaries
	if(player.x > bounds.hMax) {
		player.x = bounds.hMax;
	} else if(player.x < bounds.hMin) {
		player.x = bounds.hMin;
	}
	if(player.y > bounds.vMax) {
		player.y = bounds.vMax;
	}
	if(player.y + player.radius < 0) {
		gameEnded = true;
	}
}

function noLedgesLeft() {
	if(ledges.length == 0) {
		return true;
	} else {
		return false;
	}
}