import type { Recipe } from "../../types/recipe";
import RatingControl from "../RatingControl/RatingControl";
import styles from "./RecipeDetailSections.module.css";

interface RecipeDetailSectionsProps {
  recipe: Recipe;
  currentUserRating: number | null;
  isSavingRating: boolean;
  onRatingChange: (value: number) => void;
  currentUser: { id: string; name: string } | null;
}

function RecipeDetailSections({
  recipe,
  currentUserRating,
  isSavingRating,
  onRatingChange,
  currentUser,
}: RecipeDetailSectionsProps) {
  return (
    <>
      <section
        className={styles.contentSection}
        aria-labelledby="rating-heading"
      >
        <h2 id="rating-heading" className={styles.sectionTitle}>
          Rate this recipe
        </h2>

        {currentUser ? (
          <RatingControl
            value={currentUserRating}
            isSubmitting={isSavingRating}
            onChange={onRatingChange}
          />
        ) : (
          <p className={styles.ratingMessage}>
            Select a user to rate this recipe.
          </p>
        )}
      </section>

      <section
        className={styles.contentSection}
        aria-labelledby="ingredients-heading"
      >
        <h2 id="ingredients-heading" className={styles.sectionTitle}>
          Ingredients
        </h2>

        <ul className={styles.list}>
          {recipe.ingredients.map((ingredient, index) => (
            <li key={`${index}-${ingredient}`} className={styles.listItem}>
              {ingredient}
            </li>
          ))}
        </ul>
      </section>

      <section
        className={styles.contentSection}
        aria-labelledby="instructions-heading"
      >
        <h2 id="instructions-heading" className={styles.sectionTitle}>
          Instructions
        </h2>

        <ol className={styles.orderedList}>
          {recipe.instructions.map((instruction, index) => (
            <li key={`${index}-${instruction}`} className={styles.listItem}>
              {instruction}
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}

export default RecipeDetailSections;
