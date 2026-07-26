# Edit recipe view

- The edit route is available at `/recipes/:recipeId/edit`.
- The page only allows edits when the active user is the recipe author.
- The shared `RecipeForm` is reused for add and edit flows.
- Existing image values are preserved, replaced, or removed through the form's image state handling.
- Valid updates write the recipe back to IndexedDB and navigate to the detail page.
