"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";
import type { Servicio, TipoServicio } from "@/api/models/servicioModels";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { servicioDashboardApi } from "@/api/dashboard/servicioDashboardApi";

interface EditServicioModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  servicio: Servicio | null;
  onSave: (updatedServicio: Servicio) => Promise<void>;
  tiposServicio: TipoServicio[];
}

export default function EditServicioModal({
  open,
  onOpenChange,
  servicio,
  onSave,
  tiposServicio,
}: EditServicioModalProps) {
  const [editedServicio, setEditedServicio] = useState<Servicio | null>(null);

  useEffect(() => {
    if (servicio) {
      setEditedServicio(servicio);
    }
  }, [servicio]);

  const handleSubmit = async () => {
    if (!editedServicio) return;

    if (!editedServicio.descripcion || editedServicio.precio <= 0) {
      toast.error("Por favor complete todos los campos requeridos");
      return;
    }

    try {

      const updatedServicio = await servicioDashboardApi.editServicio(
        editedServicio.id,
        {
          descripcion: editedServicio.descripcion,
          precio: editedServicio.precio,
          tipoServicio: editedServicio.tipoServicio, 
          enabled: editedServicio.enabled,
        }
      );

      await onSave(updatedServicio);

      onOpenChange(false);
      toast.success("Servicio actualizado exitosamente");
    } catch (error) {
      toast.error("Error al actualizar el servicio");
    }
  };

  if (!editedServicio) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Editar Servicio</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Descripción</Label>
              <Input
                value={editedServicio.descripcion}
                onChange={(e) =>
                  setEditedServicio((prev) =>
                    prev
                      ? { ...prev, descripcion: e.target.value }
                      : null
                  )
                }
              />
            </div>

            <div>
              <Label>Precio</Label>
              <Input
                type="number"
                value={editedServicio.precio}
                onChange={(e) =>
                  setEditedServicio((prev) =>
                    prev
                      ? { ...prev, precio: Number(e.target.value) }
                      : null
                  )
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Tipo de Servicio</Label>
              <Select
                value={editedServicio.tipoServicio.id.toString()}
                onValueChange={(value) =>
                  setEditedServicio((prev) =>
                    prev
                      ? {
                          ...prev,
                          tipoServicio: { id: Number(value), nombre: "" },
                        }
                      : null
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  {tiposServicio.map((tipo) => (
                    <SelectItem key={tipo.id} value={tipo.id.toString()}>
                      {tipo.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Estado</Label>
              <Select
                value={editedServicio.enabled ? "active" : "inactive"}
                onValueChange={(value) =>
                  setEditedServicio((prev) =>
                    prev
                      ? { ...prev, enabled: value === "active" }
                      : null
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="inactive">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button className="w-full" onClick={handleSubmit}>
            Guardar Cambios
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}