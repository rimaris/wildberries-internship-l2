import BubbleSorter from "./bubble.js";
import Colors from "./colors.js";

const INTERVAL_DELAY = 1000;

let numbers = [15, 10, 5, 50, 22, 11];
let sorter = new BubbleSorter(numbers);
const MAX_HEIGHT = 600;

const barsDiv = document.querySelector(".histogram__bars");
const startPauseBtn = document.querySelector(".start-pause-btn");

let interval = null;

function render() {
  const maxVal = Math.max(...numbers);
  barsDiv.innerHTML = "";
  numbers.forEach((number, i) => {
    const bar = document.createElement("div");
    bar.classList.add("histogram__bar");
    const height = (number / maxVal) * MAX_HEIGHT;
    bar.style.height = `${height}px`;
    barsDiv.appendChild(bar);
    if (sorter.getElementColor(i) === Colors.RED) {
      bar.classList.add("histogram__bar_red");
    }
  });
}

startPauseBtn.addEventListener("click", function () {
  if (interval === null) {
    interval = setInterval(() => {
      if (sorter.isFinished()) {
        clearInterval(interval);
        interval = null;
        return;
      }
      sorter.step();
      render();
    }, INTERVAL_DELAY);
  } else {
    clearInterval(interval);
    interval = null;
  }
});

render();
