import Modal from "./modal.js";
import { getCurrentDate, increaseDate, decreaseDate } from "./dateUtils.js";
import { ProductDiary, Product } from "./diary.js";
import Histogram from "./histogram.js";

const MealBlocks = {
  BREAKFAST: "breakfast",
  LUNCH: "lunch",
  DINNER: "dinner",
};
const HIST_DAYS = 14;
const MAX_VALUE_TARGET_VALUE = 2;

let diary = new ProductDiary();
let targetCalories = 1500;
let date = getCurrentDate();
let caloriesByDates = {};

const setTargetCaloriesBtn = document.querySelector(".set-target-calories-btn");

const productNameInput = document.getElementById("modal__product-name");
const productProteinInput = document.getElementById("modal__product-protein");
const productFatsInput = document.getElementById("modal__product-fats");
const productCarbsInput = document.getElementById("modal__product-carbs");
const productCaloriesInput = document.getElementById("modal__product-calories");
const productWeightInput = document.getElementById("modal__product-weight");
const mealBlockSelect = document.getElementById("modal__meal-block");

const targetCaloriesInput = document.getElementById("modal__target-calories");

const breakfastMealBlock = document.querySelector(".meal-block_breakfast");
const dinnerMealBlock = document.querySelector(".meal-block_dinner");
const lunchMealBlock = document.querySelector(".meal-block_lunch");

const summaryProtein = document.querySelector(".summary__protein");
const summaryFats = document.querySelector(".summary__fats");
const summaryCarbohydrates = document.querySelector(".summary__carbohydrates");
const summaryCalories = document.querySelector(".summary__calories");
const dailyIntakeWarning = document.querySelector(
  ".daily-calorie-intake-warning"
);

const dateSelectorValue = document.querySelector(".date-selector__value");
const dateSelectorNextBtn = document.querySelector(
  ".date-selector__button_next"
);
const dateSelectorPrevBtn = document.querySelector(
  ".date-selector__button_prev"
);

const clearDiaryBtn = document.querySelector(".clear-diary-btn");

const histogram = new Histogram(
  document.querySelector(".histogram"),
  decreaseDate(date, Math.floor(HIST_DAYS / 2)),
  increaseDate(date, Math.floor(HIST_DAYS / 2)),
  caloriesByDates,
  targetCalories * MAX_VALUE_TARGET_VALUE
);

const addProductModal = new Modal(
  document.querySelector(".add-product-modal"),
  render
);
const setTargetCaloriesModal = new Modal(
  document.querySelector(".add-target-calories-modal"),
  render
);

function stateUpdated() {
  caloriesByDates[date] = diary.getTotalCalories();
  render();
  saveProductsToLocalStorage();
  saveCaloriesByDates();
  saveTargetCalories();
}

function render() {
  fillItemsList(
    breakfastMealBlock,
    diary.breakfastProducts,
    diary.removeBreakfastProduct.bind(diary)
  );
  fillItemsList(
    lunchMealBlock,
    diary.lunchProducts,
    diary.removeLunchProduct.bind(diary)
  );
  fillItemsList(
    dinnerMealBlock,
    diary.dinnerProducts,
    diary.removeDinnerProduct.bind(diary)
  );

  const summary = diary.summary;
  summaryProtein.innerHTML = summary.protein;
  summaryFats.innerHTML = summary.fats;
  summaryCarbohydrates.innerHTML = summary.carbs;
  summaryCalories.innerHTML = `${summary.cals}/${targetCalories}`;
  const intakePercent = Math.round((summary.cals / targetCalories) * 100);
  if (intakePercent > 100) {
    dailyIntakeWarning.innerHTML = `You have exceeded your daily calorie intake by ${
      intakePercent - 100
    }%`;
    dailyIntakeWarning.classList.add("daily-calorie-intake-warning_not-ok");
  } else {
    dailyIntakeWarning.innerHTML = `You have consumed ${intakePercent}% of your daily calorie intake`;
    dailyIntakeWarning.classList.remove("daily-calorie-intake-warning_not-ok");
  }

  addProductModal.render();
  setTargetCaloriesModal.render();
  if (addProductModal.modalShown || setTargetCaloriesModal.modalShown) {
    document.body.classList.add("no-overflow");
  } else {
    document.body.classList.remove("no-overflow");
  }

  dateSelectorValue.innerHTML = date;

  histogram.setValuesByDates(caloriesByDates);
  histogram.setMaxValue(targetCalories * MAX_VALUE_TARGET_VALUE);
  histogram.render();
}

function fillItemsList(mealBlock, products, removeProductFunc) {
  const ulElem = mealBlock.querySelector("ul");
  ulElem.innerHTML = "";
  products.forEach((product) => {
    const productLi = document.createElement("li");
    productLi.classList.add("product");
    productLi.innerHTML = `<div class="product__title">${product.name}</div>
        <div class="product__weight">${product.weight}g</div>
        <div class="product__protein">${product.protein}</div>
        <div class="product__fats">${product.fats}</div>
        <div class="product__carbohydrates">${product.carbohydrates}</div>
        <div class="product__calories">${product.calories}</div>
        <div class="product__controls">
          <button class="product__remove">&times;</button>
        </div>`;
    const removeBtn = productLi.querySelector(".product__remove");
    removeBtn.addEventListener("click", () => {
      removeProductFunc(product);
      stateUpdated();
    });
    ulElem.appendChild(productLi);
  });
}

function addAddProductListener(mealBlock, selectedOption) {
  const btn = mealBlock.querySelector(".add-product-btn");
  btn.addEventListener("click", () => {
    addProductModal.show();
    mealBlockSelect.value = selectedOption;
    stateUpdated();
  });
}

addAddProductListener(breakfastMealBlock, MealBlocks.BREAKFAST);
addAddProductListener(dinnerMealBlock, MealBlocks.DINNER);
addAddProductListener(lunchMealBlock, MealBlocks.LUNCH);

setTargetCaloriesBtn.addEventListener("click", () => {
  setTargetCaloriesModal.show();
  render();
});

addProductModal.setSubmitListener(() => {
  const prots = productProteinInput.value;
  const fats = productFatsInput.value;
  const cals = productCaloriesInput.value;
  const weight = productWeightInput.value;
  if (
    !productNameInput.value ||
    isNaN(prots) ||
    isNaN(fats) ||
    isNaN(cals) ||
    isNaN(weight) ||
    prots <= 0 ||
    fats <= 0 ||
    cals <= 0 ||
    weight <= 0
  ) {
    return;
  }
  const product = new Product(
    productNameInput.value,
    parseFloat(productProteinInput.value),
    parseFloat(productFatsInput.value),
    parseFloat(productCarbsInput.value),
    parseFloat(productCaloriesInput.value),
    parseFloat(productWeightInput.value)
  );

  switch (mealBlockSelect.value) {
    case MealBlocks.BREAKFAST:
      diary.addBreakfastProduct(product);
      break;
    case MealBlocks.LUNCH:
      diary.addLunchProduct(product);
      break;
    case MealBlocks.DINNER:
      diary.addDinnerProduct(product);
      break;
  }

  addProductModal.hide();
  stateUpdated();
});

setTargetCaloriesModal.setSubmitListener(() => {
  targetCalories = parseFloat(targetCaloriesInput.value);
  setTargetCaloriesModal.hide();
  stateUpdated();
});

dateSelectorNextBtn.addEventListener("click", () => {
  date = increaseDate(date);
  loadProductsFromLocalStorage();
  stateUpdated();
});

dateSelectorPrevBtn.addEventListener("click", () => {
  date = decreaseDate(date);
  loadProductsFromLocalStorage();
  stateUpdated();
});

clearDiaryBtn.addEventListener("click", () => {
  diary.clear();
  stateUpdated();
});

function saveProductsToLocalStorage() {
  localStorage.setItem(`diary_${date}`, JSON.stringify(diary));
}

function loadProductsFromLocalStorage() {
  const val = localStorage.getItem(`diary_${date}`);
  if (val === null) {
    return;
  }
  const json = JSON.parse(val);
  diary = Object.assign(new ProductDiary(), json);
}

function loadCaloriesByDates() {
  const val = localStorage.getItem(`caloriesByDates`);
  if (val === null) {
    return;
  }
  caloriesByDates = JSON.parse(val);
}

function saveCaloriesByDates() {
  localStorage.setItem("caloriesByDates", JSON.stringify(caloriesByDates));
}

function loadTargetCalories() {
  const val = localStorage.getItem("targetCalories");
  if (val === null) {
    return;
  }
  targetCalories = parseInt(val);
}

function saveTargetCalories() {
  localStorage.setItem("targetCalories", targetCalories.toString());
}

loadCaloriesByDates();
loadProductsFromLocalStorage();
loadTargetCalories();
render();
