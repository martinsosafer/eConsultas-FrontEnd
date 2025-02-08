import { api } from '../axios';
import { Paquete } from '../models/paqueteModels';
import Cookies from 'js-cookie';

export const paqueteApi = {
  async getPaqueteById(id: number): Promise<Paquete> {
    try {
      const response = await api.get(`/consultas/paquetes/${id}`, {
        headers: {
          'Accept': '*/*',
          'Authorization': `Bearer ${Cookies.get('access_token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching paquete:', error);
      throw error;
    }
  },

  async searchByMultipleServiciosIds(serviciosIds: number[]): Promise<Paquete[]> {
    try {
      const response = await api.get("/consultas/paquetes", {
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*',
          'Authorization': `Bearer ${Cookies.get('access_token')}`
        },
        data: serviciosIds // Nota: GET con body no es estándar, podría necesitar POST
      });
      return response.data;
    } catch (error) {
      console.error('Error searching paquetes:', error);
      throw error;
    }
  }
};