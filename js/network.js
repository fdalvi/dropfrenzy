var channel;
var channelName;
function hostGame()
{
	channelName = $("#roomName").val();
	channel = new DataChannel(channelName,{
		autoCloseEntireSession: true,
		direction: 'one-to-one'
	});

	channel.onopen = function(userid) { 
		console.log(userid + " connected");
		startGame(true);
		setInterval(hostToClient,1000/60.0);
	}

	channel.onmessage = function(message, userid) { 
		//console.log("Message from " + userid + ": " + message.data + " " + message.counter);
		remotePlayers[0] = message.clientPlayer;
	}
}

function joinGame()
{
	isClient = true;
	channelName = $("#roomName").val();
	channel = new DataChannel();
	channel.connect(channelName);

	channel.onopen = function(userid) { 
		console.log(userid + " connected");
		startGame(true);
		setInterval(clientToHost,1000/60.0);
	}

	channel.onmessage = function(message, userid) { 
		//console.log("Message from " + userid + ": " + message.data + " " + message.counter);
		remotePlayers[0] = message.hostPlayer;

		hostLedges = [];

		message.ledges.forEach(function(currentLedge) {
			var newLedge = new Ledge(currentLedge.x, currentLedge.y, currentLedge.width);
			hostLedges.push(newLedge);
		});

		//ledges = hostLedges;

		//console.log("Remote player x " + remotePlayers[0].x);
	}
}

function hostToClient()
{
	//console.log("setInterval hit!");

	channel.send({hostPlayer:player, ledges:ledges});
}

function clientToHost()
{
	//console.log("setInterval hit!");

	channel.send({clientPlayer:player});
}