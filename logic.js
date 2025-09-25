const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let gameState = {
    running: false,
    startTime: 0,
    height: 0
};
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateUI();
    requestAnimationFrame(gameLoop);
}
function updateUI() {
    const currentTime = gameState.running ? Date.now() - gameState.startTime-pausetime: 0;
    const minutes = Math.floor(currentTime / 60000);
    const seconds = Math.floor((currentTime % 60000) / 1000);

    document.getElementById('height').textContent = Math.floor(gameState.height);
    document.getElementById('time').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
function restartgame(){
    gameState.running=false;
    gameState.height=0;
    pausetime=0;
    pausestart=0;
    gameState.startTime=0;
    document.getElementById("height").textContent = 0;
    document.getElementById("time").textContent = "0:00";

    play.style.display = "inline-block";
    pause.style.display = "none";
    resume.style.display = "none";
    restart.style.display = "none";

}
gameLoop();
let pausetime=0;
let pausestart=0;

const play = document.getElementById("play");
const pause = document.getElementById("pause");
const resume=document.getElementById("resume");
const restart=document.getElementById("restart");

play.addEventListener("click",()=>{
    gameState.running=true;
    gameState.startTime = Date.now();
    pausetime=0;

    play.style.display="none";
    pause.style.display="inline-block";
    resume.style.display="none";
});

pause.addEventListener("click",()=>{
    if(gameState.running){
        gameState.running =false;
        pausestart= Date.now();
        pause.style.display="none";
        resume.style.display="inline-block";
    }
});

resume.addEventListener("click",()=>{
    if(!gameState.running){
        gameState.running=true;
        pausetime+= Date.now() -pausestart;

        pause.style.display= "inline-block";
        resume.style.display="none";
    }
});
restart.addEventListener("click",()=>{
    restartgame();
});

console.log('Game working');