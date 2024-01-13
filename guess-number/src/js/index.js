const GameStatuses = {
  NEW_GAME: "NewGame",
  USER_INPUT_GREATER: "UserInputGreater",
  USER_INPUT_LESS: "UserInputLess",
  USER_WON: "UserWon",
};

let attemptNumber = 1;
let minNumber = 1;
let maxNumber = 100;
let randomNumber = 0;
let gameStatus = GameStatuses.NEW_GAME;
let additionalSuggestionNeeded = false;

const userNumberInput = document.querySelector(".number-input");
const submitBtn = document.querySelector(".submit-btn");
const suggestionParagraph = document.querySelector(".suggestion");
const attemptSpan = document.querySelector(".attemt-span");
const minInput = document.getElementById("min-input");
const maxInput = document.getElementById("max-input");
const restartBtn = document.querySelector(".restart");
const additionalSuggestionParagraph = document.querySelector(
  ".additional-suggestion"
);
const warningParagraph = document.querySelector(".warning");

function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function startNewGame() {
  randomNumber = generateRandomNumber(minNumber, maxNumber);
  attemptNumber = 1;
  lastAtttempt = null;
  gameStatus = GameStatuses.NEW_GAME;
}

function processUserInput(number) {
  if (number > randomNumber) {
    gameStatus = GameStatuses.USER_INPUT_GREATER;
  } else if (number < randomNumber) {
    gameStatus = GameStatuses.USER_INPUT_LESS;
  } else {
    gameStatus = GameStatuses.USER_WON;
  }

  if (attemptNumber % 3 === 0) {
    additionalSuggestionNeeded = true;
  } else {
    additionalSuggestionNeeded = false;
  }

  attemptNumber += 1;
}

function render() {
  switch (gameStatus) {
    case GameStatuses.NEW_GAME:
      suggestionParagraph.innerHTML = "Guess the number";
      userNumberInput.value = "";
      submitBtn.disabled = false;
      break;
    case GameStatuses.USER_INPUT_GREATER:
      suggestionParagraph.innerHTML = "The hidden number is less than yours";
      break;
    case GameStatuses.USER_INPUT_LESS:
      suggestionParagraph.innerHTML = "The hidden number is greater than yours";
      break;
    case GameStatuses.USER_WON:
      suggestionParagraph.innerHTML = "You won!";
      submitBtn.disabled = true;
      break;
  }
  attemptSpan.innerHTML = attemptNumber;

  if (additionalSuggestionNeeded) {
    additionalSuggestionParagraph.innerHTML =
      randomNumber % 2 === 0
        ? "The hidden number is even"
        : "The hidden number is odd";
  } else {
    additionalSuggestionParagraph.innerHTML = "";
  }
}

submitBtn.addEventListener("click", () => {
  const userNumber = parseInt(userNumberInput.value);
  if (isNaN(userNumber)) {
    warningParagraph.innerHTML = "Invalid number";
    return;
  }
  if (userNumber > maxNumber) {
    warningParagraph.innerHTML  = `The number can't be greater than ${maxNumber}`;
    return;
  }

  if (userNumber < minNumber) {
    warningParagraph.innerHTML = `The number can't be less than ${minNumber}`;
    return;
  }

  warningParagraph.innerHTML = '';
  processUserInput(userNumber);
  render();
});

restartBtn.addEventListener("click", () => {
  minNumber = parseInt(minInput.value);
  maxNumber = parseInt(maxInput.value);
  if (isNaN(minNumber) || isNaN(maxNumber)) {
    alert('invalid min/max numbers');
    return;
  }
  if (minNumber >= maxNumber) {
    alert('min should be less than max');
    return;
  }
  startNewGame();
  render();
});

startNewGame();
render();
