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

api.interceptors.request.use(
  (config: any) => {
    const token = Cookies.get("access_token");
    
    // Excluyo rutas de autenticación y manejar FormData
    const isAuthRequest = config.url?.includes("/security/oauth/token");
    
    if (token && !isAuthRequest) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);