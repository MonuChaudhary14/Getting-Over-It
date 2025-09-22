class Player {
    radius = 50;

    constructor() {
        this.character_position = {
            x : 1500,
            y : 23000-canvas.height
        }
        this.mouse_position = {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2
        };

        document.addEventListener("mousemove", (event) => this.update_hand(event));
    }

    update_hand(event) {
        this.mouse_position.x = event.clientX;
        this.mouse_positionposition.y = event.clientY;
    }
}

const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const background = new Image();
background.src = "./Images/GettingOverIt v2.png";

background.onload = function(){
    animate();
}

let current_position = 1500;
let speed = 1;  

const player = new Player();

function animate() {

    c.clearRect(0, 0, canvas.width, canvas.height); 

    let cameraX = player.character_position.x - canvas.width + 1500;
    let cameraY = player.character_position.y;


    c.drawImage(background, cameraX, cameraY, canvas.width, canvas.height ,0, 0, canvas.width, canvas.height);

    requestAnimationFrame(animate);
}
