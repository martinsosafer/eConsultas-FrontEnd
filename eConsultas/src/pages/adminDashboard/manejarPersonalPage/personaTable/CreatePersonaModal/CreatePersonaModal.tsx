"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";
import type { CreatePersona } from "@/api/models/personaModels";
import { extractErrorMessage } from "@/api/misc/errorHandler";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { medicoApi } from "@/api/classes apis/medicoApi";

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
    },
    obraSocial: false,
  });

  const [especialidades, setEspecialidades] = useState<string[]>([]);
  const [loadingEspecialidades, setLoadingEspecialidades] = useState(false);
  const [showCustomEspecialidad, setShowCustomEspecialidad] = useState(false);

  useEffect(() => {
    const fetchEspecialidades = async () => {
      setLoadingEspecialidades(true);
      try {
        const data = await medicoApi.getMedicoSpecialties();
        setEspecialidades(data);
      } catch (error) {
        toast.error("Error al obtener especialidades");
      } finally {
        setLoadingEspecialidades(false);
      }
    };

    if (open && newPersona.tipoPersona === "MEDICO") {
      fetchEspecialidades();
    }
  }, [open, newPersona.tipoPersona]);

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
      const [day, month, year] = newPersona.fechaNacimiento.split("/");
      const dateObj = new Date(`${year}-${month}-${day}`);
      
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
        },
        obraSocial: false,
      });
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      toast.error("Error al crear el usuario: " + errorMessage);
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

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    
    setNewPersona(prev => ({
      ...prev,
      fechaNacimiento: `${day}/${month}/${year}`
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[50rem]">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center text-primary-dark">
            Crear Nuevo Usuario
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-primary-dark">Tipo de Usuario</Label>
              <select
                value={newPersona.tipoPersona}
                onChange={(e) =>
                  handleTipoPersonaChange(
                    e.target.value as "MEDICO" | "PACIENTE"
                  )
                }
                className="w-full p-2 border rounded-lg bg-background focus:ring-2 focus:ring-primary"
              >
                <option value="PACIENTE">Paciente</option>
                <option value="MEDICO">Médico</option>
              </select>
            </div>

            <div>
              <Label className="text-primary-dark">DNI</Label>
              <Input
                value={newPersona.dni}
                onChange={(e) =>
                  setNewPersona((prev) => ({ ...prev, dni: e.target.value }))
                }
                className="focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-primary-dark">Nombre</Label>
              <Input
                value={newPersona.nombre}
                onChange={(e) =>
                  setNewPersona((prev) => ({ ...prev, nombre: e.target.value }))
                }
                className="focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <Label className="text-primary-dark">Apellido</Label>
              <Input
                value={newPersona.apellido}
                onChange={(e) =>
                  setNewPersona((prev) => ({
                    ...prev,
                    apellido: e.target.value,
                  }))
                }
                className="focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-primary-dark">Fecha de Nacimiento</Label>
              <Input
                type="date"
                onChange={handleDateChange}
                className="w-full focus:ring-2 focus:ring-primary"
                value={
                  newPersona.fechaNacimiento
                    ? new Date(
                        newPersona.fechaNacimiento.split("/").reverse().join("-")
                      ).toISOString().split("T")[0]
                    : ""
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-primary-dark">Email</Label>
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
                className="focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <Label className="text-primary-dark">Teléfono</Label>
              <div className="flex gap-2">
                <Input
                  className="w-20 focus:ring-2 focus:ring-primary"
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
                  className="flex-1 focus:ring-2 focus:ring-primary"
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
            <div className="flex items-center justify-end gap-3 p-3 border rounded-lg bg-accent/5">
              <input
                type="checkbox"
                id="obraSocial"
                checked={newPersona.obraSocial}
                onChange={(e) =>
                  setNewPersona((prev) => ({
                    ...prev,
                    obraSocial: e.target.checked,
                  }))
                }
                className="w-5 h-5 cursor-pointer text-primary focus:ring-2 focus:ring-primary"
              />
              <Label htmlFor="obraSocial" className="cursor-pointer text-primary-dark">
                Obra Social
              </Label>
            </div>
          )}

          {newPersona.tipoPersona === "MEDICO" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-primary-dark">Sueldo</Label>
                <Input
                  type="number"
                  value={newPersona.sueldo || ""}
                  onChange={(e) =>
                    setNewPersona((prev) => ({
                      ...prev,
                      sueldo: Number(e.target.value),
                    }))
                  }
                  className="focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <Label className="text-primary-dark">Especialidad</Label>
                {showCustomEspecialidad ? (
                  <div className="flex gap-2">
                    <Input
                      value={newPersona.especialidad || ""}
                      onChange={(e) =>
                        setNewPersona((prev) => ({
                          ...prev,
                          especialidad: e.target.value,
                        }))
                      }
                      className="focus:ring-2 focus:ring-primary"
                    />
                    <Button
                      variant="ghost"
                      onClick={() => setShowCustomEspecialidad(false)}
                      className="text-primary hover:bg-primary/10"
                    >
                      ×
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Select
                      value={newPersona.especialidad || ""}
                      onValueChange={(value) =>
                        setNewPersona((prev) => ({
                          ...prev,
                          especialidad: value,
                        }))
                      }
                      disabled={loadingEspecialidades}
                    >
                      <SelectTrigger className="focus:ring-2 focus:ring-primary">
                        <SelectValue
                          placeholder={
                            loadingEspecialidades
                              ? "Cargando especialidades..."
                              : "Selecciona una especialidad"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <div className="relative">
                          <Input
                            placeholder="Buscar especialidad..."
                            className="mb-2 sticky top-0 focus:ring-2 focus:ring-primary"
                            onChange={(e) => {
                              const searchTerm = e.target.value.toLowerCase();
                              setEspecialidades((prev) =>
                                prev.filter((esp) =>
                                  esp.toLowerCase().includes(searchTerm)
                                )
                              );
                            }}
                          />
                          <ScrollArea className="h-40">
                            {especialidades.map((especialidad) => (
                              <SelectItem
                                key={especialidad}
                                value={especialidad}
                                className="truncate hover:bg-primary/10"
                              >
                                {especialidad}
                              </SelectItem>
                            ))}
                          </ScrollArea>
                        </div>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      onClick={() => setShowCustomEspecialidad(true)}
                      className="text-primary border-primary hover:bg-primary/10"
                    >
                      Añadir nueva
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-center pt-4">
            <Button 
              onClick={handleSubmit}
              className="px-8 py-3 text-lg bg-primary hover:bg-primary-dark transition-colors"
            >
              Crear Usuario
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}