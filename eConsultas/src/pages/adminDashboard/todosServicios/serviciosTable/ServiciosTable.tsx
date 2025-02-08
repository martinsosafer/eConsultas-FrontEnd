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
import type { Servicio } from "@/api/models/servicioModels";

import { useAuth } from "@/context/AuthProvider";
import { useOutletContext } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ServicioTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [filteredServicios, setFilteredServicios] = useState<Servicio[]>([]);
  const [editingServicio, setEditingServicio] = useState<Servicio | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const { personaData } = useAuth();
  const tableRef = useRef<HTMLDivElement>(null);
  const { isAnimating } = useOutletContext<{ isAnimating: boolean }>();
  const [initialLoad, setInitialLoad] = useState(true);

  const isSuperAdmin = personaData?.credenciales.roles.some(
    (role) => role.id === 3
  );

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const serviciosData = await servicioDashboardApi.getAllServicios();
        setServicios(serviciosData);
        applyFilters(serviciosData, filter);

        if (!isAnimating && tableRef.current) {
          tableRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      } catch (error) {
        toast.error("Error cargando servicios");
      }
    };

    fetchServicios();
  }, [isAnimating]);

  const applyFilters = (data: Servicio[], currentFilter: string) => {
    const filtered = data.filter(
      (servicio) =>
        (currentFilter === "all" ||
          servicio.tipoServicio.nombre === currentFilter) &&
        servicio.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleEditClick = (servicio: Servicio) => {
    setEditingServicio(servicio);
  };

  const handleSave = async (updatedServicio: Servicio) => {
    try {
      // Implement your update API call here
      setServicios(
        servicios.map((s) =>
          s.id === updatedServicio.id ? updatedServicio : s
        )
      );
      setFilteredServicios(
        filteredServicios.map((s) =>
          s.id === updatedServicio.id ? updatedServicio : s
        )
      );
      setEditingServicio(null);
      toast.success("Servicio actualizado con éxito");
    } catch (error) {
      toast.error("Error actualizando servicio");
    }
  };

  const handleDeleteClick = async (servicio: Servicio) => {
    if (!confirm(`¿Eliminar el servicio: ${servicio.descripcion}?`)) return;
    try {
      // Implement your delete API call here
      setServicios(servicios.filter((s) => s.id !== servicio.id));
      setFilteredServicios(
        filteredServicios.filter((s) => s.id !== servicio.id)
      );
      toast.success("Servicio eliminado");
    } catch (error) {
      toast.error("Error eliminando servicio");
    }
  };

  const handleCopyId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      toast.success("ID copiado al portapapeles");
    } catch (error) {
      toast.error("Error copiando ID");
    }
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
            placeholder="Buscar servicios..."
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
            <SelectItem value="Consultas generales">
              Consultas generales
            </SelectItem>
            <SelectItem value="Consultas especializadas">
              Consultas especializadas
            </SelectItem>
            <SelectItem value="Exámenes médicos">Exámenes médicos</SelectItem>
          </SelectContent>
        </Select>

        <Button className="bg-primary hover:bg-primary-hover text-white">
          <PlusCircle className="mr-2" size={20} />
          Nuevo Servicio
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Descripción</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead>Tipo de Servicio</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredServicios.map((servicio) => (
            <TableRow key={servicio.id}>
              <TableCell>{servicio.descripcion}</TableCell>
              <TableCell>${servicio.precio.toFixed(2)}</TableCell>
              <TableCell>{servicio.tipoServicio.nombre}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    servicio.enabled
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {servicio.enabled ? "Activo" : "Inactivo"}
                </span>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleCopyId(servicio.id)}>
                      <Copy className="mr-2 h-4 w-4" />
                      Copiar ID
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEditClick(servicio)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    {isSuperAdmin && (
                      <DropdownMenuItem
                        onClick={() => handleDeleteClick(servicio)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Eliminar
                      </DropdownMenuItem>
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
