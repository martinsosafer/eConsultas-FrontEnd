
export const extractErrorMessage = (error: any): string => {

    let errorMessage = "Ocurrió un error inesperado.";
    if (error.response) {
      try {
        const errorData = error.response.data;
        if (typeof errorData === 'string') {
          const parsedError = JSON.parse(errorData);
          errorMessage = parsedError.message || errorMessage;
        } 

        else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (parseError) {
        console.error("Error parsing error response:", parseError);
      }
    }

    else if (error.message) {
      errorMessage = error.message;
    }

    else if (typeof error === 'string') {
      errorMessage = error;
    }
  
    return errorMessage;
  };