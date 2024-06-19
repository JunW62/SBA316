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
