// personaApi.ts
import { api } from "../axios";
import Cookies from "js-cookie";
import { Medico, Paciente, Persona } from "../models/personaModels";
import { urlApi } from "../constant";

//Recuerden que acá estan todas las funciones crud de persona
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

  async updatePersona(
    email: string,
    data: Partial<Persona>
  ): Promise<Medico | Paciente> {
    const token = Cookies.get("access_token");
    if (!token) throw new Error("No authentication token found");

    try {
      const response = await api.put<Medico | Paciente>(
        `/usuarios/persona/${email}`,
        data,
        {
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
          },
        }
      );

      localStorage.setItem("personaData", JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error("Error updating persona:", error);
      throw error;
    }
  },

  async getPersonaByUsername(username: string): Promise<Medico | Paciente> {
    const token = Cookies.get("access_token");
    if (!token) throw new Error("No authentication token found");

    try {
      const response = await api.get(`/usuarios/persona/${username}`, {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });

      const isMedico = (data: Persona): data is Medico =>
        (data as Medico).tipoPersona === "MEDICO";

      const isPaciente = (data: Persona): data is Paciente =>
        (data as Paciente).tipoPersona === "PACIENTE";

      if (isMedico(response.data)) {
        return response.data as Medico;
      }

      if (isPaciente(response.data)) {
        return response.data as Paciente;
      }

      throw new Error("Tipo de persona no reconocido");
    } catch (error) {
      console.error("Error fetching by username:", error);
      throw new Error("No se pudo obtener el perfil");
    }
  },
  async deletePersona(email: string) {
    const token = Cookies.get("access_token");
    if (!token) throw new Error("No authentication token found");

    try {
      const response = await api.delete(`/usuarios/persona/${email}`, {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error deleting:", error);
      throw error;
    }
  },
  async uploadProfilePicture(payload: {
    file: File;
    identifier: string;
    tipo: string;
  }): Promise<void> {
    const token = Cookies.get("access_token");
    if (!token) throw new Error("No authentication token found");

    const formData = new FormData();
    formData.append("file", payload.file);

    const response = await fetch(
      `${urlApi}/files/files?idUsuario=${payload.identifier}&tipo=${payload.tipo}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Error subiendo archivo");
    }
  },

  async fetchProfilePicture(email: string): Promise<Blob> {
    const token = Cookies.get("access_token");
    if (!token) throw new Error("No authentication token found");

    try {
      const response = await fetch(
        `${urlApi}/files/files/${email}/PROFILE_PICTURE`,
        {
          method: "GET",
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
          redirect: "follow",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch profile picture: ${response.statusText}`
        );
      }

      // Vamos a trabajar con Blob
      return await response.blob();
    } catch (error) {
      console.error("Error fetching profile picture:", error);
      throw error;
    }
  },
  async getAllPersonas(
    tipoPersona: "MEDICO" | "PACIENTE",
    filters?: Record<string, string>
  ): Promise<(Medico | Paciente)[]> {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(
        `/usuarios/persona/get-all/${tipoPersona}?${params}`,
        {
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${Cookies.get("access_token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching personas:", error);
      throw error;
    }
  },
};
