"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Turno } from "@/api/models/turnoModels";
import { turnoApi } from "@/api/classes apis/turnoApi";
import { toast } from "sonner";

interface MedicalScheduleModalProps {
  medicoEmail: string;
  onClose: () => void; 
}

interface GroupedTurnos {
  [key: string]: {
    horario: string;
    subHorarios: (Turno & { hasTurno: boolean })[];
    hasTurno: boolean;
  };
}

export const MedicalScheduleModal = ({ medicoEmail, onClose }: MedicalScheduleModalProps) => {
  const [loading, setLoading] = useState(true);
  const [groupedTurnos, setGroupedTurnos] = useState<GroupedTurnos>({});

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
        

        const hasTurno = medicoTurnos.some(mt => mt.id === turno.id);
        acc[mainHour].subHorarios.push({ ...turno, hasTurno });
        
        return acc;
      }, {});


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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.values(groupedTurnos).map(group => (
            <div key={group.horario} className="space-y-2">
              <Button
                variant={group.hasTurno ? "default" : "outline"}
                className="w-full font-bold"
                disabled 
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
                      className="relative"
                      disabled 
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
        <div className="mt-4 flex justify-end">
          <Button onClick={onClose}>Cerrar</Button>
        </div>
      </div>
    </div>
  );
};