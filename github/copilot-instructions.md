# Recipe Hub — GitHub Copilot Instructions

## Project Overview

Recipe Hub is a frontend-only recipe application built for practicing modern React development.

The project does not have a backend, API, remote database, or real authentication system.

All persistent application data will be stored locally in the browser.

## Main Goals

The project is primarily intended to practice:

- React component architecture
- TypeScript
- Client-side routing
- CRUD operations
- Browser storage with IndexedDB
- Responsive layouts
- Native CSS Modules
- Form handling
- User-based UI permissions
- Reusable component design

## Technology Stack

Use only the following core technologies unless a new dependency is explicitly approved:

- React
- TypeScript
- Vite
- React Router
- Dexie
- dexie-react-hooks
- Native CSS
- CSS Modules
- IndexedDB
- localStorage for small UI or session preferences

## Prohibited Technologies

Do not add or use the following unless explicitly requested:

- Sass or SCSS
- Tailwind CSS
- Bootstrap
- Material UI
- styled-components
- Redux
- Redux Toolkit
- Zustand
- TanStack Query
- Axios
- React Hook Form
- Zod
- Lodash
- Any UI component library
- Any backend or authentication service

Do not install new dependencies without first explaining why they are necessary.

## Application Scope

The first version will include:

- Public recipe listing
- Recipe detail view
- Recipe creation
- Recipe editing
- Recipe deletion
- Search
- Category filtering
- Demo user selection
- Guest mode
- My Recipes
- Favorites
- Comments
- Ratings

Features may be implemented gradually. Do not build all features at once.

## Authentication Model

There is no real authentication.

The application will use predefined demo users.

Users can switch between:

- Guest
- Predefined demo users

Do not implement:

- Registration
- Passwords
- Email authentication
- Tokens
- Sessions from a backend
- OAuth
- External authentication providers
- New demo profile creation

The selected demo user may be stored in localStorage as a small session preference.

## User Permissions

Guest users can:

- View recipes
- View recipe details
- Search recipes
- Filter recipes
- Read comments
- View ratings

Selected demo users can additionally:

- Create recipes
- Edit their own recipes
- Delete their own recipes
- Add comments
- Rate recipes
- Add recipes to favorites

A user may edit or delete a recipe only when:

```ts
recipe.authorId === currentUser.id;
```

This is only a frontend permission rule. It is not secure authorization.

## Data Storage

Use IndexedDB through Dexie for application data.

Possible data groups include:

- users
- recipes
- comments
- ratings
- favorites

Do not finalize the database schema until the relevant feature is discussed.

Do not invent object stores, indexes, relations, cascade behavior, or schema versions without explicit project decisions.

Use localStorage only for small preferences such as:

- selected user ID
- theme
- sidebar state

Do not store the main application data in localStorage.

## Images

Recipe images will be stored locally in IndexedDB.

Do not implement image storage until the recipe form feature is started.

Do not use Base64 unless explicitly requested.

The following decisions are intentionally postponed:

- Blob or File storage structure
- Image object store design
- Maximum file size
- Allowed image formats
- Image compression
- Image resizing
- Thumbnail generation

## Styling Rules

Use native CSS Modules.

Component style files should use the following convention:

```text
ComponentName.tsx
ComponentName.module.css
```

Use modern native CSS features where appropriate:

- CSS nesting
- CSS custom properties
- CSS Grid
- Flexbox
- `clamp()`
- `calc()`
- media queries
- container queries when justified

Do not use inline styles for regular component styling.

Inline styles are acceptable only for truly dynamic values that cannot be represented cleanly with CSS classes or custom properties.

## Responsive Design

Every page and reusable component must support:

- Desktop
- Tablet
- Mobile

Do not assume fixed screen widths.

The main desktop layout is expected to contain:

- Header
- Sidebar
- Main content
- Footer

On smaller screens, the sidebar should not permanently occupy horizontal space.

Exact responsive behavior will be defined during page design.

## React Rules

Use function components only.

Use hooks according to React rules.

Avoid unnecessary:

- `useEffect`
- `useMemo`
- `useCallback`
- Context providers
- Global state
- Prop drilling across many levels
- Premature abstractions

Do not use `useEffect` for values that can be calculated during render.

Do not use `useMemo` or `useCallback` without a clear reason.

Keep state as local as reasonably possible.

Lift state only when multiple components genuinely need the same source of truth.

## TypeScript Rules

Do not use `any`.

Prefer explicit domain types and interfaces.

Use `unknown` when external or uncertain data must be validated.

Keep domain models separate from component props where appropriate.

Use descriptive names.

Prefer:

```ts
interface RecipeCardProps {
  recipe: Recipe;
}
```

Avoid vague types and names such as:

```ts
data;
item;
obj;
value;
thing;
```

unless their meaning is obvious from a very small local scope.

Do not use type assertions to hide type errors.

## Component Design

Components should have a clear and limited responsibility.

Prefer composition over large components with many unrelated responsibilities.

Do not split trivial markup into excessive micro-components.

Create reusable components only when:

- The UI pattern appears more than once
- The component has meaningful behavior
- The component improves readability
- The component has a clear domain responsibility

## Suggested Project Structure

Do not create every directory in advance.

Create folders only when the project actually needs them.

The project may gradually evolve toward:

```text
src/
  app/
  components/
  database/
  features/
  hooks/
  layouts/
  pages/
  styles/
  types/
  utils/
```

Feature-specific code should stay close together when practical.

Do not create empty placeholder files or folders.

## Routing

Use React Router for client-side routing.

Expected routes may include:

```text
/
/recipes/:recipeId
/recipes/new
/recipes/:recipeId/edit
/my-recipes
/favorites
```

Do not implement every route before its page is designed.

Do not add login or registration routes.

## Code Quality

Before considering a task complete:

- TypeScript must compile
- ESLint must pass
- The production build must succeed
- No unrelated files should be changed
- No unnecessary dependency should be added
- No placeholder code should remain unless clearly marked

Use the existing scripts:

```bash
npm run lint
npm run build
```

## Working Style

Implement only the requested page, feature, component, or step.

Do not generate the entire application at once.

Do not make major architecture decisions without explicit approval.

Do not silently change previously agreed project decisions.

Before introducing a new abstraction, explain the concrete problem it solves.

When requirements are incomplete:

- Preserve the current architecture
- Use the smallest reasonable implementation
- Mark undecided behavior clearly
- Do not invent business rules

## Documentation

Project decisions may be documented separately under `docs/`.

Possible future documents:

```text
docs/
  database-schema.md
  design-system.md
  features/
    recipe-images.md
  pages/
    dashboard.md
```

The Copilot instructions file contains stable project-wide rules.

Page-specific and feature-specific implementation details should be documented only after those decisions are made.
