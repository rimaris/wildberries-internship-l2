export class Product {
  constructor(name, protein, fats, carbohydrates, calories, weight) {
    this.name = name;
    this.protein = (protein * weight) / 100;
    this.fats = (fats * weight) / 100;
    this.carbohydrates = (carbohydrates * weight) / 100;
    this.calories = (calories * weight) / 100;
    this.weight = weight;
  }
}

export class ProductDiary {
  constructor() {
    this.breakfastProducts = [];
    this.lunchProducts = [];
    this.dinnerProducts = [];
    this.summary = {
      protein: 0,
      fats: 0,
      carbs: 0,
      cals: 0,
    };
  }
  
  clear() {
    this.breakfastProducts = [];
    this.lunchProducts = [];
    this.dinnerProducts = [];
    this.calcSummary();
  }

  addBreakfastProduct(product) {
    this.breakfastProducts.push(product);
    this.calcSummary();
  }

  addLunchProduct(product) {
    this.lunchProducts.push(product);
    this.calcSummary();
  }

  addDinnerProduct(product) {
    this.dinnerProducts.push(product);
    this.calcSummary();
  }

  removeBreakfastProduct(product) {
    removeFromArray(this.breakfastProducts, product);
    this.calcSummary();
  }

  removeDinnerProduct(product) {
    removeFromArray(this.dinnerProducts, product);
    this.calcSummary();
  }
  
  removeLunchProduct(product) {
    removeFromArray(this.lunchProducts, product);
    this.calcSummary();
  }

  calcSummary() {
    let protsSum = 0;
    let fatsSum = 0;
    let carbsSum = 0;
    let calsSum = 0;

    const allProducts = this.breakfastProducts.concat(
      this.lunchProducts,
      this.dinnerProducts
    );

    allProducts.forEach((product) => {
      protsSum += product.protein;
      fatsSum += product.fats;
      carbsSum += product.carbohydrates;
      calsSum += product.calories;
    });

    this.summary.protein = protsSum;
    this.summary.fats = fatsSum;
    this.summary.carbs = carbsSum;
    this.summary.cals = calsSum;
  }

  getTotalCalories() {
    return this.summary.cals;
  }
}

function removeFromArray(arr, o) {
  const idx = arr.indexOf(o);
  if (idx === -1) {
    return;
  }
  arr.splice(idx, 1);
}
