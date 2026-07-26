import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { useNavigate } from "react-router";
import RecipeGrid from "../../components/RecipeGrid/RecipeGrid";
import { db } from "../../database/db";
import useUserSession from "../../hooks/useUserSession";
import { RECIPE_CATEGORIES, type RecipePreview } from "../../types/recipe";
import styles from "./DashboardPage.module.css";

function DashboardPage() {
  const navigate = useNavigate();
  const { currentUser } = useUserSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const recipes = useLiveQuery(async () => {
    const [storedRecipes, storedRatings] = await Promise.all([
      db.recipes.toArray(),
      db.ratings.toArray(),
    ]);

    return storedRecipes.map((recipe) => {
      const recipeRatings = storedRatings.filter(
        (rating) => rating.recipeId === recipe.id,
      );
      const averageRating =
        recipeRatings.length > 0
          ? recipeRatings.reduce((sum, rating) => sum + rating.value, 0) /
            recipeRatings.length
          : null;

      return {
        id: recipe.id,
        title: recipe.title,
        category: recipe.category,
        durationMinutes: recipe.durationMinutes,
        rating:
          averageRating === null ? null : Number(averageRating.toFixed(1)),
        imageUrl: recipe.imageUrl,
        imageBlob: recipe.imageBlob,
      } satisfies RecipePreview;
    });
  }, []);

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();

  const filteredRecipes = (recipes ?? []).filter((recipe) => {
    const normalizedRecipeTitle = recipe.title.toLowerCase();
    const normalizedRecipeCategory = recipe.category.toLowerCase();
    const categoryKey = normalizedRecipeCategory.replace(/\s+/g, "-");

    const matchesSearch =
      normalizedSearchQuery.length === 0 ||
      normalizedRecipeTitle.includes(normalizedSearchQuery) ||
      normalizedRecipeCategory.includes(normalizedSearchQuery);

    const matchesCategory =
      selectedCategory === "all" || categoryKey === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const resultsLabel = `${filteredRecipes.length} ${filteredRecipes.length === 1 ? "recipe" : "recipes"}`;

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
  };

  const isDatabaseEmpty = recipes?.length === 0;

  const hasActiveFilters =
    searchQuery.trim().length > 0 || selectedCategory !== "all";

  const handleAddRecipeClick = () => {
    if (!currentUser) {
      return;
    }

    navigate("/recipes/new");
  };

  let content: React.ReactNode;

  if (recipes === undefined) {
    content = (
      <div className={styles.emptyState}>
        <h2 className={styles.emptyTitle}>Loading recipes...</h2>
        <p className={styles.emptyDescription}>
          Please wait while the recipe library loads.
        </p>
      </div>
    );
  } else if (isDatabaseEmpty) {
    content = (
      <div className={styles.emptyState}>
        <h2 className={styles.emptyTitle}>No recipes available</h2>
        <p className={styles.emptyDescription}>
          Recipes will appear here after they are added.
        </p>
      </div>
    );
  } else if (filteredRecipes.length === 0) {
    content = (
      <div className={styles.emptyState}>
        <h2 className={styles.emptyTitle}>No recipes found</h2>
        <p className={styles.emptyDescription}>
          Try changing the search or category filter to see more recipes.
        </p>
        {!hasActiveFilters ? null : (
          <button
            className={styles.clearButton}
            type="button"
            onClick={handleClearFilters}
          >
            Clear filters
          </button>
        )}
      </div>
    );
  } else {
    content = <RecipeGrid recipes={filteredRecipes} />;
  }

  return (
    <section className={styles.page} aria-labelledby="dashboard-title">
      <div className={styles.headerRow}>
        <div className={styles.headerContent}>
          <p className={styles.eyebrow}>Recipe collection</p>
          <h1 id="dashboard-title" className={styles.title}>
            Recipes
          </h1>
          <p className={styles.description}>
            Discover, save and manage your favorite recipes.
          </p>
        </div>

        <div className={styles.headerActions}>
          {!currentUser ? (
            <p className={styles.inlineMessage}>
              Select a user before adding a recipe.
            </p>
          ) : null}
          <button
            className={styles.primaryButton}
            type="button"
            disabled={!currentUser}
            onClick={handleAddRecipeClick}
          >
            Add Recipe
          </button>
        </div>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchField}>
          <label className={styles.label} htmlFor="recipe-search">
            Search recipes
          </label>
          <input
            id="recipe-search"
            className={styles.input}
            type="search"
            placeholder="Search recipes by title or ingredient"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </div>

        <div className={styles.filterField}>
          <label className={styles.label} htmlFor="category-filter">
            Category
          </label>
          <select
            id="category-filter"
            className={styles.select}
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
          >
            <option value="all">All categories</option>
            {RECIPE_CATEGORIES.map((category) => (
              <option
                key={category}
                value={category.toLowerCase().replace(/\s+/g, "-")}
              >
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {recipes !== undefined && !isDatabaseEmpty && (
        <p className={styles.resultsSummary} role="status">
          {resultsLabel}
        </p>
      )}

      {content}
    </section>
  );
}

export default DashboardPage;
