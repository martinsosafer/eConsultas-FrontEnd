"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";
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
    const dateParts = newPersona.fechaNacimiento.split("/");
    const hasValidDate =
      dateParts.length === 3 &&
      dateParts.every((part) => part) &&
      dateParts[0].length <= 2 &&
      dateParts[1].length <= 2 &&
      dateParts[2].length === 4;

    if (
      !newPersona.dni ||
      !newPersona.nombre ||
      !newPersona.apellido ||
      !hasValidDate ||
      !newPersona.credenciales.email ||
      !newPersona.credenciales.celular
    ) {
      toast.error("Por favor complete todos los campos requeridos");
      return;
    }

    try {
      // Format date with leading zeros
      const [day, month, year] = dateParts;
      const formattedDate = `${day.padStart(2, "0")}/${month.padStart(
        "0",
        2
      )}/${year}`;

      // Validate actual date
      const dateObj = new Date(
        `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
      );
      if (isNaN(dateObj.getTime())) {
        toast.error("Fecha de nacimiento inválida");
        return;
      }

      const fechaFormateada = new Date()
        .toISOString()
        .replace("T", " ")
        .split(".")[0];

      const personaToSave = {
        ...newPersona,
        fechaNacimiento: formattedDate,
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

  const handleDatePartChange = (value: string, partIndex: number) => {
    const numericValue = value.replace(/\D/g, "");
    let formattedValue = numericValue;

    if (partIndex !== 2) {
      formattedValue = numericValue.slice(0, 2);
    } else {
      formattedValue = numericValue.slice(0, 4);
    }

    setNewPersona((prev) => {
      const parts = prev.fechaNacimiento.split("/");
      while (parts.length < 3) parts.push("");
      parts[partIndex] = formattedValue;
      return {
        ...prev,
        fechaNacimiento: parts.join("/"),
      };
    });
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
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Input
                    type="text"
                    inputMode="numeric"
                    placeholder="DD"
                    value={newPersona.fechaNacimiento.split("/")[0] || ""}
                    onChange={(e) => handleDatePartChange(e.target.value, 0)}
                  />
                </div>
                <div>
                  <Input
                    type="text"
                    inputMode="numeric"
                    placeholder="MM"
                    value={newPersona.fechaNacimiento.split("/")[1] || ""}
                    onChange={(e) => handleDatePartChange(e.target.value, 1)}
                  />
                </div>
                <div>
                  <Input
                    type="text"
                    inputMode="numeric"
                    placeholder="AAAA"
                    value={newPersona.fechaNacimiento.split("/")[2] || ""}
                    onChange={(e) => handleDatePartChange(e.target.value, 2)}
                  />
                </div>
              </div>
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
                  value={newPersona.sueldo || ""}
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
                  value={newPersona.especialidad || ""}
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
