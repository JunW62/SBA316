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
const resetButton = document.getElementById("reset-button");

let computerScore = 0;
let playerScore = 0;
let playerName = "";
let rankings = [];
let anonymousCount = 1;

playerChoiceIcon.src = `./images/rock.svg`;
computerChoiceIcon.src = `/images/rock.svg`;

playerForm.addEventListener("submit", startGame);
choices.forEach((button) => button.addEventListener("click", playGame));
resetButton.addEventListener("click", resetGame);

function startGame(event) {
  event.preventDefault();
  if ((playerName = playerNameInput.value.trim() === "")) {
    playerName = `Anonym ${anonymousCount++}`;
    playerNameInput.value = playerName;
  } else {
    playerName = playerNameInput.value.trim();
  }
  initPlayer(playerName);
  updateScoreDisplay();
  updateRankings();
}

function playGame(event) {
  if (!playerName) {
    startGame(new Event("Submit"));
  }
  const playerChoice = event.target.closest("button").id;
  const computerChoice = getComputerChoice();
  const winner = getWinner(playerChoice, computerChoice);
  showResult(playerChoice, computerChoice, winner);
  updateChoiceIcons(playerChoice, computerChoice);
  updateRankings();
}
function initPlayer(name) {
  const playerIndex = rankings.findIndex((player) => player.name === name);
  if (playerIndex !== -1) {
    playerScore = rankings[playerIndex].score;
  } else {
    playerScore = 0;
    rankings.push({ name: name, score: playerScore, wins: 0, games: 0 });
  }
  computerScore = 0;
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
    resultEl.textContent = `You Won! ${capitalize(
      playerChoice
    )} beats ${capitalize(computerChoice)}.`;
    rankings[playerIndex].wins++;
    triggerConfetti();
  } else if (winner === "computer") {
    computerScore++;
    resultEl.textContent = `You Lost! ${capitalize(
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
  playerName = "";
  computerScore = 0;
  playerScore = 0;
  playerNameInput.value = "";
  playerNameInput.placeholder = "Enter your name";
  playerScoreEl.textContent = "0";
  computerScoreEl.textContent = "0";
  resultEl.textContent = "";
  playerChoiceIcon.src = "./images/rock.svg";
  computerChoiceIcon.src = "./images/rock.svg";
  playerNameDisplay.textContent = "Player";
}

function updateChoiceIcons(playerChoice, computerChoice) {
  playerChoiceIcon.src = `./images/${playerChoice}.svg`;
  computerChoiceIcon.src = `/images/${computerChoice}.svg`;
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
