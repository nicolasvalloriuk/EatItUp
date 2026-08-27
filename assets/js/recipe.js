/*jslint browser */
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

async function loadRecipe() {
    const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
    const res = await fetch(url);
    const data = await res.json();
    const meal = data.meals[0];

    let ingredients = "";
    // For loop to get ingredients and measures
    for (let i = 1; i <= 20; i += 1) {
        const ing = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ing && ing.trim() !== "") {
            ingredients += `<li>${ing} - ${measure}</li>`;
        }
    }

    document.getElementById("recipe-title").textContent = meal.strMeal;
    document.getElementById("recipe-img").src = meal.strMealThumb;
    document.getElementById("recipe-ingredients").innerHTML = ingredients;
    document.getElementById("recipe-instructions").innerHTML = meal.strInstructions.replace(/\r\n/g, "<br>");

    if (meal.strYoutube) {
        document.getElementById("recipe-video").innerHTML =
        `<a href="${meal.strYoutube}" target="_blank">Watch on YouTube</a>`;
    }
}

loadRecipe();

// Search Function
const queryInput = document.getElementById("query");
const suggestionsDiv = document.getElementById("suggestions");
const searchBtn = document.getElementById("searchBtn");

// Add event listener to the input field to fetch suggestions as the user types
queryInput.addEventListener("input", async function () {
    const q = queryInput.value.trim();
    // if statement to check if the query is less than 2 characters,
    // if so hide the suggestions
    if (q.length < 2) {
        suggestionsDiv.style.display = "none";
        return;
    }

    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(q)}`;
    const res = await fetch(url);
    const data = await res.json();
    // if statement to check if there are no meals returned,
    // if so hide the suggestions
    if (!data.meals) {
        suggestionsDiv.style.display = "none";
        return;
    }

    // Take first 5 suggestions
    const firstFive = data.meals.slice(0, 5);

    suggestionsDiv.innerHTML = "";
    firstFive.forEach(function (meal) {
        const item = document.createElement("div");
        item.textContent = meal.strMeal;

        // when clicked open recipe.html with the meal id
        item.onclick = function () {
            suggestionsDiv.style.display = "none";
            window.open(`recipe.html?id=${meal.idMeal}`, "_blank");
        };

        suggestionsDiv.appendChild(item);
    });

    suggestionsDiv.style.display = "block";
});

// Close the suggestions when clicking outside
document.addEventListener("click", function (e) {
    if (!e.target.closest(".search-container")) {
        suggestionsDiv.style.display = "none";
    }
});

//Search button with event listener connected to new page
searchBtn.addEventListener("click", async function () {
    const q = queryInput.value.trim();
    if (!q) {
        return;
    }

    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(q)}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data.meals) {
        window.location.href = "404.html";
        return;
    }

    const firstMeal = data.meals[0];
    // Open recipe on a new page when the card is clicked
    window.open(`recipe.html?id=${firstMeal.idMeal}`, "_blank");
});
