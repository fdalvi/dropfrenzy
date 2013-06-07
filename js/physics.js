var player = {
	color: "#00A",
	x: 10,
	y: 20,
	radius: 10,
	canFall: true,
	draw: function(context) {
		context.fillStyle = this.color;
		context.beginPath();
		context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
		context.fillStyle = 'green';
		context.fill();
		context.lineWidth = 2;
		context.strokeStyle = '#003300';
		context.stroke();
	}
};

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