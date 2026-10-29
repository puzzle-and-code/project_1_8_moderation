import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Link,
  Paper,
  TextField,
  Typography,
  Alert,
  FormHelperText,
} from "@mui/material";
import { AuthStatusModal } from "@/components/AuthStatusModal";
import { PasswordInput } from "@/components/PasswordInput";
import { registerUser } from "@/api/auth";
import { authStore } from "@/store/AuthStore";

interface RegisterPageProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

interface RegisterFormState {
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
  privacyAccepted: boolean;
}

interface AuthStatus {
  open: boolean;
  title: string;
  message: string;
}

type RegisterFormErrors = Partial<Record<keyof RegisterFormState, string>>;
type RegisterTextField = Exclude<keyof RegisterFormState, "privacyAccepted">;

export default function RegisterPage({
  onSuccess,
  onSwitchToLogin,
}: RegisterPageProps) {
  const [values, setValues] = useState<RegisterFormState>({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
    privacyAccepted: false,
  });
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [statusModal, setStatusModal] = useState<AuthStatus>({
    open: false,
    title: "",
    message: "",
  });

  const handleChange = (
    field: RegisterTextField,
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setValues((prev) => ({ ...prev, [field]: event.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setSubmitError("");
  };

  const handlePrivacyChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, privacyAccepted: event.target.checked }));
    setErrors((prev) => ({ ...prev, privacyAccepted: undefined }));
  };

  const validate = (): RegisterFormErrors => {
    const nextErrors: RegisterFormErrors = {};
    if (!values.displayName.trim()) {
      nextErrors.displayName = "Введите имя пользователя.";
    }
    if (!values.email.trim()) {
      nextErrors.email = "Введите электронную почту.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      nextErrors.email = "Введите корректный адрес электронной почты.";
    }
    if (!values.password) {
      nextErrors.password = "Введите пароль.";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        values.password,
      )
    ) {
      nextErrors.password =
        "Пароль должен содержать не менее 8 символов, заглавную и строчную буквы, цифру и специальный символ @$!%*?&.";
    }
    if (values.confirmPassword !== values.password) {
      nextErrors.confirmPassword = "Пароли не совпадают.";
    }
    if (!values.privacyAccepted) {
      nextErrors.privacyAccepted =
        "Необходимо принять политику конфиденциальности.";
    }
    return nextErrors;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    setSubmitError("");

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      const auth = await registerUser({
        displayName: values.displayName,
        email: values.email,
        password: values.password,
      });
      authStore.setAuth(auth);

      setStatusModal({
        open: true,
        title: "Регистрация завершена",
        message: "Ваш аккаунт успешно зарегистрирован.",
      });

      onSuccess?.();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Произошла ошибка при соединении с сервером.";
      setSubmitError(errorMessage);
      setStatusModal({
        open: true,
        title: "Ошибка регистрации",
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
          minHeight: "100vh",
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
            p: 4,
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
              Регистрация аккаунта
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              width: "100%",
              mb: 3,
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            <Button
              fullWidth
              variant="text"
              sx={{
                borderBottom: 2,
                borderColor: "primary.main",
                borderRadius: 0,
                fontWeight: "bold",
              }}
            >
              Регистрация
            </Button>
            <Button
              fullWidth
              variant="text"
              color="inherit"
              onClick={onSwitchToLogin}
              sx={{ borderRadius: 0, color: "text.secondary" }}
            >
              Вход
            </Button>
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ width: "100%" }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="register-username"
              label="Имя пользователя"
              name="displayName"
              autoComplete="username"
              value={values.displayName}
              onChange={(e) => handleChange("displayName", e)}
              error={Boolean(errors.displayName)}
              helperText={errors.displayName}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="register-email"
              label="Электронная почта"
              name="email"
              autoComplete="email"
              value={values.email}
              onChange={(e) => handleChange("email", e)}
              error={Boolean(errors.email)}
              helperText={errors.email}
            />
            <Box sx={{ mt: 2 }}>
              <PasswordInput
                id="register-password"
                label="Пароль"
                placeholder="Минимум 8 символов"
                value={values.password}
                onChange={(event) => handleChange("password", event)}
                error={errors.password}
                autoComplete="new-password"
              />
            </Box>

            <Box sx={{ mt: 3 }}>
              <PasswordInput
                id="register-confirm-password"
                label="Подтверждение пароля"
                placeholder="Повторите пароль"
                value={values.confirmPassword}
                onChange={(event) => handleChange("confirmPassword", event)}
                error={errors.confirmPassword}
                autoComplete="new-password"
              />
            </Box>

            <FormControlLabel
              control={
                <Checkbox
                  checked={values.privacyAccepted}
                  onChange={handlePrivacyChange}
                  color="primary"
                />
              }
              label={
                <Typography variant="body2">
                  Я соглашаюсь с{" "}
                  <Link href="#privacy">политикой конфиденциальности</Link>
                </Typography>
              }
              sx={{ mt: 1 }}
            />
            {errors.privacyAccepted && (
              <FormHelperText error sx={{ mt: 0.5 }}>
                {errors.privacyAccepted}
              </FormHelperText>
            )}
            {/* {errors.privacyAccepted && (
              <Typography
                component="span"
                variant="caption"
                color="error"
                display="block"
                sx={{ mt: 0.5 }}
              >
                {errors.privacyAccepted}
              </Typography>
            )} */}

            {submitError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {submitError}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isSubmitting}
              sx={{ mt: 3, mb: 2 }}
            >
              {isSubmitting ? "Отправка…" : "Регистрация →"}
            </Button>
          </Box>
        </Paper>

        <Box component="footer" sx={{ mt: 4, textAlign: "center" }}>
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

// import { useState } from "react";
// import type { ChangeEvent, FormEvent } from "react";
// import { AuthStatusModal } from "@/components/AuthStatusModal";
// import { PasswordInput } from "@/components/PasswordInput";
// import styles from "@/styles/styles.module.css";
// import { registerUser } from "@/api/auth";

// interface RegisterPageProps {
//   onSuccess?: () => void;
//   onSwitchToLogin?: () => void;
// }

// interface RegisterFormState {
//   username: string;
//   email: string;
//   password: string;
//   confirmPassword: string;
//   privacyAccepted: boolean;
// }

// interface AuthStatus {
//   open: boolean;
//   title: string;
//   message: string;
// }

// type RegisterFormErrors = Partial<Record<keyof RegisterFormState, string>>;

// export default function RegisterPage({
//   onSuccess,
//   onSwitchToLogin,
// }: RegisterPageProps) {
//   const [values, setValues] = useState<RegisterFormState>({
//     username: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     privacyAccepted: true,
//   });
//   const [errors, setErrors] = useState<RegisterFormErrors>({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitError, setSubmitError] = useState("");
//   const [statusModal, setStatusModal] = useState<AuthStatus>({
//     open: false,
//     title: "",
//     message: "",
//   });

//   const handleChange = (
//     field: keyof RegisterFormState,
//     event: ChangeEvent<HTMLInputElement>,
//   ) => {
//     const value =
//       field === "privacyAccepted" ? event.target.checked : event.target.value;
//     setValues((prev) => ({ ...prev, [field]: value }));
//     setErrors((prev) => ({ ...prev, [field]: undefined }));
//     setSubmitError("");
//   };

//   const validate = (): RegisterFormErrors => {
//     const nextErrors: RegisterFormErrors = {};
//     if (!values.username.trim()) {
//       nextErrors.username = "Введите логин.";
//     }
//     if (!values.email.trim()) {
//       nextErrors.email = "Введите электронную почту.";
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
//       nextErrors.email = "Введите корректный адрес электронной почты.";
//     }
//     if (!values.password) {
//       nextErrors.password = "Введите пароль.";
//     } else if (values.password.length < 8) {
//       nextErrors.password = "Пароль должен содержать не менее 8 символов.";
//     }
//     if (values.confirmPassword !== values.password) {
//       nextErrors.confirmPassword = "Пароли не совпадают.";
//     }
//     if (!values.privacyAccepted) {
//       nextErrors.privacyAccepted =
//         "Необходимо принять политику конфиденциальности.";
//     }
//     return nextErrors;
//   };

//   const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     const nextErrors = validate();
//     setErrors(nextErrors);
//     setSubmitError("");

//     if (Object.keys(nextErrors).length > 0) {
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       await registerUser({
//         username: values.username,
//         email: values.email,
//         password: values.password,
//       });

//       setStatusModal({
//         open: true,
//         title: "Регистрация завершена",
//         message: "Ваш аккаунт успешно зарегистрирован.",
//       });

//       onSuccess?.();
//     } catch (err: any) {
//       const errorMessage =
//         err.message || "Произошла ошибка при соединении с сервером.";
//       setSubmitError(errorMessage);
//       setStatusModal({
//         open: true,
//         title: "Ошибка регистрации",
//         message: errorMessage,
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <>
//       <main className={styles.page}>
//         <div className={styles.orb} aria-hidden="true" />
//         <section className={styles.card} aria-labelledby="auth-title">
//           <div className={styles.brand}>
//             <div className={styles.logo} aria-hidden="true">
//               ✦
//             </div>
//             <h1 className={styles.title} id="auth-title">
//               ReviewFlow
//             </h1>
//             <p className={styles.subtitle}>Регистрация аккаунта</p>
//           </div>

//           <div className={styles.tabs} role="tablist" aria-label="Авторизация">
//             <button
//               className={`${styles.tab} ${styles.activeTab}`}
//               type="button"
//             >
//               Регистрация
//             </button>
//             <button
//               className={styles.tab}
//               type="button"
//               onClick={onSwitchToLogin}
//             >
//               Вход
//             </button>
//           </div>

//           <form className={styles.form} onSubmit={handleSubmit} noValidate>
//             <div className={styles.formGroup}>
//               <label className={styles.label} htmlFor="register-username">
//                 Логин
//               </label>
//               <input
//                 className={styles.input}
//                 id="register-username"
//                 type="text"
//                 placeholder="Введите ваш логин"
//                 value={values.username}
//                 onChange={(e) => handleChange("username", e)}
//                 autoComplete="username"
//                 aria-invalid={Boolean(errors.username)}
//               />
//               {errors.username && (
//                 <span className={styles.fieldError}>{errors.username}</span>
//               )}
//             </div>

//             <div className={styles.formGroup}>
//               <label className={styles.label} htmlFor="register-email">
//                 Электронная почта
//               </label>
//               <input
//                 className={styles.input}
//                 id="register-email"
//                 type="email"
//                 placeholder="example@gmail.com"
//                 value={values.email}
//                 onChange={(e) => handleChange("email", e)}
//                 autoComplete="email"
//                 aria-invalid={Boolean(errors.email)}
//               />
//               {errors.email && (
//                 <span className={styles.fieldError}>{errors.email}</span>
//               )}
//             </div>

//             <PasswordInput
//               id="register-password"
//               label="Пароль"
//               placeholder="Минимум 8 символов"
//               value={values.password}
//               onChange={(e) => handleChange("password", e)}
//               error={errors.password}
//               autoComplete="new-password"
//             />

//             <PasswordInput
//               id="register-confirm-password"
//               label="Подтверждение пароля"
//               placeholder="Повторите пароль"
//               value={values.confirmPassword}
//               onChange={(e) => handleChange("confirmPassword", e)}
//               error={errors.confirmPassword}
//               autoComplete="new-password"
//             />

//             <label className={styles.checkLabel}>
//               <input
//                 type="checkbox"
//                 checked={values.privacyAccepted}
//                 onChange={(e) => handleChange("privacyAccepted", e)}
//               />
//               <span>
//                 Я соглашаюсь с{" "}
//                 <a href="#privacy">политикой конфиденциальности</a>
//               </span>
//             </label>
//             {errors.privacyAccepted && (
//               <span className={styles.fieldError}>
//                 {errors.privacyAccepted}
//               </span>
//             )}

//             {submitError && (
//               <p className={styles.submitError} role="alert">
//                 {submitError}
//               </p>
//             )}

//             <button
//               className={styles.submitButton}
//               type="submit"
//               disabled={isSubmitting}
//               aria-busy={isSubmitting}
//             >
//               {isSubmitting ? "Отправка…" : "Регистрация →"}
//             </button>
//           </form>
//         </section>
//         <footer className={styles.footer}>
//           © 2026 ReviewFlow · Все права защищены
//         </footer>
//       </main>

//       <AuthStatusModal
//         open={statusModal.open}
//         title={statusModal.title}
//         message={statusModal.message}
//         onClose={() => setStatusModal((curr) => ({ ...curr, open: false }))}
//       />
//     </>
//   );
// }
