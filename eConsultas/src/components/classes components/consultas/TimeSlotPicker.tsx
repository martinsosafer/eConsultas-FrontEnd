"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { es } from "date-fns/locale";
import { medicoApi } from "@/api/classes apis/medicoApi";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimeSlotPickerProps {
  medicoEmail: string;
  onTimeSelect: (fullTime: string) => void;
  selectedDate?: Date;
  onDateSelect: (date?: Date) => void;
}

interface DisponibilidadHorario {
  horario: string;
  disponible: boolean;
  subHorarios?: SubDisponibilidad[];
}

interface SubDisponibilidad {
  subHorario: string;
  disponible: boolean;
}

export const TimeSlotPicker = ({
  medicoEmail,
  onTimeSelect,
  selectedDate,
  onDateSelect,
}: TimeSlotPickerProps) => {
  const [loadingHorarios, setLoadingHorarios] = useState(false);
  const [loadingSubHorarios, setLoadingSubHorarios] = useState(false);
  const [disponibilidad, setDisponibilidad] = useState<DisponibilidadHorario[]>([]);
  const [selectedHorario, setSelectedHorario] = useState<string>("");

  const filterDisponibilidadByDate = (data: any[], date: Date): DisponibilidadHorario[] => {
    const dateString = date.toISOString().split('T')[0];
    return data
      .filter(([fecha]) => fecha === dateString)
      .map(([_, horario, disponible]) => ({
        horario,
        disponible: disponible === 1,
      }));
  };

  useEffect(() => {
    const loadDisponibilidad = async () => {
      if (!selectedDate) return;

      setLoadingHorarios(true);
      try {
        const data = await medicoApi.getDisponibilidadTurnosMedico(
          medicoEmail,
          selectedDate.toISOString().split('T')[0]
        );

        const filteredData = filterDisponibilidadByDate(data, selectedDate);
        setDisponibilidad(filteredData);
      } catch (error) {
        toast.error('Error cargando disponibilidad');
      } finally {
        setLoadingHorarios(false);
      }
    };

    loadDisponibilidad();
  }, [selectedDate, medicoEmail]);

  useEffect(() => {
    const loadSubHorarios = async () => {
      if (!selectedDate || !selectedHorario) return;

      setLoadingSubHorarios(true);
      try {
        const fecha = selectedDate.toISOString().split('T')[0];
        const data = await medicoApi.getDisponibilidadPorFechaHorario(
          medicoEmail,
          fecha,
          selectedHorario
        );

        setDisponibilidad(prev => prev.map(item => {
          if (item.horario === selectedHorario) {
            return {
              ...item,
              subHorarios: data.map(([_, sub, disponible]) => ({
                subHorario: sub,
                disponible: disponible === 1
              }))
            };
          }
          return item;
        }));
      } catch (error) {
        toast.error('Error cargando subhorarios');
      } finally {
        setLoadingSubHorarios(false);
      }
    };

    loadSubHorarios();
  }, [selectedHorario, selectedDate, medicoEmail]);

  const handleSelectSubHorario = (horario: string, subHorario: string) => {
    horario
    if (!selectedDate) return;
    const fecha = selectedDate.toISOString().split('T')[0];
    onTimeSelect(`${fecha} ${subHorario}`);
  };

  const sortHorarios = (a: DisponibilidadHorario, b: DisponibilidadHorario) => {
    const getHour = (horario: string) => parseInt(horario.split('-')[0]);
    return getHour(a.horario) - getHour(b.horario);
  };

  if (!selectedDate) {
    return (
      <div className="flex flex-col items-center p-6">
        <div className="flex items-center gap-2 mb-4">
          <CalendarIcon className="h-6 w-6 text-primary" />
          <h3 className="text-xl font-semibold">Seleccionar día</h3>
        </div>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateSelect}
          locale={es}
          disabled={{ before: new Date() }}
          fromMonth={new Date()}
          className="rounded-lg border p-2 shadow-sm w-[250px]"
        />
      </div>
    );
  }

  if (loadingHorarios) {
    return (
      <div className="flex gap-6 p-6">
        <div className="w-[250px]">
          <Skeleton className="h-8 w-full mb-2" />
          <Skeleton className="h-[280px] w-full rounded-lg" />
        </div>
        <div className="grid grid-cols-3 gap-4 flex-1 min-h-[400px]">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-14 w-full rounded-lg" />
              <div className="grid grid-cols-1 gap-2">
                {[...Array(4)].map((_, j) => (
                  <Skeleton key={j} className="h-12 rounded-md" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-6 p-6">
      <div className="w-[250px]">
        <div className="flex items-center gap-2 mb-4">
          <CalendarIcon className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Día seleccionado</h3>
        </div>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateSelect}
          locale={es}
          disabled={{ before: new Date() }}
          fromMonth={new Date()}
          className="rounded-lg border p-2 shadow-sm"
        />
        <Button
          variant="ghost"
          onClick={() => onDateSelect(undefined)}
          className="mt-4 w-full text-sm h-8"
        >
          Cambiar fecha
        </Button>
      </div>

      <div className="flex-1 flex flex-col">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span>Horarios disponibles</span>
          {loadingSubHorarios && (
            <span className="h-2 w-2 bg-primary rounded-full animate-ping" />
          )}
        </h3>

        <div className="grid grid-cols-3 gap-4 pr-4 pb-4 overflow-y-auto flex-1 min-h-[400px]">
          {[...disponibilidad]
            .sort(sortHorarios)
            .map((horario) => (
              <div key={horario.horario} className="space-y-2">
                <Button
                  variant={horario.disponible ? "default" : "destructive"}
                  className={cn(
                    "w-full font-bold h-14 text-base",
                    selectedHorario === horario.horario && "ring-2 ring-primary ring-offset-2",
                    horario.disponible && "bg-green-500 hover:bg-green-600 text-white"
                  )}
                  onClick={() => setSelectedHorario(
                    horario.disponible ? horario.horario : ""
                  )}
                  disabled={!horario.disponible || loadingSubHorarios}
                >
                  {horario.horario.split('-')[0]}
                  <span className="ml-2 text-sm">
                    {horario.disponible ? '✓' : '✕'}
                  </span>
                </Button>

                {selectedHorario === horario.horario && (
                  <div className="grid grid-cols-1 gap-2">
                    {horario.subHorarios?.map((sub) => (
                      <Button
                        key={sub.subHorario}
                        variant={sub.disponible ? "outline" : "ghost"}
                        className={cn(
                          "relative h-12 justify-start text-sm",
                          !sub.disponible && 'opacity-50 cursor-not-allowed',
                          sub.disponible && "hover:bg-green-50"
                        )}
                        onClick={() => handleSelectSubHorario(horario.horario, sub.subHorario)}
                        disabled={!sub.disponible}
                      >
                        <span className="mr-2">🕒</span>
                        {sub.subHorario}
                        <span className={`absolute top-2 right-2 w-2 h-2 rounded-full ${
                          sub.disponible ? 'bg-green-400' : 'bg-red-400'
                        }`} />
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};