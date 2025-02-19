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
let lastPositions = []; // Vorherige Position des Kopfes
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
    if (event.key === "ArrowUp" && direction !== "down" || event.key === "w" && direction !== "down") nextDirection = "up";
    if (event.key === "ArrowDown" && direction !== "up" || event.key === "s" && direction !== "up") nextDirection = "down";
    if (event.key === "ArrowRight" && direction !== "left" || event.key === "d" && direction !== "left") nextDirection = "right";
    if (event.key === "ArrowLeft" && direction !== "right" || event.key === "a" && direction !== "right") nextDirection = "left";
});

function foodSpawn() {
    let validPosition = false;
    while (!validPosition) {
        food.x = Math.floor(Math.random() * 10) * tileSize + 100;
        food.y = Math.floor(Math.random() * 10) * tileSize + 40;

        validPosition = !isFoodOnSnake(food.x, food.y);
    }
}
function isFoodOnSnake(foodX, foodY) {
    return snake.some(segment => segment.x === foodX && segment.y === foodY);
}

function moveSnake() {
    if (!Alive) return;

    lastPositions.unshift([...snake.map(segment => ({ ...segment }))]);
    if (lastPositions.length > snake.length) {
        lastPositions.pop();
    }

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
        for (let i = 0; i < snake.length; i++) {
            let x = snake[i].x;
            let y = snake[i].y;

            if (lastPositions.length > 0 && lastPositions[0][i]) {
                let prevX = lastPositions[0][i].x;
                let prevY = lastPositions[0][i].y;
                x = prevX + (snake[i].x - prevX) * smoothFactor;
                y = prevY + (snake[i].y - prevY) * smoothFactor;
            }

            ctx.fillStyle = i === 0 ? "#00ff00" : "green"; // Kopf heller färben
            ctx.fillRect(x, y, tileSize, tileSize);

            if (i === 0) {
                drawSnakeFace(x, y);
            }
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
