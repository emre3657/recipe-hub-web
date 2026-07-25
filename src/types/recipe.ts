export const RECIPE_CATEGORIES = [
  "Breakfast",
  "Main course",
  "Salad",
  "Dessert",
] as const;

export type RecipeCategory = (typeof RECIPE_CATEGORIES)[number];

export interface Recipe {
  id: string;
  title: string;
  description: string;
  category: RecipeCategory;
  durationMinutes: number;
  ingredients: string[];
  instructions: string[];
  imageUrl?: string;
  imageBlob?: Blob;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RecipePreview {
  id: string;
  title: string;
  category: RecipeCategory;
  durationMinutes: number;
  rating: number | null;
  imageUrl?: string;
  imageBlob?: Blob;
}
