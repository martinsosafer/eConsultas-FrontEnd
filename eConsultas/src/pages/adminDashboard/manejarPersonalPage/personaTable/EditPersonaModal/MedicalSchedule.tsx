"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthProvider";
import { turnoApi } from "@/api/classes apis/turnoApi";
import { toast } from "sonner";
import { Turno } from "@/api/models/turnoModel";


interface MedicalScheduleProps {
  medicoEmail: string;
  currentTurnos: Turno[]; // Remove null
  onUpdate: (updatedTurnos: Turno[]) => void;
}
export const MedicalSchedule = ({ medicoEmail, currentTurnos, onUpdate }: MedicalScheduleProps) => {
  const { personaData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [timeSlots, setTimeSlots] = useState<Record<string, boolean>>({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [groupedTurnos, setGroupedTurnos] = useState<Record<string, Turno[]>>({});

  useEffect(() => {
    const checkAdmin = () => {
      const isAdminUser = personaData?.credenciales.roles.some(role => [1, 3].includes(role.id));
      setIsAdmin(!!isAdminUser);
    };
  
    const processTurnos = () => {
      console.log('Procesando turnos:', currentTurnos);
      
      const grouped: Record<string, Turno[]> = {};
      const slots: Record<string, boolean> = {};
      
      if (currentTurnos && Array.isArray(currentTurnos)) {
        currentTurnos.forEach(turno => {
          if (!grouped[turno.horario]) {
            grouped[turno.horario] = [];
          }
          grouped[turno.horario].push(turno);
          slots[turno.subHorario] = turno.enabled;
        });
      } else {
        console.warn('currentTurnos no es un array válido:', currentTurnos);
      }
      
      setGroupedTurnos(grouped);
      setTimeSlots(slots);
      setLoading(false);
    };
  
    checkAdmin();
    processTurnos();
  }, [currentTurnos, personaData]);

  const handleTimeSlotToggle = async (subHorario: string) => {
    if (!isAdmin || !currentTurnos) return; // Chequear currentTurnos
    
    try {
      await turnoApi.toggleTurnoStatus(subHorario);
      setTimeSlots(prev => ({ ...prev, [subHorario]: !prev[subHorario] }));
      
      const updatedTurnos = currentTurnos.map(t => 
        t.subHorario === subHorario ? { ...t, enabled: !t.enabled } : t
      );
      onUpdate(updatedTurnos);
      
      toast.success(`Turno ${subHorario} actualizado`);
    } catch (error) {
      toast.error('Error actualizando turno');
    }
  };

  const handleHorarioGroupToggle = async (horario: string) => {
    if (!isAdmin || !currentTurnos) return; // Chequear currentTurnos

    try {
      const turnosInGroup = groupedTurnos[horario] || [];
      const allEnabled = turnosInGroup.every(t => t.enabled);
      
      await Promise.all(turnosInGroup.map(t => 
        turnoApi.toggleTurnoStatus(t.subHorario)
      ));

      const newSlots = { ...timeSlots };
      turnosInGroup.forEach(t => newSlots[t.subHorario] = !allEnabled);
      
      setTimeSlots(newSlots);
      onUpdate(currentTurnos.map(t => 
        t.horario === horario ? { ...t, enabled: !allEnabled } : t
      ));
      
      toast.success(`Grupo ${horario} ${!allEnabled ? 'habilitado' : 'deshabilitado'}`);
    } catch (error) {
      toast.error('Error actualizando grupo de turnos');
    }
  };

  if (loading || !currentTurnos) { // Mostrar skeleton si no hay datos
    return (
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <div className="grid grid-cols-2 gap-2">
              {[...Array(4)].map((_, j) => (
                <Skeleton key={j} className="h-10 w-full" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(groupedTurnos).map(([horario, turnos]) => (
          <div key={horario} className="space-y-2">
            <Button
              variant="ghost"
              className={`w-full font-bold ${isAdmin ? 'hover:bg-accent' : ''}`}
              onClick={() => handleHorarioGroupToggle(horario)}
            >
              {horario}
            </Button>
            
            <div className="grid grid-cols-2 gap-2">
              {turnos.map(turno => (
                <Button
                  key={turno.subHorario}
                  variant={timeSlots[turno.subHorario] ? 'default' : 'outline'}
                  className={`relative ${isAdmin ? 'cursor-pointer' : 'cursor-default'}
                    ${timeSlots[turno.subHorario] ? 
                      'bg-primary/80 hover:bg-primary/90' : 
                      'hover:bg-secondary/30'}`}
                  onClick={() => handleTimeSlotToggle(turno.subHorario)}
                >
                  {turno.subHorario}
                  {timeSlots[turno.subHorario] && (
                    <span className="absolute top-0 right-0 w-2 h-2 bg-green-400 rounded-full" />
                  )}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};