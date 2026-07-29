import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type SubmitEvent,
} from "react";
import useObjectUrl from "../../hooks/useObjectUrl";
import { RECIPE_CATEGORIES, type RecipeCategory } from "../../types/recipe";
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

type FormErrorKey = keyof RecipeFormErrors;

const FIELD_ERROR_ORDER: FormErrorKey[] = [
  "title",
  "description",
  "category",
  "durationMinutes",
  "ingredients",
  "instructions",
  "image",
];

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
  const [ingredients, setIngredients] = useState<string[]>([
    ...initialValues.ingredients,
  ]);
  const [instructions, setInstructions] = useState<string[]>([
    ...initialValues.instructions,
  ]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | undefined>(
    initialValues.imageUrl,
  );
  const [imageBlob, setImageBlob] = useState<Blob | undefined>(
    initialValues.imageBlob,
  );
  const [errors, setErrors] = useState<RecipeFormErrors>({});

  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const categoryRef = useRef<HTMLSelectElement>(null);
  const durationRef = useRef<HTMLInputElement>(null);
  const firstIngredientRef = useRef<HTMLInputElement>(null);
  const firstInstructionRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const submitErrorRef = useRef<HTMLParagraphElement>(null);

  const previewObjectUrl = useObjectUrl(imageFile ?? imageBlob);
  const previewSrc = previewObjectUrl ?? imageUrl;

  useEffect(() => {
    if (!submitError) {
      return;
    }

    submitErrorRef.current?.focus();
    submitErrorRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [submitError]);

  const clearFieldError = (field: FormErrorKey) => {
    setErrors((currentErrors) => {
      if (!currentErrors[field]) {
        return currentErrors;
      }

      return {
        ...currentErrors,
        [field]: undefined,
      };
    });
  };

  const clearImageInput = () => {
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const focusFirstError = (nextErrors: RecipeFormErrors) => {
    const firstError = FIELD_ERROR_ORDER.find((field) => nextErrors[field]);

    const fieldRefs: Record<
      FormErrorKey,
      React.RefObject<HTMLElement | null>
    > = {
      title: titleRef,
      description: descriptionRef,
      category: categoryRef,
      durationMinutes: durationRef,
      ingredients: firstIngredientRef,
      instructions: firstInstructionRef,
      image: imageInputRef,
    };

    if (!firstError) {
      return;
    }

    const target = fieldRefs[firstError].current;

    target?.focus();
    target?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  const handleImageSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0] ?? null;

    if (!nextFile) {
      return;
    }

    const isAcceptedType = ACCEPTED_IMAGE_TYPES.some(
      (acceptedType) => acceptedType === nextFile.type,
    );

    if (!isAcceptedType) {
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
    clearFieldError("image");
  };

  const removeImage = () => {
    setImageFile(null);
    setImageUrl(undefined);
    setImageBlob(undefined);
    clearImageInput();
    clearFieldError("image");
  };

  const updateIngredient = (index: number, value: string) => {
    setIngredients((currentIngredients) => {
      const nextIngredients = [...currentIngredients];
      nextIngredients[index] = value;
      return nextIngredients;
    });

    if (value.trim()) {
      clearFieldError("ingredients");
    }
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

    if (value.trim()) {
      clearFieldError("instructions");
    }
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
      window.requestAnimationFrame(() => {
        focusFirstError(nextErrors);
      });

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
      <p className={styles.requiredHint}>
        Fields marked with{" "}
        <span className={styles.requiredMarker} aria-hidden="true">
          *
        </span>{" "}
        are required.
      </p>

      <div className={styles.formGrid}>
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="recipe-title">
            Title
            <span className={styles.requiredMarker} aria-hidden="true">
              *
            </span>
          </label>

          <input
            ref={titleRef}
            id="recipe-title"
            className={styles.input}
            type="text"
            required
            value={title}
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? "recipe-title-error" : undefined}
            onChange={(event) => {
              setTitle(event.target.value);
              clearFieldError("title");
            }}
          />

          {errors.title ? (
            <p
              id="recipe-title-error"
              className={styles.fieldError}
              role="alert"
            >
              {errors.title}
            </p>
          ) : null}
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="recipe-description">
            Description
            <span className={styles.requiredMarker} aria-hidden="true">
              *
            </span>
          </label>

          <textarea
            ref={descriptionRef}
            id="recipe-description"
            className={styles.textarea}
            rows={4}
            required
            value={description}
            aria-invalid={Boolean(errors.description)}
            aria-describedby={
              errors.description ? "recipe-description-error" : undefined
            }
            onChange={(event) => {
              setDescription(event.target.value);
              clearFieldError("description");
            }}
          />

          {errors.description ? (
            <p
              id="recipe-description-error"
              className={styles.fieldError}
              role="alert"
            >
              {errors.description}
            </p>
          ) : null}
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="recipe-category">
            Category
            <span className={styles.requiredMarker} aria-hidden="true">
              *
            </span>
          </label>

          <select
            ref={categoryRef}
            id="recipe-category"
            className={styles.select}
            required
            value={category}
            aria-invalid={Boolean(errors.category)}
            aria-describedby={
              errors.category ? "recipe-category-error" : undefined
            }
            onChange={(event) => {
              setCategory(event.target.value as RecipeCategory);
              clearFieldError("category");
            }}
          >
            {RECIPE_CATEGORIES.map((recipeCategory) => (
              <option key={recipeCategory} value={recipeCategory}>
                {recipeCategory}
              </option>
            ))}
          </select>

          {errors.category ? (
            <p
              id="recipe-category-error"
              className={styles.fieldError}
              role="alert"
            >
              {errors.category}
            </p>
          ) : null}
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="recipe-duration">
            Duration (minutes)
            <span className={styles.requiredMarker} aria-hidden="true">
              *
            </span>
          </label>

          <input
            ref={durationRef}
            id="recipe-duration"
            className={styles.input}
            type="number"
            min="1"
            max="1440"
            required
            value={durationMinutes}
            aria-invalid={Boolean(errors.durationMinutes)}
            aria-describedby={
              errors.durationMinutes ? "recipe-duration-error" : undefined
            }
            onChange={(event) => {
              setDurationMinutes(event.target.value);
              clearFieldError("durationMinutes");
            }}
          />

          {errors.durationMinutes ? (
            <p
              id="recipe-duration-error"
              className={styles.fieldError}
              role="alert"
            >
              {errors.durationMinutes}
            </p>
          ) : null}
        </div>
      </div>

      <div className={styles.sectionBlock}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Ingredients
            <span className={styles.requiredMarker} aria-hidden="true">
              *
            </span>
          </h2>

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
                  ref={index === 0 ? firstIngredientRef : undefined}
                  id={`ingredient-${index}`}
                  className={styles.input}
                  type="text"
                  required={index === 0}
                  value={ingredient}
                  aria-invalid={Boolean(errors.ingredients)}
                  aria-describedby={
                    errors.ingredients ? "ingredients-error" : undefined
                  }
                  onChange={(event) =>
                    updateIngredient(index, event.target.value)
                  }
                />

                <button
                  className={styles.removeButton}
                  type="button"
                  onClick={() => removeIngredient(index)}
                  disabled={ingredients.length === 1}
                  aria-label={`Remove ingredient ${index + 1}`}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {errors.ingredients ? (
          <p id="ingredients-error" className={styles.fieldError} role="alert">
            {errors.ingredients}
          </p>
        ) : null}
      </div>

      <div className={styles.sectionBlock}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Instructions
            <span className={styles.requiredMarker} aria-hidden="true">
              *
            </span>
          </h2>

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
                  ref={index === 0 ? firstInstructionRef : undefined}
                  id={`instruction-${index}`}
                  className={styles.textarea}
                  rows={3}
                  required={index === 0}
                  value={instruction}
                  aria-invalid={Boolean(errors.instructions)}
                  aria-describedby={
                    errors.instructions ? "instructions-error" : undefined
                  }
                  onChange={(event) =>
                    updateInstruction(index, event.target.value)
                  }
                />

                <button
                  className={styles.removeButton}
                  type="button"
                  onClick={() => removeInstruction(index)}
                  disabled={instructions.length === 1}
                  aria-label={`Remove instruction ${index + 1}`}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {errors.instructions ? (
          <p id="instructions-error" className={styles.fieldError} role="alert">
            {errors.instructions}
          </p>
        ) : null}
      </div>

      <div className={styles.sectionBlock}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Image</h2>
        </div>

        <label className={styles.label} htmlFor="recipe-image">
          Optional image
        </label>

        <p className={styles.helperText}>
          JPG, PNG or WebP. Maximum file size: 2 MB.
        </p>

        <input
          ref={imageInputRef}
          id="recipe-image"
          className={styles.fileInput}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          aria-invalid={Boolean(errors.image)}
          aria-describedby={errors.image ? "recipe-image-error" : undefined}
          onChange={handleImageSelection}
        />

        {errors.image ? (
          <p id="recipe-image-error" className={styles.fieldError} role="alert">
            {errors.image}
          </p>
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

      {submitError ? (
        <p
          ref={submitErrorRef}
          className={styles.submitError}
          role="alert"
          tabIndex={-1}
        >
          {submitError}
        </p>
      ) : null}

      <div className={styles.actions}>
        <button
          className={styles.secondaryButton}
          type="button"
          disabled={isSubmitting}
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
