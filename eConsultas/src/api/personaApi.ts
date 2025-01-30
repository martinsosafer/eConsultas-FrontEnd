// personaApi.ts
import { api } from './axios';
import Cookies from 'js-cookie';
import { Medico, Paciente, Persona } from './models/models';

export const personaApi = {
  async getPersona(): Promise<Medico | Paciente | null> {

    const token = Cookies.get('access_token');
    if (!token) {
      console.error('No access token available');
      return null;
    }


    const userDTOString = localStorage.getItem('UserDTO');
    if (!userDTOString) {
      console.error('UserDTO not found in localStorage');
      return null;
    }

    try {
      const userDTO = JSON.parse(userDTOString);
      const email = userDTO.correo;

      const response = await api.get(`/usuarios/persona/${email}`, {
        headers: {
          'Accept': '*/*',

        }
      });

      // Médico
      const isMedico = (data: Persona): data is Medico => 
        (data as Medico).tipoPersona === 'MEDICO';

      // Paciente
      const isPaciente = (data: Persona): data is Paciente => 
        (data as Paciente).tipoPersona === 'PACIENTE';

      const personaData = response.data;

      if (isMedico(personaData)) {
        localStorage.setItem('personaData', JSON.stringify(personaData));
        return personaData as Medico;
      }

      if (isPaciente(personaData)) {
        localStorage.setItem('personaData', JSON.stringify(personaData));
        return personaData as Paciente;
      }

      throw new Error('Unknown persona type');
      
    } catch (error) {
      console.error('Error fetching persona data:', error);
      throw error;
    }
  }
};