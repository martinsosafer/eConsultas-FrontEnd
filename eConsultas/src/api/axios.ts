import axios from "axios";
import Cookies from "js-cookie";
import { authService } from "@/api/authService"; 
import { useAuth } from "@/context/AuthProvider";

export const api = axios.create({
  baseURL: "/api", // Implementé una proxy inversa debido a que nuestra api está en HTTP y nuestro
  //Deploy está en HTTPS. 
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de solicitud
api.interceptors.request.use(
  (config: any) => {
    const token = Cookies.get("access_token");
    
    // Excluir rutas de autenticación del Bearer token
    if (token && !config.url?.includes("/security/oauth/token")) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Manejo el FormData correctamente
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// Interceptor de respuesta para manejar tokens expirados
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Si es error 401 y no es una solicitud de refresh/login
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Marcar para evitar bucle
      
      try {
        // 1. Intentar renovar el token
        await authService.refreshToken();
        
        // 2. Actualizar header con nuevo token
        const newToken = Cookies.get("access_token");
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        
        // 3. Reintentar solicitud original
        return api(originalRequest);
      } catch (refreshError) {
        const { logout } = useAuth();
        window.location.href = "/login";
        logout();
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);