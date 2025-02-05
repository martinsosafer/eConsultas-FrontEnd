import { api } from '../axios';
import { Paquete } from '../models/paqueteModels';
import { Servicio } from '../models/servicioModels';

export const paqueteDashboardApi = {
  async getAllPaquetes(): Promise<(Paquete)[]> {
    try {
      const response = await api.get("/paquetes/get-all", {
        headers: {
          'Accept': '*/*'
        }
      });

      return response.data.map((paquete: Paquete) => {
          return paquete as Paquete;        
      });
      
    } catch (error) {
      console.error('Error fetching all paquetes:', error);
      throw error;
    }
  },


};