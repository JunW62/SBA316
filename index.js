const playerScoreEl = document.getElementById("player-score");
const computerScoreEl = documnet.getElementById("computuer-score");
const resultEl = document.getElementById("result");
const choices = document.getElementById("#choised button");

let computerScore = 0;
let playerScore = 0;

choices.forEach((button) => addEventListener("click", playGame));

function playGame(event) {
  const playerChoice = event.target.id;
  const computerChoice = getComputerChoice();
  const winner = getWinner(playerChoice, computerChoice);
  showResult(playerChoice, computerChoice, winner);
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
    computerChoice++;
    resultEl.textContent = `You Lose! ${capitalize(
      computerChoice
    )} beats ${capitalize(playerChoice)}.`;
  } else {
    resultEl.textContent = `It is a Draw! You both chose ${capitalize(
      playerChoice
    )}.`;
  }
  playerScoreEl.textContent = playerScore;
  computerScoreEl.textContent = computerScore;
}
function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
