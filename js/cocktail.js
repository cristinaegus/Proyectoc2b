document.addEventListener("DOMContentLoaded", function () {
  const searchBtn = document.getElementById("searchBtn");
  const searchInput = document.getElementById("searchInput");
  const tagButtons = document.querySelectorAll(".tag-btn");
  const initialState = document.getElementById("initialState");
  const loadingState = document.getElementById("loadingState");
  const errorState = document.getElementById("errorState");
  const cocktailsGrid = document.getElementById("cocktailsGrid");

  // Search by button click
  searchBtn.addEventListener("click", searchCocktails);

  // Search by Enter key
  searchInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      searchCocktails();
    }
  });

  // Search by quick tags
  tagButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      searchInput.value = this.dataset.ingredient;
      searchCocktails();
    });
  });

  function searchCocktails() {
    const ingredient = searchInput.value.trim();
    if (!ingredient) return;

    // Show loading state
    initialState.classList.add("hidden");
    errorState.classList.add("hidden");
    cocktailsGrid.classList.add("hidden");
    loadingState.classList.remove("hidden");

    // Fetch cocktails by ingredient
    fetch(
      `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(
        ingredient
      )}`
    )
      .then((response) => response.json())
      .then((data) => {
        loadingState.classList.add("hidden");

        if (!data.drinks) {
          errorState.classList.remove("hidden");
          return;
        }

        displayResults(data.drinks, ingredient);
      })
      .catch((error) => {
        console.error("Error:", error);
        loadingState.classList.add("hidden");
        errorState.classList.remove("hidden");
      });
  }

  function displayResults(drinks, ingredient) {
    cocktailsGrid.innerHTML = "";
    cocktailsGrid.style.display = "grid";

    drinks.forEach((drink) => {
      // Fetch detailed information for each cocktail
      fetch(
        `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drink.idDrink}`
      )
        .then((response) => response.json())
        .then((data) => {
          const cocktail = data.drinks[0];
          createCocktailCard(cocktail, ingredient);
        });
    });
  }

  function createCocktailCard(cocktail, ingredient) {
    // Get ingredients and measures
    const ingredients = [];
    const measures = [];

    for (let i = 1; i <= 15; i++) {
      if (cocktail[`strIngredient${i}`]) {
        ingredients.push(cocktail[`strIngredient${i}`]);
        measures.push(cocktail[`strMeasure${i}`] || "");
      }
    }

    // Highlight the searched ingredient
    const highlightedIngredients = ingredients
      .map((ing) => {
        return ing.toLowerCase() === ingredient.toLowerCase()
          ? `<span class="highlight">${ing}</span>`
          : ing;
      })
      .join(", ");

    const card = document.createElement("div");
    card.className = "cocktail-card fade-in";
    card.innerHTML = `
                <div class="cocktail-image">
                    <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}">
                </div>
                <div class="cocktail-content">
                    <h3>${cocktail.strDrink}</h3>
                    <div class="cocktail-meta">
                        <span><i class="fas fa-glass-whiskey"></i>${cocktail.strAlcoholic}</span>
                        <span class="separator">•</span>
                        <span><i class="fas fa-list-ul"></i>${ingredients.length} ingredientes</span>
                    </div>
                    <p class="cocktail-ingredients">${highlightedIngredients}</p>
                    <div class="cocktail-footer">
                        <button class="view-details">
                            Ver detalles
                            <i class="fas fa-chevron-right"></i>
                        </button>
                        <span class="cocktail-category">${cocktail.strCategory}</span>
                    </div>
                </div>
            `;

    // Add click event to view details
    card.querySelector(".view-details").addEventListener("click", () => {
      showCocktailDetails(cocktail);
    });

    cocktailsGrid.appendChild(card);
  }

  function showCocktailDetails(cocktail) {
    // Create modal
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>${cocktail.strDrink}</h3>
                        <button class="close-modal">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="modal-row">
                            <div class="modal-image">
                                <img src="${cocktail.strDrinkThumb}" alt="${
      cocktail.strDrink
    }">
                            </div>
                            <div class="modal-info">
                                <div class="info-group">
                                    <h4>Categoría</h4>
                                    <p>${cocktail.strCategory} • ${
      cocktail.strAlcoholic
    }</p>
                                </div>
                                <div class="info-group">
                                    <h4>Vaso recomendado</h4>
                                    <p>${cocktail.strGlass}</p>
                                </div>
                                <div class="info-group">
                                    <h4>Instrucciones</h4>
                                    <p>${cocktail.strInstructions}</p>
                                </div>
                            </div>
                        </div>

                        <div class="info-group">
                            <h4>Ingredientes</h4>
                            <div class="ingredients-grid">
                                ${getIngredientsList(cocktail)}
                            </div>
                        </div>

                        ${
                          cocktail.strInstructionsES
                            ? `
                        <div class="instructions-es">
                            <h4>Instrucciones en Español</h4>
                            <p>${cocktail.strInstructionsES}</p>
                        </div>
                        `
                            : ""
                        }
                    </div>
                </div>
            `;

    document.body.appendChild(modal);

    // Close modal
    modal.querySelector(".close-modal").addEventListener("click", () => {
      modal.remove();
    });

    // Close when clicking outside
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }

  function getIngredientsList(cocktail) {
    let html = "";
    for (let i = 1; i <= 15; i++) {
      const ingredient = cocktail[`strIngredient${i}`];
      const measure = cocktail[`strMeasure${i}`];

      if (ingredient) {
        html += `
                        <div class="ingredient-item">
                            <div class="ingredient-icon">
                                <i class="fas fa-circle"></i>
                            </div>
                            <div>
                                <div class="ingredient-name">${ingredient}</div>
                                ${
                                  measure
                                    ? `<div class="ingredient-measure">${measure}</div>`
                                    : ""
                                }
                            </div>
                        </div>
                    `;
      }
    }
    return html;
  }
});
