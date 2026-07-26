import type { RecipeCategory } from "../../types/recipe";

export interface RecipeFormValues {
  title: string;
  description: string;
  category: RecipeCategory;
  durationMinutes: string;
  ingredients: string[];
  instructions: string[];
  imageBlob?: Blob;
  imageUrl?: string;
}
