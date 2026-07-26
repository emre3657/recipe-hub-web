import { createBrowserRouter, RouterProvider } from "react-router";
import AppLayout from "../layouts/AppLayout/AppLayout";
import AddRecipePage from "../pages/AddRecipePage/AddRecipePage";
import DashboardPage from "../pages/DashboardPage/DashboardPage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import RecipeDetailPage from "../pages/RecipeDetailPage/RecipeDetailPage";

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
        path: "/recipes/:recipeId",
        element: <RecipeDetailPage />,
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
