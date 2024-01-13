function dateToStr(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return (
    year +
    "-" +
    (month < 10 ? "0" : "") +
    month +
    "-" +
    (day < 10 ? "0" : "") +
    day
  );
}

export function getCurrentDate() {
  let currentDate = new Date();

  return dateToStr(currentDate);
}

export function increaseDate(d, days = 1) {
  let date = new Date(Date.parse(d));
  date.setDate(date.getDate() + days);
  return dateToStr(date);
}

export function decreaseDate(d, days = 1) {
  let date = new Date(Date.parse(d));
  date.setDate(date.getDate() - days);
  return dateToStr(date);
}
