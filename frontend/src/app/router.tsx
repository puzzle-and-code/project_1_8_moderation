import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "@/layout/AppLayout";
import HomePage from "@/pages/home/HomePage";
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
        element: <HomePage />,
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
        element: <AccountPage />,
      },
    ],
  },
]);
