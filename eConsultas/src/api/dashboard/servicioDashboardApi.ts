import { api } from "../axios";
import { CreateServicio, Servicio } from "../models/servicioModels";
import Cookies from "js-cookie";

export const servicioDashboardApi = {
  async getAllServicios(): Promise<Servicio[]> {
    try {
      const response = await api.get("/consultas/servicios/get-all", {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${Cookies.get("access_token")}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching all servicios:", error);
      throw error;
    }
  },

  async createServicio(servicioData: CreateServicio): Promise<Servicio> {
    try {
      const response = await api.post("/consultas/servicios", servicioData, {
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          Authorization: `Bearer ${Cookies.get("access_token")}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating servicio:", error);
      throw error;
    }
  },

  async editServicio(
    id: number,
    servicioData: Partial<Servicio>
  ): Promise<Servicio> {
    try {
      const response = await api.put(
        `/consultas/servicios/${id}`,
        servicioData,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            Authorization: `Bearer ${Cookies.get("access_token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating servicio:", error);
      throw error;
    }
  },

  async deleteServicio(id: number): Promise<void> {
    try {
      await api.delete(`/consultas/servicios/${id}`, {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${Cookies.get("access_token")}`,
        },
      });
    } catch (error) {
      console.error("Error deleting servicio:", error);
      throw error;
    }
  },
};
