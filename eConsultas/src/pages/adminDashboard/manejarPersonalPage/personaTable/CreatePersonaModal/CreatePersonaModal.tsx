"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { personaDashboardApi } from "@/api/dashboard/personaDashboardApi";
import type { CreatePersona } from "@/api/models/personaModels";

interface CreatePersonaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (newPersona: CreatePersona) => Promise<void>;
}

export default function CreatePersonaModal({
  open,
  onOpenChange,
  onSave,
}: CreatePersonaModalProps) {
  const [newPersona, setNewPersona] = useState<CreatePersona>({
    tipoPersona: "PACIENTE",
    dni: "",
    nombre: "",
    apellido: "",
    fechaNacimiento: "",
    credenciales: {
      email: "",
      codigoDeLlamada: "+52",
      celular: "",
      roles: [{ id: 1 }],
    },
    obraSocial: false,
  });

  const handleSubmit = async () => {
    if (
      !newPersona.dni ||
      !newPersona.nombre ||
      !newPersona.apellido ||
      !newPersona.fechaNacimiento ||
      !newPersona.credenciales.email ||
      !newPersona.credenciales.celular
    ) {
      toast.error("Por favor complete todos los campos requeridos");
      return;
    }

    try {
      const fechaFormateada = new Date()
        .toISOString()
        .replace("T", " ")
        .split(".")[0];

      const personaToSave = {
        ...newPersona,
        credenciales: {
          ...newPersona.credenciales,
          fechaDeSolicitudDeCodigoDeVerificacion: fechaFormateada,
        },
      };

      await onSave(personaToSave);
      onOpenChange(false);
      setNewPersona({
        tipoPersona: "PACIENTE",
        dni: "",
        nombre: "",
        apellido: "",
        fechaNacimiento: "",
        credenciales: {
          email: "",
          codigoDeLlamada: "+52",
          celular: "",
          roles: [{ id: 1 }],
        },
        obraSocial: false,
      });
    } catch (error) {
      toast.error("Error al crear el usuario");
    }
  };

  const handleTipoPersonaChange = (value: "MEDICO" | "PACIENTE") => {
    setNewPersona((prev) => ({
      ...prev,
      tipoPersona: value,
      credenciales: {
        ...prev.credenciales,
        roles: value === "MEDICO" ? [{ id: 3 }] : [{ id: 1 }],
      },
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Crear Nuevo Usuario</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Tipo de Usuario</Label>
              <select
                value={newPersona.tipoPersona}
                onChange={(e) =>
                  handleTipoPersonaChange(
                    e.target.value as "MEDICO" | "PACIENTE"
                  )
                }
                className="w-full p-2 border rounded"
              >
                <option value="PACIENTE">Paciente</option>
                <option value="MEDICO">Médico</option>
              </select>
            </div>

            <div>
              <Label>DNI</Label>
              <Input
                value={newPersona.dni}
                onChange={(e) =>
                  setNewPersona((prev) => ({ ...prev, dni: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Nombre</Label>
              <Input
                value={newPersona.nombre}
                onChange={(e) =>
                  setNewPersona((prev) => ({ ...prev, nombre: e.target.value }))
                }
              />
            </div>

            <div>
              <Label>Apellido</Label>
              <Input
                value={newPersona.apellido}
                onChange={(e) =>
                  setNewPersona((prev) => ({
                    ...prev,
                    apellido: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Fecha de Nacimiento</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newPersona.fechaNacimiento || "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={
                      newPersona.fechaNacimiento
                        ? new Date(newPersona.fechaNacimiento)
                        : undefined
                    }
                    onSelect={(date) => {
                      if (date) {
                        setNewPersona((prev) => ({
                          ...prev,
                          fechaNacimiento: format(date, "dd/MM/yyyy"),
                        }));
                      }
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={newPersona.credenciales.email}
                onChange={(e) =>
                  setNewPersona((prev) => ({
                    ...prev,
                    credenciales: {
                      ...prev.credenciales,
                      email: e.target.value,
                    },
                  }))
                }
              />
            </div>

            <div>
              <Label>Teléfono</Label>
              <div className="flex gap-2">
                <Input
                  className="w-20"
                  value={newPersona.credenciales.codigoDeLlamada}
                  onChange={(e) =>
                    setNewPersona((prev) => ({
                      ...prev,
                      credenciales: {
                        ...prev.credenciales,
                        codigoDeLlamada: e.target.value,
                      },
                    }))
                  }
                />
                <Input
                  className="flex-1"
                  value={newPersona.credenciales.celular}
                  onChange={(e) =>
                    setNewPersona((prev) => ({
                      ...prev,
                      credenciales: {
                        ...prev.credenciales,
                        celular: e.target.value,
                      },
                    }))
                  }
                />
              </div>
            </div>
          </div>

          {newPersona.tipoPersona === "PACIENTE" && (
            <div className="flex items-center space-x-2">
              <Input
                type="checkbox"
                id="obraSocial"
                checked={newPersona.obraSocial}
                onChange={(e) =>
                  setNewPersona((prev) => ({
                    ...prev,
                    obraSocial: e.target.checked,
                  }))
                }
              />
              <Label htmlFor="obraSocial">Obra Social</Label>
            </div>
          )}

          {newPersona.tipoPersona === "MEDICO" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Sueldo</Label>
                <Input
                  type="number"
                  value={newPersona.sueldo}
                  onChange={(e) =>
                    setNewPersona((prev) => ({
                      ...prev,
                      sueldo: Number(e.target.value),
                    }))
                  }
                />
              </div>

              <div>
                <Label>Especialidad</Label>
                <Input
                  value={newPersona.especialidad}
                  onChange={(e) =>
                    setNewPersona((prev) => ({
                      ...prev,
                      especialidad: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          )}

          <Button className="w-full" onClick={handleSubmit}>
            Crear Usuario
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
