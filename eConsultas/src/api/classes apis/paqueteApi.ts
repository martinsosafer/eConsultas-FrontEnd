import { toast } from 'sonner';
import { api } from '../axios';
import { Paquete } from '../models/paqueteModels';
import Cookies from 'js-cookie';
import { extractErrorMessage } from '../errorHandler';

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
      console.log(serviciosIds);
      const token = Cookies.get("access_token");
      const response = await api.get("/consultas/paquetes", {
        headers: {
          'Accept': '*/*',
          'Authorization': `Bearer ${token}`
        },
        params: {
          serviceIds: serviciosIds.join(',')
        }
      });
      return response.data;
    } catch (error) {
      const message = extractErrorMessage(error);
      toast.error(message);
      throw error;
    }
  }
};
