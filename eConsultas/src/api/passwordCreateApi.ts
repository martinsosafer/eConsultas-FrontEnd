import { urlApi } from "./constant";

export const updatePassword = async (email: string, password: string, code: string) => {
    const myHeaders = new Headers();
    myHeaders.append("Accept", "*/*");
    myHeaders.append("Authorization", "");
    
    // formato YYYY-MM-DD HH:MM:SS
    const fechaFormateada = new Date().toISOString()
      .replace('T', ' ')          // Reemplazamos T por espacio
      .split('.')[0];             // Elimina milisegundos

    const requestOptions: RequestInit = {
      method: "PUT",
      headers: myHeaders,
      redirect: "follow" as RequestRedirect, 
    };
  
   
  
    try {
      console.log("Preparando solicitud...");
      console.log("URL estructurada:", `${urlApi}/usuarios/agregar-password/${email}?password=${password}&codigo=${code}&fecha=${fechaFormateada}`);
      console.log("URL codificada:", urlApi);

      const response = await fetch(urlApi, requestOptions);
      
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorData}`);
      }
  
      const result = await response.text();
      console.log("Actualización exitosa:", result);
      return result;
    } catch (error) {
      console.error("Error en updatePassword:", error instanceof Error ? error.message : "Error desconocido");
      throw error;
    }
};