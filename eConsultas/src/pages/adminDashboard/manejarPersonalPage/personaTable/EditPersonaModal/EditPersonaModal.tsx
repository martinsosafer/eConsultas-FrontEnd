"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Medico, Paciente } from "@/api/models/personaModels";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface EditPersonaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  persona: Medico | Paciente;
  onSave: (updatedPersona: Medico | Paciente) => void;
  onChange: (updatedPersona: Medico | Paciente) => void;
}
import { useToast } from "@/hooks/use-toast";
export default function EditPersonaModal({
  open,
  onOpenChange,
  persona,
  onSave,
  onChange,
}: EditPersonaModalProps) {
  const { toast } = useToast();
  useEffect(() => {
    if (open && persona) {
      onChange({ ...persona });
    }
  }, [open]);
  const handleSave = () => {
    onSave(persona);
    toast({
      title: "Éxito!",
      description: "Cambios guardados correctamente",
      variant: "success",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <Card className="bg-card shadow-lg">
          <div className="bg-gradient-to-r from-primary to-secondary h-24" />
          <CardHeader className="relative pb-0 pt-16">
            <Avatar className="w-20 h-20 mx-auto border-4 border-white absolute -top-10 inset-x-0">
              <AvatarFallback className="text-3xl bg-primary text-white">
                {persona?.nombre?.[0]}
                {persona?.apellido?.[0]}
              </AvatarFallback>
            </Avatar>
          </CardHeader>

          <CardContent className="space-y-4 mt-4">
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
                  value={(persona as Paciente).obraSocial ? "Sí" : "No"}
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
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
