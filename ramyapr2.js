const defaultApiUrl = 'https://www.themealdb.com/api/json/v1/1/search.php?s=a'; 
const searchApiUrl = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
async function fetchFoodRecipes(query = '') {
    const apiUrl = query ? `${searchApiUrl}${query}` : defaultApiUrl;
    const response = await fetch(apiUrl);
    const data = await response.json();
    displayFoodRecipes(data.meals);
}
function displayFoodRecipes(meals) {
    const container = document.getElementById('food-container');
    container.innerHTML = '';

    if (!meals) {
        container.innerHTML = '<p>No recipes found. Try another search!</p>';
        return;
    }
    meals.forEach(meal => {
        const card = document.createElement('div');
        card.className = 'food-card';
        card.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <h3>${meal.strMeal}</h3>
            <p>Category: ${meal.strCategory}</p>
            <p>Area: ${meal.strArea}</p>
            <button onclick="fetchMealDetails('${meal.idMeal}')">View Details</button>
        `;
        container.appendChild(card);
    });
}
async function fetchMealDetails(mealId) {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
    const data = await response.json();
    displayMealDetails(data.meals[0]);
}
function displayMealDetails(meal) {
    const mealDetails = document.getElementById('meal-details');
    mealDetails.innerHTML = `
        <h2>${meal.strMeal}</h2>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <h3>Ingredients:</h3>
        <ul>
            ${getIngredients(meal).map(ingredient => `<li>${ingredient}</li>`).join('')}
        </ul>
        <h3>Instructions:</h3>
        <ul>
            ${formatInstructions(meal.strInstructions)}
        </ul>
    `;
    mealDetails.style.display = 'block'; // Show meal details
}
function getIngredients(meal) {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
        }
    }
    return ingredients;
}
function formatInstructions(instructions) {
    const steps = instructions.split('.').filter(step => step.trim() !== '');
    return steps.map(step => `<li>${step.trim()}</li>`).join('');
}
function searchRecipes() {
    const query = document.getElementById('search-input').value.trim();
    fetchFoodRecipes(query);
}
window.onload = function() {
    fetchFoodRecipes();
};
