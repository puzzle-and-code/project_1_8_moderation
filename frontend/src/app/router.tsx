import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "@/layout/AppLayout";
import { InitialRedirect, RequireAuth } from "@/layout/AuthRouteGuard";
import AccountPage from "@/pages/form/FormPage";
import { NotFound } from "@/pages/error/NotFound";
import { LoginRoute, RegisterRoute } from "@/app/AuthRoutes";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <InitialRedirect />,
      },
      {
        path: "login",
        element: <LoginRoute />,
      },
      {
        path: "register",
        element: <RegisterRoute />,
      },
      {
        path: "account",
        element: <Navigate to="/forms" replace />,
      },
      {
        element: <RequireAuth />,
        children: [
          {
            path: "forms",
            element: <AccountPage />,
          },
        ],
      },
    ],
  },
]);
