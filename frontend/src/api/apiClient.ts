import { authStore } from "@/store/AuthStore";
import { refreshAuthSession } from "@/api/authSession";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5009/api";
const AUTH_ENDPOINTS = ["/auth/login", "/auth/register", "/auth/refresh"];

async function request<T>(
  endpoint: string,
  options: RequestInit,
  canRefresh: boolean,
): Promise<T> {
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const token = authStore.accessToken;
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (
    response.status === 401 &&
    canRefresh &&
    !AUTH_ENDPOINTS.includes(endpoint)
  ) {
    try {
      const session = await refreshAuthSession();
      if (!session) {
        throw new Error("Сессия истекла");
      }

      authStore.setAuth(session);
      return request<T>(endpoint, options, false);
    } catch (error) {
      authStore.clearAuth();
      throw error;
    }
  }

  if (!response.ok) {
    let errorData: unknown;
    try {
      errorData = await response.json();
    } catch {
      errorData = null;
    }

    const message = readErrorMessage(errorData);

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  return text ? (JSON.parse(text) as T) : ({} as T);
}

function readErrorMessage(errorData: unknown): string {
  if (typeof errorData !== "object" || errorData === null) {
    return "Произошла ошибка запроса";
  }

  if ("error" in errorData && typeof errorData.error === "string") {
    return errorData.error;
  }

  if ("message" in errorData && typeof errorData.message === "string") {
    return errorData.message;
  }

  if ("errors" in errorData && typeof errorData.errors === "object" && errorData.errors !== null) {
    const messages = Object.values(errorData.errors).flatMap((value) =>
      Array.isArray(value)
        ? value.filter((item): item is string => typeof item === "string")
        : [],
    );
    if (messages.length > 0) {
      return messages.join(" ");
    }
  }

  if ("title" in errorData && typeof errorData.title === "string") {
    return errorData.title;
  }

  return "Произошла ошибка запроса";
}

export function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  return request<T>(endpoint, options, true);
}
