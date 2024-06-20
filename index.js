const gameContainer = document.getElementById("game");
const playerScoreEl = document.getElementById("player-score");
const computerScoreEl = document.getElementById("computer-score");
const resultEl = document.getElementById("result");
const choices = document.querySelectorAll("#choices button");
const playerForm = document.getElementById("player-form");
const playerNameInput = document.getElementById("player-name");
const playerNameDisplay = document.getElementById("player-name-display");
const playerChoiceIcon = document.getElementById("player-choice-icon");
const computerChoiceIcon = document.getElementById("computer-choice-icon");
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
    rankings.push({ name: playerName, score: playerScore, wins: 0, games: 0 });
  }
  computerScore = 0;
  playerForm.reset();
  updateScoreDisplay();
  updateRankings();
}

function playGame(event) {
  const playerChoice = event.target.closest("button").id;
  const computerChoice = getComputerChoice();
  const winner = getWinner(playerChoice, computerChoice);
  showResult(playerChoice, computerChoice, winner);
  updateChoiceIcons(playerChoice, computerChoice);
  updateRankings();
}

function getComputerChoice() {
  const choices = ["rock", "paper", "scissors", "lizard", "spock"];
  const randomIndex = Math.floor(Math.random() * choices.length);
  return choices[randomIndex];
}

function getWinner(playerChoice, computerChoice) {
  if (playerChoice === computerChoice) {
    return "draw";
  } else if (
    (playerChoice === "rock" &&
      (computerChoice === "scissors" || computerChoice === "lizard")) ||
    (playerChoice === "paper" &&
      (computerChoice === "rock" || computerChoice === "spock")) ||
    (playerChoice === "scissors" &&
      (computerChoice === "paper" || computerChoice === "lizard")) ||
    (playerChoice === "lizard" &&
      (computerChoice === "spock" || computerChoice === "paper")) ||
    (playerChoice === "spock" &&
      (computerChoice === "scissors" || computerChoice === "rock"))
  ) {
    return "player";
  } else {
    return "computer";
  }
}
function showResult(playerChoice, computerChoice, winner) {
  const playerIndex = rankings.findIndex(
    (player) => player.name === playerName
  );
  if (winner === "player") {
    playerScore++;
    resultEl.textContent = `You Win! ${capitalize(
      playerChoice
    )} beats ${capitalize(computerChoice)}.`;
    rankings[playerIndex].wins++;
    triggerConfetti();
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
  rankings[playerIndex].games++;
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

function updateChoiceIcons(playerChoice, computerChoice) {
  const choiceIcons = {
    rock: "fa-hand-rock",
    paper: "fa-hand-paper",
    scissors: "fa-hand-scissors",
    lizard: "fa-hand-lizard",
    spock: "fa-hand-spock",
  };
  playerChoiceIcon.className = `fa ${choiceIcons[playerChoice]}`;
  computerChoiceIcon.className = `fa ${choiceIcons[computerChoice]}`;
}

function updateRankings() {
  rankings.sort((a, b) => getWinRate(b) - getWinRate(a));
  rankingsList.innerHTML = rankings
    .map(
      (player) =>
        `<li>${player.name} : ${getWinRate(player).toFixed(2)}% ${
          player.wins
        }/${player.games}</li>`
    )
    .join("");
}
function updateScoreDisplay() {
  playerScoreEl.textContent = playerScore;
  computerScoreEl.textContent = computerScore;
  playerNameDisplay.textContent = playerName;
}

function getWinRate(player) {
  return player.games > 0 ? (player.wins / player.games) * 100 : 0;
}

function triggerConfetti() {
  confetti({
    particleCount: 100,
    spread: 200,
    origin: { y: 0.6 },
  });
}
