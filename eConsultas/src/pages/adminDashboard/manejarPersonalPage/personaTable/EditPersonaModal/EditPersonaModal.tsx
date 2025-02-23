"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Medico, Paciente, Rol } from "@/api/models/personaModels";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast, Toaster } from "sonner";
import { personaApi } from "@/api/classes apis/personaApi";
import { Skeleton } from "@/components/ui/skeleton";
import { MedicalSchedule } from "./MedicalSchedule";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useAuth } from "@/context/AuthProvider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { extractErrorMessage } from "@/api/misc/errorHandler";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { personaDashboardApi } from "@/api/dashboard/personaDashboardApi";
import { medicoApi } from "@/api/classes apis/medicoApi";

interface EditPersonaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  persona: Medico | Paciente;
  onSave: (updatedPersona: Medico | Paciente) => void;
  onChange: (updatedPersona: Medico | Paciente) => void;
}

export default function EditPersonaModal({
  open,
  onOpenChange,
  persona,
  onSave,
  onChange,
}: EditPersonaModalProps) {
  const { personaData } = useAuth();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [especialidades, setEspecialidades] = useState<string[]>([]);
  const [loadingEspecialidades, setLoadingEspecialidades] = useState(false);
  const [showCustomEspecialidad, setShowCustomEspecialidad] = useState(false);
  const [selectedRol, setSelectedRol] = useState<number | null>(null);

  const isSuperAdmin = personaData?.credenciales.roles.some(
    (role) => role.id === 3
  );

  // Roles predefinidos (manejados desde el frontend)
  const roles: Rol[] = [
    { id: 1, nombre: "Admin" },
    { id: 2, nombre: "Usuario" },
    { id: 3, nombre: "Super Admin" },
  ];

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [blob] = await Promise.all([
          personaApi.fetchProfilePicture(persona.credenciales.email),
        ]);

        const url = URL.createObjectURL(blob);
        setImageUrl(url);
      } catch (error) {
        const errorMessage = extractErrorMessage(error);
        console.error("Error loading data:", errorMessage);
        toast.error("No tiene foto de perfil");
      } finally {
        setLoadingImage(false);
        setIsLoading(false);
      }
    };

    if (open) {
      setIsLoading(true);
      loadInitialData();
      onChange({ ...persona });
    }

    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [open, persona.credenciales?.email]);

  // Forzar la carga de especialidades médicas
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

    if (open && persona.tipoPersona === "MEDICO") {
      fetchEspecialidades();
    }
  }, [open, persona.tipoPersona]);

  // Manejar guardar cambios
  const handleSave = () => {
    onSave(persona);
    toast.success("Cambios guardados correctamente");
  };

  // Asignar nuevo rol
  const handleAssignRol = async () => {
    if (!selectedRol) {
      toast.error("Selecciona un rol antes de asignarlo");
      return;
    }

    try {
      await personaDashboardApi.modifyRol(persona.credenciales.email, [selectedRol]);
      toast.success("Rol asignado correctamente");
    } catch (error) {
      toast.error("No se pudo asignar el rol");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <Card className="bg-card shadow-lg flex-1 flex flex-col">
          <div className="bg-gradient-to-r from-primary to-secondary h-24" />
          <CardHeader className="relative pb-0 pt-16">
            <Avatar className="w-20 h-20 mx-auto border-4 border-white absolute -top-10 inset-x-0">
              {!loadingImage && imageUrl && (
                <AvatarImage
                  src={imageUrl}
                  alt={`${persona.nombre} ${persona.apellido}`}
                />
              )}
              <AvatarFallback className="text-3xl bg-primary text-white">
                {loadingImage ? (
                  <Skeleton className="w-full h-full rounded-full" />
                ) : (
                  `${persona?.nombre?.[0]}${persona?.apellido?.[0]}`
                )}
              </AvatarFallback>
            </Avatar>
          </CardHeader>

          <CardContent className="space-y-4 mt-4 flex-1 flex flex-col">
            <ScrollArea className="flex-1 pr-4">
              <Accordion type="single" collapsible defaultValue="datos">
                <AccordionItem value="datos">
                  <AccordionTrigger>Datos Personales</AccordionTrigger>
                  <AccordionContent>
                    {isLoading ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-10 w-full" />
                          </div>
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-10 w-full" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-10 w-full" />
                          </div>
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-10 w-full" />
                          </div>
                        </div>
                        {persona.tipoPersona === "PACIENTE" && (
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-10 w-full" />
                          </div>
                        )}
                        {persona.tipoPersona === "MEDICO" && (
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-20" />
                              <Skeleton className="h-10 w-full" />
                            </div>
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-20" />
                              <Skeleton className="h-10 w-full" />
                            </div>
                          </div>
                        )}
                        <Skeleton className="h-10 w-full mt-4" />
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Nombre</Label>
                            <Input
                              value={persona.nombre}
                              onChange={(e) =>
                                onChange({ ...persona, nombre: e.target.value })
                              }
                            />
                          </div>
                          <div>
                            <Label>Apellido</Label>
                            <Input
                              value={persona.apellido}
                              onChange={(e) =>
                                onChange({ ...persona, apellido: e.target.value })
                              }
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>DNI</Label>
                            <Input
                              value={persona.dni}
                              onChange={(e) =>
                                onChange({ ...persona, dni: e.target.value })
                              }
                            />
                          </div>
                          <div>
                            <Label>Email</Label>
                            <Input value={persona.credenciales.email} disabled />
                          </div>
                        </div>

                        {persona.tipoPersona === "PACIENTE" && (
                          <div>
                            <Label>Obra Social</Label>
                            <Input
                              value={
                                (persona as Paciente).obraSocial ? "Sí" : "No"
                              }
                              onChange={(e) =>
                                onChange({
                                  ...persona,
                                  obraSocial: e.target.value === "Sí",
                                })
                              }
                            />
                          </div>
                        )}

                        {persona.tipoPersona === "MEDICO" && (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Sueldo</Label>
                              <Input
                                type="number"
                                value={(persona as Medico).sueldo}
                                onChange={(e) =>
                                  onChange({
                                    ...persona,
                                    sueldo: Number(e.target.value),
                                  })
                                }
                              />
                            </div>
                            <div>
                              <Label>Especialidad</Label>
                              {showCustomEspecialidad ? (
                                <div className="flex gap-2">
                                  <Input
                                    value={(persona as Medico).especialidad}
                                    onChange={(e) =>
                                      onChange({
                                        ...persona,
                                        especialidad: e.target.value,
                                      })
                                    }
                                  />
                                  <Button
                                    variant="ghost"
                                    onClick={() => setShowCustomEspecialidad(false)}
                                  >
                                    ×
                                  </Button>
                                </div>
                              ) : (
                                <div className="flex gap-2">
                                  <Select
                                    value={(persona as Medico).especialidad}
                                    onValueChange={(value) =>
                                      onChange({
                                        ...persona,
                                        especialidad: value,
                                      })
                                    }
                                    disabled={loadingEspecialidades}
                                  >
                                    <SelectTrigger>
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
                                          className="mb-2 sticky top-0"
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
                                              className="truncate"
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
                                  >
                                    Añadir nueva
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        <Button className="w-min mt-4 mx-auto" onClick={handleSave}>
                          Guardar Cambios
                        </Button>
                      </>
                    )}
                  </AccordionContent>
                </AccordionItem>

                {persona.tipoPersona === "MEDICO" && (
                  <AccordionItem value="turnos">
                    <AccordionTrigger>Gestión de Turnos</AccordionTrigger>
                    <AccordionContent>
                      <MedicalSchedule
                        medicoEmail={persona.credenciales.email}
                        currentTurnos={(persona as Medico).turnos ?? []}
                        onUpdate={(updatedTurnos) => {
                          const updatedMedico = { ...persona, turnos: updatedTurnos };
                          onChange(updatedMedico);
                        }}
                      />
                    </AccordionContent>
                  </AccordionItem>
                )}

                {isSuperAdmin && (
                  <AccordionItem value="roles">
                    <AccordionTrigger>Gestión de Roles</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          Rol actual:{" "}
                          <span className="font-semibold">
                            {persona.credenciales.roles
                              .map((role) => role.nombre)
                              .join(", ")}
                          </span>
                        </p>
                        <Select
                          value={selectedRol?.toString() ?? ""}
                          onValueChange={(value) => setSelectedRol(Number(value))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un rol" />
                          </SelectTrigger>
                          <SelectContent>
                            {roles.map((role) => (
                              <SelectItem key={role.id} value={role.id.toString()}>
                                {role.nombre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          className="w-full"
                          onClick={handleAssignRol}
                          disabled={!selectedRol}
                        >
                          Asignar Rol
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>
            </ScrollArea>
          </CardContent>
        </Card>
      </DialogContent>
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
    </Dialog>
  );
}