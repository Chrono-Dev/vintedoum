const fases = [
  {
    palavras: ["solar"],
    mensagem:
      "🌟 Você é como o sol amor, exalta um brilho próprio, uma exuberancia linda de se ver, iluminando tudo ao seu redor."
  },
  {
    palavras: ["lunar", "calma"],
    mensagem:
      "☁️ Você é como a lua, trazendo uma luz em meio a escuridão, uma calmaria no meio do caos, uma perfeição da natureza."
  },
  {
    palavras: ["senso", "firme", "linda", "criar"],
    mensagem:
      "🪐 Você tem muito SENSO, é sensata, sábia e inteligente e acho incrível quanto você consegue pensar rápido e resolver problemas, tem muito conhecimento com você. Você é firme, firme com seu senso de moral, que você segue a risca, firme com os pés no chão, sempre se esforçando, com garra pra conquistar o que é seu. Você é linda linda linda, a MULHER mais linda do mundo, uma beleza estonteante, como uma brisa de verão, um cobertor no inverno, tão bela quanto todas as paisagens vistas, e não vistas, todos os nasceres e pores do sol, a beleza desse planeta e de outros. Você tem o dom de criar, criar idéias, artes, amor, você consegue criar coisas amor, e coisas tão gostosas de se presenciar, de se admirar."
  }
];

// mensagem FINAL FINAL
const mensagemFinal =
  "💖 Feliz aniversário meu bem, feliz 20 anos, hoje, comemoramos duas décadas de Brenda nesse planeta Terra, e por mais que eu só esteja aqui no último ano (e uns quebrados), eu já sei o porque esse dia é tão importante, você é uma pessoa maravilhosa, e o SEU dia tem que ser comemorado, com toda a felicidade do mundo, porque você é uma grande adição pra esse nosso mundo, e principalmente, pra minha vida. Feliz aniversário minha estrela, meu bem, meu amor, que seus  próximos anos sejam maravilhosos e que esse seja um ano ótimo, com a gente junto, sempre em frente!.";

let faseAtual = 0;
let linhaAtual = 0;
let colunaAtual = 0;
let terminou = false;

let boards = [];
let currentGuess = [];

const boardsContainer = document.getElementById("boards");
const title = document.getElementById("title");

/* ================= POPUP ================= */

const overlay = document.createElement("div");
overlay.id = "overlay";

overlay.innerHTML = `
  <div id="popup">
    <h2 id="popup-title"></h2>
    <p id="popup-message"></p>
    <button id="popup-button"></button>
  </div>
`;

document.body.appendChild(overlay);

const popupTitle = document.getElementById("popup-title");
const popupMessage = document.getElementById("popup-message");
const popupButton = document.getElementById("popup-button");

/* ========================================= */

function iniciarFase() {
  boardsContainer.innerHTML = "";
  boards = [];
  linhaAtual = 0;
  colunaAtual = 0;
  currentGuess = [];
  terminou = false;

  title.textContent = `TERMO — Fase ${faseAtual + 1}`;

  const palavras = fases[faseAtual].palavras.map(p => p.toLowerCase());
  const total = palavras.length;

  boardsContainer.style.gridTemplateColumns =
    total === 1 ? "repeat(1, auto)" : "repeat(2, auto)";

  palavras.forEach(palavra => {
    const boardEl = document.createElement("div");
    boardEl.className = "board";

    for (let i = 0; i < 6; i++) {
      const row = document.createElement("div");
      row.className = "row";

      for (let j = 0; j < 5; j++) {
        const tile = document.createElement("div");
        tile.className = "tile";
        row.appendChild(tile);
      }

      boardEl.appendChild(row);
    }

    boardsContainer.appendChild(boardEl);

    boards.push({
      palavra,
      resolvido: false,
      element: boardEl
    });
  });
}

iniciarFase();

/* ================= INPUT ================= */

document.addEventListener("keydown", e => {
  if (terminou || overlay.style.display === "flex") return;

  if (e.key === "Backspace") removerLetra();
  else if (e.key === "Enter") enviarPalpite();
  else if (/^[a-zA-Z]$/.test(e.key)) adicionarLetra(e.key.toLowerCase());
});

function adicionarLetra(letra) {
  if (colunaAtual >= 5) return;

  currentGuess.push(letra);

  boards.forEach(b => {
    if (b.resolvido) return;
    b.element.children[linhaAtual].children[colunaAtual].textContent = letra;
  });

  colunaAtual++;
}

function removerLetra() {
  if (colunaAtual === 0) return;

  colunaAtual--;
  currentGuess.pop();

  boards.forEach(b => {
    if (b.resolvido) return;
    b.element.children[linhaAtual].children[colunaAtual].textContent = "";
  });
}

function enviarPalpite() {
  if (currentGuess.length < 5) return;

  const guess = currentGuess.join("");

  boards.forEach(b => {
    if (b.resolvido) return;

    const row = b.element.children[linhaAtual];

    for (let i = 0; i < 5; i++) {
      const tile = row.children[i];

      tile.classList.remove("correct", "present", "absent");

      if (guess[i] === b.palavra[i]) tile.classList.add("correct");
      else if (b.palavra.includes(guess[i])) tile.classList.add("present");
      else tile.classList.add("absent");
    }

    if (guess === b.palavra) {
      b.resolvido = true;
    }
  });

  if (boards.every(b => b.resolvido)) {
    mostrarPopupFase();
    return;
  }

  linhaAtual++;
  colunaAtual = 0;
  currentGuess = [];
}

/* ================= POPUPS ================= */

function mostrarPopupFase() {
  terminou = true;

  popupTitle.textContent =
    faseAtual === fases.length - 1
      ? "✨ Última fase concluída"
      : `✅ Fase ${faseAtual + 1} concluída`;

  popupMessage.textContent = fases[faseAtual].mensagem;

  popupButton.textContent =
    faseAtual === fases.length - 1 ? "Continuar" : "Avançar";

  popupButton.onclick = () => {
    overlay.style.display = "none";

    if (faseAtual < fases.length - 1) {
      faseAtual++;
      iniciarFase();
    } else {
      mostrarPopupFinal();
    }
  };

  overlay.style.display = "flex";
}

function mostrarPopupFinal() {
  popupTitle.textContent = "💖 Fim";
  popupMessage.textContent = mensagemFinal;
  popupButton.textContent = "Fechar";

  popupButton.onclick = () => {
    overlay.style.display = "none";
  };

  overlay.style.display = "flex";
}


if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}