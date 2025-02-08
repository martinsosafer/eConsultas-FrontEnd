import { api } from '../axios';
import { Consulta } from '../models/consultaModels';
import Cookies from 'js-cookie';

export const consultaApi = {
  async getConsultaByConsultaId(id: number): Promise<Consulta> {
    const token = Cookies.get('access_token');
    if (!token) throw new Error('No authentication token found');

    try {
      const response = await api.get(`/consultas/consultas/${id}`, {
        headers: {
          Accept: '*/*',
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching consulta:', error);
      throw error;
    }
  },

  async getConsultasByEmail(email: string): Promise<Consulta[]> {
    const token = Cookies.get('access_token');
    if (!token) throw new Error('No authentication token found');

    try {
      const response = await api.get(`/consultas/consultas/persona-consultas/${email}`, {
        headers: {
          Accept: '*/*',
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching consultas by email:', error);
      throw error;
    }
  }
};
