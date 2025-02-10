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
import { extractErrorMessage } from "@/api/errorHandler";

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
      toast.error(extractErrorMessage(error));
    }
  };

  const verifyPaquete = async () => {
    setIsVerifying(true);
    try {
      const existing = await paqueteApi.searchByMultipleServiciosIds(
        selectedServicios.map(s => s.id).sort((a, b) => a - b)
      );
      setVerificationResult(existing.length > 0 ? "exists" : "available");
    } catch (error) {
      toast.error(`Verificación fallida: ${extractErrorMessage(error)}`);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[80vh] flex flex-col">
        <div className="flex-1 flex flex-col space-y-6 overflow-hidden">
          <h2 className="text-2xl font-bold">Crear nuevo paquete</h2>

          <div className="flex-1 overflow-y-auto space-y-4 pr-4">
            <div className="grid grid-cols-1 gap-4 min-h-[200px]">
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
          </div>

          <div className="space-y-4 pt-4 border-t">
            {selectedServicios.length >= 2 && (
              <div className="space-y-4">
                <Button
                  variant={verificationResult === "exists" ? "destructive" : "secondary"}
                  className="w-full gap-2"
                  onClick={verifyPaquete}
                  disabled={isVerifying}
                >
                  {isVerifying ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <span>🔍 Verificar disponibilidad</span>
                  )}
                </Button>

                {verificationResult && (
                  <p
                    className={cn(
                      "p-2 rounded-md text-center",
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
              className="w-full bg-primary hover:bg-primary-dark"
              onClick={handleCreate}
              disabled={
                selectedServicios.length < 2 ||
                verificationResult === "exists"
              }
            >
              Crear Paquete
            </Button>
          </div>
        </div>

        <ServicioSelectionSlider
          open={sliderOpen}
          onOpenChange={setSliderOpen}
          onSelect={(servicio) => {
            if (!selectedServicios.some(s => s.id === servicio.id)) {
              setSelectedServicios(prev => [...prev, servicio]);
              setVerificationResult(null);
            }
          }}
          selectedIds={selectedServicios.map(s => s.id)}
        />
      </DialogContent>
    </Dialog>
  );
};