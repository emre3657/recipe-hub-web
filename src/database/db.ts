import Dexie, { type Table } from "dexie";
import type { Recipe } from "../types/recipe";
import type { Rating } from "../types/rating";
import type { User } from "../types/user";
import { seedRecipes, seedRatings, seedUsers } from "./seedData";

export class RecipeHubDatabase extends Dexie {
  recipes!: Table<Recipe, string>;
  ratings!: Table<Rating, string>;
  users!: Table<User, string>;

  constructor() {
    super("recipeHubDB");

    this.version(1).stores({
      recipes: "id, category, authorId, createdAt",
      ratings: "id, recipeId, userId, &[recipeId+userId]",
    });

    this.version(2)
      .stores({
        users: "id, name",
      })
      .upgrade(async (transaction) => {
        await transaction.table<User, string>("users").bulkAdd(seedUsers);
      });

    this.on("populate", async () => {
      await this.users.bulkAdd(seedUsers);
      await this.recipes.bulkAdd(seedRecipes);
      await this.ratings.bulkAdd(seedRatings);
    });
  }
}

export const db = new RecipeHubDatabase();
