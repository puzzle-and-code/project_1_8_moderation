import { makeAutoObservable } from "mobx";
import type { AuthResponse } from "@/types/auth";

export type AuthUser = AuthResponse["user"];

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

class AuthStore {
  accessToken: string | null = null;
  user: AuthUser | null = null;

  constructor() {
    makeAutoObservable(this);
    this.loadFromStorage();
  }

  get isAuthenticated(): boolean {
    return this.accessToken !== null && this.user !== null;
  }

  setAuth = (auth: AuthResponse): void => {
    this.accessToken = auth.accessToken;
    this.user = auth.user;

    localStorage.setItem(TOKEN_KEY, auth.accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(auth.user));
  };

  clearAuth = (): void => {
    this.accessToken = null;
    this.user = null;

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  private loadFromStorage = (): void => {
    try {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);

      if (storedToken && storedUser) {
        this.accessToken = storedToken;
        this.user = JSON.parse(storedUser) as AuthUser;
      }
    } catch (error) {
      console.error(
        "Ошибка при загрузке данных авторизации из localStorage:",
        error,
      );
      this.clearAuth();
    }
  };
}

export const authStore = new AuthStore();

// import { makeAutoObservable } from "mobx";
// import type { AuthResponse } from "@/types/auth";

// export type AuthUser = AuthResponse["user"];

// const TOKEN_KEY = "auth_token";
// const USER_KEY = "auth_user";

// class AuthStore {
//   accessToken: string | null = null;
//   user: AuthUser | null = null;

//   constructor() {
//     makeAutoObservable(this, {}, { autoBind: true });
//     this.loadFromStorage();
//   }

//   get isAuthenticated() {
//     return this.accessToken !== null && this.user !== null;
//   }

//   setAuth(auth: AuthResponse) {
//     this.accessToken = auth.accessToken;
//     this.user = auth.user;

//     localStorage.setItem(TOKEN_KEY, auth.accessToken);
//     localStorage.setItem(USER_KEY, JSON.stringify(auth.user));
//   }

//   clearAuth() {
//     this.accessToken = null;
//     this.user = null;

//     localStorage.removeItem(TOKEN_KEY);
//     localStorage.removeItem(USER_KEY);
//   }
// }

//   loadFromStorage() {
//     try {
//       const storedToken = localStorage.getItem(TOKEN_KEY);
//       const storedUser = localStorage.getItem(USER_KEY);

//       if (storedToken && storedUser) {
//         this.accessToken = storedToken as string;

//         this.user = JSON.parse(storedUser) as AuthUser;
//       }
//     } catch (error) {
//       console.error("Ошибка при загрузке данных авторизации из localStorage:", error);
//       this.clearAuth();
//     }
//   }

// export const authStore = new AuthStore();
