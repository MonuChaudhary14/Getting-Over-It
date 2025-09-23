const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const CW = canvas.width = 800
const CH = canvas.height = 700

let gameSpeed = 4;

const back1 = new Image();
back1.src = './assets/layer-1.png';
const back2 = new Image();
back2.src = './assets/layer-2.png';
const back3 = new Image();
back3.src = './assets/layer-3.png';
const back4 = new Image();
back4.src = './assets/layer-4.png';
const back5 = new Image();
back5.src = './assets/layer-5.png';

class Layer {
    constructor(image , speedMod) {
        this.x = 0;
        this.y =0;
        this.w = 2400;
        this.h = 700;
        this.x2 = this.w;
        this.image = image;
        this.speedMod = speedMod;
        this.speed = this.speedMod * gameSpeed;
    }
    update(){
        this.speed = this.speedMod * gameSpeed;
        if(this.x < -this.w){ this.x = this.w - gameSpeed + this.x2}
        if(this.x2 < -this.w){ this.x2 = this.w - gameSpeed + this.x}
        this.x = Math.floor(this.x -this.speed)
        this.x2 = Math.floor(this.x2 -this.speed)
    }
    draw(){
        ctx.drawImage(this.image,this.x , this.y , this.w , this.h)
        ctx.drawImage(this.image,this.x2 , this.y , this.w , this.h)
    }
}

const layer1 = new Layer(back1,0.2);
const layer2 = new Layer(back2,0.4);
const layer3 = new Layer(back3,0.6);
const layer5 = new Layer(back5,1);

const layers = [layer1,layer2,layer3,layer5];

function anim(){
    ctx.clearRect(0,0,CW,CH);
    layers.forEach(ob =>{
        ob.update();
        ob.draw();
    })
    requestAnimationFrame(anim);
}
//feature1 popup message
class FallMessage {
    constructor() {
        this.messages = [
            "Oops!you fall!",
            "beter luck next time!",
            "you lose!",
            "gravity wins!"

        ];
        this.popup = document.getElementById("popup");
    }
    show() {
        const msg = this.messages[Math.floor(Math.random() * this.messages.length)];
        this.popup.innerText = msg;
        this.popup.style.display = "block";
        setTimeout(() => this.popup.style.display = "none", 2000);
    }
}
if (player.isFalling()) {
    FallMessage.show();
}
//feature2 sound effect
const hammersound =[new Audio(), new Audio(), new Audio()];
function hammercollision(){
    const sound = hammersound[Math.floor(Math.random() * hammersound.length)]; 
    sound.currentTime = 0 ; 
    sound.play();
}
anim();