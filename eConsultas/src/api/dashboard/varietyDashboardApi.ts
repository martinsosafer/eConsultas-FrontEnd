import { api } from "../axios";
import Cookies from "js-cookie";

export const varietyDashboardApi = {
  async getNumberOfTotalPacients(): Promise<number[]> {
    try {
      const response = await api.get("/pacientes/totao-pacientes", {
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
}