import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "@/layout/AppLayout";
import HomePage from "@/pages/home/HomePage";
import Authorisation from "@/pages/login/AuthorisationPage";
import FormsPage from "@/pages/form/FormPage";
import { NotFound } from "@/pages/error/NotFound";

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
        element: (
          <Authorisation
            onSubmit={(mode, data) => console.log("Данные формы:", mode, data)}
          />
        ),
      },
      {
        path: "forms",
        element: <FormsPage />,
      },
    ],
  },
]);
