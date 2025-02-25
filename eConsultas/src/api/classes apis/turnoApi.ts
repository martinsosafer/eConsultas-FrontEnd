import { api } from "../axios";
import Cookies from "js-cookie";
import { CreateTurno, Turno } from "../models/turnoModels";


export const turnoApi = {
  async getTurno(horario: string): Promise<Turno> {
    const token = Cookies.get("access_token");
    if (!token) throw new Error("No authentication token found");

    try {
      const response = await api.get(`/usuarios/turnos/${(horario)}`, {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching turno:", error);
      throw error;
    }
  },

  async toggleTurnoStatus(horario: string): Promise<Turno> {
    const token = Cookies.get("access_token");
    if (!token) throw new Error("No authentication token found");

    try {
      const response = await api.put(
        `/usuarios/turnos/habilitar-deshabilitar/:${(horario)}`,
      
        {
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error toggling turno status:", error);
      throw error;
    }
  },

  async deleteTurno(horario: string): Promise<void> {
    const token = Cookies.get("access_token");
    if (!token) throw new Error("No authentication token found");

    try {
      await api.delete(`/usuarios/turnos/${(horario)}`, {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Error deleting turno:", error);
      throw error;
    }
  },

  async createTurno(turnoData: CreateTurno): Promise<Turno> {
    const token = Cookies.get("access_token");
    if (!token) throw new Error("No authentication token found");

    try {
      const response = await api.post("/usuarios/turnos", turnoData, {
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating turno:", error);
      throw error;
    }
  },

  async getAllTurnos(): Promise<Turno[]> {
    const token = Cookies.get("access_token");
    if (!token) throw new Error("No authentication token found");
  
    try {
      // console.log("Fetching all turnos...");
      const response = await api.get("/usuarios/turnos/get-all", {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });
      
      // console.log("Respuesta de getAllTurnos:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching all turnos:", error);
      if (error.response) {
        console.error("Detalles del error:", {
          status: error.response.status,
          data: error.response.data
        });
      }
      throw error;
    }
  },

  
  async getTurnosByMedico(
    medicoEmail: string, 
  ): Promise<Turno[]> {
    const token = Cookies.get("access_token");
    if (!token) throw new Error("No authentication token found");
  
    try {
      const response = await api.get(`/usuarios/turnos/get-all?medicoEmail=${medicoEmail}`, {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });
      
      return response.data;
    } catch (error) {
      console.error("Error fetching medico turnos:", error);
      throw error;
    }
  },

  async asignarRemoverTurno(email: string, horario: string): Promise<void> {
    const token = Cookies.get("access_token");
    if (!token) throw new Error("No authentication token found");
  
    try {
      await api.put(`/usuarios/medicos/asignar-remover-turno?email=${email}&horario=${horario}`, {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Error updating turno:", error);
      throw error;
    }
  }
};