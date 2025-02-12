"use client";

import { Servicio } from "@/api/models/servicioModels";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

interface ServicioSelectorCardProps {
  selectedServicio?: Servicio;
  onSelect: () => void;
  onRemove: () => void;
  isPaquete?: boolean;
}

export const ServicioSelectorCard = ({
  selectedServicio,
  onSelect,
  onRemove,
  isPaquete = false,
}: ServicioSelectorCardProps) => {
  return (
    <div className="relative min-h-[120px]">
      {selectedServicio ? (
        <div className="border-2 border-primary rounded-lg p-4 relative h-full">
          <Button
            variant="ghost"
            size="icon"
            className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-red-500 hover:bg-red-600 text-white"
            onClick={onRemove}
          >
            ×
          </Button>
          <h3 className="font-medium">{selectedServicio.descripcion}</h3>
          <p className="text-sm text-muted-foreground">
            ${selectedServicio.precio.toFixed(2)}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span
              className={cn(
                "text-xs px-2 py-1 rounded-full",
                selectedServicio.enabled
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              )}
            >
              {selectedServicio.enabled ? "Habilitado" : "Deshabilitado"}
            </span>
            <span className="text-xs text-muted-foreground">
              {selectedServicio.tipoServicio.nombre}
            </span>
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          className="h-full w-full border-2 border-dashed border-primary hover:bg-primary-light/20 min-h-[120px]"
          onClick={onSelect}
        >
          <div className="flex flex-col items-center gap-2">
            <Plus className="w-8 h-8 text-primary" />
            <span className="text-primary">Añadir Servicio</span>
          </div>
        </Button>
      )}
    </div>
  );
};