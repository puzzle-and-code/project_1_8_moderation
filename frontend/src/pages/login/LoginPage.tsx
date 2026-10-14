import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Link,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { AuthStatusModal } from "@/components/AuthStatusModal";
import { PasswordInput } from "@/components/PasswordInput";
import { loginUser } from "@/api/auth";
import { authStore } from "@/store/AuthStore";

interface LoginPageProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
}

interface LoginFormState {
  emailOrLogin: string;
  password: string;
}

interface AuthStatus {
  open: boolean;
  title: string;
  message: string;
}

type LoginFormErrors = Partial<Record<keyof LoginFormState, string>>;

export default function LoginPage({
  onSuccess,
  onSwitchToRegister,
}: LoginPageProps) {
  const [values, setValues] = useState<LoginFormState>({
    emailOrLogin: "",
    password: "",
  });
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [statusModal, setStatusModal] = useState<AuthStatus>({
    open: false,
    title: "",
    message: "",
  });

  const handleChange = (
    field: keyof LoginFormState,
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setValues((prev) => ({ ...prev, [field]: event.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setSubmitError("");
  };

  const validate = (): LoginFormErrors => {
    const nextErrors: LoginFormErrors = {};
    if (!values.emailOrLogin.trim()) {
      nextErrors.emailOrLogin = "Введите электронную почту или логин.";
    }
    if (!values.password) {
      nextErrors.password = "Введите пароль.";
    } else if (values.password.length < 8) {
      nextErrors.password = "Пароль должен содержать не менее 8 символов.";
    }
    return nextErrors;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    setSubmitError("");

    if (Object.keys(nextErrors).length > 0) {
      setStatusModal({
        open: true,
        title: "Ошибка входа",
        message: "Проверьте введённые данные и попробуйте снова.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const auth = await loginUser({
        emailOrLogin: values.emailOrLogin.trim(),
        password: values.password,
      });
      authStore.setAuth(auth);

      setStatusModal({
        open: true,
        title: "Успешный вход",
        message: "Вход выполнен. Добро пожаловать!",
      });
      onSuccess?.();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Произошла ошибка при соединении с сервером.";
      setSubmitError(errorMessage);
      setStatusModal({
        open: true,
        title: "Ошибка входа",
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, sm: 4 },
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: 3,
          }}
        >
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography
              variant="h4"
              component="h1"
              color="primary"
              sx={{ fontWeight: "bold" }}
            >
              ReviewFlow
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Вход в аккаунт
            </Typography>
          </Box>

          <Box
            role="tablist"
            aria-label="Авторизация"
            sx={{ display: "flex", width: "100%", mb: 3 }}
          >
            <Button
              fullWidth
              variant="text"
              onClick={onSwitchToRegister}
              role="tab"
            >
              Регистрация
            </Button>
            <Button
              fullWidth
              variant="contained"
              aria-selected="true"
              role="tab"
            >
              Вход
            </Button>
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ width: "100%", display: "grid", gap: 2 }}
          >
            <TextField
              id="login-identity"
              label="Электронная почта или логин"
              placeholder="example@gmail.com"
              name="emailOrLogin"
              autoComplete="username"
              value={values.emailOrLogin}
              onChange={(event) => handleChange("emailOrLogin", event)}
              error={Boolean(errors.emailOrLogin)}
              helperText={errors.emailOrLogin}
              fullWidth
              required
            />

            <PasswordInput
              id="login-password"
              label="Пароль"
              placeholder="Введите пароль"
              value={values.password}
              onChange={(event) => handleChange("password", event)}
              error={errors.password}
              autoComplete="current-password"
            />

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label="Запомнить меня"
              />
              <Link href="#forgot-password" underline="hover">
                Забыли пароль?
              </Link>
            </Box>

            {submitError && <Alert severity="error">{submitError}</Alert>}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isSubmitting}
              sx={{ mt: 1 }}
            >
              {isSubmitting ? "Отправка…" : "Войти в аккаунт"}
            </Button>
          </Box>
        </Paper>

        <Box component="footer" sx={{ mt: 3, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            © 2026 ReviewFlow · Все права защищены
          </Typography>
        </Box>
      </Container>

      <AuthStatusModal
        open={statusModal.open}
        title={statusModal.title}
        message={statusModal.message}
        onClose={() => setStatusModal((curr) => ({ ...curr, open: false }))}
      />
    </>
  );
}
