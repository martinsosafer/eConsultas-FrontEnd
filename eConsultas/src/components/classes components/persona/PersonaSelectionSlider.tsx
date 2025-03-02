"use client";

import { Medico, Paciente } from "@/api/models/personaModels";
import { personaApi } from "@/api/classes apis/personaApi";
import { medicoApi } from "@/api/classes apis/medicoApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface PersonaSelectionSliderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (persona: Medico | Paciente) => void;
  tipoPersona: "MEDICO" | "PACIENTE";
  filters?: Record<string, string>;
}

export const PersonaSelectionSlider = ({
  open,
  onOpenChange,
  onSelect,
  tipoPersona,
  filters,
}: PersonaSelectionSliderProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [personas, setPersonas] = useState<(Medico | Paciente)[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const fetchPersonas = async () => {
    try {
      setLoading(true);
      let data;

      // Handle MEDICO with specialty filter
      if (tipoPersona === "MEDICO" && filters?.especialidadMedico) {
        data = await medicoApi.getMedicosBySpecialty(
          filters.especialidadMedico
        );
      } else {
        data = await personaApi.getAllPersonas(tipoPersona, filters);
      }

      setPersonas(data);
    } catch (error) {
      toast.error("Error cargando datos");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm) return;

    try {
      setSearchLoading(true);
      let response;

      // Handle MEDICO with specialty filter search
      if (tipoPersona === "MEDICO" && filters?.especialidadMedico) {
        response = await medicoApi.getMedicosBySpecialty(
          filters.especialidadMedico,
          searchTerm
        );
      } else {
        response = await personaApi.getAllPersonas(tipoPersona, {
          ...filters,
          search: searchTerm,
        });
      }

      if (response.length > 0) {
        setPersonas(response);
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

  useEffect(() => {
    if (open) {
      fetchPersonas();
    } else {
      setPersonas([]);
      setSearchTerm("");
    }
  }, [open, filters]);

  const truncarTexto = (texto: string, longitud: number) =>
    texto.length > longitud ? `${texto.substring(0, longitud)}...` : texto;

  return (
    <div
      className={cn(
        "fixed top-0 right-0 h-screen w-full sm:w-[500px] bg-background border-l shadow-xl transform transition-transform duration-300 z-[1000]",
        open ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="p-4 sm:p-6 h-full flex flex-col">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold">
            Seleccionar {tipoPersona}
          </h2>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="hover:bg-gray-100 rounded-full h-8 w-8"
          >
            ×
          </Button>
        </div>

        <div className="space-y-4 flex flex-col h-[calc(100vh-140px)] sm:h-[calc(100vh-160px)]">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
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
            <Button
              onClick={handleSearch}
              disabled={searchLoading}
              className="sm:w-auto w-full"
            >
              {searchLoading ? <Loader2 className="animate-spin" /> : "Buscar"}
            </Button>
          </div>

          <ScrollArea className="flex-1 w-full pr-4">
            <div className="space-y-2 pb-4">
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : personas.length === 0 ? (
                <div className="text-center py-8">No hay resultados</div>
              ) : (
                personas.map((persona) => {
                  const emailTruncado = truncarTexto(
                    persona.credenciales.email,
                    15
                  );
                  return (
                    <div
                      key={persona.id}
                      className={cn(
                        "p-4 border rounded-lg transition-all cursor-pointer group",
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
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">
                          {persona.nombre} {persona.apellido}
                        </h3>
                        {tipoPersona === "MEDICO" && (
                          <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800">
                            {(persona as Medico).especialidad ||
                              "Sin especialidad"}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm text-muted-foreground">
                          {emailTruncado}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(
                              persona.credenciales.email
                            );
                            toast.success("Email copiado");
                          }}
                        >
                          <Copy className="h-4 w-4 text-green-600" />
                        </Button>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-2">
                        <span
                          className={cn(
                            "text-xs px-2 py-1 rounded-full",
                            persona.credenciales.enabled
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          )}
                        >
                          {persona.credenciales.enabled
                            ? "Habilitado"
                            : "Deshabilitado"}
                        </span>

                        {tipoPersona === "PACIENTE" && (
                          <span
                            className={cn(
                              "text-xs px-2 py-1 rounded-full",
                              (persona as Paciente).obraSocial
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                            )}
                          >
                            {(persona as Paciente).obraSocial
                              ? "Obra social"
                              : "Sin obra social"}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};
