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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Search,
  UserPlus,
  CalendarIcon,
  MoreVertical,
  Edit,
  Trash2,
  Copy,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import { personaDashboardApi } from "@/api/dashboard/personaDashboardApi";
import { personaApi } from "@/api/classes apis/personaApi";
import type { Medico, Paciente } from "@/api/models/personaModels";
import EditPersonaModal from "./EditPersonaModal/EditPersonaModal";
import { useAuth } from "@/context/AuthProvider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOutletContext } from "react-router-dom";
import CreatePersonaModal from "./CreatePersonaModal/CreatePersonaModal";

export default function PersonaTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<(Medico | Paciente)[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<(Medico | Paciente)[]>([]);
  const [editingUser, setEditingUser] = useState<Medico | Paciente | null>(
    null
  );
  const [filter, setFilter] = useState<"all" | "PACIENTE" | "MEDICO">("all");

  const personaData = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  // Chequeamos si es superadmin para mostrar el de eliminar.
  // En este caso podemos verificar si es role 3 (SUPERADMIN).
  const isSuperAdmin = personaData.personaData?.credenciales.roles.some(
    (role) => role.id === 3
  );

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const personas = await personaDashboardApi.getAllPersonas();
        setUsers(personas);
        const filtered = personas.filter((user) =>
          filter === "all" ? true : user.tipoPersona === filter
        );
        setFilteredUsers(filtered);
      } catch (error) {
        toast.error("Error loading users");
      }
    };

    fetchUsers();
  }, [filter]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = users.filter(
      (user) =>
        (filter === "all" || user.tipoPersona === filter) &&
        (user.nombre.toLowerCase().includes(term) ||
          user.apellido.toLowerCase().includes(term) ||
          user.credenciales.email.toLowerCase().includes(term) ||
          user.dni.toLowerCase().includes(term))
    );
    setFilteredUsers(filtered);
  };
  const handleCreateUser = async (newUserData: CreatePersona) => {
    try {
      const createdUser = await personaDashboardApi.createPersona(newUserData);
      setUsers((prev) => [...prev, createdUser]);
      setFilteredUsers((prev) => [...prev, createdUser]);
      toast.success("Usuario creado con éxito");
    } catch (error) {
      console.log("error", error);
      toast.error("Error al crear el usuario");
    }
  };

  const handleEditClick = (user: Medico | Paciente) => {
    setEditingUser(user);
  };

  const handleSave = async (updatedUser: Medico | Paciente) => {
    try {
      const savedUser = await personaApi.updatePersona(
        updatedUser.credenciales.email,
        updatedUser
      );
      setUsers(
        users.map((user) => (user.id === savedUser.id ? savedUser : user))
      );
      setFilteredUsers(
        filteredUsers.map((user) =>
          user.id === savedUser.id ? savedUser : user
        )
      );
      setEditingUser(null);
      toast.success("Usuario actualizado con éxito");
    } catch (error) {
      toast.error("Error saving user");
    }
  };

  const handleDeleteClick = async (user: Medico | Paciente) => {
    if (
      !confirm(`¿Estás seguro de eliminar a ${user.nombre} ${user.apellido}?`)
    ) {
      return;
    }
    try {
      await personaApi.deletePersona(user.credenciales.email);

      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      setFilteredUsers((prev) => prev.filter((u) => u.id !== user.id));
      toast.success("Eliminamos al usuario con éxito");
    } catch (error) {
      toast.error("Error al eliminar el usuario");
      console.error("Error deleting user:", error);
    }
  };

  const handleCopyUserId = async (user: Medico | Paciente) => {
    try {
      await navigator.clipboard.writeText(user.id);
      toast.success("ID del usuario copiado al portapapeles");
    } catch (error) {
      toast.error("Error copiando el ID");
    }
  };
  const tableRef = useRef<HTMLDivElement>(null);
  const { isAnimating } = useOutletContext<{ isAnimating: boolean }>();
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const personas = await personaDashboardApi.getAllPersonas();
        setUsers(personas);
        const filtered = personas.filter((user) =>
          filter === "all" ? true : user.tipoPersona === filter
        );
        setFilteredUsers(filtered);

        // Scroll after data loads
        if (!isAnimating && tableRef.current) {
          tableRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      } catch (error) {
        toast.error("Error loading users");
      }
    };

    fetchUsers();
  }, [filter, isAnimating]);
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
        <div className="flex items-center">
          <div className="relative w-64">
            <Input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10"
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
          <div className="flex items-center space-x-4 ml-4">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-secondary mr-2"></div>
              <span className="text-sm">Paciente</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-accent mr-2"></div>
              <span className="text-sm">Medico</span>
            </div>
          </div>
        </div>
        <Select
          value={filter}
          onValueChange={(value: "all" | "PACIENTE" | "MEDICO") =>
            setFilter(value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Users</SelectItem>
            <SelectItem value="PACIENTE">Pacientes</SelectItem>
            <SelectItem value="MEDICO">Medicos</SelectItem>
          </SelectContent>
        </Select>
        <Button
          className="bg-primary hover:bg-primary-hover text-white"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <UserPlus className="mr-2" size={20} />
          Añadir Usuario
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Apellido</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>DNI</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Obra Social</TableHead>
            <TableHead>Sueldo</TableHead>
            <TableHead>Especialidad</TableHead>
            <TableHead>Turnos</TableHead>
            <TableHead>Editar/Eliminar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow
              key={user.id}
              className={
                user.tipoPersona === "PACIENTE" ? "bg-secondary" : "bg-accent"
              }
            >
              <TableCell>{user.apellido}</TableCell>
              <TableCell>{user.nombre}</TableCell>
              <TableCell>{user.dni}</TableCell>
              <TableCell>{user.credenciales.email}</TableCell>
              <TableCell>
                {user.tipoPersona === "PACIENTE"
                  ? (user as Paciente).obraSocial
                    ? "Yes"
                    : "No"
                  : ""}
              </TableCell>
              {/* Sueldo (Medico only) */}
              <TableCell>
                {user.tipoPersona === "MEDICO"
                  ? `$${(user as Medico).sueldo.toLocaleString()}`
                  : ""}
              </TableCell>
              {/* Especialidad (Medico only) */}
              <TableCell>
                {user.tipoPersona === "MEDICO"
                  ? (user as Medico).especialidad
                  : ""}
              </TableCell>
              <TableCell>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-[240px] justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      View Turnos
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={new Date()}
                      onSelect={() => {}}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleCopyUserId(user)}>
                      <Copy className="mr-2 h-4 w-4" />
                      <span>Copiar ID</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {editingUser && (
        <EditPersonaModal
          open={true}
          onOpenChange={(open) => !open && setEditingUser(null)}
          persona={editingUser}
          onSave={handleSave}
          onChange={setEditingUser}
        />
      )}
      {isCreateModalOpen && (
        <CreatePersonaModal
          open={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
          onSave={handleCreateUser}
        />
      )}
    </div>
  );
}
