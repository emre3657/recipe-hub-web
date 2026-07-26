# Recipe detail view

- The detail route is available at `/recipes/:recipeId`.
- The page uses `useLiveQuery` to read the matching recipe, the recipe ratings, and the author in a single, direct Dexie flow.
- The author name falls back to `Unknown author` when no user record is available.
- Average rating is calculated from the recipe's ratings and shown as `Not rated` when there are no ratings.
- The page uses the existing `useObjectUrl` hook to show `imageBlob` first, then `imageUrl`, and finally a placeholder when no image exists.
- While the query is loading, the page displays a loading state; when no recipe is found, it shows a not-found state with a back link to the dashboard.
