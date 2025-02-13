"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
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
  showHorario = true
}: CreateConsultaModalProps) => {
  const [activeTab, setActiveTab] = useState("paciente");
  const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(null);
  const [selectedMedico, setSelectedMedico] = useState<Medico | null>(null);
  const [selectedServicio, setSelectedServicio] = useState<Servicio | null>(null);
  const [selectedPaquete, setSelectedPaquete] = useState<Paquete | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState("");
  const [sliderType, setSliderType] = useState<"paciente" | "medico" | "servicio" | "paquete">("paciente");
  const [sliderOpen, setSliderOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateCurrentTab = () => {
    switch(activeTab) {
      case "paciente": return !!selectedPaciente;
      case "medico": return !!selectedMedico;
      case "tipo": return !!selectedServicio || !!selectedPaquete;
      case "horario": return !!selectedDate && !!selectedTime;
      default: return true;
    }
  };

  const handleCreateConsulta = async () => {
    if (!validateCurrentTab()) {
      toast.error("Completa todos los campos requeridos");
      return;
    }

    if (!selectedPaciente || !selectedMedico || !selectedDate || !selectedTime) {
      toast.error("Faltan datos requeridos");
      return;
    }

    setLoading(true);
    try {
      const payload: CreateConsulta = {
        fecha: selectedDate.toISOString().split('T')[0],
        horario: selectedTime,
        medico: { credenciales: { email: selectedMedico.credenciales.email } },
        paciente: { credenciales: { email: selectedPaciente.credenciales.email } },
        ...(selectedServicio && { idServicioMedico: selectedServicio.id }),
        ...(selectedPaquete && { idPaquete: selectedPaquete.id })
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
    const [date, time] = fullTime.split(' ');
    setSelectedDate(new Date(date));
    setSelectedTime(time);
  };

  const handleSliderClose = () => {
    setSliderOpen(false);
    setSliderType("paciente");
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) {
        setSliderOpen(false);
      }
    }}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">Crear Nueva Consulta</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-4 h-12">
            {showPaciente && <TabsTrigger value="paciente">Paciente</TabsTrigger>}
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
                  onSelect={() => {
                    setSliderType("paciente");
                    setSliderOpen(true);
                  }}
                  onRemove={() => setSelectedPaciente(null)}
                />
              </TabsContent>
            )}

            {showMedico && (
              <TabsContent value="medico">
                <PersonaSelectorCard
                  tipoPersona="MEDICO"
                  selectedPersona={selectedMedico || undefined}
                  onSelect={() => {
                    setSliderType("medico");
                    setSliderOpen(true);
                  }}
                  onRemove={() => setSelectedMedico(null)}
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
                      onSelect={() => {
                        setSliderType("servicio");
                        setSliderOpen(true);
                        setSelectedPaquete(null);
                      }}
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
                          <h3 className="font-medium">Paquete #{selectedPaquete.id}</h3>
                          <div className="text-sm text-muted-foreground">
                            <p>Precio: ${selectedPaquete.precio.toFixed(2)}</p>
                            <p className="mt-2">Servicios incluidos:</p>
                            <ul className="list-disc pl-4">
                              {selectedPaquete.servicios.map(servicio => (
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
                          onClick={() => {
                            setSliderType("paquete");
                            setSliderOpen(true);
                            setSelectedServicio(null);
                          }}
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
              onClick={() => {
                setSliderOpen(false);
                setActiveTab(prev => {
                  const tabs = ["paciente", "medico", "tipo", "horario"];
                  return tabs[tabs.indexOf(prev) - 1];
                });
              }}
            >
              Anterior
            </Button>
            
            {activeTab !== "horario" ? (
              <Button
                disabled={!validateCurrentTab()}
                onClick={() => {
                  setSliderOpen(false);
                  setActiveTab(prev => {
                    const tabs = ["paciente", "medico", "tipo", "horario"];
                    return tabs[tabs.indexOf(prev) + 1];
                  });
                }}
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

        {sliderType === "paciente" && (
          <PersonaSelectionSlider
            open={sliderOpen}
            onOpenChange={setSliderOpen}
            tipoPersona="PACIENTE"
            onSelect={(p) => {
              setSelectedPaciente(p);
              setSliderOpen(false);
            }}
          />
        )}

        {sliderType === "medico" && (
          <PersonaSelectionSlider
            open={sliderOpen}
            onOpenChange={setSliderOpen}
            tipoPersona="MEDICO"
            onSelect={(m) => {
              setSelectedMedico(m);
              setSliderOpen(false);
            }}
          />
        )}

        {sliderType === "servicio" && (
          <ServicioSelectionSlider
            open={sliderOpen}
            onOpenChange={setSliderOpen}
            onSelect={(s) => {
              setSelectedServicio(s);
              setSliderOpen(false);
            }}
            selectedIds={selectedServicio ? [selectedServicio.id] : []}
          />
        )}

        {sliderType === "paquete" && (
          <PaqueteSelectionSlider
            open={sliderOpen}
            onOpenChange={setSliderOpen}
            onSelect={(p) => {
              setSelectedPaquete(p);
              setSliderOpen(false);
            }}
            selectedIds={selectedPaquete ? [selectedPaquete.id] : []}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};