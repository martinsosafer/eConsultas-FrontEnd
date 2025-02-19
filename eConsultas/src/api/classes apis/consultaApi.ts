import { api } from "../axios";
import { Consulta, CreateConsulta } from "../models/consultaModels";
import Cookies from "js-cookie";

export const consultaApi = {
  async getConsultaByConsultaId(id: number): Promise<Consulta> {
    const token = Cookies.get("access_token");
    if (!token) throw new Error("No authentication token found");

    try {
      const response = await api.get(`/consultas/consultas/${id}`, {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching consulta:", error);
      throw error;
    }
  },

  async createConsulta(consultaData: CreateConsulta): Promise<Consulta> {
    const token = Cookies.get("access_token");
    if (!token) throw new Error("No authentication token found");

    try {
      const response = await api.post("/consultas/consultas", consultaData, {
        // Add /consultas
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating a consulta:", error);
      throw error;
    }
  },
};
