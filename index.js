const gameContainer = document.getElementById("game");
const playerScoreEl = document.getElementById("player-score");
const computerScoreEl = document.getElementById("computer-score");
const resultEl = document.getElementById("result");
const choices = document.querySelectorAll("#choices button");
const playerForm = document.getElementById("player-form");
const playerNameInput = document.getElementById("player-name");
const rankingsList = document.getElementById("rankings");

let computerScore = 0;
let playerScore = 0;
let playerName = "";
let rankings = [];

playerForm.addEventListener("submit", startGame);
choices.forEach((button) => button.addEventListener("click", playGame));

function startGame(event) {
  event.preventDefault();
  playerName = playerNameInput.value.trim();
  if (!playerName) {
    alert("Please enter a valid name");
    return;
  }
  const playerIndex = rankings.findIndex(
    (player) => player.name === playerName
  );
  if (playerIndex !== -1) {
    playerScore = rankings[playerIndex].score;
  } else {
    playerScore = 0;
  }
  computerScore = 0;
  playerForm.reset();
  updateScoreDisplay();
}

function playGame(event) {
  const playerChoice = event.target.id;
  const computerChoice = getComputerChoice();
  const winner = getWinner(playerChoice, computerChoice);
  showResult(playerChoice, computerChoice, winner);
  updateRankings();
}

function getComputerChoice() {
  const choices = ["rock", "paper", "scissors"];
  const randomIndex = Math.floor(Math.random() * choices.length);
  return choices[randomIndex];
}

function getWinner(playerChoice, computerChoice) {
  if (playerChoice === computerChoice) {
    return "draw";
  } else if (
    (playerChoice === "rock" && computerChoice === "scissors") ||
    (playerChoice === "paper" && computerChoice === "rock") ||
    (playerChoice === "scissors" && computerChoice === "paper")
  ) {
    return "player";
  } else {
    return "computer";
  }
}
function showResult(playerChoice, computerChoice, winner) {
  if (winner === "player") {
    playerScore++;
    resultEl.textContent = `You Win! ${capitalize(
      playerChoice
    )} beats ${capitalize(computerChoice)}.`;
  } else if (winner === "computer") {
    computerScore++;
    resultEl.textContent = `You Lose! ${capitalize(
      computerChoice
    )} beats ${capitalize(playerChoice)}.`;
  } else {
    resultEl.textContent = `It is a Draw! You both chose ${capitalize(
      playerChoice
    )}.`;
  }
  updateScoreDisplay();
}
function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function resetGame() {
  let computerScore = 0;
  let playerScore = 0;
  playerScoreEl.textContent = playerScore;
  computerScoreEl.textContent = computerScore;
  resultEl.textContent = "";
}

function updateRankings() {
  const playerIndex = rankings.findIndex(
    (player) => player.name === playerName
  );
  if (playerIndex !== -1) {
    rankings[playerIndex].score = playerScore;
  } else {
    rankings.push({ name: playerName, score: playerScore });
  }
  rankings.sort((a, b) => b.score - a.score);
  rankingsList.innerHTML = rankings
    .map((player) => `<li>${player.name} : ${player.score}</li>`)
    .join("");
}
function updateScoreDisplay() {
  playerScoreEl.textContent = playerScore;
  computerScoreEl.textContent = computerScore;
}
