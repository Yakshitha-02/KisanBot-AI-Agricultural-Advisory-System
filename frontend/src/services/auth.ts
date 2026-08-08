import api from "./api";

export interface AuthUser {
  id: number;
  email: string;
  role: "farmer" | "admin";
  full_name: string;
  is_active?: boolean;
}

interface AuthResponse {
  access_token: string;
  user?: AuthUser;
}

const AUTH_USER_STORAGE_KEY = "kisanbot_user";

export const getStoredAuthUser = (): AuthUser | null => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = localStorage.getItem(AUTH_USER_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as AuthUser) : null;
  } catch {
    return null;
  }
};

export const setStoredAuthUser = (user: AuthUser | null) => {
  if (typeof window === "undefined") {
    return;
  }

  if (!user) {
    localStorage.removeItem(AUTH_USER_STORAGE_KEY);
    return;
  }

  localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
};

export const clearStoredAuthUser = () => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(AUTH_USER_STORAGE_KEY);
};

export interface RegisterPayload {
  full_name: string;
  email: string;
  password: string;
  role: "farmer" | "admin";
  state: string;
  district: string;
  preferred_language: string;
}

export const authService = {
  async login(email: string, password: string) {
    const response = await api.post<AuthResponse>("/auth/login", {
      email,
      password,
    });

    if (response.data.access_token) {
      localStorage.setItem(
        "kisanbot_token",
        response.data.access_token
      );
    }

    if (response.data.user) {
      setStoredAuthUser(response.data.user);
    }

    return response.data;
  },

  async register(payload: RegisterPayload) {
    const response = await api.post<AuthResponse>("/auth/register", payload);

    if (response.data.access_token) {
      localStorage.setItem(
        "kisanbot_token",
        response.data.access_token
      );
    }

    if (response.data.user) {
      setStoredAuthUser(response.data.user);
    }

    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get<AuthUser>("/auth/me");
    return response.data;
  },

  logout() {
    localStorage.removeItem("kisanbot_token");
    clearStoredAuthUser();
  },
};