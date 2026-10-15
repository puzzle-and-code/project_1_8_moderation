import { autorun } from "mobx";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { authStore } from "@/store/AuthStore";

interface AuthStatus {
  isAuthenticated: boolean;
  isInitializing: boolean;
}

function useAuthStatus(): AuthStatus {
  const [status, setStatus] = useState<AuthStatus>(() => ({
    isAuthenticated: authStore.isAuthenticated,
    isInitializing: authStore.isInitializing,
  }));

  useEffect(
    () =>
      autorun(() => {
        setStatus({
          isAuthenticated: authStore.isAuthenticated,
          isInitializing: authStore.isInitializing,
        });
      }),
    [],
  );

  return status;
}

export function InitialRedirect() {
  const { isAuthenticated, isInitializing } = useAuthStatus();

  if (isInitializing) {
    return <p role="status">Проверяем авторизацию…</p>;
  }

  return <Navigate to={isAuthenticated ? "/forms" : "/login"} replace />;
}

export function RequireAuth() {
  const { isAuthenticated, isInitializing } = useAuthStatus();

  if (isInitializing) {
    return <p role="status">Проверяем авторизацию…</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
