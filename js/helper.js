/* Helper file to define all variables that need to be available to several modules */

/* Canvas stuff */
var ctx;
var canvasWidth;
var canvasHeight;

/* Game flow controllers */
var gameEnded = false;
var isMultiplayerGame = false;
var gameSpeed;
var gameFrame;
var currentFPS = 60;
var hostDeltaTime = 1.0;

/* Internal objects */
var ledges = [];
var player;
var playerColor = 'green';

/* Multiplayer related objects */
var remotePlayers = [];
var ledgesToSync = [];
var isHost = true;
var remotePlayer;
var endMessage = "";
var clientDeltaTime = 1.0;

/* Player Information */
var score = 0;