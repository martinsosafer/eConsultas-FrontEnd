"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthProvider";
import { medicoApi } from "@/api/classes apis/medicoApi";
import { toast } from "sonner";
import { Turno } from "@/api/models/turnoModel";

const HOURS = Array.from({ length: 24 }, (_, i) => i); // 0-23 horas
const QUARTERS = ['00', '15', '30', '45'];

interface MedicalScheduleProps {
  medicoEmail: string;
  currentTurnos: Turno[];
  onUpdate: (updatedTurnos: Turno[]) => void;
}

export const MedicalSchedule = ({ medicoEmail, currentTurnos, onUpdate }: MedicalScheduleProps) => {
  const { personaData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [timeSlots, setTimeSlots] = useState<Record<string, boolean>>({});
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = () => {
      const isAdminUser = personaData?.credenciales.roles.some(role => [1, 3].includes(role.id));
      setIsAdmin(!!isAdminUser);
    };

    const loadAvailability = async () => {
      try {
        const disponibilidad = await medicoApi.getDisponibilidadTurnosMedico(
          medicoEmail,
          new Date().toISOString().split('T')[0]
        );
        
        const slots: Record<string, boolean> = {};
        disponibilidad.horariosDisponibles.forEach((h: string) => slots[h] = true);
        disponibilidad.horariosOcupados.forEach((h: string) => slots[h] = false);
        
        setTimeSlots(slots);
      } catch (error) {
        toast.error('Error cargando disponibilidad');
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
    loadAvailability();
  }, [medicoEmail, personaData]);

  const handleTimeSlotToggle = async (time: string) => {
    if (!isAdmin) return;
    
    try {
      await medicoApi.removeTurnoForMedico(medicoEmail, time);
      setTimeSlots(prev => ({ ...prev, [time]: !prev[time] }));
      toast.success(`Turno ${time} actualizado`);
      onUpdate(currentTurnos.map(t => t.horario === time ? { ...t, enabled: !timeSlots[time] } : t));
    } catch (error) {
      toast.error('Error actualizando turno');
    }
  };

  const handleHourToggle = async (hour: number) => {
    if (!isAdmin) return;

    try {
      const baseHour = `${hour.toString().padStart(2, '0')}:`;
      const slots = QUARTERS.map(q => `${baseHour}${q}`);
      
      await Promise.all(slots.map(slot => 
        medicoApi.removeTurnoForMedico(medicoEmail, slot)
      ));

      const newSlots = { ...timeSlots };
      slots.forEach(slot => newSlots[slot] = !newSlots[slot]);
      
      setTimeSlots(newSlots);
      onUpdate(currentTurnos.map(t => 
        slots.includes(t.horario) ? { ...t, enabled: !t.enabled } : t
      ));
      
      toast.success(`Hora completa ${hour} actualizada`);
    } catch (error) {
      toast.error('Error actualizando hora completa');
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        {HOURS.map(hour => (
          <div key={hour} className="space-y-2">
            <Button
              variant="ghost"
              className={`w-full font-bold ${isAdmin ? 'hover:bg-accent' : ''}`}
              onClick={() => isAdmin && handleHourToggle(hour)}
            >
              {`${hour.toString().padStart(2, '0')}:00`}
            </Button>
            
            <div className="grid grid-cols-2 gap-2">
              {QUARTERS.map(quarter => {
                const time = `${hour.toString().padStart(2, '0')}:${quarter}`;
                return (
                  <Button
                    key={time}
                    variant={timeSlots[time] ? 'default' : 'outline'}
                    className={`relative ${isAdmin ? 'cursor-pointer' : 'cursor-default'}
                      ${timeSlots[time] ? 'bg-primary/80 hover:bg-primary/90' : 
                       'hover:bg-secondary/30'}`}
                    onClick={() => handleTimeSlotToggle(time)}
                  >
                    {time}
                    {timeSlots[time] && (
                      <span className="absolute top-0 right-0 w-2 h-2 bg-green-400 rounded-full" />
                    )}
                  </Button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};