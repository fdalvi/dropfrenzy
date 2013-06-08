var gameSpeed = 2;
var playerSpeed = 5;
var lowestLedge = -1; // No Ledge

// Creating class for Player
function Player (color) {
	this.color = color;
	this.x = 10;
	this.y =  20;
	this.radius = 10;
	this.canFall = true;
	this.draw = function() {
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
		ctx.fillStyle = 'green';
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
		ctx.fillStyle = this.color;;
		ctx.fillRect(this.x, this.y, this.width, this.height);
	};
	this.collides = function(somePlayer) {
		// Check if the player(somePlayer) is ON the ledge
		return this.x <= somePlayer.x + somePlayer.radius &&
		this.x + this.width >= somePlayer.x &&
		this.y <= somePlayer.y + somePlayer.radius &&
		this.y + this.height >= somePlayer.y + somePlayer.radius;
	}
}

// Create collection to hold all ledges on screen
var ledges = [];

// Create collection to hold all players on screen
var players = [];
var player = new Player("#00A");
players.push(player);

var bounds = {
	hMax: canvasWidth-player.radius,
	hMin: player.radius,
	vMax: canvasHeight-player.radius,
	vMin: player.radius
};


function handleCollisions()
{
	var continueCheckCollisions = true;
	ledges.forEach(function(currentLedge) {
		if(continueCheckCollisions) {
			if (currentLedge.collides(player)) {
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
}

function updateElements()
{
	var ledgesOnScreen = [];
	// Add new Ledges and remove ledges outside the board. Also, update their positions
	if(lowestLedge < 540)
	{
		lowestLedge = 600;
		switch(Math.floor(Math.random()*4))
		{
			case 0:
			// Gap on right
			var ledge = new Ledge(0,600,200);
			ledges.push(ledge);
			break;
			case 1:
			// Gap in between
			ledge = new Ledge(0,600,250);
			ledges.push(ledge);
			ledge = new Ledge(300,600,200);
			ledges.push(ledge);
			break;
			case 2:
			// Gap on left
			ledge = new Ledge(200,600,200);
			ledges.push(ledge);
			break;
			case 3:
			// Gap on both sides
			ledge = new Ledge(100,600,200);
			ledges.push(ledge);
			break;
			default:
		}
	}

	lowestLedge -= gameSpeed;
	ledges.forEach(function(currentLedge) {
		currentLedge.y -= gameSpeed;
		if(currentLedge.y > -20) {
			ledgesOnScreen.push(currentLedge);
		}
	});

	ledges = [];
	ledges = ledgesOnScreen.slice();
	ledgesOnScreen = [];

	//Updating player position
	if (keydown.left) {
		player.x -= playerSpeed;
	}

	if (keydown.right) {
		player.x += playerSpeed;
	}

	if (player.canFall) {
		player.y += playerSpeed;
	} else {
		player.y -= gameSpeed;
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
}