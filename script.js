const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const CW = canvas.width = 800
const CH = canvas.height = 700

let gameSpeed = 0;

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
        this.speed = speedMod * gameSpeed;
    }
    update(){

    }
    draw(){
        
    }
}

function anim(){
    if(x<-2400) x=2400 -gameSpeed + x2;
    else x -= gameSpeed;
    if(x2 <-2400) x2 = 2400 +x -gameSpeed;
    else x2 -= gameSpeed;
    ctx.clearRect(0,0,CW,CH);
    ctx.drawImage(back1,0,0);
    ctx.drawImage(back4,x2,0);
    ctx.drawImage(back3,x,0);
    
    requestAnimationFrame(anim);
}
anim();