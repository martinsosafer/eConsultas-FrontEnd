import { api } from '../axios';
import { Paquete } from '../models/paqueteModels';
import Cookies from 'js-cookie';

export const paqueteDashboardApi = {
  async getAllPaquetes(): Promise<Paquete[]> {
    try {
      const response = await api.get("/consultas/paquetes/get-all", {
        headers: {
          'Accept': '*/*',
          'Authorization': `Bearer ${Cookies.get('access_token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching all paquetes:', error);
      throw error;
    }
  },

  async createPaquete(serviciosIds: number[]): Promise<Paquete> {
    try {
      const response = await api.post("/consultas/paquetes", serviciosIds, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*',
          'Authorization': `Bearer ${Cookies.get('access_token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating paquete:', error);
      throw error;
    }
  },

  async editPaquete(id: number, paqueteData: Partial<Paquete>): Promise<Paquete> {
    try {
      const response = await api.put(`/consultas/paquetes/${id}`, paqueteData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*',
          'Authorization': `Bearer ${Cookies.get('access_token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating paquete:', error);
      throw error;
    }
  },

  async deletePaquete(id: number): Promise<void> {
    try {
      await api.delete(`/consultas/paquetes/${id}`, {
        headers: {
          'Accept': '*/*',
          'Authorization': `Bearer ${Cookies.get('access_token')}`
        }
      });
    } catch (error) {
      console.error('Error deleting paquete:', error);
      throw error;
    }
  }
};
