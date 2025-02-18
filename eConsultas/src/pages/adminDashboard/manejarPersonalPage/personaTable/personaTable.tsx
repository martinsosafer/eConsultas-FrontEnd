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
  UserPlus,
  MoreVertical,
  Edit,
  Trash2,
  Copy,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import { personaDashboardApi } from "@/api/dashboard/personaDashboardApi";
import { personaApi } from "@/api/classes apis/personaApi";
import type { CreatePersona, Medico, Paciente } from "@/api/models/personaModels";
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
import { Switch } from "@/components/ui/switch";

export default function PersonaTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<(Medico | Paciente)[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<(Medico | Paciente)[]>([]);
  const [editingUser, setEditingUser] = useState<Medico | Paciente | null>(null);
  const [filter, setFilter] = useState<"all" | "PACIENTE" | "MEDICO">("all");
  const { personaData } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const isSuperAdmin = personaData?.credenciales.roles.some(
    (role) => role.id === 3
  );
  const isAdmin = personaData?.credenciales.roles.some(
    (role) => role.id === 1
  );

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const personas = await personaDashboardApi.getAllPersonas();
        setUsers(personas);
        applyFilters(personas, filter, searchTerm);
      } catch (error) {
        toast.error("Error cargando usuarios");
      }
    };
    fetchUsers();
  }, [filter]);

  const applyFilters = (data: (Medico | Paciente)[], currentFilter: string, term: string) => {
    const filtered = data.filter((user) => {
      const matchesType = currentFilter === "all" || user.tipoPersona === currentFilter;
      const matchesSearch = user.nombre.toLowerCase().includes(term.toLowerCase()) ||
        user.apellido.toLowerCase().includes(term.toLowerCase()) ||
        user.credenciales.email.toLowerCase().includes(term.toLowerCase()) ||
        user.dni.toLowerCase().includes(term.toLowerCase());
      return matchesType && matchesSearch;
    });
    setFilteredUsers(filtered);
  };

  const handleToggleEnabled = async (user: Medico | Paciente, enabled: boolean) => {
    const isTargetSuperAdmin = user.credenciales.roles.some(role => role.id === 3);
    if (isTargetSuperAdmin) {
      toast.error("No se puede modificar a un SuperAdmin");
      return;
    }

    try {
      await personaDashboardApi.disableOrEnableUser(user.credenciales.email);
      const updatedUsers = users.map(u => 
        u.id === user.id ? { ...u, credenciales: { ...u.credenciales, enabled } } : u
      );
      setUsers(updatedUsers);
      applyFilters(updatedUsers, filter, searchTerm);
      toast.success(`Usuario ${enabled ? "habilitado" : "deshabilitado"}`);
    } catch (error) {
      toast.error("Error actualizando estado del usuario");
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
    applyFilters(users, filter, term);
  };

  const handleCreateUser = async (newUserData: CreatePersona) => {
    try {
      const createdUser = await personaDashboardApi.createPersona(newUserData);
      const updatedUsers = [...users, createdUser];
      setUsers(updatedUsers);
      applyFilters(updatedUsers, filter, searchTerm);
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
      setUsers(users.map(user => user.id === savedUser.id ? savedUser : user));
      setFilteredUsers(filteredUsers.map(user => 
        user.id === savedUser.id ? savedUser : user
      ));
      setEditingUser(null);
      toast.success("Usuario actualizado con éxito");
    } catch (error) {
      toast.error("Error saving user");
    }
  };

  const mapRoles = (roles: { id: number }[]) => {
    return roles.map(role => {
      switch(role.id) {
        case 1: return "Admin";
        case 2: return "Cliente";
        case 3: return "Super Admin";
        default: return "Desconocido";
      }
    }).join(", ");
  };

  const handleDeleteClick = async (user: Medico | Paciente) => {
    const isTargetSuperAdmin = user.credenciales.roles.some(role => role.id === 3);
    if (isTargetSuperAdmin) {
      toast.error("No se puede eliminar a un SuperAdmin");
      return;
    }

    if (!confirm(`¿Estás seguro de eliminar a ${user.nombre} ${user.apellido}?`)) return;
    
    try {
      await personaApi.deletePersona(user.credenciales.email);
      const updatedUsers = users.filter(u => u.id !== user.id);
      setUsers(updatedUsers);
      applyFilters(updatedUsers, filter, searchTerm);
      toast.success("Usuario eliminado con éxito");
    } catch (error) {
      toast.error("Error al eliminar el usuario");
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
        applyFilters(personas, filter, searchTerm);

        if (!isAnimating && tableRef.current) {
          tableRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
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
      style={{ opacity: initialLoad ? 0 : 1, transition: "opacity 0.2s ease" }}
      onTransitionEnd={() => setInitialLoad(false)}
    >
      <Toaster theme="system" toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          success: "group-[.toast]:bg-green-100 group-[.toast]:text-green-800 group-[.toast]:border-green-200",
          error: "group-[.toast]:bg-red-100 group-[.toast]:text-red-800 group-[.toast]:border-red-200",
        },
      }} />

      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="relative w-64">
            <Input
              type="text"
              placeholder="Buscar usuarios..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
          <div className="flex items-center space-x-4 ml-4">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-secondary-light mr-2"></div>
              <span className="text-sm">Paciente</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-accent-light mr-2"></div>
              <span className="text-sm">Médico</span>
            </div>
          </div>
        </div>

        <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="PACIENTE">Pacientes</SelectItem>
            <SelectItem value="MEDICO">Médicos</SelectItem>
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
            <TableHead>Roles</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user) => {
            const isTargetSuperAdmin = user.credenciales.roles.some(role => role.id === 3);
            return (
              <TableRow key={user.id} 
                className={user.tipoPersona === "PACIENTE" 
                  ? "bg-secondary-light/50 hover:bg-secondary-light/70" 
                  : "bg-accent-light/50 hover:bg-accent-light/70"}>
                <TableCell>{user.apellido}</TableCell>
                <TableCell>{user.nombre}</TableCell>
                <TableCell>{user.dni}</TableCell>
                <TableCell>{user.credenciales.email}</TableCell>
                <TableCell>
                  {user.tipoPersona === "PACIENTE" 
                    ? (user as Paciente).obraSocial ? "Sí" : "No" 
                    : "-"}
                </TableCell>
                <TableCell>
                  {user.tipoPersona === "MEDICO" 
                    ? `$${(user as Medico).sueldo.toLocaleString()}` 
                    : "-"}
                </TableCell>
                <TableCell>
                  {user.tipoPersona === "MEDICO" 
                    ? (user as Medico).especialidad 
                    : "-"}
                </TableCell>
                <TableCell>
                  <span className="px-2 py-1 bg-primary-light/20 text-primary-dark rounded-full text-xs">
                    {mapRoles(user.credenciales.roles)}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={user.credenciales.enabled}
                      onCheckedChange={(enabled) => handleToggleEnabled(user, enabled)}
                      disabled={isTargetSuperAdmin || !(isAdmin || isSuperAdmin)}
                    />
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.credenciales.enabled 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {user.credenciales.enabled ? "Activo" : "Inactivo"}
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
                      <DropdownMenuItem onClick={() => handleCopyUserId(user)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copiar ID
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditClick(user)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      {isSuperAdmin && !isTargetSuperAdmin && (
                        <DropdownMenuItem onClick={() => handleDeleteClick(user)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )}
          )}
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