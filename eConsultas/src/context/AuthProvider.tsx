// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { api } from "../api/axios";

interface UserDTO {
  correo: string;
  verificacion2Factores: boolean;
  TipoPersona: string;
  username: string;
  jti: string;
  scope: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserDTO | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserDTO | null>(null);

  // Initialize auth state on app load
  useEffect(() => {
    const token = Cookies.get("access_token");
    const userData = localStorage.getItem("UserDTO");
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
      api.defaults.headers.Authorization = `Bearer ${token}`;
    }
  }, []);

  const login = async (username: string, password: string) => {
    const response = await authService.login(username, password);
    const userData = JSON.parse(localStorage.getItem("UserDTO")!);
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    Cookies.remove("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("UserDTO");
    setIsAuthenticated(false);
    setUser(null);
    delete api.defaults.headers.Authorization;
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
