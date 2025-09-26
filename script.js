var mouseX, mouseY, mouseDown;
mouseX = 0;
mouseY = 0;
const canvas = document.getElementById('gameCanvas');
const area = canvas.getContext('2d');

class GameMap {
    constructor() {
        this.groundHeight = 50;
        this.platforms = [];
        this.initializePlatfrom();
    }
    initializePlatfrom() {
        this.platforms = [
            { x: -20, y: 0, width: 5000, height: this.groundHeight },
            { x: 200, y: 0, width: 150, height: 80 },
            { x: 370, y: 0, width: 160, height: 140 },
            { x: 550, y: 0, width: 150, height: 100 },
            { x: 720, y: 0, width: 140, height: 180 },
            { x: 880, y: 0, width: 150, height: 220 },
            { x: 1060, y: 0, width: 160, height: 150 },
            { x: 1240, y: 0, width: 140, height: 200 },
            { x: 1400, y: 0, width: 150, height: 250 },
            { x: 1580, y: 0, width: 160, height: 170 },
            { x: 1750, y: 0, width: 140, height: 230 },
            { x: 1920, y: 0, width: 150, height: 200 },
            { x: 2100, y: 0, width: 140, height: 260 },
            { x: 2280, y: 0, width: 160, height: 180 },
            { x: 2460, y: 0, width: 150, height: 240 },
            { x: 2650, y: 0, width: 140, height: 200 },
            { x: 2820, y: 0, width: 150, height: 260 },
            { x: 3000, y: 0, width: 140, height: 220 },
            { x: 3170, y: 0, width: 160, height: 280 },
            { x: 3380, y: 0, width: 150, height: 240 },
        ];
    }
    updatePlatformsPositions() {
        const starting_Y = canvas.height - this.groundHeight;
        this.platforms[0].y = starting_Y;
        this.platforms[1].y = starting_Y - 80;
        this.platforms[2].y = starting_Y - 140;
        this.platforms[3].y = starting_Y - 100;
        this.platforms[4].y = starting_Y - 180;
        this.platforms[5].y = starting_Y - 220;
        this.platforms[6].y = starting_Y - 150;
        this.platforms[7].y = starting_Y - 200;
        this.platforms[8].y = starting_Y - 250;
        this.platforms[9].y = starting_Y - 170;
        this.platforms[10].y = starting_Y - 230;
        this.platforms[11].y = starting_Y - 200;
        this.platforms[12].y = starting_Y - 260;
        this.platforms[13].y = starting_Y - 180;
        this.platforms[14].y = starting_Y - 240;
        this.platforms[15].y = starting_Y - 200;
        this.platforms[16].y = starting_Y - 260;
        this.platforms[17].y = starting_Y - 220;
        this.platforms[18].y = starting_Y - 280;
        this.platforms[19].y = starting_Y - 240;
    }
    draw(playerPositionX, playerPositionY) {
        area.fillStyle = '#886633';
        this.platforms.forEach(platform => {
            area.fillRect(platform.x - playerPositionX, platform.y - playerPositionY, platform.width, platform.height);
        });
    }
}
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var startX = window.innerWidth / 2;
var startY = window.innerHeight / 1.5;

function getDir(x1, y1, x2, y2) {
    var dx = y2 - y1;
    var dy = x2 - x1;
    return Math.atan2(dy, dx);
}

function getDist(x1, y1, x2, y2) {
    let dx = x2 - x1;
    let dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

document.addEventListener('mousedown', e => {
    mouseDown = true;
});

document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

var mapOffsetX = 0;
var mapOffsetY = 0;

function drawSky() {

    var gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(0.4, '#16213e');
    gradient.addColorStop(0.8, '#0f3460');
    gradient.addColorStop(1, '#533483');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawStars() {
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 30; i++) {
        ctx.globalAlpha = Math.random() * 0.6 + 0.3;
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height * 0.7;
        let radius = Math.random() * 2 + 1;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1;
}

function drawMoon() {
    ctx.fillStyle = '#f5f5dc';
    ctx.strokeStyle = '#e6e6b8';
    ctx.lineWidth = 1;

    let x = canvas.width * 0.85;
    let y = canvas.height * 0.15;

    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
}

function drawClouds() {
    ctx.fillStyle = '#2a2a4a';
    ctx.globalAlpha = 0.4;

    for (let i = 0; i < 5; i++) {
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height * 0.4;
        let w = 80 + Math.random() * 40;
        let h = 30 + Math.random() * 20;

        ctx.beginPath();
        ctx.ellipse(x, y, w / 2, h / 2, 0, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1;
}

var map = [];

class Obstacle {
    touching(box) {
        if ((box.x <= this.box.x2 && box.x2 >= this.box.x) &&
            (box.y <= this.box.y2 && box.y2 >= this.box.y)) {
            return true;
        }
    }

    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.box = {
            x: x,
            y: y,
            x2: x + w,
            y2: y + h,
        };
        map.push(this.box);
    }

    draw() {
        ctx.fillStyle = '#0a5a0a';
        ctx.strokeStyle = '#0a4a0a';
        ctx.lineWidth = 1;

        let drawX = this.x + mapOffsetX;
        let drawY = this.y + mapOffsetY;

        ctx.fillRect(drawX, drawY, this.width, this.height);
        ctx.strokeRect(drawX, drawY, this.width, this.height);
    }
}

class Player {
    update() {
        mapOffsetX += this.xVel;
        mapOffsetY += this.yVel * -1;
        this.orient();
        this.physics();
    }

    physics() {
        let hit = map.find(o => player.touching(o));
        let hammerHit = map.find(o => player.touchingHammer(o));

        if (hit !== undefined) {
            if (this.getBoxDiff(hit).y !== undefined) {
                this.yVel = this.getBoxDiff(hit).y;
            } else {
                this.xVel = this.getBoxDiff(hit).x;
                this.yVel += -0.24;
            }
        } else {
            this.yVel += -0.24;
        }

        if (hammerHit !== undefined) {
            if (this.getHammerDiff(hammerHit).y !== undefined) {
                if (Math.abs(this.getHammerDiff(hammerHit).y) > this.yVel) {
                    this.yVel = this.getHammerDiff(hammerHit).y;
                }
                this.xVel = this.prevPos.x - this.hammerCenter.x;
            } else {
                this.xVel = this.getHammerDiff(hammerHit).x;
                this.yVel = -this.prevPos.y + this.hammerCenter.y;
            }
        }

        if (hit !== undefined) {
            if (this.getBoxDiff(hit).y !== undefined &&
                Math.abs(this.getBoxDiff(hit).y) / this.getBoxDiff(hit).y ===
                Math.abs(this.yVel) / this.yVel) {
                this.yVel = this.getBoxDiff(hit).y;
            } else if (Math.abs(this.getBoxDiff(hit).x) / this.getBoxDiff(hit).x ===
                Math.abs(this.xVel) / this.xVel) {
                this.xVel = this.getBoxDiff(hit).x;
            }
        }

        this.prevPos = { x: this.hammerCenter.x, y: this.hammerCenter.y };

        if (this.xVel > 5) this.xVel = 5;
        if (this.xVel < -5) this.xVel = -5;
        if (this.yVel > 5) this.yVel = 5;
    }

    orient() {
        let leftStart = { x: startX - 5.5, y: startY - 23 };
        let rightStart = { x: startX + 5.5, y: startY - 23 };
        let hammerCenter, dist;

        dist = getDist(startX, startY - 23, mouseX, mouseY);

        if (dist >= 64.5) {
            let dir = getDir(startX, startY - 23, mouseX, mouseY);
            hammerCenter = {
                x: startX + Math.sin(dir) * 39.5,
                y: (startY - 23) + Math.cos(dir) * 39.5
            };
        } else if (dist >= 39.5) {
            let dir = getDir(startX, startY - 23, mouseX, mouseY);
            hammerCenter = {
                x: startX + Math.sin(dir) * (dist - 25),
                y: (startY - 23) + Math.cos(dir) * (dist - 25)
            };
        } else {
            let dir = getDir(startX, startY - 23, mouseX, mouseY);
            hammerCenter = {
                x: startX + Math.sin(dir) * 14.5,
                y: (startY - 23) + Math.cos(dir) * 14.5
            };
        }

        let hammerDir = getDir(hammerCenter.x, hammerCenter.y, mouseX, mouseY);
        let mod = 1;

        if (getDist(hammerCenter.x + Math.sin(hammerDir) * -25,
            hammerCenter.y + Math.cos(hammerDir) * -25, startX, startY - 23) >
            getDist(hammerCenter.x + Math.sin(hammerDir) * 25,
                hammerCenter.y + Math.cos(hammerDir) * 25, startX, startY - 23)) {
            mod = -1;
        }

        this.hammerCenter = hammerCenter;
        this.handleStart = {
            x: hammerCenter.x + Math.sin(hammerDir) * 25 * mod,
            y: hammerCenter.y + Math.cos(hammerDir) * 25 * mod
        };
        this.handleEnd = {
            x: hammerCenter.x + Math.sin(hammerDir) * -25 * mod,
            y: hammerCenter.y + Math.cos(hammerDir) * -25 * mod
        };
    }

    touching(box) {
        let playerBox = this.box();
        if ((box.x <= playerBox.x2 && box.x2 >= playerBox.x) &&
            (box.y <= playerBox.y2 && box.y2 >= playerBox.y)) {
            return true;
        }
    }

    touchingHammer(box) {
        let hammerBox = this.hammerBox();
        if ((box.x <= hammerBox.x2 && box.x2 >= hammerBox.x) &&
            (box.y <= hammerBox.y2 && box.y2 >= hammerBox.y)) {
            return true;
        }

        let dxMid, dyMid;
        dxMid = (this.prevPos.x - this.hammerCenter.x) / 2;
        dyMid = (this.prevPos.y - this.hammerCenter.y) / 2;

        if ((box.x <= hammerBox.x2 + dxMid && box.x2 >= hammerBox.x + dxMid) &&
            (box.y <= hammerBox.y2 + dyMid && box.y2 >= hammerBox.y + dyMid)) {
            return true;
        }
    }

    getHammerDiff(box) {
        let hammerBox = this.hammerBox();
        let y1, x1, y2, x2;
        y1 = -box.y + hammerBox.y2;
        y2 = box.y2 - hammerBox.y;
        x1 = -box.x + hammerBox.x2;
        x2 = box.x2 - hammerBox.x;
        let arr = [y1, y2, x1, x2];
        let min = Math.min(...arr);
        if (min === y1) return { y: min };
        if (min === y2) return { y: -min };
        if (min === x1) return { x: -min };
        if (min === x2) return { x: min };
    }

    getBoxDiff(box) {
        let playerBox = this.box();
        let y1, x1, y2, x2;
        y1 = Math.abs(-box.y + playerBox.y2);
        y2 = Math.abs(box.y2 - playerBox.y);
        x1 = Math.abs(-box.x + playerBox.x2);
        x2 = Math.abs(box.x2 - playerBox.x);
        let arr = [y1, y2, x1, x2];
        let min = Math.min(...arr);
        if (min === y1) return { y: min };
        if (min === y2) return { y: -min };
        if (min === x1) return { x: -min };
        if (min === x2) return { x: min };
    }

    constructor() {
        this.xVel = 0;
        this.yVel = 0;
        this.prevPos = { x: null, y: null };
        this.hammerCenter = { x: startX, y: startY - 53 };
        this.handleStart = { x: startX, y: startY - 28 };
        this.handleEnd = { x: startX, y: startY - 78 };
    }

    box() {
        return {
            x: startX - 10 - mapOffsetX,
            x2: startX + 10 - mapOffsetX,
            y: startY - 10 - mapOffsetY,
            y2: startY + 10 - mapOffsetY,
        };
    }

    hammerBox() {
        return {
            x: this.hammerCenter.x - 5 - mapOffsetX,
            x2: this.hammerCenter.x + 5 - mapOffsetX,
            y: this.hammerCenter.y - 3.5 - mapOffsetY,
            y2: this.hammerCenter.y + 3.5 - mapOffsetY,
        };
    }

    draw() {

        ctx.fillStyle = "#333";
        ctx.fillRect(startX - 10, startY - 10, 20, 20);


        ctx.fillStyle = "#225";
        ctx.fillRect(startX - 7.5, startY - 25, 15, 20);


        ctx.fillStyle = "#ddb";
        ctx.fillRect(startX, startY - 30, 4, 8);


        ctx.fillStyle = "#ddb";
        ctx.fillRect(startX - 4, startY - 37, 8, 8);


        ctx.fillStyle = "#000";
        ctx.fillRect(startX + 1, startY - 32, 3, 2);


        ctx.fillStyle = "#225";
        ctx.beginPath();
        ctx.ellipse(startX, startY - 5, 7.5, 3.5, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#ddb';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';


        ctx.beginPath();
        ctx.moveTo(startX - 5.5, startY - 43);
        ctx.lineTo(startX - 5.5, startY - 33);
        ctx.stroke();


        ctx.beginPath();
        ctx.moveTo(startX + 5.5, startY - 43);
        ctx.lineTo(startX + 5.5, startY - 33);
        ctx.stroke();


        ctx.beginPath();
        ctx.moveTo(startX - 5.5, startY - 33);
        ctx.lineTo(startX - 5.5, startY - 23);
        ctx.stroke();


        ctx.beginPath();
        ctx.moveTo(startX + 5.5, startY - 33);
        ctx.lineTo(startX + 5.5, startY - 23);
        ctx.stroke();

 
        ctx.strokeStyle = '#841';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(this.handleStart.x, this.handleStart.y);
        ctx.lineTo(this.handleEnd.x, this.handleEnd.y);
        ctx.stroke();


        ctx.fillStyle = "#666";
        ctx.fillRect(this.hammerCenter.x - 5, this.hammerCenter.y - 3.5, 10, 7);
    }
}

var player = new Player();
var obstacles = [];


obstacles.push(new Obstacle(-10000, 500, 20000, 1000)); 
obstacles.push(new Obstacle(200, 450, 100, 50));
obstacles.push(new Obstacle(100, 400, 100, 100));
obstacles.push(new Obstacle(-900, 400, 1000, 100));
obstacles.push(new Obstacle(100, 350, 100, 150));
obstacles.push(new Obstacle(550, 400, 150, 100));
obstacles.push(new Obstacle(650, 450, 40, 50));
obstacles.push(new Obstacle(400, 470, 300, 30));
obstacles.push(new Obstacle(800, 400, 100, 100));
obstacles.push(new Obstacle(1900, 400, 1000, 100));

var canDo = true;

function update(progress) {
    player.update();
    if (false) {
        if (canDo) {
            console.log(Math.random());
            canDo = false;
        }
    } else {
        canDo = true;
    }
}

function draw() {
 
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawSky();
    drawStars();
    drawMoon();
    drawClouds();

    obstacles.forEach(obstacle => obstacle.draw());


    player.draw();
}

var looping = true;

function toggleLoop() {
    looping = !looping;
    if (looping) {
        window.requestAnimationFrame(loop);
    }
}

function loop(timestamp) {
    var progress = timestamp - lastRender;
    update(progress);
    draw();
    lastRender = timestamp;
    if (looping) {
        window.requestAnimationFrame(loop);
    }
}

var lastRender = 0;
window.requestAnimationFrame(loop);

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    startX = window.innerWidth / 2;
    startY = window.innerHeight / 1.5;
});

const startScreen = document.querySelector(".startingscreen");
const gameContainer = document.querySelector(".game-container");
const playButton = document.querySelector(".play-button");

playButton.addEventListener("click", () => {
  startScreen.classList.add("hidden");      
  gameContainer.classList.remove("hidden"); 
});


