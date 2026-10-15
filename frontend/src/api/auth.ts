import { apiClient } from "./apiClient";
import { parseAuthResponse, REFRESH_TOKEN_KEY } from "./authSession";
import type { AuthResponse } from "@/types/auth";

export interface RegisterCredentials {
  displayName: string;
  email: string;
  password: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export async function registerUser(
  credentials: RegisterCredentials,
): Promise<AuthResponse> {
  const response = await apiClient<unknown>("/auth/register", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
  return parseAuthResponse(response);
}

export async function loginUser(
  credentials: LoginCredentials,
): Promise<AuthResponse> {
  const response = await apiClient<unknown>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
  return parseAuthResponse(response);
}

export async function logoutUser() {
  const refreshToken = sessionStorage.getItem(REFRESH_TOKEN_KEY);
  if (!refreshToken) {
    throw new Error("Refresh-токен не найден. Войдите в аккаунт повторно.");
  }

  return apiClient<{ message: string }>("/auth/logout", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
}
