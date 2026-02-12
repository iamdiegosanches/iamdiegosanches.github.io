import { runWired } from './src/wired/interpreter.js';

// Efeito de Accordion para os projetos
var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function () {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    
    // Lógica para expandir/colapsar
    if (content.style.maxHeight) {
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
}

// Log temático no console do navegador
// console.log("%c SYSTEM BOOT... ", "background: #000; color: #00ff41; font-size: 20px");
// console.log("%c WELCOME TO THE WIRED ", "background: #000; color: #bd00ff; font-size: 15px");


const historyElement = document.getElementById('terminal-history');
const inputElement = document.getElementById('terminal-input');

// Logica para o historico
let commandHistory = [];
let historyIndex = -1;

const commands = {
  help: () => "Comandos disponíveis: help, about, clear, snake",
  about: () => "Sou o Diego, um desenvolvedor focado",
  clear: () => {
    historyElement.innerHTML = '';
    return "";
  },
  snake: () => {
    startSnake();
    return "Iniciando snake_exe.bat...";
  },
  wired: () => {
    document.getElementById('ide-window').style.display = 'block';
    return "Iniciando wired_interpreter.exe...";
  }
};

inputElement.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const fullCommand = inputElement.value.trim();
    
    if (fullCommand !== "") {
      commandHistory.push(fullCommand);
      historyIndex = commandHistory.length;
      
      const cmd = fullCommand.toLowerCase().split(' ')[0];
      const args = fullCommand.split(' ').slice(1);

      addLine(`<span class="prompt">user@diegosanches:~$</span> ${fullCommand}`);

      if (commands[cmd]) {
        const response = commands[cmd](args);
        if (response) addLine(response);
      } else {
        addLine(`Comando não encontrado: ${cmd}. Digite 'help' para ajuda.`);
      }
    }

    inputElement.value = '';
    historyElement.scrollTop = historyElement.scrollHeight; 
  } 
  
  else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (historyIndex > 0) {
      historyIndex--;
      inputElement.value = commandHistory[historyIndex];
    }
  } 
  
  else if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (historyIndex < commandHistory.length - 1) {
      historyIndex++;
      inputElement.value = commandHistory[historyIndex];
    } else {
      historyIndex = commandHistory.length;
      inputElement.value = '';
    }
  }
});

function addLine(text) {
  const line = document.createElement('div');
  line.innerHTML = text;
  historyElement.appendChild(line);
}



// ========================================================================================
// JOGO SNAKE
// ========================================================================================

let canvas, ctx, gameInterval;
let snake, food, dx, dy, score;
let isGameOver = false;
let best_score = 0;

function startSnake() {
    isGameOver = false;
    document.getElementById('snake-window').style.display = 'block';
    canvas = document.getElementById('snakeGame');
    ctx = canvas.getContext('2d');
    
    snake = [{x: 150, y: 150}, {x: 140, y: 150}, {x: 130, y: 150}];
    food = {x: 0, y: 0};
    dx = 10; dy = 0; score = 0;
    document.getElementById('snake-score').innerText = "SCORE: 000";
    createFood();
    
    if(gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(main, 100);
    
    document.addEventListener('keydown', changeDirection);
}

function setBestScore(score) {
  document.getElementById('best-score').innerText = "BEST: " + score;
}

function main() {
    if (didGameEnd()) {
        isGameOver = true;
        setBestScore(best_score);
        clearInterval(gameInterval);
        drawGameOver();
        return;
    }
    clearCanvas();
    drawFood();
    advanceSnake();
    drawSnake();
}

function drawGameOver() {
    ctx.fillStyle = "rgba(139, 172, 15, 0.8)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#0f380f";
    ctx.font = "30px 'VT323'";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 10);
    
    ctx.font = "16px 'VT323'";
    ctx.fillText("PRESS ANY KEY TO RESTART", canvas.width / 2, canvas.height / 2 + 20);
}

function clearCanvas() {
    ctx.fillStyle = "#8bac0f"; // Cor do Gameboy original
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    snake.forEach(part => {
        ctx.fillStyle = "#0f380f"; // Pixel escuro
        ctx.strokeStyle = "#8bac0f";
        ctx.fillRect(part.x, part.y, 10, 10);
        ctx.strokeRect(part.x, part.y, 10, 10);
    });
}

function advanceSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);
    if (snake[0].x === food.x && snake[0].y === food.y) {
        score += 10;
        if (score >= best_score) {
          best_score = score;
        }
        
        document.getElementById('snake-score').innerText = "SCORE: " + score;
        createFood();
    } else {
        snake.pop();
    }
}

function didGameEnd() {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    const hitLeft = snake[0].x < 0;
    const hitRight = snake[0].x > canvas.width - 10;
    const hitTop = snake[0].y < 0;
    const hitBottom = snake[0].y > canvas.height - 10;
    return hitLeft || hitRight || hitTop || hitBottom;
}

function createFood() {
    food.x = Math.floor(Math.random() * (canvas.width / 10)) * 10;
    food.y = Math.floor(Math.random() * (canvas.height / 10)) * 10;
}

function drawFood() {
    ctx.fillStyle = "#0f380f";
    ctx.fillRect(food.x, food.y, 10, 10);
}

function changeDirection(event) {
    if (isGameOver) {
        startSnake();
        return;
    }

    const LEFT_KEY = 37, RIGHT_KEY = 39, UP_KEY = 38, DOWN_KEY = 40;
    const keyPressed = event.keyCode;

    if (keyPressed === LEFT_KEY && dx !== 10) { dx = -10; dy = 0; }
    if (keyPressed === UP_KEY && dy !== 10) { dx = 0; dy = -10; }
    if (keyPressed === RIGHT_KEY && dx !== -10) { dx = 10; dy = 0; }
    if (keyPressed === DOWN_KEY && dy !== -10) { dx = 0; dy = 10; }
    
    if([37, 38, 39, 40].includes(keyPressed)) event.preventDefault();
}

document.getElementById('close-snake').addEventListener('click', closeSnake);
export function closeSnake() {
    document.getElementById('snake-window').style.display = 'none';
    clearInterval(gameInterval);
    document.removeEventListener('keydown', changeDirection);
}

function makeDraggable(windowElement) {
    const header = windowElement.querySelector('.window-bar');
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    header.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        windowElement.style.top = (windowElement.offsetTop - pos2) + "px";
        windowElement.style.left = (windowElement.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

makeDraggable(document.getElementById('snake-window'));
makeDraggable(document.getElementById('ide-window'));

// ========================================================================================
// WIRED
// ========================================================================================

const btnPlay = document.getElementById('btn-play');
const codeEditor = document.getElementById('code-editor');
const ideOutput = document.getElementById('ide-output');

const examplePrograms = {
    clear: "-- Comece seu programa abaixo\n",
    hello: "-- Bem-vindo à Wired\nSIGNAL power = 100\nEMIT power",
    calc: "-- Cálculos de sinal\nSIGNAL base = 50\nSIGNAL boost = base * 2\nEMIT boost + 10",
    error: "-- Teste de erro\nEMIT sinal_inexistente"
};

const dropdown = document.getElementById('example-programs');
const editor = document.getElementById('code-editor');

dropdown.addEventListener('change', (e) => {
    if (examplePrograms[e.target.value]) {
        editor.value = examplePrograms[e.target.value];
    }
});

btnPlay.addEventListener('click', async () => {
    const code = codeEditor.value;
    ideOutput.innerHTML = ''; 
    
    try {
        const result = await runWired(code);
        const line = document.createElement('div');
        line.textContent = `> ${result}`;
        ideOutput.appendChild(line);
    } catch (err) {
        const errorLine = document.createElement('div');
        errorLine.style.color = "#ff5555";
        errorLine.textContent = `!! ERROR: ${err.message}`;
        ideOutput.appendChild(errorLine);
    }
});

document.getElementById('close-ide').addEventListener('click', closeIDE);
export function closeIDE() {
    document.getElementById('ide-window').style.display = 'none';
    clearInterval(gameInterval);
    document.removeEventListener('keydown', changeDirection);
}

document.getElementById('btn-pause').addEventListener('click', () => {
    document.getElementById('ide-output').innerHTML = "<span style='color: #win-dark'>Sincronização pausada...</span>";
});