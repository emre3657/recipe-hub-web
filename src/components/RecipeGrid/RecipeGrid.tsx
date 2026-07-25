import type { RecipePreview } from "../../types/recipe";
import RecipeCard from "../RecipeCard/RecipeCard";
import styles from "./RecipeGrid.module.css";

interface RecipeGridProps {
  recipes: RecipePreview[];
}

function RecipeGrid({ recipes }: RecipeGridProps) {
  return (
    <ul className={styles.grid}>
      {recipes.map((recipe) => (
        <li key={recipe.id}>
          <RecipeCard recipe={recipe} />
        </li>
      ))}
    </ul>
  );
}

export default RecipeGrid;
