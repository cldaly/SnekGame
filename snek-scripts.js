let width;
let height;
let tileSize;
let canvas;
let ctx;
let food;
let snek;
let score;
let highScore;
let isPaused;
let hasChangedDir;
let interval;
let gameOver;

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
    constructor() {
        this.x = tileSize * Math.floor(width / (2 * tileSize));
        this.y = tileSize * Math.floor(height / (2 * tileSize));
        this.tail = [{ x: this.x - tileSize, y: this.y }, { x: this.x - tileSize * 2, y: this.y }];
        this.xVelo = 1;
        this.yVelo = 0;
    }

    draw() {
        ctx.beginPath();
        ctx.rect(this.x, this.y, tileSize, tileSize);
        ctx.fillStyle = "lightgreen";
        ctx.fill();
        ctx.strokeStyle = "darkgreen";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.closePath();

        for (let t of this.tail) {
            ctx.beginPath();
            ctx.rect(t.x, t.y, tileSize, tileSize);
            ctx.fillStyle = "lightgreen";
            ctx.fill();
            ctx.strokeStyle = "darkgreen";
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.closePath();
        }
    }
    
    move() {
        for (let i = this.tail.length -1; i > 0; i--) {
            this.tail[i] = this.tail[i - 1];
        }
        this.tail[0] = { x: this.x, y: this.y };

        this.x += this.xVelo * tileSize;
        this.y += this.yVelo * tileSize;
    }

    changeDirection(xDir, yDir) {
        this.xVelo = xDir;
        this.yVelo = yDir;
    }
    eatFood() {
        if (this.x == food.x && this.y == food.y) {
            this.tail.push({});
            increaseScore();
            return true;
        }
        return false;
    }
    dead() {
        for (let t of this.tail) {
            if (this.x == t.x && this.y == t.y) {
                return true;
            }
        }
        return false;
    }
    checkBorder() {
        if (this.x > width - tileSize || this.x < 0 || this.y > height - tileSize || this.y < 0) handleGameOver();
    }
}

// Functions
function initialize() {
    gameOver = false;
    width = 500;
    height = 500;
    tileSize = 10;
    score = 0;

    canvas = document.getElementById("snek-game");
    document.getElementById("score").innerHTML = score;

    canvas.width = width;
    canvas.height = height;

    ctx = canvas.getContext("2d");

    snek = new Snek();
    snek.draw();

    food = new Food(spawnNewFood());
    food.draw();
}

function game() {
    initialize();
    isPaused = false;
    toggleGame();

    interval = setInterval(update, 100);
}

function update() {
    if (isPaused) return;
    hasChangedDir = false;

    snek.move();

    if (snek.dead()) {
        handleGameOver();
    }

    snek.checkBorder();

    if (snek.eatFood()) {
        food = new Food(spawnNewFood());
    }

    ctx.clearRect(0, 0, width, height);

    food.draw();
    snek.draw();
}

function spawnNewFood() {
    let rows = width / tileSize;
    let cols = height / tileSize;
    let xPos, yPos;
    let newPos;

    do {
        xPos = Math.floor(Math.random() * rows) * tileSize;
        yPos = Math.floor(Math.random() * cols) * tileSize;
        newPos = { x: xPos, y: yPos };
    } while (snek.tail.includes(newPos) || (xPos === snek.x && yPos === snek.y) || (food && xPos === food.x && yPos === food.y));
    
    return newPos;
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

function handleGameOver() {
    gameOver = true;
    clearInterval(interval);
    let modal = document.getElementById("snek-modal");
    let close = document.getElementById("close-modal");

    let modalScore = document.getElementById("modal-score");
    let modalHighScore = document.getElementById("high-score");

    highScore = (highScore) ? Math.max(score, highScore) : score;
    
    modalScore.innerHTML = score;
    modalHighScore.innerHTML = highScore
    modal.style.display = "block";

    close.onclick = function() {
        modal.style.display = "none";
        game();
    }
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
            game();
        }
    }
}

// Event Listeners
window.addEventListener("keydown", function (event) {
    if (gameOver) return;
    if (hasChangedDir) return;
    switch (event.key) {
        case " ":
            event.preventDefault();
            toggleGame();
            break;
        case "w":
            event.preventDefault();
            if (snek.yVelo != 1 && snek.x >= 0 && snek.x <= width && snek.y >= 0 && snek.y <= height) {
                snek.changeDirection(0, -1);
                hasChangedDir = true;
            }
            break;
        case "s":
            event.preventDefault();
            if (snek.yVelo != -1 && snek.x >= 0 && snek.x <= width && snek.y >= 0 && snek.y <= height) {
                snek.changeDirection(0, 1);
                hasChangedDir = true;
            }
            break;
        case "a":
            event.preventDefault();
            if (snek.xVelo != 1 && snek.x >= 0 && snek.x <= width && snek.y >= 0 && snek.y <= height) {
                snek.changeDirection(-1, 0);
                hasChangedDir = true;
            }
            break;
        case "d":
            event.preventDefault();
            if (snek.xVelo != -1 && snek.x >= 0 && snek.x <= width && snek.y >= 0 && snek.y <= height) {
                snek.changeDirection(1, 0);
                hasChangedDir = true;
            }
            break;
    }
});

// Start game
game();