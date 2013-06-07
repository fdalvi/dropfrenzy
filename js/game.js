// some variables that we gonna use in this demo
var initId = 0;
var player = function(){
	this.object = null;
	this.canJump = false;
};
var world;
var ctx;
var canvasWidth;
var canvasHeight;
var keys = [];

// HTML5 onLoad event
Event.observe(window, 'load', function() {
	// Creating Box2DWorld
	world = createWorld();

	// Grabbing reference to 2D Canvas
	ctx = $('game').getContext('2d'); 
	var canvasElm = $('game');
	canvasWidth = parseInt(canvasElm.width);
	canvasHeight = parseInt(canvasElm.height);

	// Initialize Game
	initGame(); 

	// Event Listeners for keys to avoid page scrolling
	window.addEventListener('keydown',handleKeyDown,true); 
	window.addEventListener('keyup',handleKeyUp,true);

	// Run game loop
	animate();
});

function initGame(){
	// Create Map	
	createBox(world, 50, 50, 100, 10, true, 'ground');
	createBox(world, 550, 50, 100, 10, true, 'ground');
	createBox(world, 300, 100, 150, 10, true, 'ground');
	createBox(world, 300, 150, 150, 10, true, 'ground');
	createBox(world, 300, 200, 150, 10, true, 'ground');
	createBox(world, 300, 250, 150, 10, true, 'ground');

	
	// create player ball
	var ballSd = new b2CircleDef();
	ballSd.density = 0.1;
	ballSd.radius = 12;
	ballSd.restitution = 0.5;
	ballSd.friction = 1;
	ballSd.userData = 'player';
	var ballBd = new b2BodyDef();
	ballBd.linearDamping = .03;
	ballBd.allowSleep = false;
	ballBd.AddShape(ballSd);
	ballBd.position.Set(20,0);
	player.object = world.CreateBody(ballBd);
	
}

window.requestAnimFrame = (function(callback) {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
	function(callback) {
		window.setTimeout(callback, 1000 / 60);
	};
})();

var setupFps = function(){

	var lastTime = new Date();
	var hits = 0;
	var fps = "Waiting";
	var hit = function(){
		hits++;
		var nowTime = new Date();
		if (nowTime.getTime() - lastTime.getTime() > 1000){
			var dt = nowTime.getTime() - lastTime.getTime();
			fps = "" + Math.round(hits * 1000 / dt);
			hits = 0;
			lastTime = nowTime;
		}
		return fps;
	};
	return hit;
};


var hit = setupFps();



function animate() {
	requestAnimFrame(function() {
		animate();
	});
	if (player.object.GetCenterPosition().y > canvasHeight){
		player.object.SetCenterPosition(new b2Vec2(20,0),0)
	}	
	else if (player.object.GetCenterPosition().x > canvasWidth-50){
		showWin();
		return;	
	}

	handleInteractions();

	var stepping = false;
	var timeStep = 1.0/30;
	var iteration = 1;
	world.Step(timeStep, iteration);
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
	drawWorld(world, ctx);

	ctx.fillStyle    = '#000';
	ctx.font         = '30px verdana';
	ctx.textBaseline = 'top';
	ctx.fillText(hit(), 30, 100);
}

function showWin(){
	ctx.fillStyle    = '#000';
	ctx.font         = '30px verdana';
	ctx.textBaseline = 'top';
	ctx.fillText('Ye! you made it!', 30, 0);
	ctx.fillText('thank you, andersonferminiano.com', 30, 30);
	ctx.fillText('@andferminiano', 30, 60);	
}

function handleInteractions(){
	// up arrow
	// 1
	var collision = world.m_contactList;
	player.canJump = false;
	if (collision != null){
		if (collision.GetShape1().GetUserData() == 'player' || collision.GetShape2().GetUserData() == 'player'){
			if ((collision.GetShape1().GetUserData() == 'ground' || collision.GetShape2().GetUserData() == 'ground')){
				var playerObj = (collision.GetShape1().GetUserData() == 'player' ? collision.GetShape1().GetPosition() :  collision.GetShape2().GetPosition());
				var groundObj = (collision.GetShape1().GetUserData() == 'ground' ? collision.GetShape1().GetPosition() :  collision.GetShape2().GetPosition());
				if (playerObj.y < groundObj.y){
					player.canJump = true;
				}
			}
		}
	}
	// 2
	var vel = player.object.GetLinearVelocity();
	// 3
	if (keys[38] && player.canJump){
		vel.y = -150;	
	}
	
	// 4
	// left/right arrows
	if (keys[37]){
		vel.x = -60;
	}
	else if (keys[39]){
		vel.x = 60;
	}
	
	// 5
	player.object.SetLinearVelocity(vel);
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

