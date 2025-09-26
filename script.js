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

const player = {
    x: 50,
    y: 0,
    width: 30,
    height: 40,
    speed: 5,
    velocityX: 0,
    velocityY: 0,
    jumping: false,
};

const gameMap = new GameMap();

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gameMap.updatePlatformsPositions();
}

window.addEventListener('resize', resize);
resize();

let playerPositionX = 0;
let playerPositionY = 0;
const gravity = 0.7;

function drawPlayer(startX, startY) {
    area.fillStyle = "#282222ff";
    area.fillRect(startX - 10, startY - 10, 20, 20);

    area.fillStyle = "rgba(36, 36, 118, 1)";
    area.fillRect(startX - 7.5, startY - 25, 15, 20);

    area.fillStyle = "#b0b07bff";
    area.fillRect(startX, startY - 30, 4, 8);

    area.fillStyle = "#ddb";
    area.fillRect(startX - 4, startY - 37, 8, 8);

    area.fillStyle = "black";
    area.fillRect(startX + 1, startY - 32, 3, 2);

    area.strokeStyle = '#cbcbb1ff';
    area.lineWidth = 4;

    area.beginPath();
    area.moveTo(startX - 5.5, startY - 43);
    area.lineTo(startX - 5.5, startY - 23);
    area.stroke();

    area.beginPath();
    area.moveTo(startX + 5.5, startY - 43);
    area.lineTo(startX + 5.5, startY - 23);
    area.stroke();
}

const hammer = {
    length: 100,
    angle: Math.PI / 4,
    hammer_handle_start: { x: 0, y: 0 },
    hammer_handle_end: { x: 0, y: 0 },
    hammerCenter: { x: 0, y: 0 },
    prevCenter: { x: 0, y: 0 }
};

let mouse_position_X = 0;
let mouse_position_Y = 0;

canvas.addEventListener('mousemove', (e) => {
    const canvas_size = canvas.getBoundingClientRect();

    mouse_position_X = e.clientX - canvas_size.left;
    mouse_position_Y = e.clientY - canvas_size.top;
    const playerScreenX = player.x - playerPositionX + player.width / 2;
    const playerScreenY = player.y - playerPositionY + player.height - 15;
    const dx = mouse_position_X - playerScreenX;
    const dy = mouse_position_Y - playerScreenY;
    hammer.angle = Math.atan2(dy, dx);
});

function updateHammer() {
    const playerScreenX = player.x - playerPositionX + player.width / 2;
    const playerScreenY = player.y - playerPositionY + player.height - 15;

    hammer.hammer_handle_start.x = playerScreenX;
    hammer.hammer_handle_start.y = playerScreenY;
    
    hammer.hammer_handle_end.x = playerScreenX + Math.cos(hammer.angle) * hammer.length;
    hammer.hammer_handle_end.y = playerScreenY + Math.sin(hammer.angle) * hammer.length;

    hammer.prevCenter.x = hammer.hammerCenter.x;
    hammer.prevCenter.y = hammer.hammerCenter.y;

    hammer.hammerCenter.x = playerScreenX + Math.cos(hammer.angle) * (hammer.length / 2);
    hammer.hammerCenter.y = playerScreenY + Math.sin(hammer.angle) * (hammer.length / 2);
}

function limitVelocity(value, maxSpeed) {
    if (value > maxSpeed) return maxSpeed;
    if (value < -maxSpeed) return -maxSpeed;
    return value;
}

function hammerCollision() {
    const hammer_boundry = {
        x: hammer.hammerCenter.x + playerPositionX - 5,
        y: hammer.hammerCenter.y + playerPositionY - 3.5,
        w: 10,
        h: 7
    };
    for (const p of gameMap.platforms) {
        if (!(hammer_boundry.x + hammer_boundry.w < p.x ||
            hammer_boundry.x > p.x + p.width ||
            hammer_boundry.y + hammer_boundry.h < p.y ||
            hammer_boundry.y > p.y + p.height)) {
            return p;
        }
    }
    return null;
}

function updatePlayer() {
    player.velocityX *= 0.9;
    player.velocityY += gravity;
    const hitPlatform = hammerCollision();
    
    if (hitPlatform) {
        const dx = hammer.hammerCenter.x - hammer.prevCenter.x;
        const dy = hammer.hammerCenter.y - hammer.prevCenter.y;
        player.velocityX -= dx * 0.2;
        player.velocityY -= dy * 2;
        player.jumping = true;
    }

    player.velocityX = limitVelocity(player.velocityX, 5);
    player.velocityY = limitVelocity(player.velocityY, 10);
    player.x += player.velocityX;
    player.y += player.velocityY;

    for (const p of gameMap.platforms) {
        if (player.x + player.width > p.x &&
            player.x < p.x + p.width &&
            player.y + player.height > p.y &&
            player.y < p.y + p.height) {
            const overlapX1 = (p.x + p.width) - player.x;
            const overlapX2 = (player.x + player.width) - p.x;
            const overlapY1 = (p.y + p.height) - player.y;
            const overlapY2 = (player.y + player.height) - p.y;
            const minOverlapX = Math.min(overlapX1, overlapX2);
            const minOverlapY = Math.min(overlapY1, overlapY2);
            if (minOverlapX < minOverlapY) {
                if (overlapX1 < overlapX2) {
                    player.x = p.x + p.width;
                } else {
                    player.x = p.x - player.width;
                }
                player.velocityX = 0;
            } else {
                if (overlapY1 < overlapY2) {
                    player.y = p.y + p.height;
                    player.velocityY = 0;
                } else {
                    player.y = p.y - player.height;
                    player.velocityY = 0;
                    player.jumping = false;
                }
            }
        }
    }

    const mapWidth = 5000;
    const mapHeight = canvas.height;
    if (player.x < 50) {
        player.x = 50;
        player.velocityX = 0;
    }

    if (player.x + player.width > mapWidth) {
        player.x = mapWidth - player.width;
        player.velocityX = 0;
    }

    if (player.y < 0) {
        player.y = 0;
        player.velocityY = 0;
    }

    if (player.y + player.height > mapHeight) {
        player.y = mapHeight - player.height;
        player.velocityY = 0;
        player.jumping = false;
    }
}

function updateCamera() {
    playerPositionX = player.x - canvas.width / 2 + player.width / 2;
    playerPositionY = player.y - canvas.height / 2 + player.height / 2;
    if (playerPositionX < 0) playerPositionX = 0;
    if (playerPositionX > 2000 - canvas.width) playerPositionX = 2000 - canvas.width;
    if (playerPositionY < 0) playerPositionY = 0;
}

function drawHammer() {
    const halfX = hammer.hammer_handle_start.x + Math.cos(hammer.angle) * (hammer.length / 2);
    const halfY = hammer.hammer_handle_start.y + Math.sin(hammer.angle) * (hammer.length / 2);

    area.strokeStyle = 'rgba(177, 100, 41, 1)';
    area.lineWidth = 8;
    area.lineCap = 'round';

    area.beginPath();
    area.moveTo(hammer.hammer_handle_start.x, hammer.hammer_handle_start.y);
    area.lineTo(halfX, halfY);
    area.stroke();
    
    area.fillStyle = 'rgba(229, 186, 153, 1)';
    area.fillRect(halfX - 5, halfY - 3.5, 10, 7);
}

function draw() {
    area.clearRect(0, 0, canvas.width, canvas.height);
    gameMap.draw(playerPositionX, playerPositionY);
    drawPlayer(player.x - playerPositionX + player.width / 2, player.y - playerPositionY + player.height);
    drawHammer();
}

function gameLoop() {
    updateHammer();
    updatePlayer();
    updateCamera();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();

const startScreen = document.querySelector(".startingscreen");
const gameContainer = document.querySelector(".game-container");
const playButton = document.querySelector(".play-button");

playButton.addEventListener("click", () => {
    startScreen.classList.add("hidden");
    gameContainer.classList.remove("hidden");
});
