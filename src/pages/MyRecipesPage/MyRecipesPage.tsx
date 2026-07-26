import { Link } from "react-router";
import { useLiveQuery } from "dexie-react-hooks";
import RecipeGrid from "../../components/RecipeGrid/RecipeGrid";
import { db } from "../../database/db";
import useUserSession from "../../hooks/useUserSession";
import type { RecipePreview } from "../../types/recipe";
import styles from "./MyRecipesPage.module.css";

function MyRecipesPage() {
  const { currentUser, isLoading } = useUserSession();

  const currentUserId = currentUser?.id;

  const recipes = useLiveQuery<RecipePreview[]>(async () => {
    if (!currentUserId) {
      return [];
    }

    const userRecipes = await db.recipes
      .where("authorId")
      .equals(currentUser.id)
      .toArray();

    const ratings = await db.ratings.toArray();
    const ratingsByRecipeId = new Map<string, number[]>();

    const userRecipeIds = new Set(userRecipes.map((recipe) => recipe.id));

    ratings.forEach((rating) => {
      if (!userRecipeIds.has(rating.recipeId)) {
        return;
      }

      const values = ratingsByRecipeId.get(rating.recipeId) ?? [];
      values.push(rating.value);
      ratingsByRecipeId.set(rating.recipeId, values);
    });

    const previews = userRecipes
      .slice()
      .sort(
        (left, right) => right.createdAt.getTime() - left.createdAt.getTime(),
      )
      .map((recipe) => {
        const recipeRatings = ratingsByRecipeId.get(recipe.id) ?? [];
        const averageRating =
          recipeRatings.length > 0
            ? recipeRatings.reduce((sum, value) => sum + value, 0) /
              recipeRatings.length
            : null;

        return {
          id: recipe.id,
          title: recipe.title,
          category: recipe.category,
          durationMinutes: recipe.durationMinutes,
          rating: averageRating,
          imageUrl: recipe.imageUrl,
          imageBlob: recipe.imageBlob,
        } satisfies RecipePreview;
      });

    return previews;
  }, [currentUser?.id]);

  if (isLoading) {
    return (
      <section className={styles.statusCard}>
        <h1 className={styles.statusTitle}>Loading your recipes...</h1>
      </section>
    );
  }

  if (!currentUser) {
    return (
      <section className={styles.statusCard}>
        <h1 className={styles.statusTitle}>My Recipes</h1>
        <p className={styles.statusText}>Select a user to view your recipes.</p>
        <Link className={styles.actionLink} to="/">
          Back to recipes
        </Link>
      </section>
    );
  }

  if (recipes === undefined) {
    return (
      <section className={styles.statusCard}>
        <h1 className={styles.statusTitle}>Loading your recipes...</h1>
      </section>
    );
  }

  if (recipes.length === 0) {
    return (
      <section className={styles.emptyState}>
        <div className={styles.emptyContent}>
          <p className={styles.eyebrow}>Personal collection</p>
          <h1 className={styles.title}>No recipes yet</h1>
          <p className={styles.description}>
            Add your first recipe to see it here.
          </p>
        </div>
        <Link className={styles.primaryAction} to="/recipes/new">
          Add Recipe
        </Link>
      </section>
    );
  }

  return (
    <section className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Personal collection</p>
          <h1 className={styles.title}>My Recipes</h1>
          <p className={styles.description}>
            Recipes created by {currentUser.name}.
          </p>
        </div>
        <div className={styles.headerMeta}>
          <p className={styles.count}>
            {recipes.length} {recipes.length === 1 ? "recipe" : "recipes"}
          </p>
          <Link className={styles.primaryAction} to="/recipes/new">
            Add Recipe
          </Link>
        </div>
      </div>

      <RecipeGrid recipes={recipes} />
    </section>
  );
}

export default MyRecipesPage;
