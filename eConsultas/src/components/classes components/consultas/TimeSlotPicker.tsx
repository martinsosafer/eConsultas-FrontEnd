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
  const [disponibilidad, setDisponibilidad] = useState<DisponibilidadHorario[]>(
    []
  );
  const [selectedHorario, setSelectedHorario] = useState<string>("");
  const [selectedSubHorario, setSelectedSubHorario] = useState<string>("");

  const filterDisponibilidadByDate = (
    data: any[],
    date: Date
  ): DisponibilidadHorario[] => {
    const dateString = date.toISOString().split("T")[0];
    return data
      .filter(([fecha]) => fecha === dateString)
      .map(([_, horario, disponible]) => ({
        horario,
        disponible: disponible === 1,
      }));
  };

  const isHorarioPast = (horarioTime: string): boolean => {
    if (!selectedDate) return false;
    const today = new Date();
    const isToday = selectedDate.toDateString() === today.toDateString();
    if (!isToday) return false;

    const [_, end] = horarioTime.split("-");
    const [endHours, endMinutes] = end.split(":").map(Number);
    const horarioEndTime = new Date(selectedDate);
    horarioEndTime.setHours(endHours, endMinutes, 0, 0);

    return horarioEndTime < today;
  };

  const isSubHorarioPast = (subHorarioTime: string): boolean => {
    if (!selectedDate) return false;
    const today = new Date();
    const isToday = selectedDate.toDateString() === today.toDateString();
    if (!isToday) return false;

    const [start] = subHorarioTime.split("-");
    const [hours, minutes] = start.split(":").map(Number);
    const slotTime = new Date(selectedDate);
    slotTime.setHours(hours, minutes, 0, 0);

    return slotTime < today;
  };

  useEffect(() => {
    setSelectedSubHorario("");
  }, [selectedDate]);

  useEffect(() => {
    const loadDisponibilidad = async () => {
      if (!selectedDate) return;

      setLoadingHorarios(true);
      try {
        const data = await medicoApi.getDisponibilidadTurnosMedico(
          medicoEmail,
          selectedDate.toISOString().split("T")[0]
        );

        const filteredData = filterDisponibilidadByDate(data, selectedDate);
        setDisponibilidad(filteredData);
      } catch (error) {
        toast.error("Error cargando disponibilidad");
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
        const fecha = selectedDate.toISOString().split("T")[0];
        const data = await medicoApi.getDisponibilidadPorFechaHorario(
          medicoEmail,
          fecha,
          selectedHorario
        );

        setDisponibilidad((prev) =>
          prev.map((item) => {
            if (item.horario === selectedHorario) {
              return {
                ...item,
                subHorarios: data.map(([_, sub, disponible]) => ({
                  subHorario: sub,
                  disponible: disponible === 1,
                })),
              };
            }
            return item;
          })
        );
      } catch (error) {
        toast.error("Error cargando subhorarios");
      } finally {
        setLoadingSubHorarios(false);
      }
    };

    loadSubHorarios();
  }, [selectedHorario, selectedDate, medicoEmail]);

  const handleSelectSubHorario = (horario: string, subHorario: string) => {
    horario;
    if (!selectedDate) return;

    if (selectedSubHorario === subHorario) {
      setSelectedSubHorario("");
      onTimeSelect("");
    } else {
      const fecha = selectedDate.toISOString().split("T")[0];
      onTimeSelect(`${fecha} ${subHorario}`);
      setSelectedSubHorario(subHorario);
    }
  };

  const sortHorarios = (a: DisponibilidadHorario, b: DisponibilidadHorario) => {
    const getHour = (horario: string) => parseInt(horario.split("-")[0]);
    return getHour(a.horario) - getHour(b.horario);
  };

  if (!selectedDate) {
    return (
      <div className="flex flex-col items-center p-4 sm:p-6">
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
          className="rounded-lg border p-2 shadow-sm w-full max-w-[280px]"
        />
      </div>
    );
  }

  if (loadingHorarios) {
    return (
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-6">
        <div className="w-full sm:w-[250px]">
          <Skeleton className="h-8 w-full mb-2" />
          <Skeleton className="h-[280px] w-full rounded-lg" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 flex-1 min-h-[400px]">
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
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-6">
      {/* Date Picker Column */}
      <div className="w-full sm:w-[250px]">
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
          className="rounded-lg border p-2 shadow-sm w-full"
        />
        <Button
          variant="ghost"
          onClick={() => onDateSelect(undefined)}
          className="mt-4 w-full text-sm h-10 sm:h-8"
        >
          Cambiar fecha
        </Button>
      </div>

      {/* Time Slots Column */}
      <div className="flex-1 flex flex-col">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span>Horarios disponibles</span>
          {selectedSubHorario && (
            <span className="text-primary-dark ml-2">
              Seleccionado: {selectedSubHorario.split("-")[0]}
            </span>
          )}
          {loadingSubHorarios && (
            <span className="h-2 w-2 bg-primary rounded-full animate-ping" />
          )}
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 pb-4 overflow-y-auto flex-1">
          {[...disponibilidad].sort(sortHorarios).map((horario) => {
            const horarioDisabled =
              !horario.disponible || isHorarioPast(horario.horario);

            return (
              <div key={horario.horario} className="space-y-2">
                <Button
                  variant={horarioDisabled ? "destructive" : "default"}
                  className={cn(
                    "w-full font-bold h-14 text-base px-2",
                    selectedHorario === horario.horario &&
                      "ring-2 ring-primary ring-offset-2",
                    !horarioDisabled &&
                      "bg-green-500 hover:bg-green-600 text-white"
                  )}
                  onClick={() =>
                    setSelectedHorario(horarioDisabled ? "" : horario.horario)
                  }
                  disabled={horarioDisabled || loadingSubHorarios}
                >
                  <span className="truncate">
                    {horario.horario.split("-")[0]}
                  </span>
                  <span className="ml-2 text-sm">
                    {horario.disponible ? "✓" : "✕"}
                  </span>
                </Button>

                {selectedHorario === horario.horario && (
                  <div className="grid grid-cols-1 gap-2">
                    {horario.subHorarios?.map((sub) => {
                      const subDisabled =
                        !sub.disponible || isSubHorarioPast(sub.subHorario);
                      const isSelected = selectedSubHorario === sub.subHorario;

                      return (
                        <Button
                          key={sub.subHorario}
                          variant={isSelected ? "default" : "outline"}
                          className={cn(
                            "relative h-12 justify-start text-sm",
                            subDisabled && "opacity-50 cursor-not-allowed",
                            !subDisabled && "hover:bg-green-50",
                            isSelected &&
                              "bg-primary-dark text-white hover:bg-primary-dark/90"
                          )}
                          onClick={() =>
                            handleSelectSubHorario(
                              horario.horario,
                              sub.subHorario
                            )
                          }
                          disabled={subDisabled}
                        >
                          <span className="mr-2">🕒</span>
                          <span className="truncate">
                            {sub.subHorario.split("-")[0]}
                          </span>
                          {!subDisabled && (
                            <span
                              className={`absolute top-2 right-2 w-2 h-2 rounded-full ${
                                sub.disponible ? "bg-green-400" : "bg-red-400"
                              }`}
                            />
                          )}
                        </Button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
