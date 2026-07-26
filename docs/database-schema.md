# Database schema

- Database name: `recipeHubDB`
- Version: `1` and `2`
- Recipes store indexes: `id`, `category`, `authorId`, `createdAt`
- Ratings store indexes: `id`, `recipeId`, `userId`, `recipeId+userId`
- Users store indexes: `id`, `name`
- `Recipe` is the persisted domain model for recipes, while `RecipePreview` is a calculated UI shape used by the dashboard.
- Ratings are stored separately so each user can rate a recipe once and averages can be computed from the ratings table.
- Users are predefined demo profiles stored locally in IndexedDB and selected through a simple active-user session.
- Guest mode is not stored as a user; it is represented by a null active-user value and persisted as a missing or cleared localStorage key.
- `imageUrl` is the current display field for recipe images, while `imageBlob` is reserved for future image storage support.
- Dexie schemas only declare indexed fields; the full recipe, rating, and user objects are still stored with their complete properties.
