const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
const canvasSize = 20; // 20 x 20 = 400px canvas
let score = 0;

let snake = [
  { x: 9 * box, y: 9 * box }
];

let food = {
  x: Math.floor(Math.random() * canvasSize) * box,
  y: Math.floor(Math.random() * canvasSize) * box
};

let direction;

document.addEventListener("keydown", setDirection);

function setDirection(event) {
  const key = event.keyCode;
  if (key === 37 && direction !== "RIGHT") direction = "LEFT";
  else if (key === 38 && direction !== "DOWN") direction = "UP";
  else if (key === 39 && direction !== "LEFT") direction = "RIGHT";
  else if (key === 40 && direction !== "UP") direction = "DOWN";
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dibuja la serpiente
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "#0f0" : "#fff";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  // Dibuja la comida
  ctx.fillStyle = "#f00";
  ctx.fillRect(food.x, food.y, box, box);

  // Posición de la cabeza
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (direction === "LEFT") snakeX -= box;
  if (direction === "UP") snakeY -= box;
  if (direction === "RIGHT") snakeX += box;
  if (direction === "DOWN") snakeY += box;

  // Verifica si comió
  if (snakeX === food.x && snakeY === food.y) {
    score++;
    document.getElementById("score").textContent = "Puntaje: " + score;
    food = {
      x: Math.floor(Math.random() * canvasSize) * box,
      y: Math.floor(Math.random() * canvasSize) * box
    };
  } else {
    snake.pop(); // elimina la cola si no comió
  }

  const newHead = { x: snakeX, y: snakeY };

  // Verifica colisiones
  if (
    snakeX < 0 || snakeX >= canvas.width ||
    snakeY < 0 || snakeY >= canvas.height ||
    collision(newHead, snake)
  ) {
    clearInterval(game);
    alert("¡Perdiste! Puntaje final: " + score);
  }

  snake.unshift(newHead);
}

function collision(head, body) {
  return body.some(segment => segment.x === head.x && segment.y === head.y);
}

const game = setInterval(draw, 100);
