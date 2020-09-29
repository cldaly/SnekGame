let width;
let height;
let tileSize;
let canvas;
let ctx;
let food;
let snek;
let score;
let isPaused;

function initialize() {
    width = 500;
    height = 500;
    tileSize = 10;

    canvas = document.getElementById("snek-game");

    canvas.width = width;
    canvas.height = height;

    ctx = canvas.getContext("2d");

    food = new Food(spawnLocation());
    food.draw();

    snek = new Snek({ x: tileSize * Math.floor(width / (2 * tileSize)), y: tileSize * Math.floor(height / (2 * tileSize)) });
    snek.draw();
}

function spawnLocation() {
    let rows = width / tileSize;
    let cols = height / tileSize;
    let xPos, yPos;

    xPos = Math.floor(Math.random() * rows) * tileSize;
    yPos = Math.floor(Math.random() * cols) * tileSize;

    return { x: xPos, y: yPos };
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
        this.velX = 1;
        this.velY = 0;
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
        this.x += this.velX * tileSize;
        this.y += this.velY * tileSize;
    }

    dir(dirX, dirY) {
        this.velX = dirX;
        this.velY = dirY;
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
        if (this.x + tileSize > width && this.velX != -1 || this.x < 0 && this.velX != 1){
            // this.x = width - this.x;
            alert("GAME OVER!!!");
            clearInterval(interval);
            game();
        } else if (this.y + tileSize > height && this.velY != -1 || this.velY != 1 && this.y < 0) {
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
    if (snek.die()) {
        alert("GAME OVER!!!");
        window.location.reload();
    }

    snek.border();

    if (snek.eat()) {
        food = new Food(spawnLocation(), "red");
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

window.addEventListener("keydown", function (evt) {
    if (evt.key === " ") {
        evt.preventDefault();
        toggleGame();
    }
    else if (evt.key === "w") {
        evt.preventDefault();
        if (snek.velY != 1 && snek.x >= 0 && snek.x <= width && snek.y >= 0 && snek.y <= height)
            snek.dir(0, -1);
    }
    else if (evt.key === "s") {
        evt.preventDefault();
        if (snek.velY != -1 && snek.x >= 0 && snek.x <= width && snek.y >= 0 && snek.y <= height)
            snek.dir(0, 1);
    }
    else if (evt.key === "a") {
        evt.preventDefault();
        if (snek.velX != 1 && snek.x >= 0 && snek.x <= width && snek.y >= 0 && snek.y <= height)
            snek.dir(-1, 0);
    }
    else if (evt.key === "d") {
        evt.preventDefault();
        if (snek.velX != -1 && snek.x >= 0 && snek.x <= width && snek.y >= 0 && snek.y <= height)
            snek.dir(1, 0);
    }

});

game();