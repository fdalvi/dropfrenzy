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

var ledge = new Ledge(0,100,200);
ledges.push(ledge);
ledge = new Ledge(200,165,200);
ledges.push(ledge);
ledge = new Ledge(0,220,250);
ledges.push(ledge);
ledge = new Ledge(300,220,200);
ledges.push(ledge);
ledge = new Ledge(100,280,200);
ledges.push(ledge);


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
	//Updating player position
	if (keydown.left) {
		player.x -= 5;
	}

	if (keydown.right) {
		player.x += 5;
	}

	if (player.canFall) {
		player.y += 5;
	}

	// Checking for boundaries
	if(player.x > bounds.hMax) {
		player.x = bounds.hMax;
	} else if(player.x < bounds.hMin) {
		player.x = bounds.hMin;
	}
	if(player.y > bounds.vMax) {
		player.y = 0;
	}
}