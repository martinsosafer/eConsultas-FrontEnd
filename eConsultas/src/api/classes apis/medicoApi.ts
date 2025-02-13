
import { api } from "../axios";
import Cookies from "js-cookie";

export const medicoApi = {
  async getDisponibilidadTurnosMedico(email: string, fecha: string): Promise<any> {
    const token = Cookies.get("access_token");
    if (!token) throw new Error("No authentication token found");

    try {
      const response = await api.get("/usuarios/medicos/disponibilidad-semanal", {
        params: {
          email,
          fecha
        },
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching disponibilidad:", error);
      throw error;
    }
  },

  async removeTurnoForMedico(email: string, horario: string): Promise<void> {
    const token = Cookies.get("access_token");
    if (!token) throw new Error("No authentication token found");

    try {
      await api.put("/usuarios/medicos/asignar-remover-turno", null, {
        params: {
          email: encodeURIComponent(email),
          idOHorarioTurno: encodeURIComponent(horario)
        },
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Error removing turno:", error);
      throw error;
    }
  },

  async removeTurnoToAllMedicos(horario: string): Promise<void> {
    const token = Cookies.get("access_token");
    if (!token) throw new Error("No authentication token found");

    try {
      await api.put("/usuarios/medicos/asignar-remover-turno-a-todos", null, {
        params: {
          idOHorario: encodeURIComponent(horario),
          accion: "REMOVER"
        },
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Error removing turno from all medicos:", error);
      throw error;
    }
  },

  async getDisponibilidadPorFechaHorario(
    email: string,
    fecha: string,
    horario: string
  ): Promise<any> {
    const token = Cookies.get("access_token");
    if (!token) throw new Error("No authentication token found");

    try {
      const response = await api.get(
        `/usuarios/medicos/disponibilidad-por-fecha-horario?fecha=${fecha}&email=${email}&horario=${horario}`, 
        {
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching disponibilidad por horario:", error);
      throw error;
    }
  },
};