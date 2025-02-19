const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const tileSize = 50;
const speed = 5; // Geschwindigkeit in Pixeln pro Frame
const moveInterval = 250; // Zeit in ms für einen Schritt

let lastMoveTime = 0;
let Punkte = 0;
let Alive = true;

let snake = [{ x: 100, y: 40 }];
let direction = "right";
let nextDirection = "right";

let food = { x: 300, y: 90 };
let lastPosition = { x: 100, y: 40 }; // Vorherige Position des Kopfes
let smoothFactor = 0; // Wert für flüssige Bewegung

let gameOverScreen = document.getElementById("gameOverScreen");
let restartButton = document.getElementById("neustart");


// Verhindere das Scrollen der Seite mit den Pfeiltasten
document.addEventListener("keydown", function (event) {
    if (["ArrowUp", "ArrowDown", "ArrowRight", "ArrowLeft"].includes(event.key)) {
        event.preventDefault();
    }
});

// Ändere die Richtung des Schlangenkopfes
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" && direction !== "down") nextDirection = "up";
    if (event.key === "ArrowDown" && direction !== "up") nextDirection = "down";
    if (event.key === "ArrowRight" && direction !== "left") nextDirection = "right";
    if (event.key === "ArrowLeft" && direction !== "right") nextDirection = "left";
});

function foodSpawn() {
    food.x = Math.floor(Math.random() * 10) * tileSize + 100;
    food.y = Math.floor(Math.random() * 10) * tileSize + 40;
}

function moveSnake() {
    if (!Alive) return;

    lastPosition = { ...snake[0] };

    direction = nextDirection;

    let newHead = { ...snake[0] };

    if (direction === "up") newHead.y -= tileSize;
    if (direction === "down") newHead.y += tileSize;
    if (direction === "right") newHead.x += tileSize;
    if (direction === "left") newHead.x -= tileSize;

    // Selbstkollision prüfen
    for (let i = 1; i < snake.length; i++) {
        if (newHead.x === snake[i].x && newHead.y === snake[i].y) {
            gameOver();
            return;
        }
    }

    // Wand-Kollision prüfen
    if (newHead.x < 100 || newHead.x >= 600 || newHead.y < 40 || newHead.y >= 540) {
        gameOver();
        return;
    }

    // Essen-Kollision prüfen
    if (newHead.x === food.x && newHead.y === food.y) {
        Punkte++;
        foodSpawn();
    } else {
        snake.pop();
    }

    snake.unshift(newHead);
    smoothFactor = 0; // Zurücksetzen für flüssige Bewegung
}

function drawFood() {
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, tileSize, tileSize);
}

function drawSnake(smoothFactor) {


    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = "green";
        let prev = snake[i + 1] || snake[i]; // Vorheriges Segment (zum Weichzeichnen)
        let x, y;

        if (i === 0) {
            // Interpolation des Kopfes zwischen der alten und neuen Position
            ctx.fillStyle = "#00ff00";
            x = lastPosition.x + (snake[0].x - lastPosition.x) * smoothFactor;
            y = lastPosition.y + (snake[0].y - lastPosition.y) * smoothFactor;
        } else {
            // Interpolation der anderen Segmente
            x = prev.x + (snake[i].x - prev.x) * smoothFactor;
            y = prev.y + (snake[i].y - prev.y) * smoothFactor;
        }

        ctx.fillRect(x, y, tileSize, tileSize);
        if (i === 0) {
            drawSnakeFace(x, y);
        }
    }
}


function drawSnakeFace(a, b) {
    if (direction === "up") {
        ctx.fillStyle = "white";
        ctx.fillRect(a + 10, b + 35, 10, 10);       //Auge links
        ctx.fillRect(a + 30, b + 35, 10, 10);       //Auge rechts
        ctx.fillStyle = "white";                    //Mund
        ctx.fillRect(a + 10, b + 10, 30, 10);
        ctx.fillStyle = "red";                      //Zunge
        ctx.fillRect(a + 20, b - 5, 8, 20);
    }
    if (direction === "down") {
        ctx.fillStyle = "white";
        ctx.fillRect(a + 10, b + 10, 10, 10);       //Auge links
        ctx.fillRect(a + 30, b + 10, 10, 10);       //Auge rechts
        ctx.fillStyle = "white";                    //Mund
        ctx.fillRect(a + 10, b + 30, 30, 10);
        ctx.fillStyle = "red";                      //Zunge
        ctx.fillRect(a + 20, b + 35, 8, 20);
    }
    if (direction === "right") {
        ctx.fillStyle = "white";
        ctx.fillRect(a + 10, b + 10, 10, 10);       //Auge links
        ctx.fillRect(a + 10, b + 30, 10, 10);       //Auge rechts
        ctx.fillStyle = "white";
        ctx.fillRect(a + 35, b + 10, 10, 30);       //Mund
        ctx.fillStyle = "red";
        ctx.fillRect(a + 40, b + 20, 20, 8);        //Zunge
    }
    if (direction === "left") {
        ctx.fillStyle = "white";
        ctx.fillRect(a + 30, b + 10, 10, 10);       //Auge links
        ctx.fillRect(a + 30, b + 30, 10, 10);       //Auge rechts
        ctx.fillStyle = "white";
        ctx.fillRect(a + 10, b + 10, 10, 30);       //Mund
        ctx.fillStyle = "red";
        ctx.fillRect(a - 5, b + 20, 20, 8);         //Zunge
    }
}

function drawGrid() {
    ctx.strokeStyle = "#cccccc";
    for (let x = 100; x <= 590; x += tileSize) {
        for (let y = 40; y <= 530; y += tileSize) {
            ctx.strokeRect(x, y, tileSize, tileSize);
        }
    }
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(14, 172, 14, 0.5)";
    drawGrid();
    ctx.fillRect(100, 40, 500, 500);

    ctx.strokeStyle = "black";
    ctx.lineWidth = 5;
    ctx.strokeRect(100, 40, 500, 500);


    drawFood();
    drawSnake(smoothFactor);

    ctx.fillStyle = "black";
    ctx.font = "20px Verdana";
    ctx.fillText("Punkte: " + Punkte, 150, 30);
}

function updateGame(timestamp) {
    if (!Alive) return;
    let deltaTime = timestamp - lastMoveTime;

    if (deltaTime > moveInterval) {
        lastMoveTime = timestamp;
        moveSnake();
    } else {
        smoothFactor = deltaTime / moveInterval; // Interpolation für fließende Bewegung
    }

    drawGame();
    requestAnimationFrame(updateGame);
}

function startGame() {
    gameOverScreen.style.display = "none";
    Alive = true;
    snake = [{ x: 100, y: 40 }];
    Punkte = 0;
    direction = "right";
    nextDirection = "right";
    foodSpawn();
    updateGame(performance.now());
}

function gameOver() {
    Alive = false;
    document.getElementById("score").innerText = Punkte;
    gameOverScreen.style.display = "flex";

}

restartButton.addEventListener("click", startGame);

// Starte das Spiel
startGame();
