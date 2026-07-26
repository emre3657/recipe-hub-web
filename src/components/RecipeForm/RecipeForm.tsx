import { useRef, useState, type ChangeEvent, type SubmitEvent } from "react";
import { RECIPE_CATEGORIES, type RecipeCategory } from "../../types/recipe";
import useObjectUrl from "../../hooks/useObjectUrl";
import styles from "./RecipeForm.module.css";
import type { RecipeFormValues } from "./recipeFormTypes";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_IMAGE_SIZE_BYTES,
  validateRecipeForm,
  type RecipeFormErrors,
} from "./recipeFormValidation";

interface RecipeFormProps {
  initialValues: RecipeFormValues;
  submitLabel: string;
  submittingLabel: string;
  isSubmitting: boolean;
  submitError?: string;
  onSubmit: (values: RecipeFormValues) => Promise<void>;
  onCancel: () => void;
}

function RecipeForm({
  initialValues,
  submitLabel,
  submittingLabel,
  isSubmitting,
  submitError,
  onSubmit,
  onCancel,
}: RecipeFormProps) {
  const [title, setTitle] = useState(initialValues.title);
  const [description, setDescription] = useState(initialValues.description);
  const [category, setCategory] = useState<RecipeCategory>(
    initialValues.category,
  );
  const [durationMinutes, setDurationMinutes] = useState(
    initialValues.durationMinutes,
  );
  const [ingredients, setIngredients] = useState<string[]>(
    initialValues.ingredients,
  );
  const [instructions, setInstructions] = useState<string[]>(
    initialValues.instructions,
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | undefined>(
    initialValues.imageUrl,
  );
  const [imageBlob, setImageBlob] = useState<Blob | undefined>(
    initialValues.imageBlob,
  );
  const [errors, setErrors] = useState<RecipeFormErrors>({});
  const imageInputRef = useRef<HTMLInputElement>(null);

  const previewObjectUrl = useObjectUrl(imageFile ?? imageBlob);
  const previewSrc = previewObjectUrl ?? imageUrl;

  const clearImageInput = () => {
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const handleImageSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0] ?? null;

    if (!nextFile) {
      setImageFile(null);
      clearImageInput();
      return;
    }

    if (
      !ACCEPTED_IMAGE_TYPES.includes(
        nextFile.type as (typeof ACCEPTED_IMAGE_TYPES)[number],
      )
    ) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        image: "Please choose a JPG, PNG, or WebP image.",
      }));
      clearImageInput();
      return;
    }

    if (nextFile.size > MAX_IMAGE_SIZE_BYTES) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        image: "Image must be 2 MB or smaller.",
      }));
      clearImageInput();
      return;
    }

    setImageFile(nextFile);
    setImageUrl(undefined);
    setImageBlob(undefined);
    setErrors((currentErrors) => ({ ...currentErrors, image: undefined }));
  };

  const removeImage = () => {
    setImageFile(null);
    setImageUrl(undefined);
    setImageBlob(undefined);
    clearImageInput();
    setErrors((currentErrors) => ({ ...currentErrors, image: undefined }));
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

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateRecipeForm({
      title,
      description,
      category,
      durationMinutes,
      ingredients,
      instructions,
      imageFile,
    });

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const cleanedValues: RecipeFormValues = {
      title: title.trim(),
      description: description.trim(),
      category,
      durationMinutes,
      ingredients: ingredients
        .map((ingredient) => ingredient.trim())
        .filter(Boolean),
      instructions: instructions
        .map((instruction) => instruction.trim())
        .filter(Boolean),
      imageBlob: imageFile ?? imageBlob,
      imageUrl: imageFile ? undefined : imageUrl,
    };

    await onSubmit(cleanedValues);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {submitError ? (
        <p className={styles.formError} role="alert">
          {submitError}
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

        {previewSrc ? (
          <div className={styles.previewCard}>
            <img
              className={styles.previewImage}
              src={previewSrc}
              alt={
                imageFile
                  ? `Preview of ${imageFile.name}`
                  : "Current recipe preview"
              }
            />

            <div className={styles.previewMeta}>
              <p className={styles.previewName}>
                {imageFile?.name ?? "Current recipe image"}
              </p>

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
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className={styles.primaryButton}
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? submittingLabel : submitLabel}
        </button>
      </div>
    </form>
  );
}

export default RecipeForm;
