const formEl = document.querySelector(".search-input-container");
const inputEl = document.querySelector(".search-input");
const mealBtnArr = document.querySelectorAll(".meal-option");
const headerEl = document.querySelector("header");
const recipeContainer = document.querySelector(".recipe-container");
const closeBtn = document.querySelector(".close-btn");
const ingredientList = document.querySelector(".ingredient-list");
const instructionsEl = document.querySelector(".instructions");

let mealsContainer = document.querySelector(".meals-list");

const scrollMealsSection = function() {
  mealsContainer.classList.remove("hide");
  mealsContainer.innerHTML = `<div class="spinner"></div>`

  mealsContainer.scrollIntoView({
    behavior: "smooth",
  });
}

const getMealList = async function(mealName) {
  let response = await  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`);
  let data = await response.json();
  return data.meals
}

const getRecipe = async function(id) {
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
  let data = await response.json();
  return data.meals[0];
}

const viewRecipeHandler = async function() {

    let id = this.dataset.id;
    let recipe = await getRecipe(id);
    
    ingredientList.innerHTML = "";
    instructionsEl.innerText = "";

    for (let i = 1; i <= 20; i++) {
      let quantity = recipe[`strMeasure${i}`];
      let ingredient = recipe[`strIngredient${i}`];
      if (!quantity || quantity.trim().length === 0) break;
      let ingredientHTML = `<li>${quantity.trim()} ${ingredient}</li>`;
      ingredientList.insertAdjacentHTML("beforeend", ingredientHTML);
    }
    
    instructionsEl.innerText = recipe.strInstructions;
    recipeContainer.classList.remove("hide");

    recipeContainer.scrollIntoView({
      behavior: "smooth",
      block: "center"
    })

}

const createHTML = function(meals) {
  mealsContainer.innerHTML = "";
  
  if (!meals) {
    let html = `
    <div class="error-container">
      <span class="error-text">Could'nt find anything relating to your search, Try Something else</span>
      <span class="error-emoji">☹</span>
    </div>
    `
    mealsContainer.innerHTML = html;
    return;
  }

  for (let i = 0; i < meals.length; i++) {
    let meal = meals[i];

    let html = `
    <div class="meal-card">
      <div class="meal-img-container">
        <img src="${meal.strMealThumb}" alt="meal image" class="meal-img">
      </div>
      <div class="meal-content">
        <span class="meal-name">${meal.strMeal.slice(0, 30)}</span>
        <span class="meal-description">${meal.strArea} Dish</span>
        <span class="meal-category">Belongs to <b>${meal.strCategory}</b> Category</span>
        <button data-id="${meal.idMeal}" class="recipe-btn">View Recipe</button>
      </div>
    </div>`;
    
    mealsContainer.insertAdjacentHTML("beforeend", html);
  }

  document.querySelectorAll(".recipe-btn").forEach(el => {
    el.addEventListener("click", viewRecipeHandler);
  })

}

formEl.addEventListener("submit", async function(e) {
    e.preventDefault();

    // Read the value from the input
    let inputValue = inputEl.value.trim();
    inputEl.value = "";
    if (inputValue === "") return;

    scrollMealsSection();

    // Getting the array of meals, creating and HTML card and inserting it in index.html meals-section
    let meals = await getMealList(inputValue);

    createHTML(meals);

})

mealBtnArr.forEach(mealBtn => {
  mealBtn.addEventListener("click", async function() {
    const meal = this.dataset.meal;

    scrollMealsSection();

    let meals = await getMealList(meal);
  
    createHTML(meals);
  
  });
})


closeBtn.addEventListener("click", function() {
  recipeContainer.classList.add("hide");
})

