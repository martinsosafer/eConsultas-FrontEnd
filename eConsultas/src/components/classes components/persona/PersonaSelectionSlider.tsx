"use client";

import { Medico, Paciente } from "@/api/models/personaModels";
import { personaApi } from "@/api/classes apis/personaApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { personaDashboardApi } from "@/api/dashboard/personaDashboardApi";

interface PersonaSelectionSliderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (persona: Medico | Paciente) => void;
  tipoPersona: "MEDICO" | "PACIENTE";
}

export const PersonaSelectionSlider = ({
  open,
  onOpenChange,
  onSelect,
  tipoPersona,
}: PersonaSelectionSliderProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [personas, setPersonas] = useState<(Medico | Paciente)[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm) return;
    
    try {
      setSearchLoading(true);
      const persona = await personaApi.getPersona();
      
      if (persona) {
        setPersonas([persona]);
      } else {
        setPersonas([]);
        toast.info(`No se encontró ${tipoPersona.toLowerCase()}`);
      }
    } catch (error) {
      toast.error("Error en la búsqueda");
    } finally {
      setSearchLoading(false);
    }
  };

  const fetchAll = async () => {
    try {
      setLoading(true);
      const data = await personaDashboardApi.getAllPersonasByTipo(tipoPersona);
      setPersonas(data);
    } catch (error) {
      toast.error("Error cargando datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) fetchAll();
  }, [open]);

  return (
    <div className={cn(
      "fixed top-0 right-0 h-screen w-[400px] bg-background border-l shadow-xl transform transition-transform duration-300 z-[1000]",
      open ? "translate-x-0" : "translate-x-full"
    )}>
      <div className="p-6 h-full flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Seleccionar {tipoPersona}</h2>
          <Button 
            variant="ghost" 
            onClick={() => onOpenChange(false)}
            className="hover:bg-gray-100 rounded-full"
          >
            ×
          </Button>
        </div>

        <div className="space-y-4 flex flex-col h-[calc(100vh-160px)]">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                placeholder="Buscar por email, DNI o celular..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                onKeyUp={(e) => e.key === "Enter" && handleSearch()}
              />
              <Search className="absolute left-3 top-3 text-muted-foreground" />
            </div>
            <Button onClick={handleSearch} disabled={searchLoading}>
              {searchLoading ? <Loader2 className="animate-spin" /> : "Buscar"}
            </Button>
          </div>

          <Button variant="outline" onClick={fetchAll} disabled={loading}>
            {loading ? "Cargando..." : "Traer todos"}
          </Button>

          <ScrollArea className="flex-1 w-full pr-4">
            <div className="space-y-2 pb-4">
              {personas.length === 0 ? (
                <div className="text-center py-8">No hay resultados</div>
              ) : (
                personas.map((persona) => (
                  <div
                    key={persona.id}
                    className={cn(
                      "p-4 border rounded-lg transition-all cursor-pointer",
                      persona.credenciales.enabled
                        ? "hover:bg-accent bg-white"
                        : "opacity-50 cursor-not-allowed bg-gray-50"
                    )}
                    onClick={() => {
                      if (persona.credenciales.enabled) {
                        onSelect(persona);
                        onOpenChange(false);
                      }
                    }}
                  >
                    <h3 className="font-medium">
                      {persona.nombre} {persona.apellido}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm text-muted-foreground">
                        @{persona.credenciales.username}
                      </span>
                      <span className={cn(
                        "text-xs px-2 py-1 rounded-full",
                        persona.credenciales.enabled
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      )}>
                        {persona.credenciales.enabled ? "Habilitado" : "Deshabilitado"}
                      </span>
                      {tipoPersona === "PACIENTE" && (
                        <span className={cn(
                          "text-xs px-2 py-1 rounded-full",
                          (persona as Paciente).obraSocial
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        )}>
                          {(persona as Paciente).obraSocial 
                            ? "Obra social" 
                            : "Sin obra social"}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};