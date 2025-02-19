import { api } from "../axios";

//Explicación de este código: Por lógica, cuando trabajamos con la API solemos verificar el token
//pero, en este caso, no hace falta debido a que esta request está hecha sin autorización pensando en el
//mero hecho de que NOSOTROS somos quienes estamos sin token y buscamos recuperar nuestra contraseña!

//English explanation of this code: By logic, when we work with the API we usually verify the token
//but, in this case, it is not necessary because this request is made without authorization with the
//mere fact that WE are the ones without a token and looking to recover our password!
export const sendPasswordRecoveryEmail = async (email: string, expirationDate: string): Promise<void> => {
  try {
    await api.post(
      "/verificacion/verificacion/codigo-de-verificacion",
      {
        to: email,
        fecha: expirationDate,
        template: "CORREO_RECUPERACION_PASSWORD"
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*"
        }
      }
    );
  } catch (error) {
    console.error("Error sending recovery email:", error);
    throw error;
  }
}

export const sendFileToUserEmail = async (
    email: string,
    expirationDate: string,
    pdfFile: File
  ): Promise<void> => {
    try {
      const formData = new FormData();
      formData.append("to", email);
      formData.append("fecha", expirationDate);
      formData.append("template", "ENVIO_DE_ARCHIVO");
      formData.append("file", pdfFile);

      await api.post("/verificacion/verificacion/codigo-de-verificacion", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "*/*"
        }
      });
    } catch (error) {
      console.error("Error sending file email:", error);
      throw error;
    }
  };
