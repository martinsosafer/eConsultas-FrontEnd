import { ServicioContratado } from "./paqueteModels";
import { Medico, Paciente } from "./personaModels";

export interface Consulta {
    id: number;
    fecha: string;
    horario: string;
    medico: Medico;
    paciente: Paciente;
    idServicioMedico: number | null;  // Presente cuando es servicio individual
    idPaquete: number | null;         // Presente cuando es paquete
    total: number;
    pagado: boolean;
    serviciosContratados?: ServicioContratado[]; // Solo existe cuando es paquete recordemos
  }