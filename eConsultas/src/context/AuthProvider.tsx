// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { api } from "../api/axios";
import { personaApi } from "@/api/classes apis/personaApi";
import { Medico, Paciente, Persona } from "../api/models/personaModels";
import { authService } from "@/api/authService";
interface CredencialesDTO {
  roles?: Array<{ id: number; nombre: string }>;
  // Include other fields from the credenciales object as needed
}
interface UserDTO {
  correo: string;
  verificacion2Factores: boolean;
  TipoPersona: string;
  username: string;
  jti: string;
  scope: string;

  credenciales?: CredencialesDTO;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserDTO | null;
  personaData: Medico | Paciente | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserDTO | null>(null);
  const [personaData, setPersonaData] = useState<Medico | Paciente | null>(
    null
  );
  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      const token = Cookies.get("access_token");
      const userData = localStorage.getItem("UserDTO");

      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          api.defaults.headers.Authorization = `Bearer ${token}`;

          // Add loading state
          const persona = await personaApi.getPersona();
          if (!persona) throw new Error("No persona data");

          setIsAuthenticated(true);
          setUser(parsedUser);
          setPersonaData(persona);
        } catch (error) {
          console.error("Auth initialization error:", error);
          logout();
        } finally {
          setIsLoading(false); // Ensure loading ends
        }
      }
    };
    initializeAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      await authService.login(username, password);
      const userData = JSON.parse(localStorage.getItem("UserDTO")!);
      const persona = await personaApi.getPersona();

      setIsAuthenticated(true);
      setUser(userData);
      setPersonaData(persona);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    Cookies.remove("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("UserDTO");
    localStorage.removeItem("personaData");
    setIsAuthenticated(false);
    setUser(null);
    setPersonaData(null);
    delete api.defaults.headers.Authorization;
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, personaData, login, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
