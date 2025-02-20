"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Turno } from "@/api/models/turnoModels";
import { turnoApi } from "@/api/classes apis/turnoApi";
import { toast } from "sonner";

interface MedicalScheduleProps {
  medicoEmail: string;
  currentTurnos: Turno[];
  onUpdate: (updatedTurnos: Turno[]) => void;
}

interface GroupedTurnos {
  [key: string]: {
    horario: string;
    subHorarios: (Turno & { hasTurno: boolean })[];
    hasTurno: boolean;
  };
}

export const MedicalSchedule = ({ medicoEmail }: MedicalScheduleProps) => {
  const [loading, setLoading] = useState(true);
  const [groupedTurnos, setGroupedTurnos] = useState<GroupedTurnos>({});
  const [processing, setProcessing] = useState<string[]>([]);

  const loadData = async () => {
    try {
      const [allTurnos, medicoTurnos] = await Promise.all([
        turnoApi.getAllTurnos(),
        turnoApi.getTurnosByMedico(medicoEmail)
      ]);

      const grouped = allTurnos.reduce((acc: GroupedTurnos, turno) => {
        const mainHour = turno.horario;
        if (!acc[mainHour]) {
          acc[mainHour] = {
            horario: mainHour,
            subHorarios: [],
            hasTurno: false
          };
        }
        
        // Verificar si el médico tiene este turno
        const hasTurno = medicoTurnos.some(mt => mt.id === turno.id);
        acc[mainHour].subHorarios.push({ ...turno, hasTurno });
        
        return acc;
      }, {});

      // Actualizar hasTurno para el horario principal
      Object.keys(grouped).forEach(key => {
        grouped[key].hasTurno = grouped[key].subHorarios.some(sh => sh.hasTurno);
      });

      setGroupedTurnos(grouped);
    } catch (error) {
      toast.error('Error cargando horarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [medicoEmail]);

  const handleToggle = async (horario: string, isMainHour: boolean) => {
    try {
      setProcessing(prev => [...prev, horario]);
      
      await turnoApi.asignarRemoverTurno(medicoEmail, horario);
      await loadData();

      toast.success(
        isMainHour 
          ? `Horario ${horario} actualizado`
          : `Turno ${horario} actualizado`
      );
    } catch (error) {
      toast.error('Error actualizando turno');
      await loadData();
    } finally {
      setProcessing(prev => prev.filter(h => h !== horario));
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-12 w-full rounded-lg" />
            <div className="grid grid-cols-2 gap-2">
              {[...Array(4)].map((_, j) => (
                <Skeleton key={j} className="h-10 rounded-md" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {Object.values(groupedTurnos).map(group => (
        <div key={group.horario} className="space-y-2">
          <Button
            variant={group.hasTurno ? "default" : "outline"}
            className={`w-full font-bold ${
              processing.includes(group.horario) ? 'animate-pulse' : ''
            }`}
            onClick={() => handleToggle(group.horario, true)}
            disabled={processing.includes(group.horario)}
          >
            {group.horario.split('-')[0]}
            <span className="ml-2 text-sm">
              {group.hasTurno ? '✓' : '✕'}
            </span>
          </Button>
          
          <div className="grid grid-cols-2 gap-2">
            {group.subHorarios.map(sub => {
              const [hora, minutos] = sub.subHorario.split(':');
              const horaCompleta = `${hora.padStart(2, '0')}:${minutos}`;
              
              return (
                <Button
                  key={sub.id}
                  variant={sub.hasTurno ? "default" : "outline"}
                  className={`relative ${
                    processing.includes(sub.subHorario) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={() => handleToggle(sub.subHorario, false)}
                  disabled={processing.includes(sub.subHorario)}
                >
                  {horaCompleta}
                  <span className={`absolute top-1 right-1 w-2 h-2 rounded-full ${
                    sub.enabled ? 'bg-green-400' : 'bg-red-400'
                  }`} />
                </Button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};