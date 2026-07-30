import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useLiveQuery } from "dexie-react-hooks";
import RatingControl from "../../components/RatingControl/RatingControl";
import ConfirmDialog from "../../components/ConfirmaDialog/ConfirmDialog";
import { db } from "../../database/db";
import useObjectUrl from "../../hooks/useObjectUrl";
import useToast from "../../hooks/useToast";
import useUserSession from "../../hooks/useUserSession";
import type { Recipe } from "../../types/recipe";
import styles from "./RecipeDetailPage.module.css";

interface RecipeDetailData {
  recipe: Recipe;
  authorName: string;
  averageRating: number | null;
  currentUserRating: number | null;
  currentUserFavoriteId: string | null;
}

function RecipeDetailPage() {
  const { recipeId } = useParams<{ recipeId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useUserSession();
  const { showToast } = useToast();
  const [isSavingRating, setIsSavingRating] = useState(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  const detailData = useLiveQuery<RecipeDetailData | null>(async () => {
    if (!recipeId) {
      return null;
    }

    const recipe = await db.recipes.get(recipeId);

    if (!recipe) {
      return null;
    }

    const [ratings, author, currentUserFavorite] = await Promise.all([
      db.ratings.where("recipeId").equals(recipeId).toArray(),
      db.users.get(recipe.authorId),
      currentUser
        ? db.favorites
            .where("[recipeId+userId]")
            .equals([recipeId, currentUser.id])
            .first()
        : Promise.resolve(undefined),
    ]);

    const averageRating =
      ratings.length === 0
        ? null
        : ratings.reduce((sum, rating) => sum + rating.value, 0) /
          ratings.length;

    const currentUserRating = currentUser
      ? (ratings.find((rating) => rating.userId === currentUser.id)?.value ??
        null)
      : null;

    return {
      recipe,
      authorName: author?.name ?? "Unknown author",
      averageRating,
      currentUserRating,
      currentUserFavoriteId: currentUserFavorite?.id ?? null,
    };
  }, [recipeId, currentUser?.id]);

  const imageSrc = useObjectUrl(detailData?.recipe.imageBlob);

  const openDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    if (isDeleting) {
      return;
    }

    setIsDeleteDialogOpen(false);
  };

  const handleDeleteRecipe = async () => {
    if (!detailData || !currentUser) {
      return;
    }

    const { recipe } = detailData;

    if (recipe.authorId !== currentUser.id) {
      showToast({
        message: "You can only delete your own recipes.",
        variant: "error",
      });

      setIsDeleteDialogOpen(false);
      return;
    }

    setIsDeleting(true);

    try {
      await db.transaction(
        "rw",
        db.recipes,
        db.ratings,
        db.favorites,
        async () => {
          const storedRecipe = await db.recipes.get(recipe.id);

          if (!storedRecipe) {
            throw new Error("Recipe no longer exists.");
          }

          if (storedRecipe.authorId !== currentUser.id) {
            throw new Error(
              "You do not have permission to delete this recipe.",
            );
          }

          await db.ratings.where("recipeId").equals(recipe.id).delete();
          await db.favorites.where("recipeId").equals(recipe.id).delete();
          await db.recipes.delete(recipe.id);
        },
      );

      showToast({
        message: "Recipe deleted successfully.",
        variant: "success",
      });

      navigate("/");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "The recipe could not be deleted.";

      showToast({
        message,
        variant: "error",
      });

      setIsDeleting(false);
    }
  };

  const handleRatingChange = async (value: number) => {
    if (!recipeId || !currentUser || isSavingRating) {
      return;
    }

    setIsSavingRating(true);

    try {
      const existingRating = await db.ratings
        .where("[recipeId+userId]")
        .equals([recipeId, currentUser.id])
        .first();

      const now = new Date();

      if (existingRating) {
        await db.ratings.update(existingRating.id, {
          value,
          updatedAt: now,
        });
      } else {
        const id =
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

        await db.ratings.add({
          id,
          recipeId,
          userId: currentUser.id,
          value,
          createdAt: now,
          updatedAt: now,
        });
      }

      showToast({
        message: existingRating
          ? "Rating updated successfully."
          : "Rating added successfully.",
        variant: "success",
      });
    } catch {
      showToast({
        message: "The rating could not be saved.",
        variant: "error",
      });
    } finally {
      setIsSavingRating(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!recipeId || !currentUser || !detailData || isTogglingFavorite) {
      return;
    }

    setIsTogglingFavorite(true);

    try {
      const existingFavorite = await db.favorites
        .where("[recipeId+userId]")
        .equals([recipeId, currentUser.id])
        .first();

      if (existingFavorite) {
        await db.favorites.delete(existingFavorite.id);

        showToast({
          message: "Recipe removed from favorites.",
          variant: "success",
        });
      } else {
        const id =
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

        await db.favorites.add({
          id,
          recipeId,
          userId: currentUser.id,
          createdAt: new Date(),
        });

        showToast({
          message: "Recipe added to favorites.",
          variant: "success",
        });
      }
    } catch {
      showToast({
        message: "The favorite could not be updated.",
        variant: "error",
      });
    } finally {
      setIsTogglingFavorite(false);
    }
  };

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

  const {
    recipe,
    authorName,
    averageRating,
    currentUserRating,
    currentUserFavoriteId,
  } = detailData;

  const isOwner = currentUser?.id === recipe.authorId;
  const isFavorite = currentUserFavoriteId !== null;

  const createdAtLabel = new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(recipe.createdAt);

  const ratingLabel =
    averageRating === null ? "Not rated" : `★ ${averageRating.toFixed(1)}`;

  return (
    <>
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
                  onClick={handleToggleFavorite}
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
                      onClick={openDeleteDialog}
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
              onChange={handleRatingChange}
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
      </article>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Delete recipe?"
        description={`Are you sure you want to delete “${recipe.title}”? This action cannot be undone.`}
        confirmLabel="Delete recipe"
        cancelLabel="Cancel"
        isConfirming={isDeleting}
        onConfirm={handleDeleteRecipe}
        onClose={closeDeleteDialog}
      />
    </>
  );
}

export default RecipeDetailPage;
