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

  export interface ConsultaDTO {
    id: number;
    fecha: string;
    horario: string;
    medico: MedicoDTO;
    paciente: PacienteDTO;
    idServicioMedico?: number | null;
    idPaquete?: number | null;
    total: number;
    pagado: boolean;
    serviciosContratados?: ServicioContratadoDTO[];
  }
  
  export interface CreateConsulta {
    fecha: string;
    horario: string;
    medico: { credenciales: { email: string } };
    paciente: { credenciales: { email: string } };
    idServicioMedico?: number;
    idPaquete?: number;
  }
  
  interface MedicoDTO {
    nombre: string;
    apellido: string;
    credenciales: CredencialesMedicoDTO;
    sueldo: number;
  }
  
  interface PacienteDTO {
    nombre: string;
    apellido: string;
    credenciales: CredencialesPacienteDTO;
  }
  
  interface CredencialesMedicoDTO {
    email: string;
  }
  
  interface CredencialesPacienteDTO {
    email: string;
  }
  
  interface ServicioContratadoDTO {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
  }