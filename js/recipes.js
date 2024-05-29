document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const categoryTitle = document.getElementById('category-title');
    const recipesContainer = document.getElementById('recipes-container');
    const searchField = document.querySelector("[data-search-field]");
    const searchBtn = document.querySelector("[data-search-btn]");

    categoryTitle.textContent = `Recipes for ${category}`;

    function fetchRecipes(query = '') {
        let apiUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;
        if (query) {
            apiUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;
        }
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                recipesContainer.innerHTML = '';
                const meals = data.meals || [];
                meals.forEach(meal => {
                    const recipeCard = document.createElement('div');
                    recipeCard.className = 'recipe-card';
                    recipeCard.innerHTML = `
                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                        <h3>${meal.strMeal}</h3>
                    `;
                    recipesContainer.appendChild(recipeCard);
                });
            });
    }

    fetchRecipes();

    searchBtn.addEventListener("click", function () {
        if (searchField.value) fetchRecipes(searchField.value);
    });

    searchField.addEventListener("keydown", e => {
        if (e.key === "Enter") searchBtn.click();
    });
});
