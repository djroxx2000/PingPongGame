//HTML Elements 
const userScore_span = document.getElementById("user-score");
const cpuScore_span = document.getElementById("comp-score");
const easy_div = document.getElementById('easy');
const hard_div = document.getElementById('hard');
const extreme_div = document.getElementById('extreme');
const impossible_div = document.getElementById('impossible'); 
const startMenu_div = document.getElementById('choices');
const gameCanvas_div = document.getElementById('gameCanvas');
const scoreBoard_div = document.getElementById('scoreBoard');
const actionMessage_p = document.getElementById('action-message');
//Canvas Element
var canvas;
var canvasContext;
//Ball Specs
var ballX = 450;
var ballY = 250;
var ballRadius = 8;
var ballSpeedX ;
var ballSpeedY ;
//Paddle Specs
const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 10;
const playerPaddleX = 10;
const cpuPaddleX = 880;
var playerPaddleY = 250;
var cpuPaddleY = 250;
//Scoring
var playerPoints = 0;
var cpuPoints = 0;
//Misc Specs
var framesPerSecond=30;
var cpuSpeed;
const WIN = 5;
var specialMove;
//Game Status
var gameEnd = false;
var gameStart = true;

//Extract mouse position data
function calcMousePos(event) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = event.clientX - rect.left - root.scrollLeft;
    var mouseY = event.clientY - rect.top - root.scrollTop;
    return {
        x: mouseX,
        y: mouseY
    }
}

//Events after mouse click at end of the game
function handleMouseClick(event) {
    if (gameEnd) {
        startMenu_div.style.display = 'block';
        gameCanvas_div.style.display = 'none';
        actionMessage_p.style.display = 'none';
        scoreBoard_div.style.display = 'none';
        playerPoints = 0;
        cpuPoints = 0;
        userScore_span.innerHTML='0';
        cpuScore_span.innerHTML='0';
        gameEnd = false;
        gameStart= true;
        main();
    }

}

//When any player scores, bring ball to centre
function ballReset() {
    if (playerPoints >= WIN || cpuPoints >= WIN) {
        gameEnd = true;
    }
    ballSpeedX = -ballSpeedX;
    ballSpeedY = -ballSpeedY;
    ballX = canvas.width / 2;
    ballY = (playerPaddleY + cpuPaddleY) / 2;
}

//Draw Circular Ball
function colorCircle(posX, posY, radius, color) {
    canvasContext.fillStyle = color;
    canvasContext.beginPath(); //start drawing a new element
    canvasContext.arc(posX, posY, radius, 0, Math.PI * 2, true); //Defining the element(X,Y,Radius,start angle,end angle,anticlockwise?:boolean)
    canvasContext.fill();//Output the defined element 
}
//Draw Rectangles
function colorRectangle(posX, posY, width, height, color) {
    canvasContext.fillStyle = color;
    canvasContext.fillRect(posX, posY, width, height);
}

//CPU Movement Specs
function cpuMovement() {
    if (cpuPaddleY + (PADDLE_HEIGHT / 2) - ballSpeedY - 10 > ballY) {
        cpuPaddleY -= cpuSpeed;
    }
    else if (cpuPaddleY + (PADDLE_HEIGHT / 2) + ballSpeedY + 10 < ballY) {
        cpuPaddleY += cpuSpeed;
    }

}

//Start movement of all movable components
function moveEverything() {
    if (gameEnd || gameStart){
        return;
    }
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    //Ball movement cpu side
    if (ballX > cpuPaddleX - ballSpeedX) {
        if (ballX < cpuPaddleX) {
            if (ballY > cpuPaddleY && ballY < cpuPaddleY + PADDLE_HEIGHT) {
                ballSpeedX = -ballSpeedX;
                specialMove = ballY - (cpuPaddleY + PADDLE_HEIGHT / 2);
                ballSpeedY = specialMove * 0.3;
            }
        }
        else {
            if (ballX > canvas.width) {
                playerPoints += 1;
                userScore_span.innerHTML = playerPoints;
                ballReset();
            }
        }
    }
    //Ball movement player side
    if (ballX < playerPaddleX + PADDLE_WIDTH - ballSpeedX) {
        if (ballX > playerPaddleX + PADDLE_WIDTH) {
            if (ballY > playerPaddleY && ballY < playerPaddleY + PADDLE_HEIGHT) {
                ballSpeedX = -ballSpeedX;
                specialMove = ballY - (playerPaddleY + PADDLE_HEIGHT / 2);
                ballSpeedY = specialMove * 0.3;

            }
            else if (ballY > playerPaddleY && ballY < playerPaddleY + PADDLE_HEIGHT) {
                ballSpeedX = -ballSpeedX;
                ballSpeedY = -ballSpeedY;
            }
        }
        else {
            if (ballX < 0) {
                cpuPoints += 1;
                cpuScore_span.innerHTML = cpuPoints;
                ballReset();
            }
        }
    }

    if (ballY > canvas.height - ballSpeedY) {
        ballSpeedY = -ballSpeedY;
    }
    if (ballY < 0) {
        ballSpeedY = -ballSpeedY;
    }

    cpuMovement();
}

//Start drawing stuff inside canvas
function drawStuff() {
    if(gameStart){
        return;
    }
    colorRectangle(0, 0, canvas.width, canvas.height, '#24272E');
    canvasContext.fillStyle = 'white';
    canvasContext.font = "30px Asap";
    if (gameEnd) {
        if (playerPoints >= WIN) {
            canvasContext.fillText("You Win! Good Going!", canvas.width / 2 - 145, canvas.height / 3);
        }

        else if (cpuPoints >= WIN) {
            canvasContext.fillText("You Lost! Better Luck Next Time!", canvas.width / 2 - 210, canvas.height / 3);
        }
        canvasContext.font = "20px Asap";
        canvasContext.fillText("Click anywhere to continue", canvas.width / 2 - 120, canvas.height / 1.5);
        return;
    }
    //Ball
    colorCircle(ballX, ballY, ballRadius, 'white');
    //Player Paddle
    colorRectangle(playerPaddleX, playerPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT, 'white');
    //CPU Paddle
    colorRectangle(cpuPaddleX, cpuPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT, 'white');
    //Center Net
    for (var i = 0; i < canvas.height; i += 30) {
        canvasContext.fillStyle = 'white';
        canvasContext.fillRect(canvas.width / 2 - 2, i, 2, 20);
    }
}

//Start Game Components: Canvas and Movement
function startGame() {
    
    console.log("Hello")
    gameStart = false;
    canvas = document.getElementById('gameCanvas'); //extract canvas data from html
    canvasContext = canvas.getContext('2d');  //create graphic vector for js to work on  
    setInterval(function () {
        setTimeout(moveEverything, 3000);
        drawStuff();
    }, 1000 / framesPerSecond);  //makes the function call every 1000/frames milliseconds 

    canvas.addEventListener('mousedown', handleMouseClick);
    canvas.addEventListener('mousemove',
        function (event) {
            var mousePos = calcMousePos(event);
            playerPaddleY = mousePos.y - 60;
        })
}

function main() {
    easy_div.addEventListener('click', function () {
        startMenu_div.style.display='none';
        gameCanvas_div.style.display='block';
        actionMessage_p.style.display='block';
        scoreBoard_div.style.display='block';
        cpuSpeed= 4;
        ballSpeedX=6;
        ballSpeedY=6;
        startGame();
    })
    hard_div.addEventListener('click', function () {
        startMenu_div.style.display = 'none';
        gameCanvas_div.style.display = 'block';
        actionMessage_p.style.display = 'block';
        scoreBoard_div.style.display = 'block';
        cpuSpeed = 6;
        ballSpeedX = 6;
        ballSpeedY = 7;
        startGame();
    })
    extreme_div.addEventListener('click', function () {
        startMenu_div.style.display = 'none';
        gameCanvas_div.style.display = 'block';
        actionMessage_p.style.display = 'block';
        scoreBoard_div.style.display = 'block';
        cpuSpeed = 8;
        ballSpeedX = 7;
        ballSpeedY = 8;
        startGame();
    })
    impossible_div.addEventListener('click', function () {
        startMenu_div.style.display = 'none';
        gameCanvas_div.style.display = 'block';
        actionMessage_p.style.display = 'block';
        scoreBoard_div.style.display = 'block';
        cpuSpeed = 12;
        ballSpeedX = 9;
        ballSpeedY = 10;
        startGame();
    })
}

main();
