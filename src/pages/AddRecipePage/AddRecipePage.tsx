import { useState } from "react";
import { Link, useNavigate } from "react-router";
import RecipeForm from "../../components/RecipeForm/RecipeForm";
import type { RecipeFormValues } from "../../components/RecipeForm/recipeFormTypes";
import { db } from "../../database/db";
import useToast from "../../hooks/useToast";
import useUserSession from "../../hooks/useUserSession";
import { RECIPE_CATEGORIES, type Recipe } from "../../types/recipe";
import styles from "./AddRecipePage.module.css";
import useDocumentTitle from "../../hooks/useDocumentTitle";

function AddRecipePage() {
  useDocumentTitle("Add Recipe");

  const navigate = useNavigate();
  const { currentUser } = useUserSession();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | undefined>();

  const initialValues: RecipeFormValues = {
    title: "",
    description: "",
    category: RECIPE_CATEGORIES[0],
    durationMinutes: "",
    ingredients: [""],
    instructions: [""],
    imageBlob: undefined,
    imageUrl: undefined,
  };

  const handleSubmit = async (values: RecipeFormValues) => {
    if (!currentUser) {
      setSubmitError("Select a user to add a recipe.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(undefined);

    try {
      const now = new Date();

      const recipe: Recipe = {
        id: crypto.randomUUID(),
        title: values.title,
        description: values.description,
        category: values.category,
        durationMinutes: Number(values.durationMinutes),
        ingredients: values.ingredients,
        instructions: values.instructions,
        imageBlob: values.imageBlob,
        imageUrl: values.imageUrl,
        authorId: currentUser.id,
        createdAt: now,
        updatedAt: now,
      };

      await db.recipes.add(recipe);
      showToast({
        message: "Recipe added successfully.",
        variant: "success",
      });
      navigate("/");
    } catch (error) {
      setSubmitError("Unable to save the recipe right now. Please try again.");
      console.error("Failed to save recipe", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentUser) {
    return (
      <section className={styles.accessMessage}>
        <h1 className={styles.title}>Add Recipe</h1>
        <p>Select a user to add a recipe.</p>

        <Link className={styles.link} to="/">
          Back to dashboard
        </Link>
      </section>
    );
  }

  return (
    <section className={styles.page} aria-labelledby="add-recipe-title">
      <div className={styles.headerBlock}>
        <Link className={styles.backLink} to={`/`}>
          Back to recipes
        </Link>
        <h1 id="add-recipe-title" className={styles.title}>
          Create Recipe
        </h1>

        <p className={styles.description}>
          Share a new recipe with the collection.
        </p>
      </div>

      <RecipeForm
        initialValues={initialValues}
        submitLabel="Save recipe"
        submittingLabel="Saving..."
        isSubmitting={isSubmitting}
        submitError={submitError}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/")}
      />
    </section>
  );
}

export default AddRecipePage;
