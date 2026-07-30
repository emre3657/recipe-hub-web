import type { Recipe } from "../../types/recipe";

export interface RecipeCommentItem {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RecipeDetailData {
  recipe: Recipe;
  authorName: string;
  averageRating: number | null;
  currentUserRating: number | null;
  currentUserFavoriteId: string | null;
  comments: RecipeCommentItem[];
}
