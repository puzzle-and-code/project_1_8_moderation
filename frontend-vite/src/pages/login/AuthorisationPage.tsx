import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { AuthStatusModal } from "@/components/AuthStatusModal";
import styles from "@/styles/styles.module.css";

type AuthMode = "register" | "login";
type TextField =
  | "emailOrLogin"
  | "email"
  | "username"
  | "password"
  | "confirmPassword";
type PasswordField = "password" | "confirmPassword";

interface AuthFormState {
  emailOrLogin: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  privacyAccepted: boolean;
}

interface AuthStatus {
  open: boolean;
  title: string;
  message: string;
}

type AuthFormErrors = Partial<Record<keyof AuthFormState, string>>;

interface AuthorisationProps {
  onSubmit?: (
    mode: AuthMode,
    values: AuthFormState,
  ) => boolean | void | Promise<boolean | void>;
}

const initialValues: AuthFormState = {
  emailOrLogin: "",
  email: "",
  username: "",
  password: "",
  confirmPassword: "",
  privacyAccepted: true,
};

// ИЗМЕНИТЬ: Симуляция запроса на сервер для авторизации
async function simulateLoginRequest(loginIdentifier: string): Promise<void> {
  await new Promise<void>((resolve) => window.setTimeout(resolve, 1000));
  if (loginIdentifier.trim().toLowerCase() === "server-error") {
    throw new Error("Сервер недоступен");
  }
}

export default function Authorisation({ onSubmit }: AuthorisationProps) {
  const [mode, setMode] = useState<AuthMode>("login"); // По умолчанию режим "Вход"
  const [values, setValues] = useState<AuthFormState>(initialValues);
  const [errors, setErrors] = useState<AuthFormErrors>({});
  const [visiblePasswords, setVisiblePasswords] = useState<
    Record<PasswordField, boolean>
  >({ password: false, confirmPassword: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [statusModal, setStatusModal] = useState<AuthStatus>({
    open: false,
    title: "",
    message: "",
  });

  const handleTextChange = (
    field: TextField,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitError("");
  };

  const handlePrivacyChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValues((current) => ({
      ...current,
      privacyAccepted: event.target.checked,
    }));
    setErrors((current) => ({ ...current, privacyAccepted: undefined }));
  };

  const togglePassword = (field: PasswordField) => {
    setVisiblePasswords((current) => ({
      ...current,
      [field]: !current[field],
    }));
  };

  const validate = (): AuthFormErrors => {
    const nextErrors: AuthFormErrors = {};

    if (mode === "register") {
      if (!values.username.trim()) {
        nextErrors.username = "Введите логин.";
      }
      if (!values.email.trim()) {
        nextErrors.email = "Введите электронную почту.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        nextErrors.email = "Введите корректный адрес электронной почты.";
      }
    } else if (!values.emailOrLogin.trim()) {
      nextErrors.emailOrLogin = "Введите электронную почту или логин.";
    }

    if (!values.password) {
      nextErrors.password = "Введите пароль.";
    } else if (values.password.length < 8) {
      nextErrors.password = "Пароль должен содержать не менее 8 символов.";
    }

    if (mode === "register") {
      if (values.confirmPassword !== values.password) {
        nextErrors.confirmPassword = "Пароли не совпадают.";
      }
      if (!values.privacyAccepted) {
        nextErrors.privacyAccepted =
          "Необходимо принять политику конфиденциальности.";
      }
    }

    return nextErrors;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log("Отправка формы(авторизация):", { mode, values });

    const nextErrors = validate();
    setErrors(nextErrors);
    setSubmitError("");

    if (Object.keys(nextErrors).length > 0) {
      console.warn("Ошибки валидации(авторизация):", nextErrors);

      if (mode === "login") {
        setStatusModal({
          open: true,
          title: "Ошибка входа",
          message: "Проверьте введённые данные и попробуйте снова.",
        });
      }
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === "login") {
        await simulateLoginRequest(values.emailOrLogin);
      }

      const accepted = await onSubmit?.(mode, values);

      if (accepted === false) {
        throw new Error("Пользователь не найден");
      }

      console.log("Авторизация успешно завершена!");

      setStatusModal({
        open: true,
        title: mode === "login" ? "Успешный вход" : "Регистрация завершена",
        message:
          mode === "login"
            ? "Вход выполнен. Добро пожаловать!"
            : "Ваш аккаунт успешно зарегистрирован.",
      });
    } catch (err) {
      console.error("Ошибка в процессе входа:", err);

      const message = "Пользователь не найден (ошибка сервера).";
      setSubmitError(message);
      setStatusModal({
        open: true,
        title: "Ошибка входа",
        message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const changeMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setErrors({});
    setSubmitError("");
  };

  const renderPasswordInput = (
    field: PasswordField,
    label: string,
    placeholder: string,
  ) => (
    <div className={styles.formGroup}>
      <label className={styles.label} htmlFor={`${mode}-${field}`}>
        {label}
      </label>
      <div className={styles.inputWrap}>
        <input
          className={styles.input}
          id={`${mode}-${field}`}
          type={visiblePasswords[field] ? "text" : "password"}
          placeholder={placeholder}
          value={values[field]}
          onChange={(event) => handleTextChange(field, event)}
          autoComplete={
            field === "password" ? "current-password" : "new-password"
          }
          aria-invalid={Boolean(errors[field])}
          aria-describedby={
            errors[field] ? `${mode}-${field}-error` : undefined
          }
        />
        <button
          className={styles.visibilityButton}
          type="button"
          onClick={() => togglePassword(field)}
          aria-label={
            visiblePasswords[field] ? "Скрыть пароль" : "Показать пароль"
          }
        >
          {visiblePasswords[field] ? "Скрыть" : "Показать"}
        </button>
      </div>
      {errors[field] && (
        <span className={styles.fieldError} id={`${mode}-${field}-error`}>
          {errors[field]}
        </span>
      )}
    </div>
  );

  return (
    <>
      <main className={styles.page}>
        <div className={styles.orb} aria-hidden="true" />
        <section className={styles.card} aria-labelledby="auth-title">
          <div className={styles.brand}>
            <div className={styles.logo} aria-hidden="true">
              ✦
            </div>
            <h1 className={styles.title} id="auth-title">
              ReviewFlow
            </h1>
            <p className={styles.subtitle}>Авторизация</p>
          </div>

          <div className={styles.tabs} role="tablist" aria-label="Авторизация">
            <button
              className={`${styles.tab} ${mode === "register" ? styles.activeTab : ""}`}
              type="button"
              role="tab"
              aria-selected={mode === "register"}
              onClick={() => changeMode("register")}
            >
              Регистрация
            </button>
            <button
              className={`${styles.tab} ${mode === "login" ? styles.activeTab : ""}`}
              type="button"
              role="tab"
              aria-selected={mode === "login"}
              onClick={() => changeMode("login")}
            >
              Вход
            </button>
          </div>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            {mode === "register" ? (
              <>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="register-username">
                    Логин
                  </label>
                  <input
                    className={styles.input}
                    id="register-username"
                    type="text"
                    placeholder="Введите ваш логин"
                    value={values.username}
                    onChange={(event) => handleTextChange("username", event)}
                    autoComplete="username"
                    aria-invalid={Boolean(errors.username)}
                  />
                  {errors.username && (
                    <span className={styles.fieldError}>{errors.username}</span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="register-email">
                    Электронная почта
                  </label>
                  <input
                    className={styles.input}
                    id="register-email"
                    type="email"
                    placeholder="example@gmail.com"
                    value={values.email}
                    onChange={(event) => handleTextChange("email", event)}
                    autoComplete="email"
                    aria-invalid={Boolean(errors.email)}
                  />
                  {errors.email && (
                    <span className={styles.fieldError}>{errors.email}</span>
                  )}
                </div>
              </>
            ) : (
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="login-identity">
                  Электронная почта или логин
                </label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="example@gmail.com"
                  value={values.emailOrLogin}
                  onChange={(event) => handleTextChange("emailOrLogin", event)}
                  autoComplete="username"
                  aria-invalid={Boolean(errors.emailOrLogin)}
                />
                {errors.emailOrLogin && (
                  <span className={styles.fieldError}>
                    {errors.emailOrLogin}
                  </span>
                )}
              </div>
            )}

            {renderPasswordInput(
              "password",
              "Пароль",
              mode === "register" ? "Минимум 8 символов" : "Введите пароль",
            )}

            {mode === "register" ? (
              <>
                {renderPasswordInput(
                  "confirmPassword",
                  "Подтверждение пароля",
                  "Повторите пароль",
                )}
                <label className={styles.checkLabel}>
                  <input
                    type="checkbox"
                    checked={values.privacyAccepted}
                    onChange={handlePrivacyChange}
                  />
                  <span>
                    Я соглашаюсь с{" "}
                    <a href="#privacy">политикой конфиденциальности</a>
                  </span>
                </label>
                {errors.privacyAccepted && (
                  <span className={styles.fieldError}>
                    {errors.privacyAccepted}
                  </span>
                )}
              </>
            ) : (
              <div className={styles.formMeta}>
                <label className={styles.remember}>
                  <input type="checkbox" defaultChecked />
                  Запомнить меня
                </label>
                <a className={styles.link} href="#forgot-password">
                  Забыли пароль?
                </a>
              </div>
            )}

            {submitError && (
              <p className={styles.submitError} role="alert">
                {submitError}
              </p>
            )}

            <button
              className={styles.submitButton}
              type="submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting
                ? "Отправка…"
                : mode === "register"
                  ? "Регистрация →"
                  : "Войти в аккаунт →"}
            </button>

            <div className={styles.divider}>
              <span>или войти через</span>
            </div>
            <div className={styles.socials}>
              <button className={styles.socialButton} type="button">
                Google
              </button>
              <button className={styles.socialButton} type="button">
                VK
              </button>
              <button className={styles.socialButton} type="button">
                Discord
              </button>
            </div>
          </form>
        </section>
        <footer className={styles.footer}>
          © 2026 ReviewFlow · Все права защищены
        </footer>
      </main>
      <AuthStatusModal
        open={statusModal.open}
        title={statusModal.title}
        message={statusModal.message}
        onClose={() =>
          setStatusModal((current) => ({ ...current, open: false }))
        }
      />
    </>
  );
}
