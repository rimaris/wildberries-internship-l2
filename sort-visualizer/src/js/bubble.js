import Colors from "./colors.js";

function swap(arr, a, b) {
  let temp = arr[a];
  arr[a] = arr[b];
  arr[b] = temp;
}
class BubbleSorter {
  constructor(arr) {
    this.arr = arr;
    this.i = 0;
    this.j = 0;
    this.finished = false;
  }

  isFinished() {
    return this.i >= this.arr.length;
  }

  getElementColor(i) {
    if (this.isFinished()) {
      return Colors.DEFAULT
    }
    if (i === this.j) {
        return Colors.RED;
    }
    return Colors.DEFAULT;
  }

  step() {
    if (this.isFinished()) {
      return;
    }
    const arr = this.arr;
    if (this.j >= arr.length - 1 - this.i) {
      this.j = 0;
      this.i += 1;
      return;
    }
    if (arr[this.j] > arr[this.j + 1]) {
      swap(arr, this.j, this.j + 1);
    }
    this.j += 1;
  }
}

export default BubbleSorter;
