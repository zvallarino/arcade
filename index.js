const SCREEN_WIDTH = window.innerWidth;
const SCREEN_HEIGHT = window.innerHeight;

const canvas = document.getElementById("canvas");
canvas.style.backgroundColor = "green";
canvas.setAttribute("width", SCREEN_WIDTH);
canvas.setAttribute("height", SCREEN_HEIGHT);

const context = canvas.getContext("2d")

const TICK = 30; 

const CELL_SIZE = 64;

const PLAYER_SIZE = 10;

const map = [
  [1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 1, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1],
];

const player = {
  x: CELL_SIZE * 1.5,
  y: CELL_SIZE * 2,
  angle: 0,
  speed: 0
}

function clearScreen(){
  context.fillStyle = "#54fbff"
  context.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)
}

function movePlayer(){}
function getRays(){}
function renderScene(rays){}


function renderMinimap(posX = 0,posY = 0, scale = 1, rays){
  const cellSize = scale * CELL_SIZE;
  map.forEach((row,y) => {
    row.forEach( (cell,x) => {
      if(cell){
        context.fillStyle = "#fff821"
        context.fillRect(posX + x * cellSize, posY + y * cellSize, cellSize, cellSize)
      }
    })
  })

  context.fillStyle="#ff2121"
  context.fillRect(
    posX + player.x * scale - PLAYER_SIZE/2,
    posY + player.y * scale - PLAYER_SIZE/2,
    PLAYER_SIZE,
    PLAYER_SIZE
  )

  const rayLength = PLAYER_SIZE * 2;
  context.strokeStyle = "#21ff6b";
  context.beginPath()
  context.moveTo(player.x * scale + posX, player.y * scale + posy )
}

function gameLoop(){
  clearScreen()
  movePlayer()
  const rays = getRays()
  renderScene(rays)
  renderMinimap(0, 0, 0.75, rays)
}

setInterval(gameLoop, TICK)

