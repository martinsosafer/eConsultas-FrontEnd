"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { PersonaSelectorCard } from "@/components/classes components/persona/PersonaSelectorCard";
import { PersonaSelectionSlider } from "@/components/classes components/persona/PersonaSelectionSlider";
import { ServicioSelectionSlider } from "@/components/classes components/servicio/ServicioSelectionSlider";
import { ServicioSelectorCard } from "@/components/classes components/servicio/ServicioSelectorCard";
import { Servicio } from "@/api/models/servicioModels";
import { Paquete } from "@/api/models/paqueteModels";
import { consultaDashboardApi } from "@/api/dashboard/consultaDashboardApi";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Medico, Paciente } from "@/api/models/personaModels";
import { CreateConsulta } from "@/api/models/consultaModels";
import { PaqueteSelectionSlider } from "@/components/classes components/paquetes/PaqueteSelectionSlider";
import { TimeSlotPicker } from "@/components/classes components/consultas/TimeSlotPicker";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { medicoApi } from "@/api/classes apis/medicoApi";

interface CreateConsultaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => Promise<void>;
  showPaciente?: boolean;
  showMedico?: boolean;
  showTipo?: boolean;
  showHorario?: boolean;
}

export const CreateConsultaModal = ({
  open,
  onOpenChange,
  onCreated,
  showPaciente = true,
  showMedico = true,
  showTipo = true,
  showHorario = true,
}: CreateConsultaModalProps) => {
  const [activeTab, setActiveTab] = useState("paciente");
  const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(
    null
  );
  const [selectedMedico, setSelectedMedico] = useState<Medico | null>(null);
  const [selectedServicio, setSelectedServicio] = useState<Servicio | null>(
    null
  );
  const [selectedPaquete, setSelectedPaquete] = useState<Paquete | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [availableSpecialties, setAvailableSpecialties] = useState<string[]>(
    []
  );
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(
    null
  );
  const [loadingSpecialties, setLoadingSpecialties] = useState(false);
  const [sliderStates, setSliderStates] = useState({
    paciente: false,
    medico: false,
    servicio: false,
    paquete: false,
  });

  useEffect(() => {
    if (open) {
      setSliderStates({
        paciente: false,
        medico: false,
        servicio: false,
        paquete: false,
      });
      setActiveTab("paciente");
      setSelectedPaciente(null);
      setSelectedMedico(null);
      setSelectedServicio(null);
      setSelectedPaquete(null);
      setSelectedDate(undefined);
      setSelectedTime("");
    }
  }, [open]);

  const validateCurrentTab = () => {
    switch (activeTab) {
      case "paciente":
        return !!selectedPaciente;
      case "medico":
        return !!selectedMedico;
      case "tipo":
        return !!selectedServicio || !!selectedPaquete;
      case "horario":
        return !!selectedDate && !!selectedTime;
      default:
        return true;
    }
  };

  const handleCreateConsulta = async () => {
    if (!validateCurrentTab()) {
      toast.error("Completa todos los campos requeridos");
      return;
    }

    setLoading(true);
    try {
      const payload: CreateConsulta = {
<<<<<<< HEAD
        fecha: selectedDate?.toISOString().split("T")[0] || "",
        horario: selectedTime.split(" ")[1],
        medico: {
          credenciales: { email: selectedMedico?.credenciales.email || "" },
        },
        paciente: {
          credenciales: { email: selectedPaciente?.credenciales.email || "" },
        },
=======
        fecha: selectedDate?.toISOString().split('T')[0] || "",
        horario: selectedTime,
        medico: { credenciales: { email: selectedMedico?.credenciales.email || "" } },
        paciente: { credenciales: { email: selectedPaciente?.credenciales.email || "" } },
>>>>>>> 9e29e290dd02ca7fd61ecb9af79d8ab768c8f50d
        ...(selectedServicio && { idServicioMedico: selectedServicio.id }),
        ...(selectedPaquete && { idPaquete: selectedPaquete.id }),
      };

      await consultaDashboardApi.createConsulta(payload);
      toast.success("Consulta creada exitosamente");
      onOpenChange(false);
      await onCreated();
    } catch (error) {
      toast.error("Error al crear consulta");
    } finally {
      setLoading(false);
    }
  };

  const handleTimeSelect = (fullTime: string) => {
    const [date, time] = fullTime.split(" ");
    setSelectedDate(new Date(date));
    setSelectedTime(time);
  };
  useEffect(() => {
    const fetchSpecialties = async () => {
      setLoadingSpecialties(true);
      try {
        const data = await medicoApi.getMedicoSpecialties();
        setAvailableSpecialties(data);
      } catch (error) {
        toast.error("Error al obtener especialidades");
      } finally {
        setLoadingSpecialties(false);
      }
    };

    if (open && showMedico) {
      fetchSpecialties();
      setSelectedSpecialty(null);
    }
  }, [open, showMedico]);
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) {
          setSliderStates({
            paciente: false,
            medico: false,
            servicio: false,
            paquete: false,
          });
        }
      }}
    >
      <DialogContent className="max-w-[90vw] w-[800px] h-[85vh] flex flex-col fixed left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Crear Nueva Consulta</DialogTitle>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(tab) => {
            setSliderStates({
              paciente: false,
              medico: false,
              servicio: false,
              paquete: false,
            });
            setActiveTab(tab);
          }}
          className="flex-1 flex flex-col"
        >
          <TabsList className="grid grid-cols-4 h-12">
            {showPaciente && (
              <TabsTrigger value="paciente">Paciente</TabsTrigger>
            )}
            {showMedico && <TabsTrigger value="medico">Médico</TabsTrigger>}
            {showTipo && <TabsTrigger value="tipo">Tipo</TabsTrigger>}
            {showHorario && <TabsTrigger value="horario">Horario</TabsTrigger>}
          </TabsList>

          <ScrollArea className="flex-1 p-4">
            {showPaciente && (
              <TabsContent value="paciente">
                <PersonaSelectorCard
                  tipoPersona="PACIENTE"
                  selectedPersona={selectedPaciente || undefined}
                  onSelect={() =>
                    setSliderStates((prev) => ({ ...prev, paciente: true }))
                  }
                  onRemove={() => setSelectedPaciente(null)}
                />
              </TabsContent>
            )}

            {showMedico && (
              <TabsContent value="medico">
                <div className="mb-4 space-y-2">
                  <Label>Especialidad Médica</Label>
                  <Select
                    value={selectedSpecialty || ""}
                    onValueChange={(value) => {
                      console.log("Selected specialty:", value);
                      setSelectedSpecialty(value);
                      setSelectedMedico(null); // Reset selected doctor when specialty changes
                    }}
                    disabled={loadingSpecialties}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          loadingSpecialties
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
                            setAvailableSpecialties((prev) =>
                              prev.filter((esp) =>
                                esp.toLowerCase().includes(searchTerm)
                              )
                            );
                          }}
                          onKeyDown={(e) => e.stopPropagation()} // Prevent select closure
                        />
                        <ScrollArea className="h-40">
                          {availableSpecialties.length > 0 ? (
                            availableSpecialties.map((especialidad) => (
                              <SelectItem
                                key={especialidad}
                                value={especialidad}
                                className="truncate"
                              >
                                {especialidad}
                              </SelectItem>
                            ))
                          ) : (
                            <div className="text-center py-4 text-muted-foreground">
                              {loadingSpecialties ? (
                                <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                              ) : (
                                "No se encontraron especialidades"
                              )}
                            </div>
                          )}
                        </ScrollArea>
                      </div>
                    </SelectContent>
                  </Select>
                </div>

                <PersonaSelectorCard
                  tipoPersona="MEDICO"
                  selectedPersona={selectedMedico || undefined}
                  onSelect={() => {
                    if (!selectedSpecialty) {
                      toast.error("Primero selecciona una especialidad");
                      return;
                    }
                    setSliderStates((prev) => ({ ...prev, medico: true }));
                  }}
                  onRemove={() => setSelectedMedico(null)}
                  disabled={!selectedSpecialty}
                />
              </TabsContent>
            )}
            {showTipo && (
              <TabsContent value="tipo" className="space-y-4">
                <Tabs defaultValue="servicio" className="w-full">
                  <TabsList className="grid grid-cols-2 w-full">
                    <TabsTrigger value="servicio">Servicio</TabsTrigger>
                    <TabsTrigger value="paquete">Paquete</TabsTrigger>
                  </TabsList>

                  <TabsContent value="servicio" className="pt-4">
                    <ServicioSelectorCard
                      selectedServicio={selectedServicio || undefined}
                      onSelect={() =>
                        setSliderStates((prev) => ({ ...prev, servicio: true }))
                      }
                      onRemove={() => setSelectedServicio(null)}
                    />
                  </TabsContent>

                  <TabsContent value="paquete" className="pt-4">
                    <div className="border-2 border-dashed border-primary rounded-lg p-4 min-h-[120px]">
                      {selectedPaquete ? (
                        <div className="relative">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-red-500 hover:bg-red-600 text-white"
                            onClick={() => setSelectedPaquete(null)}
                          >
                            ×
                          </Button>
                          <h3 className="font-medium">
                            Paquete #{selectedPaquete.id}
                          </h3>
                          <div className="text-sm text-muted-foreground">
                            <p>Precio: ${selectedPaquete.precio.toFixed(2)}</p>
                            <p className="mt-2">Servicios incluidos:</p>
                            <ul className="list-disc pl-4">
                              {selectedPaquete.servicios.map((servicio) => (
                                <li key={servicio.id} className="truncate">
                                  {servicio.descripcion}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          className="w-full h-full min-h-[120px]"
                          onClick={() =>
                            setSliderStates((prev) => ({
                              ...prev,
                              paquete: true,
                            }))
                          }
                        >
                          Seleccionar Paquete
                        </Button>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </TabsContent>
            )}

            {showHorario && (
              <TabsContent value="horario" className="space-y-4">
                <TimeSlotPicker
                  medicoEmail={selectedMedico?.credenciales.email || ""}
                  onTimeSelect={handleTimeSelect}
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                />
              </TabsContent>
            )}
          </ScrollArea>

          <div className="flex justify-between pt-4 px-4 pb-2">
            <Button
              variant="outline"
              disabled={activeTab === "paciente"}
              onClick={() =>
                setActiveTab((prev) => {
                  const tabs = ["paciente", "medico", "tipo", "horario"];
                  return tabs[tabs.indexOf(prev) - 1];
                })
              }
            >
              Anterior
            </Button>

            {activeTab !== "horario" ? (
              <Button
                disabled={!validateCurrentTab()}
                onClick={() =>
                  setActiveTab((prev) => {
                    const tabs = ["paciente", "medico", "tipo", "horario"];
                    return tabs[tabs.indexOf(prev) + 1];
                  })
                }
              >
                Siguiente
              </Button>
            ) : (
              <Button onClick={handleCreateConsulta} disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Crear Consulta
              </Button>
            )}
          </div>
        </Tabs>

        <PersonaSelectionSlider
          open={sliderStates.paciente}
          onOpenChange={(open) =>
            setSliderStates((prev) => ({ ...prev, paciente: open }))
          }
          tipoPersona="PACIENTE"
          onSelect={(p) => {
            setSelectedPaciente(p);
            setSliderStates((prev) => ({ ...prev, paciente: false }));
          }}
        />

        <PersonaSelectionSlider
          open={sliderStates.medico}
          onOpenChange={(open) =>
            setSliderStates((prev) => ({ ...prev, medico: open }))
          }
          tipoPersona="MEDICO"
          filters={
            selectedSpecialty
              ? { especialidadMedico: selectedSpecialty }
              : undefined
          }
          onSelect={(m) => {
            setSelectedMedico(m);
            setSliderStates((prev) => ({ ...prev, medico: false }));
          }}
        />
        <ServicioSelectionSlider
          open={sliderStates.servicio}
          onOpenChange={(open) =>
            setSliderStates((prev) => ({ ...prev, servicio: open }))
          }
          onSelect={(s) => {
            setSelectedServicio(s);
            setSliderStates((prev) => ({ ...prev, servicio: false }));
          }}
          selectedIds={selectedServicio ? [selectedServicio.id] : []}
        />

        <PaqueteSelectionSlider
          open={sliderStates.paquete}
          onOpenChange={(open) =>
            setSliderStates((prev) => ({ ...prev, paquete: open }))
          }
          onSelect={(p) => {
            setSelectedPaquete(p);
            setSliderStates((prev) => ({ ...prev, paquete: false }));
          }}
          selectedIds={selectedPaquete ? [selectedPaquete.id] : []}
        />
      </DialogContent>
    </Dialog>
  );
};
