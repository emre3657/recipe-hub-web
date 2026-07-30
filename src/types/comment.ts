export interface Comment {
  id: string;
  recipeId: string;
  userId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
