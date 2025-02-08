import { api } from '../axios';
import { Servicio } from '../models/servicioModels';
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
      const response = await api.get(`/consultas/servicios/get-all/${encodeURIComponent(tipoNombre)}`, {
        headers: {
          'Accept': '*/*',
          'Authorization': `Bearer ${Cookies.get('access_token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching servicios by type:', error);
      throw error;
    }
  }
};
