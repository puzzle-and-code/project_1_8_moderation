import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "@/layout/AppLayout";
import { RequireAuth } from "@/layout/AuthRouteGuard";
import MyArticlesPage from "@/pages/articles/MyArticlesPage";
import { NotFound } from "@/pages/error/NotFound";
import { LoginRoute, RegisterRoute } from "@/app/AuthRoutes";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "login",
        element: <LoginRoute />,
      },
      {
        path: "register",
        element: <RegisterRoute />,
      },
      {
        path: "my-articles",
        element: <Navigate to="/" replace />,
      },
      {
        element: <RequireAuth />,
        children: [
          {
            index: true,
            element: <MyArticlesPage />,
          },
        ],
      },
    ],
  },
]);
