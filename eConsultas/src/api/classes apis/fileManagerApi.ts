import { api } from "../axios";
import Cookies from "js-cookie";

export interface FilePathModel {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

export const fileManagerApi = {
  async getFileByFileId(fileId: string): Promise<Blob> {
    const token = Cookies.get("access_token");
    if (!token) throw new Error("No authentication token found");

    try {
      const response = await api.get(`/files/files/${fileId}`, {
        responseType: 'blob',
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching file by ID:", error);
      throw error;
    }
  },

  async getFileByUserAndFileTipo(
    userIdentifier: string,
    tipo: string
  ): Promise<Blob> {
    const token = Cookies.get("access_token");
    if (!token) throw new Error("No authentication token found");

    try {
      const response = await api.get(`/files/files/${userIdentifier}/${tipo}`, {
        responseType: 'blob',
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching file by user and tipo:", error);
      throw error;
    }
  },

  async getAllFilesPathsOfUser(
    userIdentifier: string
  ): Promise<FilePathModel[]> {
    const token = Cookies.get("access_token");
    if (!token) throw new Error("No authentication token found");

    try {
        // console.log(userIdentifier)
      const response = await api.get(`/files/files/${userIdentifier}/files-paths`, {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching files paths:", error);
      throw error;
    }
  },

  async getAllFilesPathOfUserAndTipo(
    userIdentifier: string,
    tipo: string
  ): Promise<FilePathModel[]> {
    const token = Cookies.get("access_token");
    if (!token) throw new Error("No authentication token found");

    try {
      const response = await api.get(`/files/files/${userIdentifier}/files-paths`, {
        params: { tipo },
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching files paths by tipo:", error);
      throw error;
    }
  },

  async getTipoDeArchivos(): Promise<string[]> {
    const token = Cookies.get("access_token");
    if (!token) throw new Error("No authentication token found");

    try {
      const response = await api.get(`/files/files/tipos`, {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching tipos de archivos:", error);
      throw error;
    }
  },

  async uploadOrUpdateFileOfUser(
    userIdentifier: string,
    tipo: string,
    file: File
  ): Promise<void> {
    const token = Cookies.get("access_token");
    if (!token) throw new Error("No authentication token found");

    const formData = new FormData();
    formData.append("file", file);

    try {
      await api.post(`/files/files?idUsuario=${userIdentifier}&tipo=${tipo}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  },

  async uploadOrUpdateFileOfUserAndConnectWithConsulta(
    userIdentifier: string,
    tipo: string,
    idConsulta: string,
    file: File
  ): Promise<void> {
    const token = Cookies.get("access_token");
    if (!token) throw new Error("No authentication token found");

    const formData = new FormData();
    formData.append("file", file);

    try {
      await api.post(
        `/files/files?idUsuario=${userIdentifier}&tipo=${tipo}&idConsulta=${idConsulta}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error uploading file with consulta:", error);
      throw error;
    }
  },
};