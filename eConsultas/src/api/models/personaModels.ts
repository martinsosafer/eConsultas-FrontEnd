import { Turno } from "./turnoModels";


// Modelo base de Persona
export interface Persona {
    id: string; 
    pais: string | null;
    ciudad: string | null;
    direccion: string | null;
    numeroExterior: string | null;
    codigoPostal: string | null;
    credenciales: Credenciales;
    verificado: boolean;
    archivos: Archivo[];
    dni: string;
    nombre: string;
    apellido: string;
    fechaNacimiento: string;
  }
  
  // Modelo de Médico que extiende Persona
  export interface Medico extends Persona {
    tipoPersona: "MEDICO";
    sueldo: number;
    especialidad: string;
    turnos: Turno[];  
    consultas?: any[]; 
  }
  
  // Modelo de Paciente que extiende Persona
  export interface Paciente extends Persona {
    tipoPersona: "PACIENTE";
    obraSocial: boolean;
  }
  
  // Interfaces auxiliares
  export interface Credenciales {
    id: string;
    persona: Persona | null;
    tipoPersona: string | null;
    email: string; //
    username: string; //
    password: string;
    codigoDeLlamada: string; //
    celular: string; //
    roles: Rol[];
    enabled: boolean;
    intentos: number;
    nivelDeVerificacion: string;
    emailVerificado: boolean;
    celularVerificado: boolean;
    verificacion2Factores: boolean;
    nombre: string | null;
    apellido: string | null;
  }
  
  export interface Rol {
    id: number;
    nombre: string;
  }
  
  export interface Archivo {
    id: string;
    nombre: string;
    // Por ahora tienen estas propiedades los archivos
  }
  
  export interface CreatePersona {
    tipoPersona: "MEDICO" | "PACIENTE";
    dni: string;
    nombre: string;
    apellido: string;
    fechaNacimiento: string;
    credenciales: {
      email: string;
      codigoDeLlamada: string;
      celular: string;
      roles: Array<{ id: number }>;
      fechaDeSolicitudDeCodigoDeVerificacion?: string;
    };
    obraSocial?: boolean;
    sueldo?: number;
    especialidad?: string;
  }
