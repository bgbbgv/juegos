const rows = 10;
const cols = 10;
const mineCount = 10;
let board = [];
let flags = mineCount;
let timer = 0;
let timerInterval;
let revealedCells = 0;
let gameOver = false;

const boardEl = document.getElementById("board");
const flagsEl = document.getElementById("flags");
const timerEl = document.getElementById("timer");
const leaderboardEl = document.getElementById("leaderboard");

function startGame() {
  board = [];
  revealedCells = 0;
  flags = mineCount;
  gameOver = false;
  boardEl.innerHTML = '';
  clearInterval(timerInterval);
  timer = 0;
  timerEl.textContent = timer;
  flagsEl.textContent = flags;
  timerInterval = setInterval(() => {
    timer++;
    timerEl.textContent = timer;
  }, 1000);

  // Crear tablero
  for (let r = 0; r < rows; r++) {
    board[r] = [];
    for (let c = 0; c < cols; c++) {
      board[r][c] = {
        mine: false,
        revealed: false,
        flagged: false,
        element: createCellElement(r, c)
      };
    }
  }

  // Colocar minas
  let placed = 0;
  while (placed < mineCount) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (!board[r][c].mine) {
      board[r][c].mine = true;
      placed++;
    }
  }
}

function createCellElement(r, c) {
  const el = document.createElement("div");
  el.className = "cell";
  el.oncontextmenu = (e) => {
    e.preventDefault();
    toggleFlag(r, c);
  };
  el.onclick = () => reveal(r, c);
  boardEl.appendChild(el);
  return el;
}

function toggleFlag(r, c) {
  const cell = board[r][c];
  if (cell.revealed || gameOver) return;
  if (!cell.flagged && flags > 0) {
    cell.flagged = true;
    cell.element.classList.add("flag");
    cell.element.textContent = "🚩";
    flags--;
  } else if (cell.flagged) {
    cell.flagged = false;
    cell.element.classList.remove("flag");
    cell.element.textContent = "";
    flags++;
  }
  flagsEl.textContent = flags;
}

function reveal(r, c) {
  const cell = board[r][c];
  if (cell.revealed || cell.flagged || gameOver) return;

  cell.revealed = true;
  cell.element.classList.add("revealed");

  if (cell.mine) {
    cell.element.classList.add("mine");
    cell.element.textContent = "💣";
    endGame(false);
  } else {
    const minesAround = countMinesAround(r, c);
    if (minesAround > 0) {
      cell.element.textContent = minesAround;
    } else {
      for (let i = r - 1; i <= r + 1; i++) {
        for (let j = c - 1; j <= c + 1; j++) {
          if (i >= 0 && i < rows && j >= 0 && j < cols) {
            reveal(i, j);
          }
        }
      }
    }
    revealedCells++;
    if (revealedCells === rows * cols - mineCount) {
      endGame(true);
    }
  }
}

function countMinesAround(r, c) {
  let count = 0;
  for (let i = r - 1; i <= r + 1; i++) {
    for (let j = c - 1; j <= c + 1; j++) {
      if (
        i >= 0 && i < rows && j >= 0 && j < cols &&
        board[i][j].mine
      ) count++;
    }
  }
  return count;
}

function endGame(win) {
  gameOver = true;
  clearInterval(timerInterval);
  alert(win ? "🎉 ¡Ganaste!" : "💥 ¡Perdiste!");
  if (win) {
    const name = prompt("Ingresa tu nombre:");
    const score = { name, time: timer };
    const scores = JSON.parse(localStorage.getItem("scores") || "[]");
    scores.push(score);
    localStorage.setItem("scores", JSON.stringify(scores));
    mostrarClasificacion();
  }
}

function mostrarClasificacion() {
  const scores = JSON.parse(localStorage.getItem("scores") || "[]")
    .sort((a, b) => a.time - b.time)
    .slice(0, 5);
  leaderboardEl.innerHTML = "";
  scores.forEach(s => {
    const li = document.createElement("li");
    li.textContent = `${s.name} - ${s.time}s`;
    leaderboardEl.appendChild(li);
  });
}

function resetGame() {
  startGame();
  mostrarClasificacion();
}

window.onload = resetGame;