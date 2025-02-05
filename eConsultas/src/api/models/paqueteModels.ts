import { Servicio } from "./servicioModels";


export interface Paquete {
    id: number;
    servicios: Servicio[];
    precio: number;
    enabled: boolean;
  }


export interface ServicioContratado {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
  }