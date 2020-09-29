let width;
let height;
let tileSize;
let canvas;
let ctx;
let food;
let snek;
let score;
let isPaused;
let hasChangedDir;

// Classes
class Food {
    constructor(position) {
        this.x = position.x;
        this.y = position.y;
    }
    draw() {
        ctx.beginPath();
        ctx.rect(this.x, this.y, tileSize, tileSize);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.strokeStyle = "darkred";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.closePath();
    }
}

class Snek {
    constructor() {}
    draw() {}
    move() {}
    changeDirection() {}
    eatFood() {}
    die() {}
    checkBorder() {}
}

// Functions
function initialize() {
    width = 500;
    height = 500;
    tileSize = 10;

    canvas = document.getElementById("snek-game");

    canvas.width = width;
    canvas.height = height;

    ctx = canvas.getContext("2d");
}

function game() {}

function update() {}

function spawnNewFood() {
    let rows = width / tileSize;
    let cols = height / tileSize;
    let xPosition, yPosition;

    xPosition = Math.floor(Math.random() * rows) * tileSize;
    yPosition = Math.floor(Math.random() * cols) * tileSize;

    return { x: xPosition, y: yPosition };
}

function increaseScore() {
    let scoreDisplay = document.getElementById("score");
    score += 10;
    scoreDisplay.innerHTML = score;
}

function toggleGame() {
    isPaused = !isPaused;
    let btn = document.getElementById("snek-btn");
    if (isPaused) {
        btn.innerHTML = "Start Game!"
    } else {
        btn.innerHTML = "Pause Game"
    }
}

// Event Listeners
window.addEventListener("keydown", function (event) {
    if (hasChangedDir) return;
    switch (event.key) {
        case " ":
            event.preventDefault();
            toggleGame();
            break;
        case "w":
            event.preventDefault();
            if (snek.yVelocity != 1 && snek.x >= 0 && snek.x <= width && snek.y >= 0 && snek.y <= height) {
                snek.dir(0, -1);
                hasChangedDir = true;
            }
            break;
        case "s":
            event.preventDefault();
            if (snek.yVelocity != -1 && snek.x >= 0 && snek.x <= width && snek.y >= 0 && snek.y <= height) {
                snek.dir(0, 1);
                hasChangedDir = true;
            }
            break;
        case "a":
            event.preventDefault();
            if (snek.xVelocity != 1 && snek.x >= 0 && snek.x <= width && snek.y >= 0 && snek.y <= height) {
                snek.dir(-1, 0);
                hasChangedDir = true;
            }
            break;
        case "d":
            event.preventDefault();
            if (snek.xVelocity != -1 && snek.x >= 0 && snek.x <= width && snek.y >= 0 && snek.y <= height) {
                snek.dir(1, 0);
                hasChangedDir = true;
            }
            break;
    }
});

// Start game
game();