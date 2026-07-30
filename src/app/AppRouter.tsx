import { createBrowserRouter, RouterProvider } from "react-router";
import AppLayout from "../layouts/AppLayout/AppLayout";
import DashboardPage from "../pages/DashboardPage/DashboardPage";
import AddRecipePage from "../pages/AddRecipePage/AddRecipePage";
import RecipeDetailPage from "../pages/RecipeDetailPage/RecipeDetailPage";
import EditRecipePage from "../pages/EditRecipePage/EditRecipePage";
import MyRecipesPage from "../pages/MyRecipesPage/MyRecipesPage";
import FavoritesPage from "../pages/FavoritesPage/FavoritesPage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <DashboardPage />,
      },
      {
        path: "/recipes/new",
        element: <AddRecipePage />,
      },
      {
        path: "/recipes/:recipeId/edit",
        element: <EditRecipePage />,
      },
      {
        path: "/recipes/:recipeId",
        element: <RecipeDetailPage />,
      },
      {
        path: "/my-recipes",
        element: <MyRecipesPage />,
      },
      {
        path: "/favorites",
        element: <FavoritesPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;
