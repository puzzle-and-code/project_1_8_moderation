import { useNavigate } from "react-router-dom";
import LoginPage from "@/pages/login/LoginPage";
import RegisterPage from "@/pages/register/RegisterPage";

export function LoginRoute() {
  const navigate = useNavigate();
  return (
    <LoginPage
      onSuccess={() => {
        navigate("/forms");
      }}
      onSwitchToRegister={() => navigate("/register")}
    />
  );
}

export function RegisterRoute() {
  const navigate = useNavigate();
  return (
    <RegisterPage
      onSuccess={() => {
        navigate("/forms");
      }}
      onSwitchToLogin={() => navigate("/login")}
    />
  );
}
