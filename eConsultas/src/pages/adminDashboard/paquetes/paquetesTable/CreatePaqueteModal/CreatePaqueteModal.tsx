"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ServicioSelectorCard } from "@/components/classes components/servicio/ServicioSelectorCard";
import { ServicioSelectionSlider } from "@/components/classes components/servicio/ServicioSelectionSlider";
import { paqueteApi } from "@/api/classes apis/paqueteApi";
import { toast } from "sonner";
import { Servicio } from "@/api/models/servicioModels";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { paqueteDashboardApi } from "@/api/dashboard/paqueteDashboardApi";
import { cn } from "@/lib/utils";

interface CreatePaqueteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => Promise<void>;
}

export const CreatePaqueteModal = ({
  open,
  onOpenChange,
  onCreated,
}: CreatePaqueteModalProps) => {
  const [selectedServicios, setSelectedServicios] = useState<Servicio[]>([]);
  const [sliderOpen, setSliderOpen] = useState(false);
  const [verificationResult, setVerificationResult] = useState<"exists" | "available" | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleCreate = async () => {
    try {
      await paqueteDashboardApi.createPaquete(selectedServicios.map(s => s.id));
      toast.success("Paquete creado exitosamente");
      onOpenChange(false);
      await onCreated();
    } catch (error) {
      toast.error("Error al crear el paquete");
    }
  };

  const verifyPaquete = async () => {
    setIsVerifying(true);
    try {
      const existing = await paqueteApi.searchByMultipleServiciosIds(
        selectedServicios.map(s => s.id)
      );
      setVerificationResult(existing.length > 0 ? "exists" : "available");
    } catch (error) {
      toast.error("Error verificando paquete");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Crear nuevo paquete</h2>

          <div className="space-y-4">
            {selectedServicios.map((servicio, index) => (
              <ServicioSelectorCard
                key={servicio.id}
                selectedServicio={servicio}
                onSelect={() => setSliderOpen(true)}
                onRemove={() => {
                  const newSelected = [...selectedServicios];
                  newSelected.splice(index, 1);
                  setSelectedServicios(newSelected);
                  setVerificationResult(null);
                }}
                isPaquete
              />
            ))}

            {selectedServicios.length < 10 && (
              <ServicioSelectorCard
                onSelect={() => setSliderOpen(true)}
                onRemove={() => {}}
                isPaquete
              />
            )}
          </div>

          {selectedServicios.length >= 2 && (
            <div className="space-y-4">
              <Button
                variant="accent"
                onClick={verifyPaquete}
                disabled={isVerifying}
              >
                {isVerifying ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Verificar disponibilidad"
                )}
              </Button>

              {verificationResult && (
                <p
                  className={cn(
                    "p-2 rounded-md",
                    verificationResult === "exists"
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  )}
                >
                  {verificationResult === "exists"
                    ? "Ya existe un paquete con estos servicios"
                    : "Disponible para crear"}
                </p>
              )}
            </div>
          )}

          <Button
            className="w-full"
            onClick={handleCreate}
            disabled={
              selectedServicios.length < 2 ||
              verificationResult === "exists"
            }
          >
            Crear Paquete
          </Button>
        </div>

        <ServicioSelectionSlider
          open={sliderOpen}
          onOpenChange={setSliderOpen}
          onSelect={(servicio) => {
            setSelectedServicios(prev => [...prev, servicio]);
            setVerificationResult(null);
          }}
          selectedIds={selectedServicios.map(s => s.id)}
        />
      </DialogContent>
    </Dialog>
  );
};