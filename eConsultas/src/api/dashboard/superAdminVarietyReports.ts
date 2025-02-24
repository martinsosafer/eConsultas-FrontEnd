import { api } from "../axios";
import Cookies from "js-cookie";

export const dashboardApi = {
  async getTotalNumberOfPacientes(): Promise<string> {
    try {
      const response = await api.get(
        "/usuarios/pacientes/totao-pacientes",
        {
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${Cookies.get("access_token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching total number of pacientes:", error);
      throw error;
    }
  },

  async getNumberOfGananciasInOneDay(
    fechaInicio: string,
    fechaFin: string
  ): Promise<number> {
    try {
      const response = await api.get(
        `/api/consultas/reportes/ingresos-egresos?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`,
        {
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${Cookies.get("access_token")}`,
          },
        }
      );
      //  La respuesta es similar a un array así:
      // [
      //   ["2025-02-01", "2025-02-01", 0.0, 0.0]
      // ] 
      // así que solo extraigo el tercer elemento que son las ganancias
      const data = response.data;
      if (
        Array.isArray(data) &&
        data.length > 0 &&
        Array.isArray(data[0]) &&
        data[0].length >= 3
      ) {
        return Number(data[0][2]);
      }
      throw new Error("Formato de respuesta inesperado");
    } catch (error) {
      console.error("Error fetching ganancias in one day:", error);
      throw error;
    }
  },

  async getNumberOfConsultasInOneDay(fecha: string): Promise<string> {
    try {
      const response = await api.get(
        `/api/consultas/consultas/total-consultas?fecha=${fecha}`,
        {
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${Cookies.get("access_token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching total number of consultas:", error);
      throw error;
    }
  },
};
