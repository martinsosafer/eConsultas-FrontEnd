import { api } from "../axios";
import { Servicio } from "../models/servicioModels";

export const servicioDashboardApi = {
  async getAllServicios(): Promise<Servicio[]> {
    try {
      const response = await api.get("/consultas/servicios/get-all", {
        headers: {
          Accept: "*/*",
        },
      });

      return response.data.map((servicio: Servicio) => {
        return servicio as Servicio;
      });
    } catch (error) {
      console.error("Error fetching all servicios:", error);
      throw error;
    }
  },
};
