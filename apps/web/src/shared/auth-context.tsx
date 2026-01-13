import { User } from "@repo/contracts";
import { createContext, useContext, useEffect, useState } from "react";
import { login as apiLogin, getMe as apiGetMe } from "./api-client";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: unknown) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkSession = async () => {
    try {
      const { user } = await apiGetMe();
      setUser(user);
    } catch (e) {
      // ensure logout
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const login = async (data: unknown) => {
    const res = await apiLogin(data);
    setUser(res.user);
  };

  const logout = () => {
    // TODO: Call apiLogout
    setUser(null);
    window.location.href = "/auth/login";
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
