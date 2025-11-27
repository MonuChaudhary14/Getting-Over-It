const canvas = document.getElementById('gameCanvas');
const area = canvas.getContext('2d');

class GameMap {
    constructor() {
        this.platforms = [];
        this.offsetY = 0;
    }

    loadPlatforms(objects) {
        this.platforms = objects.map(obj => ({
            x: obj.x,
            y: obj.y,
            width: obj.width,
            height: obj.height
        }));
    }

    insertPlatforms() {
        this.offsetY = canvas.height;
        this.platforms = this.platforms.map(p => ({
            x: p.x,
            y: p.y + this.offsetY,
            width: p.width,
            height: p.height
        }));
    }

    draw(playerPositionX, playerPositionY) {
        area.fillStyle = '#20420cff';
        this.platforms.forEach(p => {
            area.fillRect(p.x - playerPositionX, p.y - playerPositionY, p.width, p.height);
        });
    }
}

class Player {
    constructor() {
        this.x = 50;
        this.y = 0;
        this.width = 30;
        this.height = 40;
        this.speed = 5;
        this.velocityX = 0;
        this.velocityY = 0;
        this.jumping = false;
    }
}

const player = new Player();
let gameMap = null;

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (gameMap) gameMap.insertPlatforms();
}
window.addEventListener('resize', resize);
resize();

let playerPositionX = 0;
let playerPositionY = 0;
const gravity = 0.8;

function drawPlayer(startX, startY) {
    area.fillStyle = "#2b2b2b";
    area.beginPath();
    area.ellipse(startX, startY - 10, 28, 18, 0, 0, Math.PI * 2);
    area.fill();

    area.fillStyle = "#3c3c3c";
    area.beginPath();
    area.ellipse(startX, startY - 23, 34, 10, 0, 0, Math.PI * 2);
    area.fill();

    area.fillStyle = "#d8b08a";
    area.beginPath();
    area.ellipse(startX, startY - 45, 26, 18, 0, 0, Math.PI * 2);
    area.fill();

    area.strokeStyle = "#c0926e";
    area.lineWidth = 2;
    area.beginPath();
    area.moveTo(startX - 10, startY - 48);
    area.lineTo(startX - 4, startY - 36);
    area.stroke();

    area.fillStyle = "#d0a67a";
    area.beginPath();
    area.arc(startX, startY - 80, 15, 0, Math.PI * 2);
    area.fill();

    area.fillStyle = "rgba(255,255,255,0.20)";
    area.beginPath();
    area.arc(startX - 4, startY - 86, 10, 0, Math.PI * 2);
    area.fill();

    area.fillStyle = "rgba(90,70,50,0.35)";
    area.beginPath();
    area.arc(startX, startY - 75, 12, Math.PI * 0.15, Math.PI * 0.85);
    area.fill();

    area.fillStyle = "black";
    area.beginPath();
    area.arc(startX - 5, startY - 84, 2.5, 0, Math.PI * 2);
    area.fill();

    area.beginPath();
    area.arc(startX + 5, startY - 84, 2.5, 0, Math.PI * 2);
    area.fill();

    area.strokeStyle = "black";
    area.lineWidth = 2;
    area.beginPath();
    area.moveTo(startX, startY - 82);
    area.lineTo(startX, startY - 78);
    area.stroke();

    area.strokeStyle = "black";
    area.lineWidth = 2;
    area.beginPath();
    area.arc(startX, startY - 72, 4, 0, Math.PI);
    area.stroke();
}

const hammer = {
    length: 90,
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
    const playerScreenY = player.y - playerPositionY + player.height - 35;
    const dx = mouse_position_X - playerScreenX;
    const dy = mouse_position_Y - playerScreenY;
    hammer.angle = Math.atan2(dy, dx);
});

function updateHammer() {
    const px = player.x - playerPositionX + player.width / 2;
    const py = player.y - playerPositionY + player.height - 35;

    hammer.prevCenter.x = hammer.hammerCenter.x;
    hammer.prevCenter.y = hammer.hammerCenter.y;

    const targetX = px + Math.cos(hammer.angle) * hammer.length;
    const targetY = py + Math.sin(hammer.angle) * hammer.length;

    hammer.hammerCenter.x += (targetX - hammer.hammerCenter.x) * 0.2;
    hammer.hammerCenter.y += (targetY - hammer.hammerCenter.y) * 0.2;

    hammer.hammer_handle_end.x = hammer.hammerCenter.x;
    hammer.hammer_handle_end.y = hammer.hammerCenter.y;

    hammer.hammer_handle_start.x = px;
    hammer.hammer_handle_start.y = py;
}

function resolveHammerPenetration() {
    const r = 10;
    for (const p of gameMap.platforms) {
        const hxWorld = hammer.hammerCenter.x + playerPositionX;
        const hyWorld = hammer.hammerCenter.y + playerPositionY;

        const closestX = Math.max(p.x, Math.min(hxWorld, p.x + p.width));
        const closestY = Math.max(p.y, Math.min(hyWorld, p.y + p.height));

        let dx = hxWorld - closestX;
        let dy = hyWorld - closestY;
        const distSq = dx * dx + dy * dy;

        if (distSq < r * r) {
            const dist = Math.sqrt(distSq) || 0.0001;
            const penetration = r - dist;

            const nx = dx / dist;
            const ny = dy / dist;

            const pushX_world = nx * penetration;
            const pushY_world = ny * penetration;

            hammer.hammerCenter.x += pushX_world;
            hammer.hammerCenter.y += pushY_world;

            hammer.hammer_handle_end.x += pushX_world;
            hammer.hammer_handle_end.y += pushY_world;

            hammer.prevCenter.x += pushX_world;
            hammer.prevCenter.y += pushY_world;
        }
    }
}

function limitVelocity(value, maxSpeed) {
    if (value > maxSpeed) return maxSpeed;
    if (value < -maxSpeed) return -maxSpeed;
    return value;
}

function hammerCollision() {
    const hb = {
        x: hammer.hammerCenter.x + playerPositionX - 5,
        y: hammer.hammerCenter.y + playerPositionY - 3.5,
        w: 10,
        h: 7
    };
    for (const p of gameMap.platforms) {
        if (!(hb.x + hb.w < p.x ||
              hb.x > p.x + p.width ||
              hb.y + hb.h < p.y ||
              hb.y > p.y + p.height)) {
            return p;
        }
    }
    return null;
}

function applyHammerPhysics() {
    const hit = hammerCollision();
    if (!hit) return;

    const hx = hammer.hammerCenter.x + playerPositionX;
    const hy = hammer.hammerCenter.y + playerPositionY;

    const px = hammer.prevCenter.x + playerPositionX;
    const py = hammer.prevCenter.y + playerPositionY;

    const dx = hx - px;
    const dy = hy - py;

    const pushPower = 0.25;
    player.velocityX -= dx * pushPower;
    player.velocityY -= dy * pushPower;

    const hammerSpeed = Math.hypot(dx, dy);

    if (hammerSpeed < 1.0) {
        player.velocityX *= 0.85;
        player.velocityY *= 0.85;
    } else if (hammerSpeed < 3.0) {
        player.velocityX *= 0.92;
        player.velocityY *= 0.92;
    }

    const maxSpeed = 12;
    const speed = Math.hypot(player.velocityX, player.velocityY);

    if (speed > maxSpeed) {
        player.velocityX = (player.velocityX / speed) * maxSpeed;
        player.velocityY = (player.velocityY / speed) * maxSpeed;
    }
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
    area.strokeStyle = 'rgba(177, 141, 41, 1)';
    area.lineWidth = 8;
    area.lineCap = 'round';
    area.beginPath();
    area.moveTo(hammer.hammer_handle_start.x, hammer.hammer_handle_start.y);
    area.lineTo(hammer.hammerCenter.x, hammer.hammerCenter.y);
    area.stroke();

    area.fillStyle = 'rgba(51, 195, 185, 1)';
    area.fillRect(hammer.hammerCenter.x - 5,hammer.hammerCenter.y - 3.5,10, 7);
}

function draw() {
    const gradient = area.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#87CEEB");
    gradient.addColorStop(1, "#ffffff");
    area.fillStyle = gradient;
    area.fillRect(0, 0, canvas.width, canvas.height);

    gameMap.draw(playerPositionX, playerPositionY);
    drawPlayer(player.x - playerPositionX + player.width / 2,player.y - playerPositionY + player.height);
    drawHammer();
}


function gameLoop() {
    updateHammer();
    resolveHammerPenetration();
    applyHammerPhysics();
    updatePlayer();
    updateCamera();
    draw();
    requestAnimationFrame(gameLoop);
}

async function loadMap() {
    try {
        const response = await fetch("Map.json");
        const mapJson = await response.json();

        gameMap = new GameMap();

        const objectLayer = mapJson.layers.find(
            layer => layer.name === "Object Layer 1" && layer.type === "objectgroup"
        );

        if (objectLayer) {
            gameMap.loadPlatforms(objectLayer.objects);
            gameMap.insertPlatforms();
        }

        gameLoop();
    } catch (e) {
        console.error("Map failed to load", e);
    }
}

loadMap();

const startScreen = document.querySelector(".startingscreen");
const gameContainer = document.querySelector(".game-container");
const playButton = document.querySelector(".play-button");
playButton.addEventListener("click", () => {
    startScreen.classList.add("hidden");
    gameContainer.classList.remove("hidden");
});
