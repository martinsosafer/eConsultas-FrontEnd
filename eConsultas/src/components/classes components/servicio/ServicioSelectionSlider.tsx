"use client";

import { Servicio } from "@/api/models/servicioModels";
import { servicioApi } from "@/api/classes apis/servicioApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TipoServicio } from "@/api/models/servicioModels";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { servicioDashboardApi } from "@/api/dashboard/servicioDashboardApi";

interface ServicioSelectionSliderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (servicio: Servicio) => void;
  selectedIds: number[];
}

export const ServicioSelectionSlider = ({
  open,
  onOpenChange,
  onSelect,
  selectedIds,
}: ServicioSelectionSliderProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [tiposServicio, setTiposServicio] = useState<TipoServicio[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        const tipos = await servicioApi.getAllTiposServicio();
        setTiposServicio(tipos);
        
        const servicios = await servicioDashboardApi.getAllServicios();
        setServicios(servicios);

      } catch (error) {
        toast.error("Error cargando datos");
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredServicios = servicios.filter(servicio => {
    const matchesSearch = servicio.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filter === "all" || servicio.tipoServicio.nombre === filter;
    return matchesSearch && matchesType;
  });

  return (
    <div className={cn(
      "fixed top-0 right-0 h-full w-96 bg-background border-l shadow-lg transform transition-transform",
      open ? "translate-x-0" : "translate-x-full"
    )}>
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Seleccionar Servicios</h2>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>×</Button>
        </div>

        <div className="relative">
          <Input
            placeholder="Buscar servicios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-3 text-muted-foreground" />
        </div>

        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {tiposServicio.map(tipo => (
              <SelectItem key={tipo.id} value={tipo.nombre}>
                {tipo.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <ScrollArea className="h-[calc(100vh-200px)]">
          {loading ? (
            <div className="text-center py-4">Cargando servicios...</div>
          ) : filteredServicios.length === 0 ? (
            <div className="text-center py-4">No se encontraron servicios</div>
          ) : (
            <div className="space-y-2">
              {filteredServicios.map(servicio => (
                <div
                  key={servicio.id}
                  className={cn(
                    "p-4 border rounded-lg cursor-pointer transition-colors",
                    servicio.enabled && !selectedIds.includes(servicio.id)
                      ? "hover:bg-accent"
                      : "opacity-50 cursor-not-allowed",
                    selectedIds.includes(servicio.id) && "bg-primary-light/20 border-primary"
                  )}
                  onClick={() => servicio.enabled && onSelect(servicio)}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{servicio.descripcion}</h3>
                    <span className="text-sm font-semibold">
                      ${servicio.precio.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm text-muted-foreground">
                      {servicio.tipoServicio.nombre}
                    </span>
                    <span className={cn(
                      "text-xs px-2 py-1 rounded-full",
                      servicio.enabled
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    )}>
                      {servicio.enabled ? "Habilitado" : "Deshabilitado"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};