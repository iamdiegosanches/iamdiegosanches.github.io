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
console.log("%c SYSTEM BOOT... ", "background: #000; color: #00ff41; font-size: 20px");
console.log("%c WELCOME TO THE WIRED ", "background: #000; color: #bd00ff; font-size: 15px");