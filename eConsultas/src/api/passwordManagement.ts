import { api } from "./axios";
import Cookies from "js-cookie";


export const passwordManagement = {
  
  async createPassword(email: string, password: string, code: string): Promise<void> {
    const token = Cookies.get("access_token");
    if (!token) throw new Error("No authentication token found");

    const fechaFormateada = new Date().toISOString()
      .replace('T', ' ')
      .split('.')[0];

    try {
      await api.put(
        `/usuarios/agregar-password/${encodeURIComponent(email)}?password=${encodeURIComponent(password)}&codigo=${code}&fecha=${encodeURIComponent(fechaFormateada)}`,
        null,
        {
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
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

    try {
      await api.put(
        `/usuarios/cambiar-password/${encodeURIComponent(username)}?password=${encodeURIComponent(oldPassword)}&nuevaPassword=${encodeURIComponent(newPassword)}`,
        null,
        {
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error changing password:", error);
      throw error;
    }
  }
};