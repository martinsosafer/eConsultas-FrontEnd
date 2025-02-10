import { api } from "./axios";
import Cookies from "js-cookie";

//Creamos una función para sacar los dos puntos de la URL dinámica :D
const formatParameter = (value: string): string => {
  return value.startsWith(':') ? value.slice(1) : value;
};

export const passwordManagement = {
  async createPassword(email: string, password: string, code: string): Promise<void> {



    const formatedEmail = formatParameter(email);
    const formatedCode = formatParameter(code);
    

    const fechaFormateada = new Date().toISOString()
      .replace('T', ' ')
      .split('.')[0];
    const formatedDate = formatParameter(fechaFormateada);

    try {
      console.log(`/usuarios/usuarios/agregar-password/${formatedEmail}?password=${password}&codigo=${formatedCode}&fecha=${formatedDate}`);
      await api.put(
        `/usuarios/usuarios/agregar-password/${formatedEmail}?password=${password}&codigo=${formatedCode}&fecha=${formatedDate}`,
        null,
        {
          headers: {
            Accept: "*/*",
          },
        }
      );
    } catch (error) {
      console.error("Error updating password:", error);
      throw error;
    }
  },

  async changePassword(username: string, oldPassword: string, newPassword: string): Promise<void> {
    const token = Cookies.get("access_token");
    if (!token) throw new Error("No authentication token found");

 
    const formatedUsername = formatParameter(username);

    try {
      await api.put(
        `/usuarios/usuarios/cambiar-password/${formatedUsername}?password=${oldPassword}&nuevaPassword=${newPassword}`,
        null,
        {
          headers: {
            Accept: "*/*",
          },
        }
      );
    } catch (error) {
      console.error("Error changing password:", error);
      throw error;
    }
  }
};