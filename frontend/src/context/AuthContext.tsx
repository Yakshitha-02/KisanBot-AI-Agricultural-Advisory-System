import axios from "axios";
import { createContext, ReactNode, useEffect, useState } from "react";
import {
  authService,
  clearStoredAuthUser,
  getStoredAuthUser,
  setStoredAuthUser,
  type AuthUser,
} from "../services/auth";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => getStoredAuthUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem("kisanbot_token");
      const cachedUser = getStoredAuthUser();

      if (!token) {
        setUser(cachedUser);
        setLoading(false);
        return;
      }

      if (cachedUser) {
        setUser(cachedUser);
      }

      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
        setStoredAuthUser(currentUser);
      } catch (err) {
        if (axios.isAxiosError(err) && [401, 403].includes(err.response?.status ?? 0)) {
          localStorage.removeItem("kisanbot_token");
          clearStoredAuthUser();
          setUser(null);
        } else if (!cachedUser) {
          setUser(null);
        }
      }

      setLoading(false);
    };

    restoreSession();
  }, []);

  const login = async (email: string, password: string) => {
    const authData = await authService.login(email, password);

    localStorage.setItem(
      "kisanbot_token",
      authData.access_token
    );

    if (authData.user) {
      setStoredAuthUser(authData.user);
      setUser(authData.user);
    }
  };

  const logout = () => {
    localStorage.removeItem("kisanbot_token");
    clearStoredAuthUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}