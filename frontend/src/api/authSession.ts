import type { AuthResponse } from "@/types/auth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5009/api";
export const REFRESH_TOKEN_KEY = "auth_refresh_token";

interface JwtClaims {
  sub?: string;
  nameid?: string;
  email?: string;
  display_name?: string;
  displayName?: string;
  name?: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function parseAuthResponse(response: unknown): AuthResponse {
  if (!isRecord(response)) {
    throw new Error("Сервер вернул некорректный ответ авторизации.");
  }

  const tokens = isRecord(response.tokens) ? response.tokens : response;
  if (
    typeof tokens.accessToken !== "string" ||
    typeof tokens.refreshToken !== "string"
  ) {
    throw new Error("Ответ сервера не содержит необходимые токены.");
  }

  const payload = tokens.accessToken.split(".")[1];
  if (!payload) {
    throw new Error("Сервер вернул некорректный access-токен.");
  }

  let claims: JwtClaims;
  try {
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedBase64 = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "=",
    );
    const bytes = Uint8Array.from(atob(paddedBase64), (character) =>
      character.charCodeAt(0),
    );
    const parsedClaims: unknown = JSON.parse(new TextDecoder().decode(bytes));
    if (!isRecord(parsedClaims)) {
      throw new Error("Некорректные данные токена.");
    }
    claims = parsedClaims as JwtClaims;
  } catch {
    throw new Error("Не удалось прочитать данные access-токена.");
  }

  const id = claims.sub ?? claims.nameid;
  const displayName =
    claims.display_name ?? claims.displayName ?? claims.name ?? claims.email;
  if (!id || !claims.email || !displayName) {
    throw new Error("В access-токене отсутствуют данные пользователя.");
  }

  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    user: { id, email: claims.email, displayName },
  };
}

export async function refreshAuthSession(): Promise<AuthResponse | null> {
  const refreshToken = sessionStorage.getItem(REFRESH_TOKEN_KEY);
  if (!refreshToken) {
    return null;
  }

  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
    credentials: "include",
  });

  if (response.status === 401) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`Не удалось обновить сессию (${response.status}).`);
  }

  let responseBody: unknown;
  try {
    responseBody = await response.json();
  } catch {
    throw new Error("Сервер вернул некорректный ответ обновления сессии.");
  }

  return parseAuthResponse(responseBody);
}
