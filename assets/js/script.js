
const queryInput = document.getElementById("query");
const suggestionsDiv = document.getElementById("suggestions");
const searchBtn = document.getElementById("searchBtn");

// Search Function
queryInput.addEventListener("input", async () => {
  const q = queryInput.value.trim();

  if (q.length < 2) {
    suggestionsDiv.style.display = "none";
    return;
  }

  const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(q)}`;
  const res = await fetch(url);
  const data = await res.json();

  if (!data.meals) {
    suggestionsDiv.style.display = "none";
    return;
  }

  // Take first 5 suggestions
  const firstFive = data.meals.slice(0, 5);

  suggestionsDiv.innerHTML = "";
  firstFive.forEach(meal => {
    const item = document.createElement("div");
    item.textContent = meal.strMeal;

    item.onclick = () => {
      queryInput.value = meal.strMeal;
      suggestionsDiv.style.display = "none";
      searchRecipes(meal.strMeal);
    };

    suggestionsDiv.appendChild(item);
  });

  suggestionsDiv.style.display = "block";
});

// Close the suggestions when clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".search-container")) {
    suggestionsDiv.style.display = "none";
  }
});

// Search Button
searchBtn.addEventListener("click", () => searchRecipes());

// Main search fuction
async function searchRecipes(forcedQuery = null) {

  const q = forcedQuery || queryInput.value.trim();
  const resultsDiv = document.getElementById("results");

  if (!q) {
    resultsDiv.innerHTML = "Please enter a search term.";
    return;
  }

  const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(q)}`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data.meals) {
    resultsDiv.innerHTML = "No recipes found.";
    return;
  }

  resultsDiv.innerHTML = "";

  data.meals.forEach(meal => {
    const card = document.createElement("div");
    card.className = "card";
  
    // Build ingredients list
    let ingredients = "";
    for (let i = 1; i <= 20; i++) {
      const ing = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ing && ing.trim() !== "") {
        ingredients += `<li>${ing} - ${measure}</li>`;
      }
    }

  card.innerHTML = `
    <h3>${meal.strMeal}</h3>
    <img src="${meal.strMealThumb}" alt="Meal image">

    <p><strong>Category:</strong> ${meal.strCategory}</p>
    <p><strong>Area:</strong> ${meal.strArea}</p>

    <p><strong>Ingredients:</strong></p>
    <ul>${ingredients}</ul>

    <p><strong>Instructions:</strong></p>
    <p>${meal.strInstructions.replace(/\r\n/g, "<br>")}</p>

    ${meal.strYoutube ? `<p><a href="${meal.strYoutube}" target="_blank">Watch on YouTube</a></p>` : ""}
   `;
    
    // Open recipe on a new page when the card is clicked
    card.querySelectorAll(".recipe-link").forEach(el => {
      el.addEventListener("click", () => {
        window.open(`recipe.html?id=${meal.idMeal}`, "_blank");
      });
    });

    resultsDiv.appendChild(card);
  });
}