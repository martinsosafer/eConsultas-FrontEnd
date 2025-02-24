"use client";

import { Paquete } from "@/api/models/paqueteModels";
import { paqueteApi } from "@/api/classes apis/paqueteApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { paqueteDashboardApi } from "@/api/dashboard/paqueteDashboardApi";

interface PaqueteSelectionSliderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (paquete: Paquete) => void;
  selectedIds: number[];
}

export const PaqueteSelectionSlider = ({
  open,
  onOpenChange,
  onSelect,
}: PaqueteSelectionSliderProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [paquetes, setPaquetes] = useState<Paquete[]>([]);
  const [loading, setLoading] = useState(false);

  const truncarTexto = (texto: string, longitud: number) =>
    texto.length > longitud ? `${texto.substring(0, longitud)}...` : texto;

  const getTiposUnicos = (paquete: Paquete) => {
    const tipos = new Set(
      paquete.servicios.map((servicio) => servicio.tipoServicio.nombre)
    );
    return Array.from(tipos);
  };

  const handleSearch = async () => {
    if (!searchTerm) return;

    try {
      setLoading(true);
      if (!isNaN(Number(searchTerm))) {
        const paquete = await paqueteApi.getPaqueteById(Number(searchTerm));
        setPaquetes([paquete]);
      } else {
        toast.error("Solo puedes buscar por ID de paquete");
      }
    } catch (error) {
      toast.error("Paquete no encontrado");
    } finally {
      setLoading(false);
    }
  };

  const fetchAll = async () => {
    try {
      setLoading(true);
      const data = await paqueteDashboardApi.getAllPaquetes();
      setPaquetes(data);
    } catch (error) {
      toast.error("Error cargando paquetes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) fetchAll();
  }, [open]);

  return (
    <div
      className={cn(
        "fixed top-0 right-0 h-screen w-full sm:w-[500px] bg-background border-l shadow-xl transform transition-transform duration-300 z-[1000]",
        open ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="p-4 sm:p-6 h-full flex flex-col">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold">Seleccionar Paquete</h2>
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
                placeholder="Buscar por ID de paquete..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                onKeyUp={(e) => e.key === "Enter" && handleSearch()}
              />
              <Search className="absolute left-3 top-3 text-muted-foreground" />
            </div>
            <Button
              onClick={handleSearch}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Buscar"}
            </Button>
          </div>

          <Button
            variant="outline"
            onClick={fetchAll}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading ? "Cargando..." : "Traer todos"}
          </Button>

          <ScrollArea className="flex-1 w-full pr-2 sm:pr-4">
            <div className="space-y-2 pb-4">
              {paquetes.map((paquete) => (
                <div
                  key={paquete.id}
                  className={cn(
                    "p-3 sm:p-4 border rounded-lg transition-all cursor-pointer group",
                    paquete.enabled
                      ? "hover:bg-accent bg-white"
                      : "opacity-50 cursor-not-allowed bg-gray-50"
                  )}
                  onClick={() => {
                    if (paquete.enabled) {
                      onSelect(paquete);
                      onOpenChange(false);
                    }
                  }}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-base sm:text-inherit">
                        Paquete #{paquete.id}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        ${paquete.precio.toFixed(2)}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "text-xs px-2 py-1 rounded-full shrink-0",
                        paquete.enabled
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      )}
                    >
                      {paquete.enabled ? "Activo" : "Inactivo"}
                    </span>
                  </div>

                  <div className="mt-3 sm:mt-4 space-y-2">
                    <h4 className="text-sm font-medium">
                      Servicios incluidos:
                    </h4>
                    {paquete.servicios.map((servicio) => (
                      <div
                        key={servicio.id}
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm max-w-[70%] sm:max-w-[80%] truncate">
                          {truncarTexto(servicio.descripcion, 20)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(servicio.descripcion);
                            toast.success("Descripción copiada");
                          }}
                        >
                          <Copy className="h-4 w-4 text-blue-600" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 sm:mt-4">
                    <h4 className="text-sm font-medium">Tipos de servicios:</h4>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-1.5 sm:mt-2">
                      {getTiposUnicos(paquete).map((tipo) => (
                        <div key={tipo} className="flex items-center gap-1">
                          <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800 max-w-[120px] sm:max-w-none truncate">
                            {truncarTexto(tipo, 12)}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(tipo);
                              toast.success("Tipo copiado");
                            }}
                          >
                            <Copy className="h-3 w-3 text-purple-600" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};
