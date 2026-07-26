# My Recipes view

- The page is available at `/my-recipes`.
- Guests see a clear prompt to select a user before viewing recipes.
- When a user is selected, the page uses `useLiveQuery` to read recipes by `authorId` from Dexie.
- Ratings are loaded once and grouped in memory to calculate each recipe's average rating.
- Recipes are shown newest first based on `createdAt`.
- The page uses the shared `RecipeGrid` and shows an empty state with an Add Recipe action when no recipes exist.
