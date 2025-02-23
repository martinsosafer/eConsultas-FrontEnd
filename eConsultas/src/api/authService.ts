import { api } from "./axios";
import Cookies from "js-cookie";

export const authService = {
  async login(username: string, password: string) {
    const frontAppUsername = "front_app";
    const frontAppPassword = "12345";
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("grant_type", "password");

    const response = await api.post("/security/oauth/token", formData, {
      headers: {
        Authorization:
          "Basic " + btoa(frontAppUsername + ":" + frontAppPassword),
        // "fecha-hora": "fecha y hora",
        // "ubicacion": "mi ubicacion", 
        // "dispositivo": "mi dispositivo",
      },
    });

    if (response.data.access_token) {
      // Fecha de expiración del token por ahora será 31 días :)
      Cookies.set("access_token", response.data.access_token, {
        expires: 31,
        secure: true,
        sameSite: "strict",
      });
      
      // Local storage del refresh token y del DTO del usuario :)
      localStorage.setItem("refresh_token", response.data.refresh_token);
      const userDTO = {
        correo: response.data.correo,
        verificacion2Factores: response.data.verificacion2Factores,
        username: response.data.username,
        jti: response.data.jti,
        scope: response.data.scope,
      };
      localStorage.setItem("UserDTO", JSON.stringify(userDTO));

      // Actualizamos las siguientes instancias de axios con el nuevo Bearer token yey!!! :D
      api.defaults.headers.Authorization = `Bearer ${response.data.access_token}`;
    }

    return response.data;
  },

  async refreshToken() {
    const frontAppUsername = "front_app";
    const frontAppPassword = "12345";
    const refreshToken = localStorage.getItem("refresh_token");

    if (!refreshToken) {
      throw new Error("No se encontró el refresh token.");
    }

    // 1. Crear FormData (igual que en Postman)
    const formData = new FormData();
    formData.append("refresh_token", refreshToken);
    formData.append("grant_type", "refresh_token");

    // 2. Configurar headers (sin Content-Type, Axios lo añadirá automáticamente)
    const headers = {
      Authorization: "Basic " + btoa(`${frontAppUsername}:${frontAppPassword}`),
    };

    try {
      // 3. Hacer la solicitud con Axios
      const response = await api.post("/security/oauth/token", formData, { headers });

      if (response.data.access_token) {
        // Guardar el nuevo token
        Cookies.set("access_token", response.data.access_token, {
          expires: 31,
          secure: true,
          sameSite: "strict",
        });

        // Actualizar Axios
        api.defaults.headers.Authorization = `Bearer ${response.data.access_token}`;

        return response.data;
      } else {
        throw new Error("Error al renovar el token");
      }
    } catch (error) {
      console.error("Error en refreshToken:", error);
      throw error;
    }
  },
};