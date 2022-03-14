import VirtualJoystickPlugin from '/phaser3-rex-plugins/plugins/virtualjoystick-plugin.js';

var config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT ,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: game,
        width: 800,
        height: 600,
    },
    plugins: {
        global: [{
            key: 'rexVirtualJoystick',
            plugin: VirtualJoystickPlugin,
            start: true
        },
         ]
    },
    scene: {
        create: create,
        update: update
    }
};

const socket = io();

/**
 * récupération des paramètres permettant de créer l'utilisateur
 */
 const nom = localStorage.getItem('name');

 const params = new URLSearchParams(window.location.search)
 const room = params.get('room');
 
 /**
  * connexion de l'utilisateur à la salle
  */
 socket.emit("login", nom, room);
 
 /**
  *initialisation du nombre de joueurs présent dans la salle
  */
 socket.on("userNumber", (number) => {
     $("#userNumberChat").text(number);
 });
 socket.emit("userNumber", room);
 
 /**
  * connexion  aprouvée
  */
 socket.on("login", () => {

    socket.on("start", () => {
        $("#waitMessage").addClass("d-none");
        $("#game").removeClass("d-none");
        var gamePlayer = new Phaser.Game(config);
        
    });

    socket.on("getOut",(destination) => window.location.href = destination);

 });

var cursors;
var score = 0;
var scoreText;
var gameOver = false;


function create ()
{


    //cursors = this.input.keyboard.createCursorKeys();

    var joystick = this.plugins.get('rexVirtualJoystick').add(this, {
        x: 400,
        y: 300,
        radius: 100,
        // dir: '8dir',
        // forceMin: 16,
        // fixed: true,
        // enable: true
    });

    cursors = joystick.createCursorKeys();


     //  The score
     scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#FFFF' });

     socket.on("majScore", (newScore) => {
                //  Add and update the score
        score = newScore;
        scoreText.setText('Score: ' + score);
     });

     socket.on("majGameOver", () => gameOver = true);  


}





var movementX ;
var movementY;

function update ()
{
  
    var leftKeyDown = cursors.left.isDown;
    var rightKeyDown = cursors.right.isDown;
    var upKeyDown = cursors.up.isDown;
    
    if (gameOver)
    {
        return;
    }

  

    if (upKeyDown)
    {
        movementY = "up";
    }
    else {
        movementY = "none";
    }


    if (leftKeyDown)
    {
        movementX = "left";

    }
    else if (rightKeyDown)
    { 
        movementX = "right";

    }
    else if(movementX === "turn"){
       return;
    }
    else{
        movementX = "turn";
    }

    console.log("update mouvement")
    socket.emit('playerMovement', { x: movementX, y: movementY});
    



    /*
    if (cursors.up.isDown)
    {
        movementY = "up";
    }
    else movementY = "none";

    if (cursors.left.isDown)
    {
        movementX = "left";

    }
    else if (cursors.right.isDown)
    { 
        movementX = "right";

    }
    else{
        movementX = "turn";
    }*/

    //console.log("update mouvement")
    //socket.emit('playerMovement', { x: movementX, y: movementY}); 

}

