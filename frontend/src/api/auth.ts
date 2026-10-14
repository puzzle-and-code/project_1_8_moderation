import type { AuthResponse } from "@/types/auth";

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export interface LoginCredentials {
  emailOrLogin: string;
  password: string;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5009/api";

function isAuthResponse(data: unknown): data is AuthResponse {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const candidate = data as Partial<AuthResponse>;
  return (
    typeof candidate.accessToken === "string" &&
    candidate.accessToken.length > 0 &&
    typeof candidate.user === "object" &&
    candidate.user !== null &&
    typeof candidate.user.id === "string" &&
    typeof candidate.user.email === "string" &&
    typeof candidate.user.name === "string"
  );
}

export async function registerUser(credentials: RegisterCredentials) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: credentials.username,
      email: credentials.email,
      password: credentials.password,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Ошибка при создании аккаунта");
  }

  return response.json();
}

export async function loginUser(
  credentials: LoginCredentials,
): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Неверный логин или пароль");
  }

  const data: unknown = await response.json();
  if (!isAuthResponse(data)) {
    throw new Error("Сервер вернул некорректные данные авторизации.");
  }

  return data;
}
