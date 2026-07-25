import styles from "./RecipeCard.module.css";
import type { RecipePreview } from "../../types/recipe";

interface RecipeCardProps {
  recipe: RecipePreview;
}

function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <article className={styles.card}>
      <img
        className={styles.image}
        src={recipe.imageUrl}
        alt={`Dish photo for ${recipe.title}`}
      />

      <div className={styles.content}>
        <div className={styles.metaRow}>
          <span className={styles.categoryBadge}>{recipe.category}</span>
          <span className={styles.duration}>{recipe.durationMinutes} min</span>
        </div>

        <h2 className={styles.title}>{recipe.title}</h2>
        <p className={styles.rating}>★ {recipe.rating.toFixed(1)}</p>
      </div>
    </article>
  );
}

export default RecipeCard;
