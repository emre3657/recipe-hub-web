import { useRef, useState, type ChangeEvent, type SubmitEvent } from "react";
import { Link, useNavigate } from "react-router";
import { db } from "../../database/db";
import useObjectUrl from "../../hooks/useObjectUrl";
import useUserSession from "../../hooks/useUserSession";
import {
  RECIPE_CATEGORIES,
  type Recipe,
  type RecipeCategory,
} from "../../types/recipe";
import styles from "./AddRecipePage.module.css";

interface FormErrors {
  title?: string;
  description?: string;
  category?: string;
  durationMinutes?: string;
  ingredients?: string;
  instructions?: string;
  image?: string;
  submit?: string;
}

const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

function AddRecipePage() {
  const navigate = useNavigate();
  const { currentUser } = useUserSession();

  const imageInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<RecipeCategory>(
    RECIPE_CATEGORIES[0],
  );
  const [durationMinutes, setDurationMinutes] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [instructions, setInstructions] = useState<string[]>([""]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const previewUrl = useObjectUrl(selectedImage ?? undefined);
  const previewLabel = selectedImage?.name ?? "No image selected";

  const clearImageInput = () => {
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const handleImageSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0] ?? null;

    if (!nextFile) {
      setSelectedImage(null);
      return;
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(nextFile.type as never)) {
      setSelectedImage(null);
      clearImageInput();

      setErrors((currentErrors) => ({
        ...currentErrors,
        image: "Please choose a JPG, PNG, or WebP image.",
      }));

      return;
    }

    if (nextFile.size > MAX_IMAGE_SIZE_BYTES) {
      setSelectedImage(null);
      clearImageInput();

      setErrors((currentErrors) => ({
        ...currentErrors,
        image: "Image must be 2 MB or smaller.",
      }));

      return;
    }

    setSelectedImage(nextFile);

    setErrors((currentErrors) => ({
      ...currentErrors,
      image: undefined,
    }));
  };

  const removeImage = () => {
    setSelectedImage(null);
    clearImageInput();

    setErrors((currentErrors) => ({
      ...currentErrors,
      image: undefined,
    }));
  };

  const updateIngredient = (index: number, value: string) => {
    setIngredients((currentIngredients) => {
      const nextIngredients = [...currentIngredients];
      nextIngredients[index] = value;
      return nextIngredients;
    });
  };

  const addIngredient = () => {
    setIngredients((currentIngredients) => [...currentIngredients, ""]);
  };

  const removeIngredient = (index: number) => {
    setIngredients((currentIngredients) => {
      if (currentIngredients.length === 1) {
        return [""];
      }

      return currentIngredients.filter(
        (_, ingredientIndex) => ingredientIndex !== index,
      );
    });
  };

  const updateInstruction = (index: number, value: string) => {
    setInstructions((currentInstructions) => {
      const nextInstructions = [...currentInstructions];
      nextInstructions[index] = value;
      return nextInstructions;
    });
  };

  const addInstruction = () => {
    setInstructions((currentInstructions) => [...currentInstructions, ""]);
  };

  const removeInstruction = (index: number) => {
    setInstructions((currentInstructions) => {
      if (currentInstructions.length === 1) {
        return [""];
      }

      return currentInstructions.filter(
        (_, instructionIndex) => instructionIndex !== index,
      );
    });
  };

  const validateForm = (): FormErrors => {
    const nextErrors: FormErrors = {};

    if (title.trim().length < 2) {
      nextErrors.title = "Please enter a title with at least 2 characters.";
    }

    if (description.trim().length < 10) {
      nextErrors.description =
        "Please enter a description with at least 10 characters.";
    }

    const parsedDuration = Number(durationMinutes);

    if (
      !Number.isInteger(parsedDuration) ||
      parsedDuration < 1 ||
      parsedDuration > 1440
    ) {
      nextErrors.durationMinutes =
        "Please enter a duration between 1 and 1440 minutes.";
    }

    const trimmedIngredients = ingredients
      .map((ingredient) => ingredient.trim())
      .filter(Boolean);

    if (trimmedIngredients.length === 0) {
      nextErrors.ingredients = "Please add at least one ingredient.";
    }

    const trimmedInstructions = instructions
      .map((instruction) => instruction.trim())
      .filter(Boolean);

    if (trimmedInstructions.length === 0) {
      nextErrors.instructions = "Please add at least one instruction.";
    }

    if (
      selectedImage &&
      !ACCEPTED_IMAGE_TYPES.includes(selectedImage.type as never)
    ) {
      nextErrors.image = "Please choose a JPG, PNG, or WebP image.";
    }

    if (selectedImage && selectedImage.size > MAX_IMAGE_SIZE_BYTES) {
      nextErrors.image = "Image must be 2 MB or smaller.";
    }

    return nextErrors;
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!currentUser) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        submit: "Select a user to add a recipe.",
      }));

      return;
    }

    const nextErrors = validateForm();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const now = new Date();

      const recipe: Recipe = {
        id: crypto.randomUUID(),
        title: title.trim(),
        description: description.trim(),
        category,
        durationMinutes: Number(durationMinutes),
        ingredients: ingredients
          .map((ingredient) => ingredient.trim())
          .filter(Boolean),
        instructions: instructions
          .map((instruction) => instruction.trim())
          .filter(Boolean),
        imageBlob: selectedImage ?? undefined,
        authorId: currentUser.id,
        createdAt: now,
        updatedAt: now,
      };

      await db.recipes.add(recipe);
      navigate("/");
    } catch (error) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        submit: "Unable to save the recipe right now. Please try again.",
      }));

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
        <p className={styles.eyebrow}>Create recipe</p>

        <h1 id="add-recipe-title" className={styles.title}>
          Add Recipe
        </h1>

        <p className={styles.description}>
          Share a new recipe with the collection.
        </p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {errors.submit ? (
          <p className={styles.formError} role="alert">
            {errors.submit}
          </p>
        ) : null}

        <div className={styles.formGrid}>
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="recipe-title">
              Title
            </label>

            <input
              id="recipe-title"
              className={styles.input}
              type="text"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);

                if (errors.title) {
                  setErrors((currentErrors) => ({
                    ...currentErrors,
                    title: undefined,
                  }));
                }
              }}
            />

            {errors.title ? (
              <p className={styles.fieldError}>{errors.title}</p>
            ) : null}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="recipe-description">
              Description
            </label>

            <textarea
              id="recipe-description"
              className={styles.textarea}
              rows={4}
              value={description}
              onChange={(event) => {
                setDescription(event.target.value);

                if (errors.description) {
                  setErrors((currentErrors) => ({
                    ...currentErrors,
                    description: undefined,
                  }));
                }
              }}
            />

            {errors.description ? (
              <p className={styles.fieldError}>{errors.description}</p>
            ) : null}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="recipe-category">
              Category
            </label>

            <select
              id="recipe-category"
              className={styles.select}
              value={category}
              onChange={(event) => {
                setCategory(event.target.value as RecipeCategory);

                if (errors.category) {
                  setErrors((currentErrors) => ({
                    ...currentErrors,
                    category: undefined,
                  }));
                }
              }}
            >
              {RECIPE_CATEGORIES.map((recipeCategory) => (
                <option key={recipeCategory} value={recipeCategory}>
                  {recipeCategory}
                </option>
              ))}
            </select>

            {errors.category ? (
              <p className={styles.fieldError}>{errors.category}</p>
            ) : null}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="recipe-duration">
              Duration (minutes)
            </label>

            <input
              id="recipe-duration"
              className={styles.input}
              type="number"
              min="1"
              max="1440"
              value={durationMinutes}
              onChange={(event) => {
                setDurationMinutes(event.target.value);

                if (errors.durationMinutes) {
                  setErrors((currentErrors) => ({
                    ...currentErrors,
                    durationMinutes: undefined,
                  }));
                }
              }}
            />

            {errors.durationMinutes ? (
              <p className={styles.fieldError}>{errors.durationMinutes}</p>
            ) : null}
          </div>
        </div>

        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Ingredients</h2>

            <button
              className={styles.secondaryButton}
              type="button"
              onClick={addIngredient}
            >
              Add ingredient
            </button>
          </div>

          <div className={styles.listGroup}>
            {ingredients.map((ingredient, index) => (
              <div className={styles.listItem} key={`ingredient-${index}`}>
                <label
                  className={styles.listLabel}
                  htmlFor={`ingredient-${index}`}
                >
                  Ingredient {index + 1}
                </label>

                <div className={styles.inlineRow}>
                  <input
                    id={`ingredient-${index}`}
                    className={styles.input}
                    type="text"
                    value={ingredient}
                    onChange={(event) =>
                      updateIngredient(index, event.target.value)
                    }
                  />

                  <button
                    className={styles.removeButton}
                    type="button"
                    onClick={() => removeIngredient(index)}
                    disabled={ingredients.length === 1}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {errors.ingredients ? (
            <p className={styles.fieldError}>{errors.ingredients}</p>
          ) : null}
        </div>

        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Instructions</h2>

            <button
              className={styles.secondaryButton}
              type="button"
              onClick={addInstruction}
            >
              Add step
            </button>
          </div>

          <div className={styles.listGroup}>
            {instructions.map((instruction, index) => (
              <div className={styles.listItem} key={`instruction-${index}`}>
                <label
                  className={styles.listLabel}
                  htmlFor={`instruction-${index}`}
                >
                  Step {index + 1}
                </label>

                <div className={styles.inlineRow}>
                  <textarea
                    id={`instruction-${index}`}
                    className={styles.textarea}
                    rows={3}
                    value={instruction}
                    onChange={(event) =>
                      updateInstruction(index, event.target.value)
                    }
                  />

                  <button
                    className={styles.removeButton}
                    type="button"
                    onClick={() => removeInstruction(index)}
                    disabled={instructions.length === 1}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {errors.instructions ? (
            <p className={styles.fieldError}>{errors.instructions}</p>
          ) : null}
        </div>

        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Image</h2>
          </div>

          <label className={styles.label} htmlFor="recipe-image">
            Optional image (JPG, PNG, or WebP, max 2 MB)
          </label>

          <input
            ref={imageInputRef}
            id="recipe-image"
            className={styles.fileInput}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageSelection}
          />

          {errors.image ? (
            <p className={styles.fieldError}>{errors.image}</p>
          ) : null}

          {previewUrl ? (
            <div className={styles.previewCard}>
              <img
                className={styles.previewImage}
                src={previewUrl}
                alt={`Preview of ${previewLabel}`}
              />

              <div className={styles.previewMeta}>
                <p className={styles.previewName}>{previewLabel}</p>

                <button
                  className={styles.removeButton}
                  type="button"
                  onClick={removeImage}
                >
                  Remove image
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <div className={styles.actions}>
          <button
            className={styles.secondaryButton}
            type="button"
            onClick={() => navigate("/")}
          >
            Cancel
          </button>

          <button
            className={styles.primaryButton}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save recipe"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AddRecipePage;
