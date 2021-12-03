//Canvas setup
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;

let score = 0;
let gameFrame = 0;
ctx.font = '50px Georgia';
//Mouse Interactivity
let canvasPosition = canvas.getBoundingClientRect();
const mouse = {
	x: canvas.width/2,
	y: canvas.height/2,
	click:false
}
canvas.addEventListener('mousedown',function(event){
	mouse.click = true;
	mouse.x = event.x - canvasPosition.left;
	mouse.y = event.y - canvasPosition.top;
});
canvas.addEventListener('mouseup',function(event){
 mouse.click = false;

});
//Player
const playerLeft = new Image();
playerLeft.src = 'fish_swim_left.png';
const playerRight = new Image();
playerRight.src = 'fish_swim_right.png';
class Player{
	constructor(){
		this.x = canvas.width;
		this.y = canvas.height/2;
		this.radius = 50;
		this.angle = 0;
		this.frameX = 0;
		this.frameY = 0;
		this.frame = 0;
		this.spriteWidth = 498;
		this.spriteWeight = 327;
	}
	update(){
		const dx = this.x - mouse.x;
		const dy = this.y - mouse.y;
		if (mouse.x != this.x) {
			this.x -= dx/20;
		}
		if (mouse.y != this.y) {
			this.y -= dy/20;
		}
	}
	draw(){
		if (mouse.click) {
			ctx.lineWidth = 0.2;
			ctx.beginPath();
			ctx.moveTo(this.x,this.y);
			ctx.lineTo(mouse.x,mouse.y);
		}
		ctx.fillStyle = 'red';
		ctx.beginPath();
		ctx.arc(this.x,this.y,this.radius,0,Math.PI * 2);
		ctx.fill();
		ctx.closePath();
		ctx.fillRect(this.x,this.y,this.radius,10);
		ctx.drawImage(playerLeft,this.frameX * this.spriteWidth,
			this.frameY*this.spriteHeight,this.spriteWidth,this.spriteHeight,
			this.x - 60,this.y - 40,this.spriteWidth/4,this.spriteHeight/4);
	}

}
const player = new Player();
//Bubbles
const bubbleArray = [];
class Bubble{
	constructor(){
		this.x = Math.random() * canvas.width;
		this.y = canvas.height + 100;
		this.radius = 50;
		this.speed = Math.random() * 5 + 1;
		this.distance;
		this.counted = false;
		this.sound = Math.random() <= 0.5 ? 'sound1' : 'sound2';
	}
	update(){
		this.y -= this.speed;
		const dx = this.x - player.x;
		const dy = this.y - player.y;
		this.distance = Math.sqrt(dx*dx + dy*dy);
	}
	draw(){
		ctx.fillStyle = 'blue';
		ctx.beginPath();
		ctx.arc(this.x,this.y,this.radius,0,Math.PI * 2);
		ctx.fill();
		ctx.closePath();
		ctx.stroke();
	}
}
const bublePop1 = document.createElement('audio');
bublePop1.src = 'Plog.wav';
const bublePop2 = document.createElement('audio');
bublePop2.src = 'bubbles.wav';
function handleBubbles(){
	if (gameFrame % 50 == 0) {
		bubbleArray.push(new Bubble());
	}
	for(let i = 0;i < bubbleArray.length; i++){
		bubbleArray[i].update();
		bubbleArray[i].draw();
		for(let i=0;i < bubbleArray.length;i++){
			if (bubbleArray[i].y < 0 - bubbleArray[i].radius*2) {
				bubbleArray.splice(i,1);
			}
			if (bubbleArray[i].distance < bubbleArray[i].radius + player.radius) {
				if (!bubbleArray[i].counted) {
					if (bubbleArray.sound == 'sound1') {
						bublePop1.play();
					}
					score++;
					bubbleArray[i].counted = true;
					bubbleArray.splice(i,1);
				}
			}
		}
	}
}
//Animation Loop
function animate(){
	ctx.clearRect(0,0,canvas.width,canvas.height);
	handleBubbles();
	player.update();
	player.draw();
	ctx.fillStyle = 'black';
	ctx.fillText('score :'+score,10,50);
	gameFrame++;
	requestAnimationFrame(animate);
}
animate();