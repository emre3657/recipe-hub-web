# User session

- No real authentication exists in this project.
- Guest mode is represented by `null` for the active user.
- Only the selected user ID is persisted in localStorage under `recipeHub.currentUserId`.
- Invalid or missing user IDs fall back to guest mode.
- New demo profile creation is out of scope for this stage.
