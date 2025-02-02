// personaApi.ts
import { api } from "./axios";
import Cookies from "js-cookie";
import { Medico, Paciente, Persona } from "./models/models";

export const personaApi = {
  async getPersona(): Promise<Medico | Paciente | null> {
    const token = Cookies.get("access_token");
    if (!token) {
      console.error("No access token available");
      return null;
    }

    const userDTOString = localStorage.getItem("UserDTO");
    if (!userDTOString) {
      console.error("UserDTO not found in localStorage");
      return null;
    }

    try {
      const userDTO = JSON.parse(userDTOString);
      const username = userDTO.username;

      const response = await api.get(`/usuarios/persona/${username}`, {
        headers: {
          Accept: "*/*",
        },
      });

      // Médico
      const isMedico = (data: Persona): data is Medico =>
        (data as Medico).tipoPersona === "MEDICO";

      // Paciente
      const isPaciente = (data: Persona): data is Paciente =>
        (data as Paciente).tipoPersona === "PACIENTE";

      const personaData = response.data;

      if (isMedico(personaData)) {
        localStorage.setItem("personaData", JSON.stringify(personaData));
        return personaData as Medico;
      }

      if (isPaciente(personaData)) {
        localStorage.setItem("personaData", JSON.stringify(personaData));
        return personaData as Paciente;
      }

      throw new Error("Unknown persona type");
    } catch (error) {
      console.error("Error fetching persona data:", error);
      throw error;
    }
  },

  async updatePersona(email: string, data: Partial<Persona>): Promise<Persona> {
    const token = Cookies.get("access_token");
    if (!token) throw new Error("No authentication token found");

    try {
      const response = await api.put(`/usuarios/persona/${email}`, data, {
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
      });

      localStorage.setItem("personaData", JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error("Error updating persona:", error);
      throw error;
    }
  },
};
