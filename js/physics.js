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
    this.x = type;
    this.y = y;
    this.height = 10;
    this.width = length;
    this.draw = function() {
    	ctx.fillStyle = this.color;
    	ctx.fillRect(this.x, this.y, this.width, this.height);
    };
}

var objects = [];
var player = new Player("#00A");

var bounds = {
	max: canvasWidth-player.radius,
	min: player.radius
};

function handleCollisions()
{

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
	if(player.x > bounds.max) {
		player.x = bounds.max;
	} else if(player.x < bounds.min) {
		player.x = bounds.min;
	}
	if(player.y > canvasHeight-player.radius) {
		player.y = 0;
	}
}