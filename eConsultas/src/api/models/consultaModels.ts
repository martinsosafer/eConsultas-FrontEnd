import { ServicioContratado } from "./paqueteModels";
import { Medico, Paciente } from "./personaModels";

export interface Consulta {
    id: number;
    fecha: string;
    horario: string;
    medico: Medico;
    paciente: Paciente;
    idServicioMedico: number | null;
    idPaquete: number;
    total: number;
    pagado: boolean;
    serviciosContratados: ServicioContratado[];
  }