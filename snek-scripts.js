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

function initialize() {
    width = 500;
    height = 500;
    tileSize = 10;

    canvas = document.getElementById("snek-game");

    canvas.width = width;
    canvas.height = height;

    ctx = canvas.getContext("2d");

    food = new Food(spawnNewFood());
    food.draw();

    snek = new Snek({ x: tileSize * Math.floor(width / (2 * tileSize)), y: tileSize * Math.floor(height / (2 * tileSize)) });
    snek.draw();
}

function spawnNewFood() {
    let rows = width / tileSize;
    let cols = height / tileSize;
    let xPosition, yPosition;

    xPosition = Math.floor(Math.random() * rows) * tileSize;
    yPosition = Math.floor(Math.random() * cols) * tileSize;

    return { x: xPosition, y: yPosition };
}

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
    constructor(position) {
        this.x = position.x;
        this.y = position.y;
        this.tail = [{x: position.x - tileSize, y: position.y}, {x: position.x - tileSize * 2, y: position.y}];
        this.xVelocity = 1;
        this.yVelocity = 0;
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
        for (let i = this.tail.length - 1; i > 0; i--) {
            this.tail[i] = this.tail[i - 1];
        }
        this.tail[0] = { x: this.x, y: this.y };
        this.x += this.xVelocity * tileSize;
        this.y += this.yVelocity * tileSize;
    }

    dir(xDirection, yDirection) {
        this.xVelocity = xDirection;
        this.yVelocity = yDirection;
    }

    eat() {
        if (Math.abs(this.x - food.x) < tileSize && Math.abs(this.y - food.y) < tileSize) {
            this.tail.push({});
            increaseScore();
            return true;
        }
        return false;
    }

    die() {
        for (var i = 0; i < this.tail.length; i++) {
            if (Math.abs(this.x - this.tail[i].x) < tileSize && Math.abs(this.y - this.tail[i].y) < tileSize) {
                return true;
            }
        }
        return false;
    }

    border() {
        if (this.x + tileSize > width && this.xVelocity != -1 || this.x < 0 && this.xVelocity != 1){
            // this.x = width - this.x;
            alert("GAME OVER!!!");
            clearInterval(interval);
            game();
        } else if (this.y + tileSize > height && this.yVelocity != -1 || this.yVelocity != 1 && this.y < 0) {
            // this.y = height - this.y;
            alert("GAME OVER!!!");
            clearInterval(interval);
            game();
        }
    }
}

function game() {
    initialize();
    
    isPaused = false;
    toggleGame()

    score = 0;
    interval = setInterval(update,100);
}

function update() {
    if (isPaused) return;
    hasChangedDir = false;

    if (snek.die()) {
        alert("GAME OVER!!!");
        game();
    }

    snek.border();

    if (snek.eat()) {
        food = new Food(spawnNewFood(), "red");
    }
    
    ctx.clearRect(0, 0, width, height);

    food.draw();
    snek.draw();
    snek.move();
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

game();