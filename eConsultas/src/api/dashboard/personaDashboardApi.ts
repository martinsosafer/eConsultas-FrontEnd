import Cookies from 'js-cookie';
import { api } from '../axios';
import { CreatePersona, Medico, Paciente, Persona } from '../models/personaModels';

export const personaDashboardApi = {
  async getAllPersonas(): Promise<(Medico | Paciente)[]> {
    try {
      const response = await api.get("/usuarios/usuarios", {
        headers: {
          'Accept': '*/*'
        }
      });

      return response.data.map((persona: Persona) => {
        if (persona.credenciales.tipoPersona === "MEDICO") {
          return persona as Medico;
        }
        return persona as Paciente;
      });
      
    } catch (error) {
      console.error('Error fetching all personas:', error);
      throw error;
    }
  },

  async getAllPersonasByTipo(tipo: string): Promise<(Medico | Paciente)[]> {
    try {
      const response = await api.get(`/persona/get-all/${tipo}`, {
        headers: {
          'Accept': '*/*'
        }
      });

      return response.data.map((persona: Persona) => {
        if (persona.credenciales.tipoPersona === "MEDICO") {
          return persona as Medico;
        }
        return persona as Paciente;
      });
      
    } catch (error) {
      console.error('Error fetching all personas by tipo:', error);
      throw error;
    }
  },
  async updatePersonaStatus(id: string, enabled: boolean): Promise<void> {
    try {
      await api.patch(`/usuarios/usuarios/${id}/estado`, { enabled });
    } catch (error) {
      console.error('Error updating persona status:', error);
      throw error;
    }
  },

  async disableOrEnableUser(celular: string): Promise<void> {
    const token = Cookies.get("access_token");
    if (!token) throw new Error("No authentication token found");

    try {
      await api.put(`/usuarios/deshabilitar-habilitar/${encodeURIComponent(celular)}`, null, {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  },

  async createPersona(personaData: CreatePersona): Promise<Medico | Paciente> {
    const token = Cookies.get("access_token");
    if (!token) throw new Error("No authentication token found");

    try {
      const response = await api.post("/usuarios/persona", personaData, {
        headers: {
          'Content-Type': 'application/json',
          Accept: '*/*',
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating persona:', error);
      throw error;
    }
  }
};
