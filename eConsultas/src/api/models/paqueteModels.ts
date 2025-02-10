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

// Para crear el paquete solamente hay que pasarle un array de Ids de servicios y se crea y pone precio automáticamente mediante el back!
export type CreatePaquete = number[];