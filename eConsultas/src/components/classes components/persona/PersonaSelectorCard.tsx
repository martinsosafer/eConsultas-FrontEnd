"use client";
import { Medico, Paciente } from "@/api/models/personaModels";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface PersonaSelectorCardProps {
  selectedPersona?: Medico | Paciente;
  onSelect: () => void;
  onRemove: () => void;
  tipoPersona: "MEDICO" | "PACIENTE";
}

export const PersonaSelectorCard = ({
  selectedPersona,
  onSelect,
  onRemove,
  tipoPersona,
}: PersonaSelectorCardProps) => {
  const isPaciente = tipoPersona === "PACIENTE";

  return (
    <div className="relative min-h-[120px]">
      {selectedPersona ? (
        <div className="border-2 border-primary rounded-lg p-6 relative h-full mr-4">
          <Button
            variant="ghost"
            size="icon"
            className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-red-500 hover:bg-red-600 text-white"
            onClick={onRemove}
          >
            <X className="h-4 w-4" />
          </Button>

          <h3 className="font-medium">
            {selectedPersona.nombre} {selectedPersona.apellido}
          </h3>

          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm text-muted-foreground">
              @{selectedPersona.credenciales.username}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            <span
              className={cn(
                "text-xs px-2 py-1 rounded-full",
                selectedPersona.credenciales.enabled
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              )}
            >
              {selectedPersona.credenciales.enabled
                ? "Habilitado"
                : "Deshabilitado"}
            </span>

            {isPaciente && (
              <span
                className={cn(
                  "text-xs px-2 py-1 rounded-full",
                  (selectedPersona as Paciente).obraSocial
                    ? "bg-blue-100 text-blue-800"
                    : "bg-yellow-100 text-yellow-800"
                )}
              >
                {(selectedPersona as Paciente).obraSocial
                  ? "Con obra social"
                  : "Sin obra social"}
              </span>
            )}
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          className="h-full w-full border-2 border-dashed border-primary hover:bg-primary-light/20 min-h-[120px]"
          onClick={onSelect}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-primary">
              Seleccionar {tipoPersona.toLowerCase()}
            </span>
          </div>
        </Button>
      )}
    </div>
  );
};
