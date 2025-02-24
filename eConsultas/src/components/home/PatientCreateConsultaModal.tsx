"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PersonaSelectionSlider } from "@/components/classes components/persona/PersonaSelectionSlider";
import { ServicioSelectionSlider } from "@/components/classes components/servicio/ServicioSelectionSlider";
import { ServicioSelectorCard } from "@/components/classes components/servicio/ServicioSelectorCard";
import { Servicio } from "@/api/models/servicioModels";
import { Paquete } from "@/api/models/paqueteModels";
import { consultaDashboardApi } from "@/api/dashboard/consultaDashboardApi";
import { toast, Toaster } from "sonner";
import { Loader2 } from "lucide-react";
import { Medico } from "@/api/models/personaModels";
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
import { useAuth } from "@/context/AuthProvider";
import { Button } from "@/components/ui/button";

interface PatientCreateConsultaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => Promise<void>;
}

export const PatientCreateConsultaModal = ({
  open,
  onOpenChange,
  onCreated,
}: PatientCreateConsultaModalProps) => {
  const { personaData } = useAuth();
  const [activeTab, setActiveTab] = useState("medico");
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
    medico: false,
    servicio: false,
    paquete: false,
  });

  useEffect(() => {
    if (open) {
      setSliderStates({
        medico: false,
        servicio: false,
        paquete: false,
      });
      setActiveTab("medico");
      setSelectedMedico(null);
      setSelectedServicio(null);
      setSelectedPaquete(null);
      setSelectedDate(undefined);
      setSelectedTime("");
    }
  }, [open]);

  const validateCurrentTab = () => {
    switch (activeTab) {
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

  const calculatePrice = () => {
    const originalPrice = selectedServicio?.precio || selectedPaquete?.precio || 0;
    const hasDiscount = personaData?.tipoPersona === "PACIENTE" && (personaData as any).obraSocial;
    const finalPrice = hasDiscount ? originalPrice * 0.8 : originalPrice;
    
    return { originalPrice, finalPrice, hasDiscount };
  };
  const handleCreateConsulta = async () => {
    if (!validateCurrentTab()) {
      toast.error("Completa todos los campos requeridos");
      return;
    }

    if (!personaData) {
      toast.error("No se pudo obtener la información del paciente");
      return;
    }

    setLoading(true);
    try {
      const payload: CreateConsulta = {
        fecha: selectedDate?.toISOString().split("T")[0] || "",
        horario: selectedTime,
        medico: {
          credenciales: { email: selectedMedico?.credenciales.email || "" },
        },
        paciente: {
          credenciales: { email: personaData.credenciales.email },
        },
        ...(selectedServicio && { idServicioMedico: selectedServicio.id }),
        ...(selectedPaquete && { idPaquete: selectedPaquete.id }),
      };

      await consultaDashboardApi.createConsulta(payload);
      toast.success("Tu consulta fue registrada con éxito"); // Updated message
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

    if (open) {
      fetchSpecialties();
      setSelectedSpecialty(null);
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) {
          setSliderStates({
            medico: false,
            servicio: false,
            paquete: false,
          });
        }
      }}
    >
      <DialogContent className="max-w-[90vw] w-[800px] h-[85vh] flex flex-col fixed left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 overflow-y-auto  overflow-x-hidden">
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
        <DialogHeader>
          <DialogTitle className="text-xl">Nueva Consulta</DialogTitle>
        </DialogHeader>

        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium">Paciente</h3>
          <p className="text-sm text-muted-foreground">
            {personaData?.nombre} {personaData?.apellido}
            <span className="ml-2 text-primary">
              @{personaData?.credenciales.username}
            </span>
          </p>
          {personaData?.tipoPersona === "PACIENTE" && (
            <p className="text-sm mt-1">
              Obra social:{" "}
              <span className="text-primary">
                {(personaData as any).obraSocial ? "Sí" : "No"}
              </span>
            </p>
          )}
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(tab) => {
            setSliderStates({
              medico: false,
              servicio: false,
              paquete: false,
            });
            setActiveTab(tab);
          }}
          className="flex-1 flex flex-col"
        >
          <TabsList className="grid grid-cols-3 h-12">
            <TabsTrigger value="medico">Médico</TabsTrigger>
            <TabsTrigger value="tipo">Tipo</TabsTrigger>
            <TabsTrigger value="horario">Horario</TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 p-4">
            <TabsContent value="medico">
              <div className="mb-4 space-y-2">
                <Label>Especialidad Médica</Label>
                <Select
                  value={selectedSpecialty || ""}
                  onValueChange={(value) => {
                    setSelectedSpecialty(value);
                    setSelectedMedico(null);
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
                      />
                      <ScrollArea className="h-40">
                        {availableSpecialties.map((especialidad) => (
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
              </div>

              <div className="border-2 border-dashed border-primary rounded-lg p-4 min-h-[120px]">
                {selectedMedico ? (
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-red-500 hover:bg-red-600 text-white"
                      onClick={() => setSelectedMedico(null)}
                    >
                      ×
                    </Button>
                    <h3 className="font-medium">
                      {selectedMedico.nombre} {selectedMedico.apellido}
                    </h3>
                    <div className="text-sm text-muted-foreground">
                      <p>Especialidad: {selectedMedico.especialidad}</p>
                      <p>Email: {selectedMedico.credenciales.email}</p>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full h-full min-h-[120px]"
                    onClick={() =>
                      setSliderStates((prev) => ({ ...prev, medico: true }))
                    }
                    disabled={!selectedSpecialty}
                  >
                    Seleccionar Médico
                  </Button>
                )}
              </div>
            </TabsContent>

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

            <TabsContent value="horario" className="space-y-4">
              <TimeSlotPicker
                medicoEmail={selectedMedico?.credenciales.email || ""}
                onTimeSelect={handleTimeSelect}
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
              />
            </TabsContent>
          </ScrollArea>


      <div className="flex justify-between pt-4 px-4 pb-2">
        <div className="flex items-center gap-4">
          {(selectedServicio || selectedPaquete) && (
            <div className="flex flex-col items-start">
              {calculatePrice().hasDiscount ? (
                <>
                  <span className="text-sm text-gray-500 line-through">
                    ${calculatePrice().originalPrice.toFixed(2)}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 font-semibold">
                      ${calculatePrice().finalPrice.toFixed(2)}
                    </span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      -20% obra social
                    </span>
                  </div>
                </>
              ) : (
                <span className="font-semibold">
                  ${calculatePrice().originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          )}
        </div>
        </div>
          
          <div className="flex justify-between pt-4 px-4 pb-2">
            <Button
              variant="outline"
              disabled={activeTab === "medico"}
              onClick={() =>
                setActiveTab((prev) => {
                  const tabs = ["medico", "tipo", "horario"];
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
                    const tabs = ["medico", "tipo", "horario"];
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
            if (m.tipoPersona === "MEDICO") {
              setSelectedMedico(m);
              setSliderStates((prev) => ({ ...prev, medico: false }));
            }
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
