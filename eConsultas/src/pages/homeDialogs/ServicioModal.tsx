"use client";
import { useEffect, useState } from "react";
import { Servicio, TipoServicio } from "@/api/models/servicioModels";
import { servicioApi } from "@/api/classes apis/servicioApi";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Stethoscope, Droplet, ClipboardList, HeartPulse, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { servicioDashboardApi } from "@/api/dashboard/servicioDashboardApi";
import { SquareActivity } from "lucide-react";

interface ServiciosModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getServiceIcon = (tipoNombre: string) => {
  const icons: { [key: string]: JSX.Element } = {
    "Cirugías": <SquareActivity className="w-6 h-6" />,
    "Consultas especializadas": <Stethoscope className="w-6 h-6" />,
    "Exámenes de sangre": <Droplet className="w-6 h-6" />,
    "Exámenes médicos": <ClipboardList className="w-6 h-6" />,
    "Terapias y tratamientos varios": <HeartPulse className="w-6 h-6" />
  };
  return icons[tipoNombre] || <Plus className="w-6 h-6" />;
};

export const ServiciosModal = ({ open, onOpenChange }: ServiciosModalProps) => {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [serviceTypes, setServiceTypes] = useState<TipoServicio[]>([]);
  const [selectedType, setSelectedType] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [serviciosData, tiposData] = await Promise.all([
          servicioDashboardApi.getAllServicios(),
          servicioApi.getAllTiposServicio()
        ]);
        setServicios(serviciosData);
        setServiceTypes(tiposData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (open) loadData();
  }, [open]);

  const filteredServices = selectedType 
    ? servicios.filter(s => s.tipoServicio.nombre === selectedType)
    : servicios;

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-background rounded-2xl p-6 max-w-4xl w-full h-[80vh] flex flex-col shadow-xl animate-in slide-in-from-bottom-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Servicios Médicos</h2>
              <Button variant="ghost" onClick={() => onOpenChange(false)}>
                <X size={24} />
              </Button>
            </div>

            <div className="mb-6">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Todos los tipos de servicios" />
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="h-48">
                    {serviceTypes.map((tipo) => (
                      <SelectItem key={tipo.id} value={tipo.nombre}>
                        {tipo.nombre}
                      </SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>
            </div>

            <ScrollArea className="flex-1 pr-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {loading ? (
                  Array(6).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-32 rounded-xl" />
                  ))
                ) : filteredServices.map((servicio) => (
                  <div key={servicio.id} className="border rounded-xl p-4 hover:bg-accent/10 transition-colors">
                    <div className="flex gap-4 items-start">
                      <div className="bg-primary-light p-3 rounded-full text-primary-dark">
                        {getServiceIcon(servicio.tipoServicio.nombre)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold">
                              {servicio.descripcion}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {servicio.tipoServicio.nombre}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-primary">
                              ${servicio.precio.toFixed(2)}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${servicio.enabled ? 'bg-green-500' : 'bg-destructive'}`} />
                          <span className="text-sm">
                            {servicio.enabled ? 'Disponible' : 'No disponible'}
                          </span>
                        </div>
                      </div>
                    </div>
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