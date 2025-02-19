import { api } from "../axios";
import Cookies from "js-cookie";
import { Medico } from "../models/personaModels";

export const medicoApi = {
  async getDisponibilidadTurnosMedico(
    email: string,
    fecha: string
  ): Promise<any> {
    const token = Cookies.get("access_token");
    if (!token) throw new Error("No authentication token found");

    try {
      const response = await api.get(
        "/usuarios/medicos/disponibilidad-semanal",
        {
          params: {
            email,
            fecha,
          },
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
          idOHorarioTurno: encodeURIComponent(horario),
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
          accion: "REMOVER",
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
  async getMedicoSpecialties(): Promise<string[]> {
    try {
      const response = await api.get("/usuarios/medicos/especialidades", {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${Cookies.get("access_token")}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching specialties:", error);
      throw error;
    }
  },
  async getMedicosBySpecialty(
    especialidad: string,
    search?: string
  ): Promise<Medico[]> {
    try {
      const params = new URLSearchParams({
        especialidadMedico: especialidad,
      });

      if (search) {
        params.append("search", encodeURIComponent(search));
      }

      const fullUrl = `/usuarios/persona/get-all/MEDICO?${params}`;
      console.log("Constructed URL:", fullUrl); // Add this line

      const response = await api.get(fullUrl, {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${Cookies.get("access_token")}`,
        },
      });

      console.log("API Response:", response); // Add this line
      return response.data;
    } catch (error) {
      console.error(
        "Error details:",
        (error as any).response?.data || (error as any).message
      );
      throw error;
    }
  },
};
