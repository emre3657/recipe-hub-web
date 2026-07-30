# Recipe Hub

Recipe Hub is a frontend-only recipe management application built with React, TypeScript, Vite, Dexie, and IndexedDB.

The project was created as a learning-focused application to practice component architecture, browser storage, accessibility, responsive design, and CRUD operations without using a backend.

## Features

- Browse and search recipes
- Filter recipes by category
- View recipe details
- Add new recipes
- Edit and delete owned recipes
- Store recipe images as Blob data in IndexedDB
- Rate recipes
- Add and remove favorite recipes
- View a user-specific favorites page
- Add, edit, and delete comments
- View recipes created by the selected user
- Switch between predefined demo users and Guest mode
- Live UI updates with Dexie and `useLiveQuery`
- Toast notifications
- Accessible confirmation dialogs
- Focus trapping and keyboard navigation
- Responsive desktop and mobile layouts
- Sticky desktop navigation
- Mobile navigation drawer
- Dynamic page titles
- Custom application logo and favicon

## Tech Stack

- React
- TypeScript
- Vite
- React Router
- Dexie
- Dexie React Hooks
- IndexedDB
- CSS Modules
- Native CSS custom properties

## Data Storage

The application does not use a backend or remote database.

All application data is stored locally in the browser using IndexedDB through Dexie.

The selected demo user is stored in localStorage.

Clearing browser storage will remove locally created recipes, ratings, favorites, and comments.

## User Modes

### Guest

Guests can:

- Browse recipes
- Search and filter recipes
- View recipe details
- View ratings and comments

Guests cannot create, edit, rate, favorite, or comment on recipes.

### Demo User

A selected demo user can:

- Add recipes
- Edit and delete their own recipes
- Rate recipes
- Add recipes to favorites
- Add comments
- Edit and delete their own comments
- View their own recipes and favorites

## Main Pages

- `/` — Recipe dashboard
- `/recipes/new` — Add recipe
- `/recipes/:recipeId` — Recipe details
- `/recipes/:recipeId/edit` — Edit recipe
- `/my-recipes` — Recipes owned by the selected user
- `/favorites` — Favorite recipes
- `*` — Not found page

## Project Structure

```text
src/
├── components/
├── database/
├── hooks/
├── layouts/
├── pages/
├── router/
├── styles/
├── types/
├── main.tsx
└── index.css

public/
└── favicon.svg
```

## Database Stores

The IndexedDB database contains the following stores:

- `recipes`
- `ratings`
- `users`
- `favorites`
- `comments`

Composite unique indexes are used to prevent a user from rating or favoriting the same recipe more than once.

Related ratings, favorites, and comments are deleted in the same transaction when a recipe is deleted.

## Getting Started

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

### Build the project

```bash
npm run build
```

### Run ESLint

```bash
npm run lint
```

### Preview the production build

```bash
npm run preview
```

## Accessibility

The application includes:

- Semantic HTML
- Visible focus styles
- Keyboard-accessible controls
- Accessible form validation
- `aria-invalid` and `aria-describedby`
- Live status and toast messages
- Accessible confirmation dialogs
- Focus trapping
- Escape-key support
- Focus restoration
- Reduced-motion support

## Responsive Design

The interface supports desktop, tablet, and mobile layouts.

Desktop navigation uses a sticky header and sidebar. On smaller screens, navigation is displayed inside an accessible drawer with a backdrop, focus trap, Escape-key handling, and body scroll locking.

## Notes

This is a local demonstration project. It does not provide real authentication, cloud synchronization, or multi-device data persistence.

## Author

Built with React, TypeScript, and IndexedDB.
