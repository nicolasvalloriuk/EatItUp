const params = new URLSearchParams(window.location.search);
const id = params.get("id");

async function loadRecipe() {
  const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
  const res = await fetch(url);
  const data = await res.json();
  const meal = data.meals[0];

  let ingredients = "";
  // For loop to get ingredients and measures
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ing && ing.trim() !== "") {
      ingredients += `<li>${ing} - ${measure}</li>`;
    }
  }

  document.getElementById("recipe-title").textContent = meal.strMeal;
  document.getElementById("recipe-img").src = meal.strMealThumb;
  document.getElementById("recipe-ingredients").innerHTML = ingredients;
  document.getElementById("recipe-instructions").innerHTML =
    meal.strInstructions.replace(/\r\n/g, "<br>");

  if (meal.strYoutube) {
    document.getElementById("recipe-video").innerHTML =
      `<a href="${meal.strYoutube}" target="_blank">Watch on YouTube</a>`;
  }
}

loadRecipe();