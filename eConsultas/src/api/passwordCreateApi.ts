import { urlApi } from "./constant";

export const updatePassword = async (email: string, password: string, code: string) => {
    const myHeaders = new Headers();
    myHeaders.append("Accept", "*/*");
    myHeaders.append("Authorization", "");
  
    const requestOptions: RequestInit = {
      method: "PUT",
      headers: myHeaders,
      redirect: "follow" as RequestRedirect, 
    };
  
    const url = urlApi + `/${email}?password=${password}&codigo=${code}`;
  
    try {
      console.log("Preparando solicitud...");
      console.log("URL:", url);
      console.log("Headers:", myHeaders);
  
      const response = await fetch(url, requestOptions);
      console.log("Respuesta recibida:", response);
  
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
      }
  
      const result = await response.text();
      console.log("Resultado de la API:", result);
      return result;
    } catch (error) {
      console.error("Error al actualizar la contraseña:", error);
      throw new Error("Error al actualizar la contraseña.");
    }
  };