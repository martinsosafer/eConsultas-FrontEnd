"use client";
import { useEffect, useState, useRef } from "react";
import { Medico } from "@/api/models/personaModels";
import { medicoApi } from "@/api/classes apis/medicoApi";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { MedicalScheduleModal } from "@/pages/profile/profile/seeProfileMedicalSchedule";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { personaApi } from "@/api/classes apis/personaApi";

interface MedicosModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type MedicoCache = {
  [email: string]: string;
}

export const MedicosModal = ({ open, onOpenChange }: MedicosModalProps) => {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedMedico, setSelectedMedico] = useState<Medico | null>(null);
  const imageCache = useRef<MedicoCache>({});

  const loadSpecialties = async () => {
    try {
      const data = await medicoApi.getMedicoSpecialties();
      setSpecialties(data);
    } catch (error) {
      console.error("Error loading specialties:", error);
    }
  };

  const loadMedicos = async () => {
    setLoading(true);
    try {
      const data = await medicoApi.getMedicosBySpecialty(selectedSpecialty);
      setMedicos(data);
    } catch (error) {
      console.error("Error loading medicos:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadProfileImages = async (medicos: Medico[]) => {
    const newCache = { ...imageCache.current };
    
    for (const medico of medicos) {
      const email = medico.credenciales.email;
      if (!newCache[email]) {
        try {
          const blob = await personaApi.fetchProfilePicture(email);
          newCache[email] = URL.createObjectURL(blob);
        } catch {
          newCache[email] = "";
        }
      }
    }
    
    imageCache.current = newCache;
    setMedicos(prev => [...prev]);
  };

  useEffect(() => {
    if (open) {
      loadSpecialties();
      loadMedicos();
    }

    return () => {
      Object.values(imageCache.current).forEach(url => url && URL.revokeObjectURL(url));
      imageCache.current = {};
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      loadMedicos();
    }
  }, [selectedSpecialty]);

  useEffect(() => {
    if (medicos.length > 0 && open) {
      loadProfileImages(medicos);
    }
  }, [medicos]);

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-background rounded-2xl p-6 max-w-4xl w-full h-[80vh] flex flex-col shadow-xl animate-in slide-in-from-bottom-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Médicos Registrados</h2>
              <Button variant="ghost" onClick={() => onOpenChange(false)}>
                <X size={24} />
              </Button>
            </div>

            <div className="mb-6">
              <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccione una especialidad" />
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="h-48">
                    {specialties.map((especialidad) => (
                      <SelectItem key={especialidad} value={especialidad}>
                        {especialidad}
                      </SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>
            </div>

            <ScrollArea className="flex-1 pr-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {loading ? (
                  Array(4).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-32 rounded-xl" />
                  ))
                ) : medicos.map((medico) => {
                  const imageUrl = imageCache.current[medico.credenciales.email];
                  return (
                    <div key={medico.id} className="border rounded-xl p-4 hover:bg-accent/10 transition-colors">
                      <div className="flex gap-4 items-start">
                        <Avatar className="w-16 h-16 border-2 border-primary">
                          {imageUrl && (
                            <AvatarImage 
                              src={imageUrl}
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          )}
                          <AvatarFallback className="bg-primary text-white font-bold">
                            {medico.nombre?.[0]}{medico.apellido?.[0]}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-semibold">
                                {medico.nombre} {medico.apellido}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {medico.especialidad}
                              </p>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              title="horarios"
                              onClick={() => setSelectedMedico(medico)}
                            >
                              <Clock size={18} />
                            </Button>
                          </div>

                          <div className="mt-2 flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${medico.credenciales.enabled ? 'bg-green-500' : 'bg-destructive'}`} />
                            <span className="text-sm">
                              {medico.credenciales.enabled ? 'Disponible' : 'No disponible'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </div>
      )}

      {selectedMedico && (
        <MedicalScheduleModal
          medicoEmail={selectedMedico.credenciales.email}
          onClose={() => setSelectedMedico(null)}
        />
      )}
    </>
  );
};