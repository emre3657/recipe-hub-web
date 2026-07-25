import Dexie, { type Table } from "dexie";
import type { Recipe } from "../types/recipe";
import type { Rating } from "../types/rating";
import { seedRecipes, seedRatings } from "./seedData";

export class RecipeHubDatabase extends Dexie {
  recipes!: Table<Recipe, string>;
  ratings!: Table<Rating, string>;

  constructor() {
    super("recipeHubDB");

    this.version(1).stores({
      recipes: "id, category, authorId, createdAt",
      ratings: "id, recipeId, userId, &[recipeId+userId]",
    });

    this.on("populate", async () => {
      await this.recipes.bulkAdd(seedRecipes);
      await this.ratings.bulkAdd(seedRatings);
    });
  }
}

export const db = new RecipeHubDatabase();
