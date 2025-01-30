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
  }
  
  // Modelo de Paciente que extiende Persona
  export interface Paciente extends Persona {
    tipoPersona: "PACIENTE";
    obraSocial: string;
  }
  
  // Interfaces auxiliares
  export interface Credenciales {
    id: string;
    persona: Persona | null;
    tipoPersona: string | null;
    email: string;
    username: string;
    password: string;
    codigoDeLlamada: string;
    celular: string;
    roles: Rol[];
    enabled: boolean;
    intentos: number;
    codigoDeVerificacion: string | null;
    vencimientoDeCodigoDeVerificacion: string | null;
    fechaDeSolicitudDeCodigoDeVerificacion: string | null;
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
  
  // Ejemplo de uso:
  const usuarioPersona: Persona = {
    id: "dffade8b-1205-44e6-88c8-65002b458eb0",
    pais: null,
    ciudad: null,
    direccion: null,
    numeroExterior: null,
    codigoPostal: null,
    credenciales: {
      id: "54d45cf4-7a40-44be-8d85-d1dd94fa3b06",
      persona: null,
      tipoPersona: null,
      email: "pepito.com",
      username: "pepito.com",
      password: "$2a$10$QS0D2TZaYVQIrSzm9uDS2.i6rkWm4Gu6wAXhKn6C6mAMCzl8BWUC2", //Está encriptada :p
      codigoDeLlamada: "+52",
      celular: "8781112343",
      roles: [{ id: 1, nombre: "ROLE_ADMIN" }],
      enabled: true,
      intentos: 0,
      codigoDeVerificacion: null,
      vencimientoDeCodigoDeVerificacion: null,
      fechaDeSolicitudDeCodigoDeVerificacion: null,
      nivelDeVerificacion: "BASICO",
      emailVerificado: true,
      celularVerificado: false,
      verificacion2Factores: false,
      nombre: null,
      apellido: null
    },
    verificado: false,
    archivos: [],
    dni: "123456",
    nombre: "irving",
    apellido: "meza",
    fechaNacimiento: "01/01/1973"
  };
  
  const medicoEjemplo: Medico = {
    ...usuarioPersona,
    tipoPersona: "MEDICO",
    sueldo: 100.0,
    especialidad: "cardiologia"
  };
  
  const pacienteEjemplo: Paciente = {
    ...usuarioPersona,
    tipoPersona: "PACIENTE",
    obraSocial: "Nombre de la obra social"
  };