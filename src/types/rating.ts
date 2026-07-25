export interface Rating {
  id: string;
  recipeId: string;
  userId: string;
  value: number;
  createdAt: Date;
  updatedAt: Date;
}
