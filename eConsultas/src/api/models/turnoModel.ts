export interface Turno {
  id: number;
  horario: string;
  subHorario: string;
  enabled: boolean;
}

export interface CreateTurno {
  horario: string;
  subHorario: string;
  enabled?: boolean;
}

export interface UpdateTurno {
  horario?: string;
  subHorario?: string;
  enabled?: boolean;
}