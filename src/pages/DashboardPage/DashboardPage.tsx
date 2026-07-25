import RecipeGrid from "../../components/RecipeGrid/RecipeGrid";
import type { RecipePreview } from "../../types/recipe";
import styles from "./DashboardPage.module.css";

const sampleRecipes: RecipePreview[] = [
  {
    id: "creamy-carbonara",
    title: "Creamy Carbonara",
    category: "Main course",
    durationMinutes: 30,
    rating: 4.8,
    imageUrl:
      "https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "chicken-curry",
    title: "Chicken Curry",
    category: "Main course",
    durationMinutes: 45,
    rating: 4.6,
    imageUrl:
      "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "greek-salad",
    title: "Greek Salad",
    category: "Salad",
    durationMinutes: 15,
    rating: 4.4,
    imageUrl:
      "https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "chocolate-brownies",
    title: "Chocolate Brownies",
    category: "Dessert",
    durationMinutes: 40,
    rating: 4.9,
    imageUrl:
      "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&w=900&q=80",
  },
];

function DashboardPage() {
  return (
    <section className={styles.page} aria-labelledby="dashboard-title">
      <div className={styles.headerRow}>
        <div className={styles.headerContent}>
          <p className={styles.eyebrow}>Recipe collection</p>
          <h1 id="dashboard-title" className={styles.title}>
            Recipes
          </h1>
          <p className={styles.description}>
            Discover, save and manage your favorite recipes.
          </p>
        </div>

        <button className={styles.primaryButton} type="button">
          Add Recipe
        </button>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchField}>
          <label className={styles.label} htmlFor="recipe-search">
            Search recipes
          </label>
          <input
            id="recipe-search"
            className={styles.input}
            type="search"
            placeholder="Search recipes by title or ingredient"
          />
        </div>

        <div className={styles.filterField}>
          <label className={styles.label} htmlFor="category-filter">
            Category
          </label>
          <select
            id="category-filter"
            className={styles.select}
            defaultValue=""
          >
            <option value="">All categories</option>
            <option value="breakfast">Breakfast</option>
            <option value="main-course">Main course</option>
            <option value="salad">Salad</option>
            <option value="dessert">Dessert</option>
          </select>
        </div>
      </div>

      <RecipeGrid recipes={sampleRecipes} />
    </section>
  );
}

export default DashboardPage;
