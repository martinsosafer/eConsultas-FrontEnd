import Cookies from "js-cookie";
import { api } from "../axios";
import {
  CreatePersona,
  Medico,
  Paciente,
  Persona,
  Rol,
} from "../models/personaModels";

export const personaDashboardApi = {
  async getAllPersonas(): Promise<(Medico | Paciente)[]> {
    try {
      const token = Cookies.get("access_token");
      const response = await api.get("/usuarios/usuarios", {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`
        },
      });

      return response.data.map((persona: Persona) => {
        if (persona.credenciales.tipoPersona === "MEDICO") {
          return persona as Medico;
        }
        return persona as Paciente;
      });
    } catch (error) {
      console.error("Error fetching all personas:", error);
      throw error;
    }
  },

  async getAllPersonasByTipo(tipo: string): Promise<(Medico | Paciente)[]> {
    try {
      const token = Cookies.get("access_token");
      const response = await api.get(`usuarios/persona/get-all/${tipo}`, {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`
        },
      });

      return response.data.map((persona: Persona) => {
        if (persona.credenciales.tipoPersona === "MEDICO") {
          return persona as Medico;
        }
        return persona as Paciente;
      });
    } catch (error) {
      console.error("Error fetching all personas by tipo:", error);
      throw error;
    }
  },
  async updatePersonaStatus(id: string, enabled: boolean): Promise<void> {
    try {
      await api.patch(`/usuarios/usuarios/${id}/estado`, { enabled });
    } catch (error) {
      console.error("Error updating persona status:", error);
      throw error;
    }
  },

  async disableOrEnableUser(param: string): Promise<void> {
    const token = Cookies.get("access_token");
    if (!token) throw new Error("No authentication token found");

    try {
      await api.put(
        `/usuarios/usuarios/deshabilitar-habilitar/${(param)}`,
        null,
        {
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error updating user status:", error);
      throw error;
    }
  },

  async createPersona(personaData: CreatePersona): Promise<Medico | Paciente> {
    const token = Cookies.get("access_token");
    if (!token) throw new Error("No authentication token found");

    try {
      // console.log("BODY", personaData);
      const response = await api.post("/usuarios/persona", personaData, {
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating persona:", error);
      throw error;
    }
  },
  async getAllRoles(): Promise<Rol[]> {
    const token = Cookies.get("access_token");
    if (!token) throw new Error("No authentication token found");

    try {
      const response = await api.get<Rol[]>("/usuarios/roles", {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.map((role) => ({
        ...role,
        nombre: formatRoleName(role.nombre),
      }));
    } catch (error) {
      console.error("Error fetching roles:", error);
      throw error;
    }
  },

  async modifyRol(email: string, roles: number[]): Promise<void> {
    const token = Cookies.get("access_token");
    if (!token) throw new Error("No authentication token found");

    try {
      await api.put(
        `/usuarios/usuarios/modificar-roles/${email}`,
        roles,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error modifying role:", error);
      throw error;
    }
  },
};


function formatRoleName(roleName: string): string {
  switch (roleName) {
    case "ROLE_ADMIN":
      return "Admin";
    case "ROLE_SUPER_ADMIN":
      return "Super Admin";
    case "ROLE_USER":
      return "Usuario";
    default:
      return roleName;
  }
}