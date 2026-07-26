import { Link, useParams } from "react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../database/db";
import useObjectUrl from "../../hooks/useObjectUrl";
import type { Recipe } from "../../types/recipe";
import styles from "./RecipeDetailPage.module.css";

interface RecipeDetailData {
  recipe: Recipe;
  authorName: string;
  averageRating: number | null;
}

function RecipeDetailPage() {
  const { recipeId } = useParams<{ recipeId: string }>();

  const detailData = useLiveQuery<RecipeDetailData | null>(async () => {
    if (!recipeId) {
      return null;
    }

    const recipe = await db.recipes.get(recipeId);

    if (!recipe) {
      return null;
    }

    const [ratings, author] = await Promise.all([
      db.ratings.where("recipeId").equals(recipeId).toArray(),
      db.users.get(recipe.authorId),
    ]);

    const averageRating =
      ratings.length === 0
        ? null
        : ratings.reduce((sum, rating) => sum + rating.value, 0) /
          ratings.length;

    return {
      recipe,
      authorName: author?.name ?? "Unknown author",
      averageRating,
    };
  }, [recipeId]);

  const imageSrc = useObjectUrl(detailData?.recipe.imageBlob);

  if (!recipeId) {
    return (
      <section className={styles.statusCard}>
        <h1 className={styles.statusTitle}>Recipe not found</h1>
        <Link className={styles.backLink} to="/">
          Back to recipes
        </Link>
      </section>
    );
  }

  if (detailData === undefined) {
    return (
      <section className={styles.statusCard}>
        <h1 className={styles.statusTitle}>Loading recipe...</h1>
      </section>
    );
  }

  if (!detailData) {
    return (
      <section className={styles.statusCard}>
        <h1 className={styles.statusTitle}>Recipe not found</h1>
        <Link className={styles.backLink} to="/">
          Back to recipes
        </Link>
      </section>
    );
  }

  const { recipe, authorName, averageRating } = detailData;
  const createdAtLabel = new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(recipe.createdAt);
  const ratingLabel =
    averageRating === null ? "Not rated" : `★ ${averageRating.toFixed(1)}`;

  return (
    <article className={styles.page}>
      <Link className={styles.backLink} to="/">
        Back to recipes
      </Link>

      <div className={styles.hero}>
        <div className={styles.imageColumn}>
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
        </div>

        <div className={styles.infoColumn}>
          <div className={styles.metaRow}>
            <span className={styles.categoryBadge}>{recipe.category}</span>
            <span className={styles.duration}>
              {recipe.durationMinutes} min
            </span>
            <span className={styles.rating}>{ratingLabel}</span>
          </div>

          <h1 className={styles.title}>{recipe.title}</h1>
          <p className={styles.description}>{recipe.description}</p>

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
    </article>
  );
}

export default RecipeDetailPage;
