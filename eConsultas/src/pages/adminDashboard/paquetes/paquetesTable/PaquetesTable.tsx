"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, MoreVertical, Trash2, Copy, PlusCircle } from "lucide-react";
import { toast, Toaster } from "sonner";
import { paqueteDashboardApi } from "@/api/dashboard/paqueteDashboardApi";
import { servicioApi } from "@/api/classes apis/servicioApi";
import type { Paquete } from "@/api/models/paqueteModels";
import { useAuth } from "@/context/AuthProvider";
import { useOutletContext } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreatePaqueteModal } from "./CreatePaqueteModal/CreatePaqueteModal";
import { Switch } from "@/components/ui/switch";
import { TipoServicio } from "@/api/models/servicioModels";

export default function PaqueteTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [paquetes, setPaquetes] = useState<Paquete[]>([]);
  const [filteredPaquetes, setFilteredPaquetes] = useState<Paquete[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [tiposServicio, setTiposServicio] = useState<TipoServicio[]>([]);
  const { personaData } = useAuth();
  const tableRef = useRef<HTMLDivElement>(null);
  const { isAnimating } = useOutletContext<{ isAnimating: boolean }>();
  const [initialLoad, setInitialLoad] = useState(true);

  const isSuperAdmin = personaData?.credenciales.roles.some(
    (role) => role.id === 3
  );

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [paquetesData, tiposData] = await Promise.all([
          paqueteDashboardApi.getAllPaquetes(),
          servicioApi.getAllTiposServicio()
        ]);
        setPaquetes(paquetesData);
        setTiposServicio(tiposData);
        applyFilters(paquetesData, filter);
      } catch (error) {
        toast.error("Error cargando datos iniciales");
      }
    };
    loadInitialData();
  }, [isAnimating]);

  const refreshPaquetes = async () => {
    try {
      const paquetesData = await paqueteDashboardApi.getAllPaquetes();
      setPaquetes(paquetesData);
      applyFilters(paquetesData, filter);
    } catch (error) {
      toast.error("Error actualizando paquetes");
    }
  };

  const applyFilters = (data: Paquete[], currentFilter: string) => {
    const filtered = data.filter((paquete) => {
      const matchesSearch =
        paquete.servicios.some((servicio) =>
          servicio.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
        ) || paquete.id.toString().includes(searchTerm);

      const matchesType =
        currentFilter === "all" ||
        paquete.servicios.some(
          (servicio) => servicio.tipoServicio.nombre === currentFilter
        );

      return matchesSearch && matchesType;
    });
    setFilteredPaquetes(filtered);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
    applyFilters(paquetes, filter);
  };

  const handleFilterChange = (value: string) => {
    setFilter(value);
    applyFilters(paquetes, value);
  };

  const handleDeleteClick = async (paquete: Paquete) => {
    if (!confirm(`¿Eliminar el paquete #${paquete.id}?`)) return;
    try {
      await paqueteDashboardApi.deletePaquete(paquete.id);
      setPaquetes(paquetes.filter((p) => p.id !== paquete.id));
      setFilteredPaquetes(filteredPaquetes.filter((p) => p.id !== paquete.id));
      toast.success("Paquete eliminado exitosamente");
    } catch (error) {
      toast.error("Error eliminando paquete");
    }
  };

  const handleToggleEnabled = async (paquete: Paquete, enabled: boolean) => {
    try {
      await paqueteDashboardApi.editPaquete(paquete.id, { enabled });
      const updatedPaquetes = paquetes.map(p => 
        p.id === paquete.id ? { ...p, enabled } : p
      );
      setPaquetes(updatedPaquetes);
      applyFilters(updatedPaquetes, filter);
      toast.success(`Paquete ${enabled ? "activado" : "desactivado"}`);
    } catch (error) {
      toast.error("Error actualizando estado del paquete");
    }
  };

  const handleCopyId = async (id: number) => {
    try {
      await navigator.clipboard.writeText(id.toString());
      toast.success("ID copiado al portapapeles");
    } catch (error) {
      toast.error("Error copiando ID");
    }
  };

  const getUniqueServiceTypes = (paquete: Paquete) => {
    const types = new Set(
      paquete.servicios.map((servicio) => servicio.tipoServicio.nombre)
    );
    return Array.from(types).join(", ");
  };

  return (
    <div
      ref={tableRef}
      className="container mx-auto p-6 space-y-6"
      style={{
        opacity: initialLoad ? 0 : 1,
        transition: "opacity 0.2s ease",
      }}
      onTransitionEnd={() => setInitialLoad(false)}
    >
      <CreatePaqueteModal
        open={isCreateModalOpen}
        onOpenChange={setCreateModalOpen}
        onCreated={refreshPaquetes}
      />

      <Toaster
        theme="system"
        toastOptions={{
          classNames: {
            toast:
              "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
            description: "group-[.toast]:text-muted-foreground",
            success:
              "group-[.toast]:bg-green-100 group-[.toast]:text-green-800 group-[.toast]:border-green-200",
            error:
              "group-[.toast]:bg-red-100 group-[.toast]:text-red-800 group-[.toast]:border-red-200",
          },
        }}
      />

      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <Input
            placeholder="Buscar paquetes..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10"
          />
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
        </div>

        <Select value={filter} onValueChange={handleFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {tiposServicio.map((tipo) => (
              <SelectItem key={tipo.id} value={tipo.nombre}>
                {tipo.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          className="bg-primary hover:bg-primary-hover text-white"
          onClick={() => setCreateModalOpen(true)}
        >
          <PlusCircle className="mr-2" size={20} />
          Nuevo Paquete
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead>Servicios</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPaquetes.map((paquete) => (
            <TableRow key={paquete.id}>
              <TableCell>#{paquete.id}</TableCell>
              <TableCell>${paquete.precio.toFixed(2)}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span>{paquete.servicios.length} servicios</span>
                  <span className="text-sm text-muted-foreground">
                    ({getUniqueServiceTypes(paquete)})
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={paquete.enabled}
                    onCheckedChange={(enabled) =>
                      handleToggleEnabled(paquete, enabled)
                    }
                  />
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      paquete.enabled
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {paquete.enabled ? "Activo" : "Inactivo"}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleCopyId(paquete.id)}>
                      <Copy className="mr-2 h-4 w-4" />
                      Copiar ID
                    </DropdownMenuItem>
                    {isSuperAdmin && (
                      <>
                        <DropdownMenuItem
                          onClick={() => handleToggleEnabled(paquete, !paquete.enabled)}
                        >
                          {paquete.enabled ? "Desactivar" : "Activar"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(paquete)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}