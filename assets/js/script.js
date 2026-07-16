async function searchRecipes() {
      const q = document.getElementById("query").value.trim();
      const resultsDiv = document.getElementById("results");

      if (!q) {
        resultsDiv.innerHTML = "Please enter a search term.";
        return;
      }

      const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(q)}`;

      const res = await fetch(url);
      const data = await res.json();

      console.log("Full API response:", data);

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

        resultsDiv.appendChild(card);
      });
    }