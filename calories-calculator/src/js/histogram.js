import { decreaseDate, increaseDate } from "./dateUtils.js";

const MAX_BAR_HEIGHT = 300;

class Histogram {
  constructor(histogramEl, startDate, endDate, valuesByDates, maxValue) {
    this.histogramEl = histogramEl;
    this.histogramBarsEl = histogramEl.querySelector(".histogram__bars");
    this.histogramDatesEl = histogramEl.querySelector(".histogram__dates");
    this.histogramYLabelsEls = histogramEl.querySelectorAll(".histogram__y-label");
    this.startDate = startDate;
    this.endDate = endDate;
    this.valuesByDates = valuesByDates;
    this.maxValue = maxValue;
  }

  setValuesByDates(valuesByDates) {
    this.valuesByDates = valuesByDates;
  }

  setMaxValue(maxValue) {
    this.maxValue = maxValue;
  }

  render() {
    this.histogramBarsEl.innerHTML = "";
    this.histogramDatesEl.innerHTML = "";

    for (
      let date = this.startDate;
      date <= this.endDate;
      date = increaseDate(date)
    ) {
      const dateVal = this.valuesByDates[date] || 0;

      const bar = document.createElement("div");
      bar.classList.add("histogram__bar");
      const height = Math.min((dateVal * MAX_BAR_HEIGHT) / this.maxValue, MAX_BAR_HEIGHT);
      bar.style.height = `${height}px`;
      this.histogramBarsEl.appendChild(bar);
      bar.innerHTML = `<div class="histogram__value-tooltip">${dateVal}</div>`

      const dateSplitted = date.split('-');
      const month = dateSplitted[1], day=dateSplitted[2];
      const dateEl = document.createElement('div');
      dateEl.classList.add("histogram__date");
      dateEl.innerHTML = `${day}.${month}`;
      this.histogramDatesEl.appendChild(dateEl);
    }

    let percent = 1;
    this.histogramYLabelsEls.forEach((elem, i) => {
      elem.innerHTML = Math.floor(this.maxValue * percent);
      percent -= 0.1;
    });
  }
}

export default Histogram;
