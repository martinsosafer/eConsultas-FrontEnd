// personaDashboardApi.ts
import { api } from '../axios';
import { Medico, Paciente, Persona } from '../models/models';

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

  async updatePersonaStatus(id: string, enabled: boolean): Promise<void> {
    try {
      await api.patch(`/usuarios/usuarios/${id}/estado`, { enabled });
    } catch (error) {
      console.error('Error updating persona status:', error);
      throw error;
    }
  }
};