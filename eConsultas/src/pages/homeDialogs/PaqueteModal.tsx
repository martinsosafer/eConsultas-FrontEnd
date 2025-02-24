"use client";
import { useState, useEffect } from "react";
import { Paquete } from "@/api/models/paqueteModels";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, SquareActivity, Stethoscope, Droplet, ClipboardList, HeartPulse, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { paqueteDashboardApi } from "@/api/dashboard/paqueteDashboardApi";


const getServiceIcon = (tipoNombre: string) => {
  const icons = {
    "Cirugías": <SquareActivity className="w-4 h-4" />,
    "Consultas especializadas": <Stethoscope className="w-4 h-4" />,
    "Exámenes de sangre": <Droplet className="w-4 h-4" />,
    "Exámenes médicos": <ClipboardList className="w-4 h-4" />,
    "Terapias y tratamientos varios": <HeartPulse className="w-4 h-4" />
  };
  return icons[tipoNombre] || <Plus className="w-4 h-4" />;
};

interface PaquetesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PaquetesModal = ({ open, onOpenChange }: PaquetesModalProps) => {
  const [paquetes, setPaquetes] = useState<Paquete[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedPaquete, setExpandedPaquete] = useState<number | null>(null);

  useEffect(() => {
    const loadPaquetes = async () => {
      setLoading(true);
      try {
        const data = await paqueteDashboardApi.getAllPaquetes();
        setPaquetes(data);
      } catch (error) {
        console.error("Error loading paquetes:", error);
      } finally {
        setLoading(false);
      }
    };

    if (open) loadPaquetes();
  }, [open]);

  const toggleExpand = (id: number) => {
    setExpandedPaquete(expandedPaquete === id ? null : id);
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-background rounded-2xl p-6 max-w-4xl w-full h-[80vh] flex flex-col shadow-xl animate-in slide-in-from-bottom-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Paquetes Médicos</h2>
              <Button variant="ghost" onClick={() => onOpenChange(false)}>
                <X size={24} />
              </Button>
            </div>

            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                {loading ? (
                  Array(3).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-32 rounded-xl" />
                  ))
                ) : paquetes.map((paquete) => (
                  <div key={paquete.id} className="border rounded-xl p-4 hover:bg-accent/5 transition-all">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold">Paquete #{paquete.id}</h3>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${paquete.enabled ? 'bg-green-500' : 'bg-destructive'}`} />
                          <span className="text-sm text-muted-foreground">
                            {paquete.enabled ? 'Disponible' : 'No disponible'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-primary">
                            ${paquete.precio.toFixed(2)}
                          </span>
                          <span className="text-sm text-green-500">
                            (15% de descuento)
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <span className="text-sm">Contiene:</span>
                          {[...new Set(paquete.servicios.map(s => s.tipoServicio.nombre))].map(tipo => (
                            <div 
                              key={tipo} 
                              className="flex items-center gap-1 bg-accent/10 px-2 py-1 rounded-full text-sm"
                              title={tipo}
                            >
                              {getServiceIcon(tipo)}
                              <span className="text-muted-foreground">{tipo}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => toggleExpand(paquete.id)}
                      >
                        {expandedPaquete === paquete.id ? <ChevronUp /> : <ChevronDown />}
                      </Button>
                    </div>

                    {expandedPaquete === paquete.id && (
                      <div className="mt-4 space-y-3 border-t pt-4 animate-in fade-in">
                        {paquete.servicios.map((servicio) => (
                          <div key={servicio.id} className="flex justify-between items-center bg-background p-3 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="bg-primary/10 p-2 rounded-full text-primary">
                                {getServiceIcon(servicio.tipoServicio.nombre)}
                              </div>
                              <div>
                                <h4 className="font-medium">{servicio.descripcion}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {servicio.tipoServicio.nombre}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm line-through text-destructive">
                                ${servicio.precio.toFixed(2)}
                              </span>
                              <span className="text-lg font-bold text-green-500">
                                ${(servicio.precio * 0.85).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      )}
    </>
  );
};