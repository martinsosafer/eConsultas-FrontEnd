export interface TipoServicio {
  id: number;
  nombre: string;
}

export interface Servicio {
  id: number;
  descripcion: string;
  precio: number;
  tipoServicio: TipoServicio;
  enabled: boolean;
}

export interface CreateServicio {
  descripcion: string;
  precio: number;
  tipoServicio: {
    id: number;
  };
  enabled?: boolean;
}