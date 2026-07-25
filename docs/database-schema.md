# Database schema

- Database name: `recipeHubDB`
- Version: `1`
- Recipes store indexes: `id`, `category`, `authorId`, `createdAt`
- Ratings store indexes: `id`, `recipeId`, `userId`, `recipeId+userId`
- `Recipe` is the persisted domain model for recipes, while `RecipePreview` is a calculated UI shape used by the dashboard.
- Ratings are stored separately so each user can rate a recipe once and averages can be computed from the ratings table.
- `imageUrl` is the current display field for recipe images, while `imageBlob` is reserved for future image storage support.
- Dexie schemas only declare indexed fields; the full recipe and rating objects are still stored with their complete properties.
