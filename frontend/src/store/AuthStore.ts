import { makeAutoObservable } from "mobx";
import { refreshAuthSession, REFRESH_TOKEN_KEY } from "@/api/authSession";
import type { AuthResponse } from "@/types/auth";

export type AuthUser = AuthResponse["user"];

const USER_KEY = "auth_user";
let initializationPromise: Promise<void> | null = null;

function isAuthUser(value: unknown): value is AuthUser {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  return (
    "id" in value &&
    typeof value.id === "string" &&
    "email" in value &&
    typeof value.email === "string" &&
    "displayName" in value &&
    typeof value.displayName === "string"
  );
}

class AuthStore {
  accessToken: string | null = null;
  user: AuthUser | null = null;
  isInitializing = true;

  constructor() {
    makeAutoObservable(this);
    this.loadUserFromStorage();
  }

  get isAuthenticated(): boolean {
    return typeof this.accessToken === "string" && this.accessToken.length > 0;
  }

  setAuth = (auth: AuthResponse): void => {
    this.accessToken = auth.accessToken;
    this.user = auth.user;

    localStorage.setItem(USER_KEY, JSON.stringify(auth.user));
    sessionStorage.setItem(REFRESH_TOKEN_KEY, auth.refreshToken);
  };

  setAccessToken = (token: string): void => {
    this.accessToken = token;
  };

  clearAuth = (): void => {
    this.accessToken = null;
    this.user = null;
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  };

  initialize = (): Promise<void> => {
    if (!initializationPromise) {
      initializationPromise = this.restoreSession();
    }
    return initializationPromise;
  };

  private restoreSession = async (): Promise<void> => {
    try {
      const auth = await refreshAuthSession();
      if (auth) {
        this.setAuth(auth);
      } else {
        this.clearAuth();
      }
    } catch (error: unknown) {
      this.clearAuth();
      console.error("Не удалось восстановить сессию:", error);
    } finally {
      this.isInitializing = false;
    }
  };

  private loadUserFromStorage = (): void => {
    const storedUser = localStorage.getItem(USER_KEY);
    if (!storedUser) {
      return;
    }

    try {
      const parsedUser: unknown = JSON.parse(storedUser);
      if (isAuthUser(parsedUser)) {
        this.user = parsedUser;
      } else {
        localStorage.removeItem(USER_KEY);
      }
    } catch {
      localStorage.removeItem(USER_KEY);
    }
  };
}

export const authStore = new AuthStore();
