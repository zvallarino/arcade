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

const PLAYERTWO_SIZE = 10;

const FOV = toRadians(60);

const COLORS = {
  floor: "#FF2700",
  ceiling: "#000000",
  wall:"#55AFFF",
  wallDark:"#0800FF",
  rays:"#FF002B",

}

const map = [
  [1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 0, 0, 0, 0],
  [1, 0, 1, 0, 0, 1, 1],
  [1, 0, 1, 0, 0, 0, 0],
  [1, 0, 1, 0, 0, 1, 1],
  [1, 0, 1, 0, 0, 0, 0],
  [1, 0, 1, 0, 0, 1, 1],
  [1, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1],
];

const player = {
  x: CELL_SIZE * 1.5,
  y: CELL_SIZE * 2.5,
  angle: 0,
  speed: 0
}

const playerTwo = {
  x: CELL_SIZE * 6.5,
  y: CELL_SIZE * 1.5,
  angle: 0,
  speed: 0
}

const playerThree = {
  x: CELL_SIZE * 6.5,
  y: CELL_SIZE * 3.5,
  angle: 0,
  speed: 0
}

const playerFour = {
  x: CELL_SIZE * 6.5,
  y: CELL_SIZE * 5.5,
  angle: 0,
  speed: 0
}

const playerFive = {
  x: CELL_SIZE * 6.5,
  y: CELL_SIZE * 7.5,
  angle: 0,
  speed: 0
}

function clearScreen(){
  // context.fillStyle = ""
  context.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)
}

function movePlayer(){
  player.x += Math.cos(player.angle) * player.speed;
  player.y += Math.sin(player.angle) * player.speed;
}

function outOfMapBounds(x,y){
  return x < 0 || x >= map[0].length || y < 0 || y >= map.length
}

function distance(x1, y1, x2, y2){
  return Math.sqrt(Math.pow(x2-x1,2) + Math.pow(y2 - y1,2))
}

function getVCollision(angle){
  const right = Math.abs(Math.floor((angle-Math.PI/2)/Math.PI) % 2)

  const firstX = right
  ? Math.floor(player.x / CELL_SIZE) * CELL_SIZE + CELL_SIZE
  : Math.floor(player.x / CELL_SIZE) * CELL_SIZE;

  const firstY = player.y + (firstX - player.x) * Math.tan(angle)

  const xA = right ? CELL_SIZE : -CELL_SIZE
  const yA = xA * Math.tan(angle)

  let wall; 
  let nextX = firstX;
  let nextY = firstY;

  while(!wall){
    const cellX = right
    ? Math.floor(nextX / CELL_SIZE)
    : Math.floor(nextX / CELL_SIZE) - 1;
    const cellY = Math.floor(nextY / CELL_SIZE)

    if(outOfMapBounds(cellX,cellY)){
      break
    }

    wall = map[cellY][cellX]
    if(!wall){
      nextX += xA
      nextY += yA
    }

  }

  return { angle, distance: distance(player.x, player.y, nextX, nextY), vertical:true}
}

function getHCollision(angle){
  const up = Math.abs(Math.floor(angle / Math.PI) % 2);

  const firstY = up
  ? Math.floor(player.y / CELL_SIZE) * CELL_SIZE
  : Math.floor(player.y / CELL_SIZE) * CELL_SIZE + CELL_SIZE;

  const firstX = player.x + (firstY - player.y) /Math.tan(angle);

  const yA = up ? -CELL_SIZE : CELL_SIZE;
  const xA = yA/ Math.tan(angle)

  let wall; 
  let nextX = firstX;
  let nextY = firstY;

  while(!wall){
    const cellX = Math.floor(nextX / CELL_SIZE);
    const cellY = up
    ? Math.floor(nextY / CELL_SIZE)- 1
    : Math.floor(nextY / CELL_SIZE);
 
    if(outOfMapBounds(cellX,cellY)){
      break
    }

    wall = map[cellY][cellX]
    if(!wall){
      nextX += xA
      nextY += yA
    }

  }

  return { angle, distance: distance(player.x, player.y, nextX, nextY), vertical:false}


}

function castRay(angle){
  const vCollision = getVCollision(angle);
  const hCollision = getHCollision(angle);

  return hCollision.distance >= vCollision.distance ? vCollision : hCollision
}

function getRays(){
  const initialAngle = player.angle - FOV/2
  const numberOfRays = SCREEN_WIDTH;
  const angleStep = FOV / numberOfRays;
  return Array.from({ length: numberOfRays }, (_, i) => {
    const angle = initialAngle + i * angleStep;
    const ray = castRay(angle)
    return ray
  });
}

function fixFishEye(distance, angle, playerAngle){
  const diff = angle - playerAngle;
  return distance * Math.cos(diff)
}

function renderScene(rays){
  rays.forEach((ray, i) => {
    const distance = fixFishEye(ray.distance,ray.angle,player.angle);
    const wallHeight = ((CELL_SIZE * 5) / distance) * 277;
    context.fillStyle = ray.vertical ? COLORS.wallDark : COLORS.wall;
    context.fillRect(i, SCREEN_HEIGHT / 2 - wallHeight, 1, wallHeight)
 
    context.fillStyle = COLORS.floor;
    context.fillRect(
      i,
      SCREEN_HEIGHT / 2 + wallHeight / 2,
      1,
      SCREEN_HEIGHT / 2 - wallHeight / 2
      );
    
    context.fillStyle = COLORS.ceiling;
    context.fillRect(
      i,
      0,
      1,
      SCREEN_HEIGHT / 2 - wallHeight / 2
      );
  } )

}

function renderMinimap(posX = 0,posY = 0, scale = 1, rays){
  const cellSize = scale * CELL_SIZE;
  map.forEach((row,y) => {
    row.forEach( (cell,x) => {
      if(cell){
        context.fillStyle = "#62FF55"
        context.fillRect(posX + x * cellSize, posY + y * cellSize, cellSize, cellSize)
      }
    })
  })

  
  context.strokeStyle = COLORS.rays;
  rays.forEach(ray=>{
    context.beginPath()
    context.moveTo(player.x * scale + posX, player.y * scale + posY)
    context.lineTo(
      (player.x + Math.cos(ray.angle) * ray.distance) * scale,
      (player.y + Math.sin(ray.angle) * ray.distance) * scale,
    )
    context.closePath()
    context.stroke()
    })


  context.fillStyle="green"
  context.fillRect(
    posX + playerTwo.x * scale - PLAYER_SIZE/2,
    posY + playerTwo.y * scale - PLAYER_SIZE/2,
    PLAYER_SIZE,
    PLAYER_SIZE
  )

  context.fillStyle="red"
  context.fillRect(
    posX + playerThree.x * scale - PLAYER_SIZE/2,
    posY + playerThree.y * scale - PLAYER_SIZE/2,
    PLAYER_SIZE,
    PLAYER_SIZE
  )

  context.fillStyle="yellow"
  context.fillRect(
    posX + playerFour.x * scale - PLAYER_SIZE/2,
    posY + playerFour.y * scale - PLAYER_SIZE/2,
    PLAYER_SIZE,
    PLAYER_SIZE
  )

  context.fillStyle="purple"
  context.fillRect(
    posX + playerFive.x * scale - PLAYER_SIZE/2,
    posY + playerFive.y * scale - PLAYER_SIZE/2,
    PLAYER_SIZE,
    PLAYER_SIZE
  )

  context.fillStyle="#0800FF"
  context.fillRect(
    posX + player.x * scale - PLAYER_SIZE/2,
    posY + player.y * scale - PLAYER_SIZE/2,
    PLAYER_SIZE,
    PLAYER_SIZE
  )


  

  const rayLength = PLAYER_SIZE * 2;
  context.strokeStyle = "#00C215";
  context.beginPath()
  context.moveTo(player.x * scale + posX, player.y * scale + posY)
  context.lineTo(
    (player.x + Math.cos(player.angle) * rayLength) * scale,
    (player.y + Math.sin(player.angle) * rayLength) * scale,
  )
  context.closePath()
  context.stroke()

}

function gameLoop(){
  clearScreen()
  movePlayer()
  const rays = getRays()
  renderScene(rays)
  renderMinimap(0, 0, 0.75, rays)
}

setInterval(gameLoop, TICK)

function toRadians(deg){
  return (deg * Math.PI)/ 180
}

document.addEventListener("keydown",(e)=>{
  if(e.key === "w"){
    player.speed = 2
  }
  if(e.key === "s"){
    player.speed = -2
  }
})

document.addEventListener("keyup",(e)=>{
  if(e.key === "w" || e.key === "s"){
    player.speed = 0
  }
})

document.addEventListener("mousemove", (e)=>{
  player.angle += toRadians(e.movementX)
})
