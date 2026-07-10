import { createContext, ReactNode, useEffect, useState } from "react";
import { authService } from "../services/auth";

interface AuthUser {
  id: number;
  email: string;
  role: "farmer" | "admin";
  full_name: string;
  is_active?: boolean;
}

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
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem("kisanbot_token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        localStorage.removeItem("kisanbot_token");
        setUser(null);
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

    setUser(authData.user);
  };

  const logout = () => {
    localStorage.removeItem("kisanbot_token");
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