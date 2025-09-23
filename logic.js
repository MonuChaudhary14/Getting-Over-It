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
    const currentTime = gameState.running ? Date.now() - gameState.startTime : 0;
    const minutes = Math.floor(currentTime / 60000);
    const seconds = Math.floor((currentTime % 60000) / 1000);

    document.getElementById('height').textContent = Math.floor(gameState.height);
    document.getElementById('time').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
gameLoop();

console.log('Game working');