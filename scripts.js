const message = document.querySelector('.message');
const pLose = message.querySelector('.lose-p');
const pWin = message.querySelector('.win-p');
const yButton = message.querySelector('#y-button');
const nButton = message.querySelector('#n-button');

const minGap = 200;
const maxGap = 450;
const randGap = () => Math.floor(minGap + Math.random() * (maxGap - minGap + 1));
let gap = randGap();

class Obstacle {
  minHeight = 20;
  maxHeight = 100;
  minWidth = 10;
  maxWidth = 20;
  height = Math.floor(this.minHeight + Math.random() * (this.maxHeight - this.minHeight + 1));
  width = Math.floor(this.minWidth + Math.random() * (this.maxWidth - this.minWidth + 1));
  x = 1200;
  y = gameArea.canvas.height - this.height;

  draw = () => {
    gameArea.context.fillStyle = '#fabbba';
    gameArea.context.fillRect(this.x, this.y, this.width, this.height);
  };
}

const player = {
  x: 575,
  y: 475,
  speedY: 0,
  update: function () {
    gameArea.context.fillStyle = '#dbbafa';
    const ball = new Path2D();
    ball.arc(this.x, this.y, 25, 0, 2 * Math.PI);
    gameArea.context.fill(ball);
  },
  newPos: function () {
    if (this.y < 280) {
      this.speedY = 2;
    }
    this.y = this.y + this.speedY;
    if (this.speedY === 2 && this.y === 475) {
      this.speedY = 0;
    }
  },
  crash: function (obs) {
    return this.x + 25 > obs.x && this.x < obs.x + obs.width && this.y + 25 > obs.y;
  },
  jump: function () {
    if (this.y < 475) {
      return;
    }
    this.speedY -= 2;
  },
};

const gameArea = {
  myObstacles: [],
  canvas: document.createElement('canvas'),
  start: function () {
    this.canvas.height = 500;
    this.canvas.width = 1200;
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.context = this.canvas.getContext('2d');
    this.frame = 0;
    this.score = 0;
    this.addText('Score: ', 900, 50);
    this.addText('Press any key to jump', 100, 50);
    this.addText('Goal', 900, 80);
    this.interval = setInterval(this.updateGameArea.bind(this), 5);
    window.addEventListener('keydown', player.jump.bind(player));
  },
  updateGameArea: function () {
    for (let i = 0; i < this.myObstacles.length; i++) {
      if (player.crash(this.myObstacles[i])) {
        this.gameLost();
        return;
      }
    }
    this.clear();
    if (this.everyInterval(gap)) {
      this.myObstacles.push(new Obstacle());
      gap = randGap();
      this.frame = 0;
    }
    for (let i = 0; i < this.myObstacles.length; i++) {
      this.myObstacles[i].x -= 1;
      this.myObstacles[i].draw();
    }
    player.newPos();
    player.update();
    this.frame += 1;
    this.score += 0.01;
    this.addText(`Score: ${Math.floor(this.score)}`, 900, 50);
    this.addText('Press any key to jump', 100, 50);
    this.addText('Goal: 30', 900, 80);
    if (Math.floor(this.score) === 30) {
      this.gameWon();
    }
  },
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  everyInterval: function (n) {
    return this.frame % n === 0;
  },
  addText: function (text, x, y) {
    this.context.fillStyle = 'gray';
    this.context.font = '30px Consolas';
    this.context.fillText(text, x, y);
  },
  gameLost: function () {
    clearInterval(this.interval);
    message.style.display = 'block';
    pWin.style.display = 'none';
  },
  gameWon: function () {
    clearInterval(this.interval);
    message.style.display = 'block';
    pLose.style.display = 'none';
  },
};

const startGame = () => {
  gameArea.start();
};

window.addEventListener('load', startGame);
yButton.addEventListener('click', () => window.location.reload());
nButton.addEventListener('click', () => (message.style.display = 'none'));
