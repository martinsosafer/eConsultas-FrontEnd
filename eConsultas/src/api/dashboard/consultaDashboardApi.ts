import { api } from "../axios";
import {
  Consulta,
  ConsultaDTO,
  CreateConsulta,
} from "../models/consultaModels";
import Cookies from "js-cookie";

export const consultaDashboardApi = {
  async getAllConsultas(): Promise<ConsultaDTO[]> {
   {
    const token = Cookies.get("access_token");
    if (!token) throw new Error("No authentication token found");

    try {
      const response = await api.get("/consultas/consultas/get-all", {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching consultas:", error);
      throw error;
    }
  }},

  async updateConsulta(id: number, data: Partial<Consulta>): Promise<Consulta> {
    const token = Cookies.get("access_token");
    if (!token) throw new Error("No authentication token found");

    try {
      const response = await api.put(`/consultas/consultas/${id}`, data, {
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error updating consulta:", error);
      throw error;
    }
  },

  async deleteConsulta(id: number): Promise<void> {
    const token = Cookies.get("access_token");
    if (!token) throw new Error("No authentication token found");

    try {
      await api.delete(`/consultas/consultas/${id}`, {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Error deleting consulta:", error);
      throw error;
    }
  },

  async createConsulta(consultaData: CreateConsulta): Promise<Consulta> {
    const token = Cookies.get("access_token");
    if (!token) throw new Error("No authentication token found");

    try {
      const response = await api.post("/consultas/consultas", consultaData, {
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating consulta:", error);
      throw error;
    }
  },
};
