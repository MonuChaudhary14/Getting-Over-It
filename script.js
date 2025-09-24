var mouseX, mouseY, mouseDown
mouseX = 0
mouseY = 0
var startX = window.innerWidth / 2
var startY = window.innerHeight / 1.5

function getTriangle(a, b, c) {
    let A, B, C
    A = Math.acos(((b ** 2) + (c ** 2) - (a ** 2)) / (2 * b * c))
    B = Math.acos(((a ** 2) + (c ** 2) - (b ** 2)) / (2 * a * c))
    C = Math.acos(((b ** 2) + (a ** 2) - (c ** 2)) / (2 * b * a))
    return [A, B, C]
}

function rotate(angle, delta) {
    let theta = angle + delta
    if (theta > Math.PI) {
        theta = theta - Math.PI
        theta = Math.PI - theta
        theta = theta * -1
    }
    if (theta < -1 * Math.PI) {
        theta = theta * -1
        theta = theta - Math.PI
        theta = Math.PI - theta
    }
    return theta
}
function getDir(x1, y1, x2, y2) {
    var dx = y2 - y1
    var dy = x2 - x1
    return Math.atan2(dy, dx)
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
    mouseX = e.offsetX;
    mouseY = e.offsetY;
});
document.addEventListener('mouseup', e => {
    mouseDown = false;
});

var draw = SVG().addTo('body').size('100%', '100%')

var sky = draw.rect('100%', '100%').fill({
    color: 'url(#skyGradient)'
})

var skyGradient = draw.defs().gradient('linear', function (add) {
    add.stop(0, '#1a1a2e')
    add.stop(0.4, '#16213e')
    add.stop(0.8, '#0f3460')
    add.stop(1, '#533483')
}).id('skyGradient')

sky.fill('url(#skyGradient)')
sky.back()

for (let i = 0; i < 30; i++) {
    let star = draw.circle(Math.random() * 2 + 1)
        .center(Math.random() * window.innerWidth, Math.random() * window.innerHeight * 0.7)
        .fill('#ffffff')
        .opacity(Math.random() * 0.6 + 0.3)
    star.back()
}

var moon = draw.circle(60)
    .center(window.innerWidth * 0.85, window.innerHeight * 0.15)
    .fill('#f5f5dc')
    .stroke({ width: 1, color: '#e6e6b8' })
moon.back()

for (let i = 0; i < 5; i++) {
    let cloud = draw.ellipse(80 + Math.random() * 40, 30 + Math.random() * 20)
        .center(Math.random() * window.innerWidth, Math.random() * window.innerHeight * 0.4)
        .fill('#2a2a4a')
        .opacity(0.4)
    cloud.back()
}

var map = []
var mapGroup = draw.group()
var origin = draw.rect(0, 0).move(0, 0).fill("#eee").opacity(0)
mapGroup.add(origin)
draw.toggleClass("svg")

class Obstacle {
    touching(box) {
        if ((box.x <= this.box.x2 && box.x2 >= this.box.x) && (box.y <= this.box.y2 && box.y2 >= this.box.y)) { return true }
    }
    constructor(x, y, w, h) {
        this.body = draw.rect(w, h).move(x, y).fill('#0a5a0a').stroke({ width: 1, color: '#0a4a0a' })
        mapGroup.add(this.body)
        this.box = {
            x: this.body.bbox().x,
            y: this.body.bbox().y,
            x2: this.body.bbox().x2,
            y2: this.body.bbox().y2,
        }
        map.push(this.box)
    }
}

class Player {
    update() {
        mapGroup.dmove(this.xVel * -1, this.yVel)
        this.orient()
        this.physics()
    }
    physics() {
        let hit = map.find(o => player.touching(o))
        let hammerHit = map.find(o => player.touchingHammer(o))
        if (hit !== undefined) {
            if (this.getBoxDiff(hit).y !== undefined) this.yVel = this.getBoxDiff(hit).y
            else {
                this.xVel = this.getBoxDiff(hit).x
                this.yVel += -.24
            }
        }
        else this.yVel += -.24
        if (hammerHit !== undefined) {
            if (this.getHammerDiff(hammerHit).y !== undefined) {
                if (Math.abs(this.getHammerDiff(hammerHit).y) > this.yVel)
                    this.yVel = this.getHammerDiff(hammerHit).y
                this.xVel = this.prevPos.x - this.hammer.cx()
            }
            else {
                this.xVel = this.getHammerDiff(hammerHit).x
                this.yVel = -this.prevPos.y + this.hammer.cy()
            }
        }
        if (hit !== undefined) {
            if (this.getBoxDiff(hit).y !== undefined && Math.abs(this.getBoxDiff(hit).y) / this.getBoxDiff(hit).y === Math.abs(this.yVel) / this.yVel) this.yVel = this.getBoxDiff(hit).y
            else if (Math.abs(this.getBoxDiff(hit).x) / this.getBoxDiff(hit).x === Math.abs(this.xVel) / this.xVel) {
                this.xVel = this.getBoxDiff(hit).x
            }
        }
        this.prevPos = { x: this.hammer.cx(), y: this.hammer.cy() }
        if (this.xVel > 5) this.xVel = 5
        if (this.xVel < -5) this.xVel = -5
        if (this.yVel > 5) this.yVel = 5
    }
    orient() {
        let leftEnd, rightEnd
        let leftStart = { x: startX - 5.5, y: startY - 23 }
        let rightStart = { x: startX + 5.5, y: startY - 23 }
        let hammerCenter, dist
        dist = getDist(startX, startY - 23, mouseX, mouseY)
        if (dist >= 64.5) {
            let dir = getDir(startX, startY - 23, mouseX, mouseY)
            hammerCenter = {
                x: startX + Math.sin(dir) * 39.5,
                y: (startY - 23) + Math.cos(dir) * 39.5
            }
        }
        else if (dist >= 39.5) {
            let dir = getDir(startX, startY - 23, mouseX, mouseY)
            hammerCenter = {
                x: startX + Math.sin(dir) * (dist - 25),
                y: (startY - 23) + Math.cos(dir) * (dist - 25)
            }
        }
        else {
            let dir = getDir(startX, startY - 23, mouseX, mouseY)
            hammerCenter = {
                x: startX + Math.sin(dir) * 14.5,
                y: (startY - 23) + Math.cos(dir) * 14.5
            }
        }
        let rightDir = getDir(rightStart.x, rightStart.y, mouseX, mouseY)
        let leftDir = getDir(leftStart.x, leftStart.y, mouseX, mouseY)
        let hammerDir = getDir(hammerCenter.x, hammerCenter.y, mouseX, mouseY)
        let mod = 1
        if (getDist(hammerCenter.x + Math.sin(hammerDir) * -25,
            hammerCenter.y + Math.cos(hammerDir) * -25, startX, startY - 23) >
            getDist(hammerCenter.x + Math.sin(hammerDir) * 25,
                hammerCenter.y + Math.cos(hammerDir) * 25, startX, startY - 23)) mod = -1
        this.handle.attr("x1", hammerCenter.x + Math.sin(hammerDir) * 25 * mod)
        this.handle.attr("y1", hammerCenter.y + Math.cos(hammerDir) * 25 * mod)
        this.handle.attr("x2", hammerCenter.x + Math.sin(hammerDir) * -25 * mod)
        this.handle.attr("y2", hammerCenter.y + Math.cos(hammerDir) * -25 * mod)

    }
    touching(box) {
        if ((box.x <= this.box().x2 && box.x2 >= this.box().x) && (box.y <= this.box().y2 && box.y2 >= this.box().y)) { return true }
    }
    touchingHammer(box) {
        if ((box.x <= this.hammerBox().x2 && box.x2 >= this.hammerBox().x) && (box.y <= this.hammerBox().y2 && box.y2 >= this.hammerBox().y)) { return true }
        let dxMid, dyMid
        dxMid = (this.prevPos.x - this.hammer.cx()) / 2
        dyMid = (this.prevPos.y - this.hammer.cy()) / 2
        if ((box.x <= this.hammerBox().x2 + dxMid && box.x2 >= this.hammerBox().x + dxMid) && (box.y <= this.hammerBox().y2 + dyMid && box.y2 >= this.hammerBox().y + dyMid)) return true
    }
    getHammerDiff(box) {
        let y1, x1, y2, x2
        y1 = -box.y + this.hammerBox().y2
        y2 = box.y2 - this.hammerBox().y
        x1 = -box.x + this.hammerBox().x2
        x2 = box.x2 - this.hammerBox().x
        let arr = [y1, y2, x1, x2]
        let min = Math.min(...arr)
        if (min === y1) return { y: min }
        if (min === y2) return { y: -min }
        if (min === x1) return { x: -min }
        if (min === x2) return { x: min }
    }
    getBoxDiff(box) {
        let y1, x1, y2, x2
        y1 = Math.abs(-box.y + this.box().y2)
        y2 = Math.abs(box.y2 - this.box().y)
        x1 = Math.abs(-box.x + this.box().x2)
        x2 = Math.abs(box.x2 - this.box().x)
        let arr = [y1, y2, x1, x2]
        let min = Math.min(...arr)
        if (min === y1) return { y: min }
        if (min === y2) return { y: -min }
        if (min === x1) return { x: -min }
        if (min === x2) return { x: min }
    }
    constructor() {
        this.pot = draw.rect(20, 20).center(startX, startY).fill("#333")
        this.body = draw.rect(15, 20).center(startX, startY - 15).fill("#225")
        this.chin = draw.rect(4, 8).center(startX + 2, startY - 26).fill("#ddb")
        this.skull = draw.rect(8, 8).center(startX, startY - 29).fill("#ddb")
        this.eye = draw.rect(3, 2).center(startX + 2.5, startY - 30).fill("#000")
        this.head = draw.group()
        this.head.add(this.chin)
        this.head.add(this.skull)
        this.head.add(this.eye)
        this.shirtBottom = draw.ellipse(15, 7).center(startX, startY - 5).fill("#225")
        this.arms = {
            ul: draw.line(0, 0, 0, 10).move(startX - 5.5, startY - 43).stroke({
                width: 4, color: '#ddb'
            }),
            ur: draw.line(0, 0, 0, 10).move(startX + 5.5, startY - 43).stroke({
                width: 4, color: '#ddb'
            }),
            bl: draw.line(0, 0, 0, 10).move(startX - 5.5, startY - 33).stroke({
                width: 4, color: '#ddb'
            }),
            br: draw.line(0, 0, 0, 10).move(startX + 5.5, startY - 33).stroke({
                width: 4, color: '#ddb'
            }),
        }
        this.handle = draw.line(0, 0, 0, 50).center(startX, startY - 53).stroke({
            width: 4, color: '#841'
        })
        this.hammer = draw.rect(10, 7).center(0, 50).fill("#666")
        this.xVel = 0
        this.yVel = 0
        this.prevPos = { x: null, y: null }
        this.box = function () {
            return {
                x: this.pot.bbox().x - origin.x(),
                x2: this.pot.bbox().x2 - origin.x(),
                y: this.pot.bbox().y - origin.y(),
                y2: this.pot.bbox().y2 - origin.y(),
            }
        }
        this.hammerBox = function () {
            return {
                x: this.hammer.bbox().x - origin.x(),
                x2: this.hammer.bbox().x2 - origin.x(),
                y: this.hammer.bbox().y - origin.y(),
                y2: this.hammer.bbox().y2 - origin.y(),
            }
        }
    }
}

var player = new Player()
var ground = new Obstacle(-10000, 500, 20000, 1000)
new Obstacle(200, 450, 100, 50)
new Obstacle(100, 400, 100, 100)
new Obstacle(-900, 400, 1000, 100)
new Obstacle(100, 350, 100, 150)
new Obstacle(550, 400, 150, 100)
new Obstacle(650, 450, 40, 50)
new Obstacle(400, 470, 300, 30)
new Obstacle(800, 400, 100, 100)
new Obstacle(1900, 400, 1000, 100)
var canDo = true
function update(progress) {
    player.update()
    if (false) {
        if (canDo) {
            console.log(Math.random())
            canDo = false
        }
    }
    else canDo = true
}
var looping = 1
function toggleLoop() {
    looping = !looping
    if (looping) {
        window.requestAnimationFrame(loop)
    }
}

function loop(timestamp) {
    var progress = timestamp - lastRender
    update(progress)
    lastRender = timestamp
    if (looping) {
        window.requestAnimationFrame(loop)
    }
}
var lastRender = 0
window.requestAnimationFrame(loop)