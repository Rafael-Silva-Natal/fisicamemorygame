const images = [
  { id: 1, type: "pergunta", src: "./images1/pergunta1.png", matched: false },
  { id: 2, type: "pergunta", src: "./images1/pergunta2.png", matched: false },
  { id: 3, type: "pergunta", src: "./images1/pergunta3.png", matched: false },
  { id: 4, type: "pergunta", src: "./images1/pergunta4.png", matched: false },
  { id: 5, type: "resposta", src: "./images1/resposta1.png", questionId: 1, matched: false },
  { id: 6, type: "resposta", src: "./images1/resposta2.png", questionId: 2, matched: false },
  { id: 7, type: "resposta", src: "./images1/resposta3.png", questionId: 3, matched: false },
  { id: 8, type: "resposta", src: "./images1/resposta4.png", questionId: 4, matched: false },
  { id: 9, type: "pergunta", src: "./images1/pergunta5.png", matched: false },
  { id: 10, type: "pergunta", src: "./images1/pergunta6.png", matched: false },
  { id: 11, type: "pergunta", src: "./images1/pergunta7.png", matched: false },
  { id: 12, type: "pergunta", src: "./images1/pergunta8.png", matched: false },
  { id: 13, type: "resposta", src: "./images1/resposta5.png", questionId: 9, matched: false },
  { id: 14, type: "resposta", src: "./images1/resposta6.png", questionId: 10, matched: false },
  { id: 15, type: "resposta", src: "./images1/resposta7.png", questionId: 11, matched: false },
  { id: 16, type: "resposta", src: "./images1/resposta8.png", questionId: 12, matched: false }
];

let flippedCards = [];
let canFlip = true;
let matchedPairsCount = 0;
let errorCount = 0;

function createCard(image) {
const card = document.createElement("div");
card.classList.add("card");
card.dataset.imageId = image.id;
card.dataset.type = image.type;
card.dataset.matched = image.matched;
card.style.backgroundImage = `url(./images1/verso.png)`;
card.addEventListener("click", () => {
  console.log(`Card clicked: ID ${image.id}, Type ${image.type}`);
  flipCard(card);
});
return card;
}

function flipCard(card) {
if (!canFlip || flippedCards.length >= 2 || card === flippedCards[0] || card.dataset.matched === "true") return;
const image = images.find(img => img.id.toString() === card.dataset.imageId);
card.style.backgroundImage = `url(${image.src})`;
card.classList.add("flipped");
flippedCards.push(card);
if (flippedCards.length === 2) {
  canFlip = false;
  setTimeout(checkCards, 3000);
}
}

function checkCards() {
const [card1, card2] = flippedCards;
const image1 = images.find(img => img.id.toString() === card1.dataset.imageId);
const image2 = images.find(img => img.id.toString() === card2.dataset.imageId);

let isMatch = false;
if (image1.type === "pergunta" && image2.type === "resposta" && image1.id === image2.questionId) {
  isMatch = true;
} else if (image1.type === "resposta" && image2.type === "pergunta" && image2.id === image1.questionId) {
  isMatch = true;
}

if (isMatch) {
  image1.matched = true;
  image2.matched = true;
  card1.dataset.matched = "true";
  card2.dataset.matched = "true";
  matchedPairsCount++;
  updateStats();
  showSuccessMessage();
  if (matchedPairsCount === images.length / 2) {
    setTimeout(() => {
      showSuccessMessage("Parabéns! Você encontrou todos os pares!", true);
      setTimeout(() => window.location.reload(), 4000);
    }, 500);
  }
} else {
  errorCount++;
  updateStats();
  card1.style.backgroundImage = `url(./images1/verso.png)`;
  card2.style.backgroundImage = `url(./images1/verso.png)`;
  card1.classList.remove("flipped");
  card2.classList.remove("flipped");
}
flippedCards = [];
canFlip = true;
}

function updateStats() {
const matchesEl = document.getElementById("matches");
const errorsEl = document.getElementById("errors");
if (matchesEl && errorsEl) {
  matchesEl.textContent = `Pares Encontrados: ${matchedPairsCount}`;
  errorsEl.textContent = `Erros: ${errorCount}`;
} else {
  console.error("Stats elements not found");
}
}

function showSuccessMessage(message = "Par Encontrado!", isFinal = false) {
const successMessage = document.getElementById("successMessage");
if (successMessage) {
  successMessage.querySelector("p").textContent = message;
  successMessage.classList.remove("hidden");
  try {
    particlesJS("particles-js", {
      particles: {
        number: { value: isFinal ? 200 : 150, density: { enable: true, value_area: 800 } },
        color: { value: isFinal ? ["#ffd700", "#ff4500", "#00ff00"] : "#ffd700" },
        shape: { type: "circle", stroke: { width: 0 } },
        opacity: { value: 0.7, random: true, anim: { enable: true, speed: 1, opacity_min: 0.1 } },
        size: { value: isFinal ? 5 : 4, random: true, anim: { enable: true, speed: 10, size_min: 0.1 } },
        line_linked: { enable: false },
        move: {
          enable: true,
          speed: isFinal ? 10 : 8,
          direction: "none",
          random: true,
          straight: false,
          out_mode: "out",
          bounce: false,
          attract: { enable: false }
        }
      },
      interactivity: {
        detect_on: "canvas",
        events: { onhover: { enable: false }, onclick: { enable: false }, resize: true }
      },
      retina_detect: true
    });
  } catch (e) {
    console.error("Error loading particles.js:", e);
  }
  setTimeout(() => {
    successMessage.classList.add("hidden");
    document.getElementById("particles-js").innerHTML = "";
  }, isFinal ? 3500 : 2500);
} else {
  console.error("Success message element not found");
}
}

function initGame() {
console.log("initGame: Initializing game");
matchedPairsCount = 0;
errorCount = 0;
canFlip = true;
flippedCards = [];
updateStats();
const gameBoard = document.getElementById("gameBoard");
if (gameBoard) {
  gameBoard.innerHTML = "";
  setupCards();
  const startButton = document.getElementById("startButton");
  if (startButton) {
    startButton.textContent = "Reiniciar Jogo";
  } else {
    console.error("initGame: Start button not found");
  }
} else {
  console.error("initGame: Game board not found");
}
}

function setupCards() {
console.log("setupCards: Setting up cards");
const shuffledQuestions = images.filter(image => image.type === "pergunta");
const shuffledAnswers = images.filter(image => image.type === "resposta");
shuffleArray(shuffledQuestions);
shuffleArray(shuffledAnswers);
const shuffledImages = [];
for (let i = 0; i < shuffledQuestions.length; i++) {
  shuffledImages.push(shuffledQuestions[i], shuffledAnswers[i]);
}
shuffleArray(shuffledImages);
const gameBoard = document.getElementById("gameBoard");
if (gameBoard) {
  shuffledImages.forEach(image => {
    const card = createCard(image);
    gameBoard.appendChild(card);
  });
  console.log("setupCards: Cards appended to game board");
} else {
  console.error("setupCards: Game board not found");
}
}

function shuffleArray(array) {
for (let i = array.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [array[i], array[j]] = [array[j], array[i]];
}
}

document.addEventListener("DOMContentLoaded", () => {
console.log("DOM fully loaded");
const startButton = document.getElementById("startButton");
const botao = document.getElementById("meuBotao1");
const botao2 = document.getElementById("meuBotaoEstudar");
if (startButton) {
  startButton.addEventListener("click", () => {
    console.log("Start button clicked: Triggering initGame");
    initGame();
  });
  console.log("Start button event listener attached");
} else {
  console.error("Start button (#startButton) not found in DOM");
}
if (botao) {
  botao.addEventListener("click", () => {
    console.log("Pular de fase button clicked");
    redirecionar1();
  });
  console.log("Pular de fase button event listener attached");
} else {
  console.error("Pular de fase button (#meuBotao1) not found in DOM");
}
if (botao2) {
  botao2.addEventListener("click", () => {
    console.log("estudo de fase button clicked");
    redirecionar2();
  });
  console.log("Pular de fase button event listener attached");
} else {
  console.error("Pular de fase button (#meuBotao1) not found in DOM");
}
});

function redirecionar1() {
console.log("redirecionar1: Navigating to fase2.html");
window.location.href = "../fase8/fase8.html";
}
function redirecionar2() {
console.log("redirecionar2: Navigating to estudar.html");
window.location.href = "../Estudar.html";
}