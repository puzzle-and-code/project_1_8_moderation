import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "@/app/router";
import { authStore } from "@/store/AuthStore";

export default function App() {
  useEffect(() => {
    void authStore.initialize();
  }, []);

  return <RouterProvider router={router} />;
}
