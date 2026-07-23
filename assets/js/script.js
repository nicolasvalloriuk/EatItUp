
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

    // when clicked open recipe.html with the meal id
    item.onclick = () => {
      suggestionsDiv.style.display = "none";
      window.open(`recipe.html?id=${meal.idMeal}`, "_blank");
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

//Search button with event listener connected to new page
searchBtn.addEventListener("click", async () => {
  const q = queryInput.value.trim();
  if (!q) return;

  const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(q)}`;
  const res = await fetch(url);
  const data = await res.json();

  if (!data.meals) return;

  const firstMeal = data.meals[0];
  // Open recipe on a new page when the card is clicked
  window.open(`recipe.html?id=${firstMeal.idMeal}`, "_blank");
});

