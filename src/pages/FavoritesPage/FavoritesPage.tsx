import { useLiveQuery } from "dexie-react-hooks";
import RecipeGrid from "../../components/RecipeGrid/RecipeGrid";
import { db } from "../../database/db";
import useUserSession from "../../hooks/useUserSession";
import type { RecipePreview } from "../../types/recipe";
import styles from "./FavoritesPage.module.css";

function FavoritesPage() {
  const { currentUser } = useUserSession();

  const favoriteRecipes = useLiveQuery<RecipePreview[] | null>(async () => {
    if (!currentUser) {
      return null;
    }

    const favorites = await db.favorites
      .where("userId")
      .equals(currentUser.id)
      .toArray();

    favorites.sort(
      (firstFavorite, secondFavorite) =>
        secondFavorite.createdAt.getTime() - firstFavorite.createdAt.getTime(),
    );

    if (favorites.length === 0) {
      return [];
    }

    const favoriteRecipeIds = favorites.map((favorite) => favorite.recipeId);

    const [recipes, ratings] = await Promise.all([
      db.recipes.bulkGet(favoriteRecipeIds),
      db.ratings.where("recipeId").anyOf(favoriteRecipeIds).toArray(),
    ]);

    return recipes.flatMap((recipe) => {
      if (!recipe) {
        return [];
      }

      const recipeRatings = ratings.filter(
        (rating) => rating.recipeId === recipe.id,
      );

      const averageRating =
        recipeRatings.length === 0
          ? null
          : recipeRatings.reduce((sum, rating) => sum + rating.value, 0) /
            recipeRatings.length;

      return [
        {
          id: recipe.id,
          title: recipe.title,
          category: recipe.category,
          durationMinutes: recipe.durationMinutes,
          rating:
            averageRating === null ? null : Number(averageRating.toFixed(1)),
          imageUrl: recipe.imageUrl,
          imageBlob: recipe.imageBlob,
        } satisfies RecipePreview,
      ];
    });
  }, [currentUser?.id]);

  let content: React.ReactNode;

  if (!currentUser) {
    content = (
      <div className={styles.statusCard}>
        <h2 className={styles.statusTitle}>Select a user</h2>
        <p className={styles.statusDescription}>
          Select a demo user to view their favorite recipes.
        </p>
      </div>
    );
  } else if (favoriteRecipes === undefined) {
    content = (
      <div className={styles.statusCard}>
        <h2 className={styles.statusTitle}>Loading favorite recipes...</h2>
        <p className={styles.statusDescription}>
          Please wait while your favorites are loaded.
        </p>
      </div>
    );
  } else if (favoriteRecipes === null || favoriteRecipes.length === 0) {
    content = (
      <div className={styles.statusCard}>
        <h2 className={styles.statusTitle}>No favorite recipes yet</h2>
        <p className={styles.statusDescription}>
          Recipes you add to favorites will appear here.
        </p>
      </div>
    );
  } else {
    content = <RecipeGrid recipes={favoriteRecipes} />;
  }

  return (
    <section className={styles.page} aria-labelledby="favorites-title">
      <div className={styles.headerBlock}>
        <h1 id="favorites-title" className={styles.title}>
          Favorites
        </h1>

        <p className={styles.description}>
          Keep your favorite recipes together in one place.
        </p>
      </div>

      {currentUser &&
      favoriteRecipes !== undefined &&
      favoriteRecipes !== null ? (
        <p className={styles.resultsSummary} role="status">
          {favoriteRecipes.length}{" "}
          {favoriteRecipes.length === 1
            ? "favorite recipe"
            : "favorite recipes"}
        </p>
      ) : null}

      {content}
    </section>
  );
}

export default FavoritesPage;
