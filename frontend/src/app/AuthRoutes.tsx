import { useEffect, useState } from "react";
import { autorun } from "mobx";
import { Navigate, useNavigate } from "react-router-dom";
import LoginPage from "@/pages/login/LoginPage";
import RegisterPage from "@/pages/register/RegisterPage";
import { authStore } from "@/store/AuthStore";

function useAuthStatus() {
  const [status, setStatus] = useState({
    isAuthenticated: authStore.isAuthenticated,
    isInitializing: authStore.isInitializing,
  });

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

export function LoginRoute() {
  const navigate = useNavigate();
  const { isAuthenticated, isInitializing } = useAuthStatus();

  if (isInitializing) {
    return <p role="status">Проверяем авторизацию…</p>;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <LoginPage
      onSuccess={() => {
        navigate("/");
      }}
      onSwitchToRegister={() => navigate("/register")}
    />
  );
}

export function RegisterRoute() {
  const navigate = useNavigate();
  const { isAuthenticated, isInitializing } = useAuthStatus();

  if (isInitializing) {
    return <p role="status">Проверяем авторизацию…</p>;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <RegisterPage
      onSuccess={() => {
        navigate("/");
      }}
      onSwitchToLogin={() => navigate("/login")}
    />
  );
}
