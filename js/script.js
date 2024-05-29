class HeaderComponent {
    static loadNavbar() {
        document.getElementById('navbar').innerHTML = `
            <img src="https://via.placeholder.com/50" alt="Logo">
            <nav>
                <a href="index.html">Home</a>
                <a href="saved.html">Saved Recipes</a>
            </nav>
        `;
    }
}

function fetchCategories() {
    fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
        .then(response => response.json())
        .then(data => {
            const categories = data.categories;
            let output = '';
            categories.forEach(category => {
                output += `
                    <div class="category" onclick="window.location.href='recipes.html?category=${category.strCategory}'">
                        <img src="${category.strCategoryThumb}" alt="${category.strCategory}">
                        <h3>${category.strCategory}</h3>
                    </div>
                `;
            });
            document.getElementById('categories').innerHTML = output;
        });
}

function fetchRecipes(category) {
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
        .then(response => response.json())
        .then(data => {
            const recipes = data.meals;
            let output = '';
            recipes.forEach(recipe => {
                output += `
                    <div class="recipe">
                        <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
                        <h3>${recipe.strMeal}</h3>
                        <button onclick="saveRecipe(${recipe.idMeal})">Save Recipe</button>
                    </div>
                `;
            });
            document.getElementById('recipes').innerHTML = output;
        });
}

function fetchRecipeDetails(id) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then(response => response.json())
        .then(data => {
            const recipe = data.meals[0];
            let ingredients = '';
            for (let i = 1; i <= 20; i++) {
                if (recipe[`strIngredient${i}`]) {
                    ingredients += `<li>${recipe[`strIngredient${i}`]} - ${recipe[`strMeasure${i}`]}</li>`;
                } else {
                    break;
                }
            }
            const output = `
                <h1>${recipe.strMeal}</h1>
                <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
                <h2>Ingredients</h2>
                <ul>${ingredients}</ul>
                <h2>Instructions</h2>
                <p>${recipe.strInstructions}</p>
                <button onclick="saveRecipe(${recipe.idMeal})">Save Recipe</button>
            `;
            document.getElementById('recipe-details').innerHTML = output;
        });
}

function searchRecipes() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const recipes = document.querySelectorAll('.recipe');
    recipes.forEach(recipe => {
        const title = recipe.querySelector('h3').textContent.toLowerCase();
        if (title.includes(searchTerm)) {
            recipe.style.display = 'block';
        } else {
            recipe.style.display = 'none';
        }
    });
}

function saveRecipe(id) {
    let savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
    if (!savedRecipes.includes(id)) {
        savedRecipes.push(id);
        localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
    }
}

function displaySavedRecipes() {
    let savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
    let output = '';
    savedRecipes.forEach(id => {
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
            .then(response => response.json())
            .then(data => {
                const recipe = data.meals[0];
                output += `
                    <div class="saved-recipe">
                        <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
                        <h3>${recipe.strMeal}</h3>
                        <button onclick="removeRecipe(${id})">Remove</button>
                        <button onclick="window.location.href='recipe.html?id=${id}'">View</button>
                    </div>
                `;
                document.getElementById('saved-recipes').innerHTML = output;
            });
    });
}

function removeRecipe(id) {
    let savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
    savedRecipes = savedRecipes.filter(recipeId => recipeId !== id);
    localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
    displaySavedRecipes();
}

document.addEventListener('DOMContentLoaded', () => {
    HeaderComponent.loadNavbar();
});
