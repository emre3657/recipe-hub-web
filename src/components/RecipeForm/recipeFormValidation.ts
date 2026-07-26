import { RECIPE_CATEGORIES, type RecipeCategory } from "../../types/recipe";

export const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export interface RecipeFormErrors {
  title?: string;
  description?: string;
  category?: string;
  durationMinutes?: string;
  ingredients?: string;
  instructions?: string;
  image?: string;
}

export function isValidCategory(value: string): value is RecipeCategory {
  return RECIPE_CATEGORIES.includes(value as RecipeCategory);
}

export function validateRecipeForm(values: {
  title: string;
  description: string;
  category: string;
  durationMinutes: string;
  ingredients: string[];
  instructions: string[];
  imageBlob?: Blob;
  imageUrl?: string;
  imageFile?: File | null;
}): RecipeFormErrors {
  const nextErrors: RecipeFormErrors = {};

  if (values.title.trim().length < 2) {
    nextErrors.title = "Please enter a title with at least 2 characters.";
  }

  if (values.description.trim().length < 10) {
    nextErrors.description =
      "Please enter a description with at least 10 characters.";
  }

  if (!isValidCategory(values.category)) {
    nextErrors.category = "Please choose a valid category.";
  }

  const parsedDuration = Number(values.durationMinutes);

  if (
    !Number.isInteger(parsedDuration) ||
    parsedDuration < 1 ||
    parsedDuration > 1440
  ) {
    nextErrors.durationMinutes =
      "Please enter a duration between 1 and 1440 minutes.";
  }

  const trimmedIngredients = values.ingredients
    .map((ingredient) => ingredient.trim())
    .filter(Boolean);

  if (trimmedIngredients.length === 0) {
    nextErrors.ingredients = "Please add at least one ingredient.";
  }

  const trimmedInstructions = values.instructions
    .map((instruction) => instruction.trim())
    .filter(Boolean);

  if (trimmedInstructions.length === 0) {
    nextErrors.instructions = "Please add at least one instruction.";
  }

  const candidateFile = values.imageFile;

  if (candidateFile) {
    if (
      !ACCEPTED_IMAGE_TYPES.includes(
        candidateFile.type as (typeof ACCEPTED_IMAGE_TYPES)[number],
      )
    ) {
      nextErrors.image = "Please choose a JPG, PNG, or WebP image.";
    } else if (candidateFile.size > MAX_IMAGE_SIZE_BYTES) {
      nextErrors.image = "Image must be 2 MB or smaller.";
    }
  }

  return nextErrors;
}
