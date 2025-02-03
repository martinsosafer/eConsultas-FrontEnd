"use client";

import { useState } from "react";
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
} from "lucide-react";

interface User {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  credenciales: {
    email: string;
  };
}

const users: User[] = [
  {
    id: "0f5959ae-e4e3-42f5-ae7d-91796a76a47b",
    pais: null,
    ciudad: null,
    direccion: null,
    numeroExterior: null,
    codigoPostal: null,
    credenciales: {
      id: "66ba7d4a-b225-400c-8793-db939ee706ac",
      persona: null,
      tipoPersona: null,
      email: "iamf_095@hotmail.com",
      username: "iamf_095@hotmail.com",
      password: "$2a$10$2oXmU4SQr8OabLKXtggvrejUJ7IlMMoH5elT/IIaK7UkhG6MHx6RS",
      codigoDeLlamada: "+52",
      celular: "8787912322",
      roles: [
        {
          id: 2,
          nombre: "ROLE_USER",
        },
      ],
      enabled: true,
      intentos: 0,
      codigoDeVerificacion: 2731,
      vencimientoDeCodigoDeVerificacion: null,
      fechaDeSolicitudDeCodigoDeVerificacion: null,
      nivelDeVerificacion: "SIN_VERIFICAR",
      emailVerificado: false,
      celularVerificado: false,
      verificacion2Factores: false,
      nombre: null,
      apellido: null,
    },
    verificado: false,
    tipoPersona: "PACIENTE",
    archivos: null,
    dni: "654321",
    nombre: "alfonso",
    apellido: "meza",
    fechaNacimiento: "01/01/1973",
    obraSocial: null,
    sueldo: 0.0,
    especialidad: null,
    turnos: null,
    consultas: null,
  },
  {
    id: "029ad233-9451-47e8-b6ed-cea1607af9ed",
    pais: null,
    ciudad: null,
    direccion: null,
    numeroExterior: null,
    codigoPostal: null,
    credenciales: {
      id: "720ac65e-eb59-4637-9ca5-c9e53d154cbf",
      persona: null,
      tipoPersona: null,
      email: "irvingmeza95@gmail.com",
      username: "irvingmeza95@gmail.com",
      password: "$2a$10$kmO62MCyhNSLI1OJQgIMp.sEjnhGoVJsGYpNg/.K3871msaMPAVbm",
      codigoDeLlamada: "+52",
      celular: "8781112343",
      roles: [
        {
          id: 3,
          nombre: "ROLE_SUPER_ADMIN",
        },
      ],
      enabled: true,
      intentos: 0,
      codigoDeVerificacion: 7938,
      vencimientoDeCodigoDeVerificacion: null,
      fechaDeSolicitudDeCodigoDeVerificacion: null,
      nivelDeVerificacion: "SIN_VERIFICAR",
      emailVerificado: false,
      celularVerificado: false,
      verificacion2Factores: false,
      nombre: null,
      apellido: null,
    },
    verificado: false,
    tipoPersona: "MEDICO",
    archivos: null,
    dni: "123456",
    nombre: "irving",
    apellido: "meza",
    fechaNacimiento: "01/01/1973",
    obraSocial: null,
    sueldo: 0.0,
    especialidad: null,
    turnos: null,
    consultas: null,
  },
  {
    id: "359e20ba-d04b-486b-b531-d7f1c7f2d496",
    pais: "Argentina",
    ciudad: null,
    direccion: null,
    numeroExterior: null,
    codigoPostal: null,
    credenciales: {
      id: "ac0f738e-201e-4e9a-9960-b60024e4a46a",
      persona: null,
      tipoPersona: null,
      email: "francarri3pro@gmail.com",
      username: "francarri3pro@gmail.com",
      password: "$2a$10$BZcJJe4CUO4niZ2LP1dNZOzSNySYjQAeTbVeHDQ7D8s2.bIBdeMim",
      codigoDeLlamada: "",
      celular: "8787912321231232",
      roles: [
        {
          id: 1,
          nombre: "ROLE_ADMIN",
        },
      ],
      enabled: true,
      intentos: 0,
      codigoDeVerificacion: 2961,
      vencimientoDeCodigoDeVerificacion: null,
      fechaDeSolicitudDeCodigoDeVerificacion: null,
      nivelDeVerificacion: "SIN_VERIFICAR",
      emailVerificado: false,
      celularVerificado: false,
      verificacion2Factores: false,
      nombre: null,
      apellido: null,
    },
    verificado: false,
    tipoPersona: "MEDICO",
    archivos: null,
    dni: "65432232131",
    nombre: "Francisco",
    apellido: "Carrizo",
    fechaNacimiento: "2025-02-05",
    obraSocial: null,
    sueldo: 0.0,
    especialidad: null,
    turnos: null,
    consultas: null,
  },
];

export default function PersonaTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = users.filter(
      (user) =>
        user.nombre.toLowerCase().includes(term) ||
        user.apellido.toLowerCase().includes(term) ||
        user.credenciales.email.toLowerCase().includes(term) ||
        user.dni.toLowerCase().includes(term)
    );
    setFilteredUsers(filtered);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
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
        <Button className="bg-primary hover:bg-primary-hover text-white">
          <UserPlus className="mr-2" size={20} />
          Add Person
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Apellido</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>DNI</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Turnos</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.apellido}</TableCell>
              <TableCell>{user.nombre}</TableCell>
              <TableCell>{user.dni}</TableCell>
              <TableCell>{user.credenciales.email}</TableCell>
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
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
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
