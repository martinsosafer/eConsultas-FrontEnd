"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Medico, Paciente } from "@/api/models/personaModels";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { personaApi } from "@/api/classes apis/personaApi";
import { Skeleton } from "@/components/ui/skeleton";
import { MedicalSchedule } from "./MedicalSchedule";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useAuth } from "@/context/AuthProvider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { turnoApi } from "@/api/classes apis/turnoApi";
import { extractErrorMessage } from "@/api/misc/errorHandler";

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
  const { toast } = useToast();
  const { personaData } = useAuth();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingTurnos, setLoadingTurnos] = useState(false);
  
  const loadTurnos = async () => {
    if (persona.tipoPersona === "MEDICO") {
      setLoadingTurnos(true);
      try {
        const turnos = await turnoApi.getTurnosByMedico(persona.credenciales.email);
        console.log(turnos);
        onChange({ ...persona, turnos });
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudieron cargar los turnos",
          variant: "destructive"
        });
      } finally {
        setLoadingTurnos(false);
      }
    }
  };

  useEffect(() => {
    const loadProfilePicture = async () => {
      try {
        if (persona?.credenciales?.email) {
          const [blob] = await Promise.all([
            personaApi.fetchProfilePicture(persona.credenciales.email),
            loadTurnos()
          ]);
          
          const url = URL.createObjectURL(blob);
          setImageUrl(url);
        }
      } catch (error) {
        const errorMessage = extractErrorMessage(error)
        console.error("Profile picture error:", errorMessage);
      } finally {
        setLoadingImage(false);
        setIsLoading(false);
      }
    };

    if (open) {
      setIsLoading(true);
      loadProfilePicture();
      onChange({ ...persona });
    }

    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [open, persona.credenciales?.email]);

  const handleSave = () => {
    onSave(persona);
    toast({
      title: "Éxito!",
      description: "Cambios guardados correctamente"
    });
  };

  const isAdmin = personaData?.credenciales.roles.some((role) =>
    [1, 3].includes(role.id)
  );

  console.log(isAdmin);
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
                              <Input
                                value={(persona as Medico).especialidad}
                                onChange={(e) =>
                                  onChange({
                                    ...persona,
                                    especialidad: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                        )}

                        <Button className="w-full mt-4" onClick={handleSave}>
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
                      {loadingTurnos ? (
                        <div className="grid grid-cols-4 gap-4">
                          {[...Array(4)].map((_, i) => (
                            <div key={i} className="space-y-2">
                              <Skeleton className="h-10 w-full" />
                              <div className="grid grid-cols-2 gap-2">
                                {[...Array(4)].map((_, j) => (
                                  <Skeleton key={j} className="h-10 w-full" />
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <MedicalSchedule 
                          medicoEmail={persona.credenciales.email}
                          currentTurnos={(persona as Medico).turnos ?? []} 
                          onUpdate={(updatedTurnos) => {
                            console.log((persona as Medico).turnos)
                            const updatedMedico = { ...persona, turnos: updatedTurnos };
                            onChange(updatedMedico);
                          }}
                        />
                      )}
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>
            </ScrollArea>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}