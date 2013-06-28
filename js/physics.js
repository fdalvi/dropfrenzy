var lowestLedge;

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
				return ((somePlayer.y+somePlayer.radius < this.y) && ((somePlayer.y+somePlayer.radius+gameSpeed) > this.y));
			}

		} else {
			return false;
		}
	}
}

var bounds; 

function initPhysics() {
	gameSpeed = 2;
	gameFrame = 1;
 	lowestLedge = -1; // No Ledge
 	if(isMultiplayerGame) {
 		lowestLedge = 700;
 	}

	// Create collection to hold all ledges on screen
	ledges = [];

	// Create Local Player
	player = new Player(playerColor);

	// Create collection to hold all remote players on screen
	remotePlayers = [];
	if(isMultiplayerGame)
	{
		var newPlayer = new Player('yellow');
		remotePlayer = new Player('yellow');
		remotePlayers.push(newPlayer);
	}

	/* Define bounds */
	bounds = {
		hMax: canvasWidth-player.radius,
		hMin: player.radius,
		vMax: canvasHeight-player.radius,
		vMin: player.radius
	};

}

function handleCollisions()
{
	// Variable to stop collision detection is one is already detected
	var continueCheckCollisions = true;

	// Iterating through all the ledges 
	ledges.forEach(function(currentLedge) {
		if(continueCheckCollisions) {
			if(currentLedge.collides(player)) {
				// Setting player on the ledge 
				player.y = currentLedge.y - player.radius;
				
				// Player cannot fall anymore
				player.canFall=false;
				currentLedge.color = "#00A";

				// Do not check with the rest of the ledges
				continueCheckCollisions = false;
			} else {
				// Player no more in collision. Player can fall
				player.canFall=true;
				currentLedge.color = "#A00";
			}
		}
	});

	if(isMultiplayerGame) {
		var continueCheckCollisions = true;
		ledges.forEach(function(currentLedge) {
			if(continueCheckCollisions) {
				if(currentLedge.collides(remotePlayer)) {
					/* Setting player on the ledge */
					remotePlayer.y = currentLedge.y - remotePlayer.radius;

					// Player cannot fall anymore
					remotePlayer.canFall=false;
					currentLedge.color = "#00A";

					// Do not check with the rest of the ledges
					continueCheckCollisions = false;
				} else {
					// Player no more in collision. Player can fall
					remotePlayer.canFall=true;
					currentLedge.color = "#A00";
				}
			}
		});
	}
}

function updateElements()
{
	if(isHost) {
		gameSpeed = 2 + score/1000;
	}
		
	var ledgesOnScreen = [];

	// Update all ledges positions
	lowestLedge -= 2;
	ledges.forEach(function(currentLedge) {
		currentLedge.y -= gameSpeed * hostDeltaTime;

		// Discard ledges that are above the gameBoard
		if(currentLedge.y > -20) {
			ledgesOnScreen.push(currentLedge);
		}
	});

	// Update out main ledges array
	ledges = [];
	ledges = ledgesOnScreen.slice();
	ledgesOnScreen = [];


	// Add new Ledges if necessary. 
	if(!isMultiplayerGame || (isMultiplayerGame && isHost)) {
		if(lowestLedge < 540 && !gameEnded)
		{
			lowestLedge = 620;
			var newLedge;
			switch(Math.floor(Math.random()*4))
			{
				case 0:
				// Gap on right
				newLedge = new Ledge(0,620,200);
				ledges.push(newLedge);
				if(isMultiplayerGame) {
					ledgesToSync.push(newLedge);
				}
				break;
				case 1:
				// Gap in between
				newLedge = new Ledge(0,620,250);
				ledges.push(newLedge);
				if(isMultiplayerGame) {
					ledgesToSync.push(newLedge);
				}

				newLedge = new Ledge(300,620,200);
				ledges.push(newLedge);
				if(isMultiplayerGame) {
					ledgesToSync.push(newLedge);
				}
				break;
				case 2:
				// Gap on left
				newLedge = new Ledge(200,620,200);
				ledges.push(newLedge);
				if(isMultiplayerGame) {
					ledgesToSync.push(newLedge);
				}
				break;
				case 3:
				// Gap on both sides
				newLedge = new Ledge(100,620,200);
				ledges.push(newLedge);
				if(isMultiplayerGame) {
					ledgesToSync.push(newLedge);
				}
				break;
				default:
			}
		}
	} else {
		// Add new ledge only if host has added a new ledge
		var newLedge;
		lowestLedge = 620;
		if(ledgesToSync.length != 0) {
			ledgesToSync.forEach(function(ledgeFromHost) {
				newLedge = new Ledge(ledgeFromHost.x, ledgeFromHost.y, ledgeFromHost.width);
				ledges.push(newLedge);
			});
		}
		ledgesToSync = [];
	}

	// Update player position
	if(keydown.left) {
		player.x -= player.playerSpeed * hostDeltaTime;
	}

	if(keydown.right) {
		player.x += player.playerSpeed * hostDeltaTime;
	}

	if (player.canFall) {
		score += player.playerSpeed * hostDeltaTime | 0;
		player.y += player.playerSpeed * hostDeltaTime;
	} else {
		player.y -= gameSpeed * hostDeltaTime;
	}

	// Update remote player position
	if(isMultiplayerGame) {
		if(remotePlayer.canFall) {
			remotePlayer.y += remotePlayer.playerSpeed * clientDeltaTime;
		} else {
			remotePlayer.y -= gameSpeed * clientDeltaTime;
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
		if(isMultiplayerGame && !gameEnded) {
			endMessage = "You Lost!";	
		}
		gameEnded = true;
	}
	if(isMultiplayerGame) {
		if(remotePlayer.x > bounds.hMax) {
			remotePlayer.x = bounds.hMax;
		} else if(remotePlayer.x < bounds.hMin) {
			remotePlayer.x = bounds.hMin;
		}
		if(remotePlayer.y > bounds.vMax) {
			remotePlayer.y = bounds.vMax;
		}
		if(remotePlayer.y + remotePlayer.radius < 0) {
			gameEnded = true;
		}
	}

	gameFrame++;
}

function noLedgesLeft() {
	if(ledges.length == 0) {
		return true;
	} else {
		return false;
	}
}