document.addEventListener("DOMContentLoaded", function() {
    const categoriesContainer = document.getElementById('categories-container');

    fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
        .then(response => response.json())
        .then(data => {
            const categories = data.categories;
            categories.forEach(category => {
                const categoryCard = document.createElement('div');
                categoryCard.className = 'category-card';
                categoryCard.innerHTML = `
                    <img src="${category.strCategoryThumb}" alt="${category.strCategory}">
                    <h3>${category.strCategory}</h3>
                `;
                categoryCard.addEventListener('click', () => {
                    window.location = `./recipes.html?category=${category.strCategory}`;
                });
                categoriesContainer.appendChild(categoryCard);
            });
        });
});
