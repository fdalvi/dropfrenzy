var channel;
var channelName;
function hostGame()
{
	isHost = true;
	channelName = $("#roomName").val();
	channel = new DataChannel(channelName,{
		autoCloseEntireSession: true,
		direction: 'one-to-one'
	});

	channel.onopen = function(userid) { 
		console.log(userid + " connected");
		isMultiplayerGame = true;
		startGame();
		setInterval(hostToClient,1000/60.0);
	}

	channel.onmessage = function(message, userid) { 
		//console.log("Message from " + userid + ": " + message.data + " " + message.counter);
		remotePlayers[0] = message.clientPlayer;

		var frameAdjust = gameFrame - message.clientFrame;
		/*if(remotePlayers[0].canFall) {
			remotePlayers[0].y += gameSpeed*(frameAdjust);
		} else {
			remotePlayers[0].y -= gameSpeed*(frameAdjust);
		}*/

		if(message.gameEnded) {
			if(!gameEnded) {
				endMessage = "You Won!";
			}
			gameEnded = true;
		}
		
	}

}

function joinGame()
{
	isHost = false;
	channelName = $("#roomName").val();
	channel = new DataChannel();
	channel.connect(channelName);

	channel.onopen = function(userid) { 
		console.log(userid + " connected");
		isMultiplayerGame = true;
		startGame();
		setInterval(clientToHost,1000/60.0);
	}

	channel.onmessage = function(message, userid) { 
		//console.log("Message from " + userid + ": " + message.data + " " + message.counter);
		remotePlayers[0] = message.hostPlayer;
		gameSpeed = message.gameSpeed;

		ledgesToSync = message.newLedges;

		var frameAdjust = gameFrame - message.hostFrame;
		/*if(remotePlayers[0].canFall) {
			remotePlayers[0].y += gameSpeed*(frameAdjust);
		} else {
			remotePlayers[0].y -= gameSpeed*(frameAdjust);
		}*/
		
		ledgesToSync.forEach(function(currentLedge) {
			currentLedge.y -= gameSpeed*(frameAdjust);
		});

		gameSpeed = message.gameSpeed;

		if(message.gameEnded) {
			if(!gameEnded) {
				endMessage = "You Won!";
			}
			gameEnded = true;
		}
	}
}

function hostToClient()
{
	channel.send({hostPlayer:player, newLedges:ledgesToSync, gameSpeed:gameSpeed, hostFrame:gameFrame, gameEnded: gameEnded});
	if(ledgesToSync.length != 0)
		ledgesToSync = [];
}

function clientToHost()
{
	channel.send({clientPlayer:player, clientFrame:gameFrame, gameEnded: gameEnded});
}