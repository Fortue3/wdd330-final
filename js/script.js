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
            // console.log("categories : ", categories)
            categories.forEach(category => {
                output += `
                <div class="category" onclick="window.location.href='recipes.html?category=${category.strCategory}'">
                ${category.strCategory}</div>

                `;
            });
            document.getElementById('categories').innerHTML = output;
        });
}

function sortByName() {
    const category = new URLSearchParams(window.location.search).get('category');
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
        .then(response => response.json())
        .then(data => {
            const recipes = data.meals;
            const sortVal = document.getElementById('sortVal').value
            let sortedRecipes;
            if (sortVal === "descending") {
                console.log("sort by : ", sortVal);
                sortedRecipes = recipes.sort((a, b) => b.strMeal.localeCompare(a.strMeal))
            } else {
                console.log("sort by : ", sortVal);
                sortedRecipes = recipes.sort((a, b) => a.strMeal.localeCompare(b.strMeal))
            }
           
            console.log(sortedRecipes)
            // const sortedRecipes = recipes.sort()
            let output = '';
            recipes.forEach(recipe => {
                output += `
                    <div class="card">
                        <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
                        <div class="card-content ">
                            <h3>${recipe.strMeal}</h3>
                            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit.</p>
                            <div class="btns">
                                <button class="button" onclick="window.location.href='recipe.html?id=${recipe.idMeal}'">
                                    <i class="fas fa-eye"></i>View
                                </button>
                                <button class="button" onclick="saveRecipe(${recipe.idMeal})">
                                    <i class="fas fa-bookmark"></i>Save Recipe
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });
            document.getElementById('recipes').innerHTML = output;
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
                    <div class="card">
                        <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
                        <div class="card-content ">
                            <h3>${recipe.strMeal}</h3>
                            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit.</p>
                            <div class="btns">
                                <button class="button" onclick="window.location.href='recipe.html?id=${recipe.idMeal}'">
                                    <i class="fas fa-eye"></i>View
                                </button>
                                <button class="button" onclick="saveRecipe(${recipe.idMeal})">
                                    <i class="fas fa-bookmark"></i>Save Recipe
                                </button>
                            </div>
                        </div>
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
            let ingredients1 = '';
            for (let i = 1; i <= 20; i++) {
                if (recipe[`strIngredient${i}`]) {
                    ingredients += `<li>${recipe[`strIngredient${i}`]} - ${recipe[`strMeasure${i}`]}</li>`;
                    ingredients1 += `<tr><td>${recipe[`strIngredient${i}`]} - ${recipe[`strMeasure${i}`]}<td></tr>`
                } else {
                    break;
                }
            }
            const details = `
            <div class="right-box">
                <div class="main-image-box" id="mainImageBox">
                    <img src="${recipe.strMealThumb}" id="mainImage" class="main-image" alt="">
                </div>
            </div>

            <div class="details-box">
                <h1>${recipe.strMeal}</h1>
                <h2>Ingredients</h2>
                <ul>${ingredients}</ul>
                <h2>Instructions</h2>
                <p>${recipe.strInstructions}</p>
                <button onclick="saveRecipe(${recipe.idMeal})">Save Recipe</button>
            </div>
            `;

            const output = `
                <div class="card">
                    <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
                    <div class="card-content ">
                        <h2>${recipe.strMeal}</h2>
                        <h3>Ingredients</h3>
                        <ul>${ingredients}</ul>
                        <h2>Instructions</h2>
                        <p>${recipe.strInstructions}</p>
                        <button class="button" onclick="saveRecipe(${recipe.idMeal})">Save Recipe</button>
                    </div>
                </div>
            `;
            // document.getElementById('recipe-details').innerHTML = output;
            document.getElementById('recipe-container').innerHTML = details;
        });
}

function searchRecipes() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const recipes = document.querySelectorAll('.card');
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
    document.getElementById('numberOfRecipes').innerHTML = savedRecipes.length
    // console.log("recipe count : ", savedRecipes.length)
}

function displaySavedRecipes() {
    let savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
    let output = '';
    let tbl = ''
    savedRecipes.forEach(id => {
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
            .then(response => response.json())
            .then(data => {
                const recipe = data.meals[0];

                tbl += `
                    <tr>
                        <td width="150">
                            <div class="img-box">
                                <img src="${recipe.strMealThumb}" class="img" alt="">
                            </div>
                        </td>
                        <td width="150"><p style="font-size: 15px;">${recipe.strMeal}</p></td>
                        <td width="70" onclick="removeRecipe(${id})">
                            <i class="fa-solid fa-trash" style="color: red;"></i>
                        </td>
                    </tr>
                `
                
                // document.getElementById('saved-recipes').innerHTML = output;
                document.getElementById('root').innerHTML = tbl;
            });
    });
}

function removeRecipe(id) {
    let savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
    savedRecipes = savedRecipes.filter(recipeId => recipeId !== id);
    localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
    displaySavedRecipes();
}


function countSavedRecipes() {
    let savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
    console.log("Count : ", savedRecipes)
    document.getElementById('numberOfRecipes').innerHTML = savedRecipes.length
}

document.addEventListener('DOMContentLoaded', () => {
    HeaderComponent.loadNavbar();
    let savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
    document.getElementById('numberOfRecipes').innerHTML = savedRecipes.length
});
