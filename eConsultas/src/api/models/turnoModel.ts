export interface Turno {
    id: number;
    horario: string;
    enabled: boolean;
  }
  export interface CreateTurno {
    horario: string;
    enabled?: boolean;
  }

  export interface UpdateTurno {
    enabled?: boolean;
    horario?: string;
  }