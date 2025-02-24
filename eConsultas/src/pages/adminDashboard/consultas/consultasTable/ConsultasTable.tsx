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
import { Search, MoreVertical, Trash2, Copy, PlusCircle, DollarSign } from "lucide-react";
import { toast, Toaster } from "sonner";
import { consultaDashboardApi } from "@/api/dashboard/consultaDashboardApi";
import type { ConsultaDTO } from "@/api/models/consultaModels";
import { useAuth } from "@/context/AuthProvider";
import { useNavigate, useOutletContext } from "react-router-dom";
import { CreateConsultaModal } from "./createConsultaModal/CreateConsultaModal";
import { extractErrorMessage } from "@/api/misc/errorHandler";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ConsultasTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [consultas, setConsultas] = useState<ConsultaDTO[]>([]);
  const [filteredConsultas, setFilteredConsultas] = useState<ConsultaDTO[]>([]);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const { personaData } = useAuth();
  const tableRef = useRef<HTMLDivElement>(null);
  const { isAnimating } = useOutletContext<{ isAnimating: boolean }>();
  const [initialLoad, setInitialLoad] = useState(true);
  const navigate = useNavigate();
  const [dateOrder, setDateOrder] = useState<"asc" | "desc">("asc"); 
  setDateOrder;
  const [idOrder, setIdOrder] = useState<"asc" | "desc">("asc"); 
  const isSuperAdmin = personaData?.credenciales.roles.some((role) => role.id === 3);
  const isAdmin = personaData?.credenciales.roles.some(r => [1, 3].includes(r.id));
  // Cargar consultas
  useEffect(() => {
    const fetchConsultas = async () => {
      try {
        const consultasData = await consultaDashboardApi.getAllConsultas();
        setConsultas(consultasData);
        applyFilters(consultasData);

        if (!isAnimating && tableRef.current) {
          tableRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } catch (error) {
        toast.error("Error cargando consultas");
        console.error("Loading error:", error);
      } finally {
        setInitialLoad(false);
      }
    };

    fetchConsultas();
  }, [isAnimating]);

  // Refrescar consultas
  const refreshConsultas = async () => {
    try {
      const consultasData = await consultaDashboardApi.getAllConsultas();
      setConsultas(consultasData);
      applyFilters(consultasData);
    } catch (error) {
      toast.error("Error actualizando consultas");
    }
  };

  // Aplicar filtros y ordenar por fecha o ID
  const applyFilters = (data: ConsultaDTO[]) => {
    const filtered = data.filter((consulta) => {
      const matchesSearch =
        `${consulta.medico.nombre} ${consulta.medico.apellido}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        `${consulta.paciente.nombre} ${consulta.paciente.apellido}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        consulta.fecha.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });

    // Ordenar por fecha
    const sortedByDate = filtered.sort((a, b) => {
      const dateA = new Date(a.fecha).getTime();
      const dateB = new Date(b.fecha).getTime();
      return dateOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    // Ordenar por ID
    const sortedById = sortedByDate.sort((a, b) => {
      return idOrder === "asc" ? a.id - b.id : b.id - a.id;
    });

    setFilteredConsultas(sortedById);
  };

  // Manejar búsqueda
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
    applyFilters(consultas);
  };

  // Manejar orden de ID
  const handleIdOrderChange = (order: "asc" | "desc") => {
    setIdOrder(order);
    applyFilters(consultas);
  };

  // Eliminar consulta
  const handleDeleteClick = async (consulta: ConsultaDTO) => {
    if (consulta.pagado) {
      toast.error("No se puede eliminar una consulta ya pagada");
      return;
    }

    if (!confirm(`¿Eliminar la consulta #${consulta.id}?`)) return;
    try {
      await consultaDashboardApi.deleteConsulta(consulta.id);
      setConsultas((prev) => prev.filter((c) => c.id !== consulta.id));
      setFilteredConsultas((prev) => prev.filter((c) => c.id !== consulta.id));
      toast.success("Consulta eliminada");
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      toast.error("Error eliminando consulta: " + errorMessage);
    }
  };

  // Copiar ID
  const handleCopyId = async (id: number) => {
    try {
      await navigator.clipboard.writeText(id.toString());
      toast.success("ID copiado al portapapeles");
    } catch (error) {
      toast.error("Error copiando ID");
    }
  };

  // Registrar pago
  const handleRegisterPayment = (consultaId: number) => {
    navigate(`/consultas/pay/${consultaId}`);
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
      <CreateConsultaModal
        open={isCreateModalOpen}
        onOpenChange={setCreateModalOpen}
        onCreated={refreshConsultas}
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
            placeholder="Buscar consultas..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10"
          />
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
        </div>

        <div className="flex items-center gap-4">

          <Select value={idOrder} onValueChange={handleIdOrderChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Ordenar por ID" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">ID ascendente</SelectItem>
              <SelectItem value="desc">ID descendente</SelectItem>
            </SelectContent>
          </Select>

          <Button
            className="bg-primary hover:bg-primary-hover text-white"
            onClick={() => setCreateModalOpen(true)}
          >
            <PlusCircle className="mr-2" size={20} />
            Nueva Consulta
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Médico</TableHead>
            <TableHead>Especialidad</TableHead>
            <TableHead>Paciente</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Paquete</TableHead>
            <TableHead>Servicio</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredConsultas.map((consulta) => (
            <TableRow key={consulta.id}>
              <TableCell>
                {consulta.medico.nombre} {consulta.medico.apellido}
              </TableCell>
              <TableCell>
                {consulta.medico.especialidad || "Sin especialidad"}
              </TableCell>
              <TableCell>
                {consulta.paciente.nombre} {consulta.paciente.apellido}
              </TableCell>
              <TableCell>{consulta.fecha}</TableCell>
              <TableCell>#{consulta.idPaquete || "N/A"}</TableCell>
              <TableCell>#{consulta.idServicioMedico || "N/A"}</TableCell>
              <TableCell>${consulta.total.toFixed(2)}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    consulta.pagado
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {consulta.pagado ? "Pagado" : "Pendiente"}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {!consulta.pagado && isAdmin && (
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0 bg-green-100 hover:bg-green-200"
                      onClick={() => handleRegisterPayment(consulta.id)}
                      title="Registrar pago"
                    >
                      <DollarSign className="h-4 w-4 text-green-600" />
                    </Button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleCopyId(consulta.id)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copiar ID
                      </DropdownMenuItem>
                      {isSuperAdmin && !consulta.pagado && (
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(consulta)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}