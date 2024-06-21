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
const resetButton = document.getElementById("reset-button");
resultEl.textContent = "Click Icon to make your move!";
resultEl.style.backgroundColor = "transparent";

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
window.addEventListener("load", () => {
  const lastWinner = localStorage.getItem("lastGameWinner");
  if (lastWinner) {
    updateLastWinnerDisplay(lastWinner);
  }
});

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
  updateRankingTable();
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
  updateRankingTable();
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
    resultEl.style.backgroundColor = "#4CAF50";
    rankings[playerIndex].wins++;
    triggerConfetti();
    saveLastWinner(playerName);
  } else if (winner === "computer") {
    computerScore++;
    resultEl.textContent = `You Lost! ${capitalize(
      computerChoice
    )} beats ${capitalize(playerChoice)}.`;
    resultEl.style.backgroundColor = "#f44336";
    saveLastWinner("Computer");
  } else {
    resultEl.textContent = `It is a Draw! You both chose ${capitalize(
      playerChoice
    )}.`;
    resultEl.style.backgroundColor = "#efc208";
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
  playerNameInput.placeholder = "Enter your name to start";
  playerScoreEl.textContent = "0";
  computerScoreEl.textContent = "0";
  resultEl.textContent = "";
  resultEl.textContent = "Click Icon to make your move!";
  resultEl.style.backgroundColor = "transparent";
  playerChoiceIcon.src = "./images/rock.svg";
  computerChoiceIcon.src = "./images/rock.svg";
  playerNameDisplay.textContent = "Player";
}

function updateChoiceIcons(playerChoice, computerChoice) {
  playerChoiceIcon.src = `./images/${playerChoice}.svg`;
  computerChoiceIcon.src = `/images/${computerChoice}.svg`;
}

function updateRankingTable() {
  const tableContainer = document.getElementById("ranking-table-container");

  if (tableContainer.firstChild) {
    tableContainer.removeChild(tableContainer.firstChild);
  }

  rankings.sort((a, b) => {
    if (b.score === a.score) {
      return b.wins / b.games - a.wins / a.games; // Secondary sort by win rate
    }
    return b.score - a.score;
  });

  const table = document.createElement("table");
  table.classList.add("ranking-table");
  const headerRow = document.createElement("tr");
  const headers = ["Rank", "Name", "Score", "Wins/Games"];
  headers.forEach((text) => {
    const headerCell = document.createElement("th");
    headerCell.textContent = text;
    headerRow.appendChild(headerCell);
  });
  table.appendChild(headerRow);

  const fragment = document.createDocumentFragment();

  const templateRow = document.createElement("tr");
  templateRow.innerHTML = "<td></td><td></td><td></td><td></td>";
  rankings.forEach((player, index) => {
    const newRow = templateRow.cloneNode(true);
    newRow.cells[0].textContent = index + 1;
    newRow.cells[1].textContent = player.name;
    newRow.cells[2].textContent = `${getWinRate(player).toFixed(2)}%`;
    newRow.cells[3].textContent = `${player.wins}/${player.games}`;
    fragment.appendChild(newRow);
  });

  table.appendChild(fragment);
  tableContainer.appendChild(table);
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

function saveLastWinner(winner) {
  localStorage.setItem("lastGameWinner", winner);
  updateLastWinnerDisplay(winner);
}

function updateLastWinnerDisplay(winner) {
  const lastWinnerInfo = document.getElementById("last-winner-info");
  lastWinnerInfo.textContent = `Last game winner was ${winner}!`;
  lastWinnerInfo.style.fontWeight = "bold";
  lastWinnerInfo.style.padding = "10px";
  lastWinnerInfo.style.marginTop = "10px";
  lastWinnerInfo.style.borderRadius = "5px";
}
rankings.sort((a, b) => {
  if (b.score === a.score) {
    return b.wins / b.games - a.wins / a.games;
  }
  return b.score - a.score;
});
