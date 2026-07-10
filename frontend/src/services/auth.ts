import api from "./api";

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
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    if (response.data.access_token) {
      localStorage.setItem(
        "kisanbot_token",
        response.data.access_token
      );
    }

    return response.data;
  },

  async register(payload: RegisterPayload) {
    const response = await api.post("/auth/register", payload);

    if (response.data.access_token) {
      localStorage.setItem(
        "kisanbot_token",
        response.data.access_token
      );
    }

    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get("/auth/me");
    return response.data;
  },

  logout() {
    localStorage.removeItem("kisanbot_token");
  },
};