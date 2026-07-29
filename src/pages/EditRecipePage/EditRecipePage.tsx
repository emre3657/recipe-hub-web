import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useLiveQuery } from "dexie-react-hooks";
import RecipeForm from "../../components/RecipeForm/RecipeForm";
import type { RecipeFormValues } from "../../components/RecipeForm/recipeFormTypes";
import { db } from "../../database/db";
import useToast from "../../hooks/useToast";
import useUserSession from "../../hooks/useUserSession";
import type { Recipe } from "../../types/recipe";
import styles from "./EditRecipePage.module.css";

function EditRecipePage() {
  const navigate = useNavigate();
  const { recipeId } = useParams<{ recipeId: string }>();
  const { currentUser } = useUserSession();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | undefined>();

  const recipe = useLiveQuery<Recipe | null>(async () => {
    if (!recipeId) {
      return null;
    }

    return (await db.recipes.get(recipeId)) ?? null;
  }, [recipeId]);

  if (!recipeId) {
    return (
      <section className={styles.statusCard}>
        <h1 className={styles.title}>Recipe not found</h1>
        <Link className={styles.link} to="/">
          Back to recipes
        </Link>
      </section>
    );
  }

  if (recipe === undefined) {
    return (
      <section className={styles.statusCard}>
        <h1 className={styles.title}>Loading recipe...</h1>
      </section>
    );
  }

  if (recipe === null) {
    return (
      <section className={styles.statusCard}>
        <h1 className={styles.title}>Recipe not found</h1>
        <Link className={styles.link} to="/">
          Back to recipes
        </Link>
      </section>
    );
  }

  if (!currentUser) {
    return (
      <section className={styles.statusCard}>
        <h1 className={styles.title}>Edit Recipe</h1>
        <p className={styles.description}>Select a user to edit this recipe.</p>
        <Link className={styles.link} to={`/recipes/${recipe.id}`}>
          Back to recipe
        </Link>
      </section>
    );
  }

  if (recipe.authorId !== currentUser.id) {
    return (
      <section className={styles.statusCard}>
        <h1 className={styles.title}>Edit Recipe</h1>
        <p className={styles.description}>
          You can only edit your own recipes.
        </p>
        <Link className={styles.link} to={`/recipes/${recipe.id}`}>
          Back to recipe
        </Link>
      </section>
    );
  }

  const initialValues: RecipeFormValues = {
    title: recipe.title,
    description: recipe.description,
    category: recipe.category,
    durationMinutes: String(recipe.durationMinutes),
    ingredients: [...recipe.ingredients],
    instructions: [...recipe.instructions],
    imageBlob: recipe.imageBlob,
    imageUrl: recipe.imageUrl,
  };

  const handleSubmit = async (values: RecipeFormValues) => {
    setIsSubmitting(true);
    setSubmitError(undefined);

    try {
      const updatedCount = await db.recipes.update(recipe.id, {
        title: values.title,
        description: values.description,
        category: values.category,
        durationMinutes: Number(values.durationMinutes),
        ingredients: values.ingredients,
        instructions: values.instructions,
        imageBlob: values.imageBlob,
        imageUrl: values.imageUrl,
        updatedAt: new Date(),
      });

      if (updatedCount === 0) {
        setSubmitError("Unable to update this recipe right now.");
        return;
      }

      showToast({
        message: "Recipe updated successfully.",
        variant: "success",
      });
      navigate(`/recipes/${recipe.id}`);
    } catch (error) {
      setSubmitError(
        "Unable to update this recipe right now. Please try again.",
      );
      console.error("Failed to update recipe", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={styles.page} aria-labelledby="edit-recipe-title">
      <div className={styles.headerBlock}>
        <Link className={styles.backLink} to={`/recipes/${recipe.id}`}>
          Back to recipe
        </Link>
        <h1 id="edit-recipe-title" className={styles.title}>
          Edit Recipe
        </h1>
        <p className={styles.description}>Update your recipe details.</p>
      </div>

      <RecipeForm
        key={recipe.id}
        initialValues={initialValues}
        submitLabel="Update recipe"
        submittingLabel="Updating..."
        isSubmitting={isSubmitting}
        submitError={submitError}
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/recipes/${recipe.id}`)}
      />
    </section>
  );
}

export default EditRecipePage;
