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
import {
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  PlusCircle,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import { servicioDashboardApi } from "@/api/dashboard/servicioDashboardApi";
import type { Servicio, TipoServicio } from "@/api/models/servicioModels";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/context/AuthProvider";
import { useOutletContext } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CreateServicioModal from "./CreateServicioModal/CreateServicioModal";
import { servicioApi } from "@/api/classes apis/servicioApi";
import EditServicioModal from "./EditServicioModal/EditServicioModal";
import { extractErrorMessage } from "@/api/misc/errorHandler";

export default function ServicioTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [tiposServicio, setTiposServicio] = useState<TipoServicio[]>([]);
  const [filteredServicios, setFilteredServicios] = useState<Servicio[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [editingServicio, setEditingServicio] = useState<Servicio | null>(null);
  const { personaData } = useAuth();
  const tableRef = useRef<HTMLDivElement>(null);
  const { isAnimating } = useOutletContext<{ isAnimating: boolean }>();
  const [initialLoad, setInitialLoad] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const isSuperAdmin = personaData?.credenciales.roles.some(
    (role) => role.id === 3
  );

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [serviciosData, tiposData] = await Promise.all([
          servicioDashboardApi.getAllServicios(),
          servicioApi.getAllTiposServicio(),
        ]);
        setServicios(serviciosData);
        setTiposServicio(tiposData);
        applyFilters(serviciosData, filter);
      } catch (error) {
        const errorMessage = extractErrorMessage(error);
        toast.error("Error cargando datos iniciales: " + errorMessage);
      } finally {
        setInitialLoad(false);
      }
    };

    loadInitialData();
  }, [isAnimating]);

  const applyFilters = (data: Servicio[], currentFilter: string) => {
    const filtered = data.filter(
      (servicio) =>
        (currentFilter === "all" ||
          servicio.tipoServicio.id.toString() === currentFilter) &&
        (servicio.descripcion
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
          servicio.id.toString().includes(searchTerm))
    );
    setFilteredServicios(filtered);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
    applyFilters(servicios, filter);
  };

  const handleFilterChange = (value: string) => {
    setFilter(value);
    applyFilters(servicios, value);
  };

  const handleToggleEnabled = async (servicio: Servicio, enabled: boolean) => {
    try {
      const updatedServicio = await servicioDashboardApi.editServicio(
        servicio.id,
        {
          ...servicio,
          enabled,
        }
      );

      setServicios((prev) =>
        prev.map((s) => (s.id === servicio.id ? updatedServicio : s))
      );
      applyFilters(
        servicios.map((s) => (s.id === servicio.id ? updatedServicio : s)),
        filter
      );
      toast.success(`Servicio ${enabled ? "activado" : "desactivado"}`);
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      toast.error("Error actualizando servicio: " + errorMessage);
    }
  };

  const handleDeleteClick = async (servicio: Servicio) => {
    if (!confirm(`¿Eliminar el servicio: ${servicio.descripcion}?`)) return;
    try {
      await servicioDashboardApi.deleteServicio(servicio.id);
      setServicios((prev) => prev.filter((s) => s.id !== servicio.id));
      setFilteredServicios((prev) => prev.filter((s) => s.id !== servicio.id));
      toast.success("Servicio eliminado");
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      toast.error("Error eliminando servicio: " + errorMessage);
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

  return (
    <div
      ref={tableRef}
      className="w-full max-w-[100vw] overflow-x-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6"
      style={{
        opacity: initialLoad ? 0 : 1,
        transition: "opacity 0.2s ease",
      }}
    >
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

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-64 max-w-xs">
          <Input
            placeholder="Buscar servicios..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10"
          />
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={20}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Select value={filter} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {tiposServicio.map((tipo) => (
                <SelectItem key={tipo.id} value={tipo.id.toString()}>
                  {tipo.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {isSuperAdmin && (
            <Button
              onClick={() => setCreateModalOpen(true)}
              className="w-full sm:w-auto"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Nuevo Servicio
            </Button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descripción</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredServicios.map((servicio) => (
              <TableRow key={servicio.id}>
                <TableCell className="font-medium">
                  {servicio.descripcion}
                </TableCell>
                <TableCell>${servicio.precio.toFixed(2)}</TableCell>
                <TableCell>{servicio.tipoServicio.nombre}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={servicio.enabled}
                      onCheckedChange={(enabled) =>
                        handleToggleEnabled(servicio, enabled)
                      }
                    />
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        servicio.enabled
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {servicio.enabled ? "Activo" : "Inactivo"}
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
                      <DropdownMenuItem
                        onClick={() => handleCopyId(servicio.id)}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copiar ID
                      </DropdownMenuItem>
                      {isSuperAdmin && (
                        <>
                          <DropdownMenuItem
                            onClick={() => setEditingServicio(servicio)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteClick(servicio)}
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

      <CreateServicioModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSave={async (newServicio) => {
          try {
            const createdServicio = await servicioDashboardApi.createServicio(
              newServicio
            );
            setServicios((prev) => [...prev, createdServicio]);
            applyFilters([...servicios, createdServicio], filter);
          } catch (error) {
            const errorMessage = extractErrorMessage(error);
            toast.error("Error creando servicio: " + errorMessage);
          }
        }}
      />

      {editingServicio && (
        <EditServicioModal
          open={!!editingServicio}
          onOpenChange={(open) => {
            if (!open) {
              setEditingServicio(null);
            }
          }}
          servicio={editingServicio}
          tiposServicio={tiposServicio}
          onSave={async (updatedServicio) => {
            try {
              const updated = await servicioDashboardApi.editServicio(
                updatedServicio.id,
                updatedServicio
              );
              setServicios((prev) =>
                prev.map((s) => (s.id === updated.id ? updated : s))
              );
              setFilteredServicios((prev) =>
                prev.map((s) => (s.id === updated.id ? updated : s))
              );
              setEditingServicio(null);
              toast.success("Servicio actualizado con éxito");
            } catch (error) {
              const errorMessage = extractErrorMessage(error);
              toast.error("Error actualizando servicio: " + errorMessage);
            }
          }}
        />
      )}
    </div>
  );
}
