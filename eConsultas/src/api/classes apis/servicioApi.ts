import { api } from '../axios';
import { Servicio, TipoServicio } from '../models/servicioModels';
import Cookies from 'js-cookie';

export const servicioApi = {
  async getServicioMedicoById(id: number): Promise<Servicio> {
    try {
      const response = await api.get(`/consultas/servicios/${id}`, {
        headers: {
          'Accept': '*/*',
          'Authorization': `Bearer ${Cookies.get('access_token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching servicio:', error);
      throw error;
    }
  },

  async getAllByTipo(tipoNombre: string): Promise<Servicio[]> {
    try {
      const response = await api.get(
        `/consultas/servicios/get-all/${encodeURIComponent(tipoNombre)}`, 
        {
          headers: {
            'Accept': '*/*',
            'Authorization': `Bearer ${Cookies.get('access_token')}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching services by type:', error);
      throw error;
    }
  },
  
  async getAllTiposServicio(): Promise<TipoServicio[]> {
    try {
      const response = await api.get("/consultas/tipos-de-servicios/get-all", {
        headers: {
          'Accept': '*/*',
          'Authorization': `Bearer ${Cookies.get('access_token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching service types:', error);
      throw error;
    }
  },

};
