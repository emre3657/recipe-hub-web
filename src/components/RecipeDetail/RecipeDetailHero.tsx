import { Link } from "react-router";
import styles from "./RecipeDetailHero.module.css";
import type { Recipe } from "../../types/recipe";
import type { User } from "../../types/user";

interface RecipeDetailHeroProps {
  recipe: Recipe;
  recipeImageSrc: string | null;
  authorName: string;
  averageRating: number | null;
  currentUser: User | null;
  isFavorite: boolean;
  isTogglingFavorite: boolean;
  isOwner: boolean;
  onToggleFavorite: () => void;
  onDeleteRecipe: () => void;
}

function RecipeDetailHero({
  recipe,
  recipeImageSrc,
  authorName,
  averageRating,
  currentUser,
  isFavorite,
  isTogglingFavorite,
  isOwner,
  onToggleFavorite,
  onDeleteRecipe,
}: RecipeDetailHeroProps) {
  const createdAtLabel = new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(recipe.createdAt);

  const ratingLabel =
    averageRating === null ? "Not rated" : `★ ${averageRating.toFixed(1)}`;

  return (
    <div className={styles.hero}>
      <div className={styles.imageColumn}>
        {recipeImageSrc ? (
          <img
            className={styles.image}
            src={recipeImageSrc}
            alt={`Dish photo for ${recipe.title}`}
          />
        ) : recipe.imageUrl ? (
          <img
            className={styles.image}
            src={recipe.imageUrl}
            alt={`Dish photo for ${recipe.title}`}
          />
        ) : (
          <div
            className={styles.imagePlaceholder}
            role="img"
            aria-label={`No image available for ${recipe.title}`}
          />
        )}
      </div>

      <div className={styles.infoColumn}>
        <div className={styles.metaRow}>
          <span className={styles.categoryBadge}>{recipe.category}</span>
          <span className={styles.duration}>{recipe.durationMinutes} min</span>
          <span className={styles.rating}>{ratingLabel}</span>
        </div>

        <h1 className={styles.title}>{recipe.title}</h1>
        <p className={styles.description}>{recipe.description}</p>

        {currentUser ? (
          <div className={styles.actions}>
            <button
              className={[
                styles.favoriteAction,
                isFavorite ? styles.favoriteActionActive : "",
              ].join(" ")}
              type="button"
              disabled={isTogglingFavorite}
              aria-pressed={isFavorite}
              onClick={onToggleFavorite}
            >
              <span aria-hidden="true">{isFavorite ? "♥" : "♡"}</span>
              {isTogglingFavorite
                ? "Updating..."
                : isFavorite
                  ? "Remove from favorites"
                  : "Add to favorites"}
            </button>

            {isOwner ? (
              <>
                <Link
                  className={styles.secondaryAction}
                  to={`/recipes/${recipe.id}/edit`}
                >
                  Edit recipe
                </Link>

                <button
                  className={styles.deleteAction}
                  type="button"
                  onClick={onDeleteRecipe}
                >
                  Delete recipe
                </button>
              </>
            ) : null}
          </div>
        ) : (
          <p className={styles.favoriteMessage}>
            Select a user to add this recipe to favorites.
          </p>
        )}

        <dl className={styles.metadataList}>
          <div className={styles.metadataItem}>
            <dt className={styles.metadataLabel}>Author</dt>
            <dd className={styles.metadataValue}>{authorName}</dd>
          </div>

          <div className={styles.metadataItem}>
            <dt className={styles.metadataLabel}>Created</dt>
            <dd className={styles.metadataValue}>{createdAtLabel}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

export default RecipeDetailHero;
