import useObjectUrl from "../../hooks/useObjectUrl";
import styles from "./RecipeCard.module.css";
import type { RecipePreview } from "../../types/recipe";

interface RecipeCardProps {
  recipe: RecipePreview;
}

function RecipeCard({ recipe }: RecipeCardProps) {
  const ratingLabel =
    recipe.rating === null ? "Not rated" : `★ ${recipe.rating.toFixed(1)}`;
  const imageSrc = useObjectUrl(recipe.imageBlob);

  return (
    <article className={styles.card}>
      {imageSrc ? (
        <img
          className={styles.image}
          src={imageSrc}
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

      <div className={styles.content}>
        <div className={styles.metaRow}>
          <span className={styles.categoryBadge}>{recipe.category}</span>
          <span className={styles.duration}>{recipe.durationMinutes} min</span>
        </div>

        <h2 className={styles.title}>{recipe.title}</h2>
        <p className={styles.rating}>{ratingLabel}</p>
      </div>
    </article>
  );
}

export default RecipeCard;
