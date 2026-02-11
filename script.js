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

const commands = {
  help: () => "Comandos disponíveis: help, about, clear",
  about: () => "Sou o Diego, um desenvolvedor focado",
  clear: () => {
    historyElement.innerHTML = '';
    return "";
  }
};

inputElement.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const fullCommand = inputElement.value.trim().toLowerCase();
    const [cmd, ...args] = fullCommand.split(' '); // Já separa argumentos caso precise

    addLine(`<span class="prompt">user@diegosanches:~$</span> ${fullCommand}`);

    if (commands[cmd]) {
      const response = commands[cmd](args);
      if (response) addLine(response);
    } else if (fullCommand !== "") {
      addLine(`Comando não encontrado: ${cmd}. Digite 'help' para ajuda.`);
    }

    inputElement.value = '';
    historyElement.scrollTop = historyElement.scrollHeight; 
  }
});

function addLine(text) {
  const line = document.createElement('div');
  line.innerHTML = text;
  historyElement.appendChild(line);
}