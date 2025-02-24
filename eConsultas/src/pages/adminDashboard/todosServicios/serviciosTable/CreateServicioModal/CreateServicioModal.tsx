"use client";

import { useState, useEffect } from "react"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";
import type { CreateServicio, TipoServicio } from "@/api/models/servicioModels"; 
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { servicioApi } from "@/api/classes apis/servicioApi"; 

interface CreateServicioModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (newServicio: CreateServicio) => Promise<void>;
}

export default function CreateServicioModal({
  open,
  onOpenChange,
  onSave,
}: CreateServicioModalProps) {
  const [newServicio, setNewServicio] = useState<CreateServicio>({
    descripcion: "",
    precio: 0,
    tipoServicio: { id: 0 }, 
    enabled: true,
  });

  const [tiposServicio, setTiposServicio] = useState<TipoServicio[]>([]); 


  useEffect(() => {
    const loadTiposServicio = async () => {
      try {
        const tipos = await servicioApi.getAllTiposServicio();
        setTiposServicio(tipos);
        

        if (tipos.length > 0) {
          setNewServicio((prev) => ({
            ...prev,
            tipoServicio: { id: tipos[0].id },
          }));
        }
      } catch (error) {
        toast.error("Error cargando tipos de servicio");
      }
    };

    loadTiposServicio();
  }, []);

  const handleSubmit = async () => {
    if (!newServicio.descripcion || newServicio.precio <= 0) {
      toast.error("Por favor complete todos los campos requeridos");
      return;
    }

    try {
      await onSave(newServicio);
      onOpenChange(false);
      setNewServicio({
        descripcion: "",
        precio: 0,
        tipoServicio: { id: tiposServicio[0]?.id || 0 }, 
        enabled: true,
      });
      toast.success("Servicio creado exitosamente");
    } catch (error) {
      toast.error("Error al crear el servicio");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Crear Nuevo Servicio</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Descripción</Label>
              <Input
                value={newServicio.descripcion}
                onChange={(e) =>
                  setNewServicio((prev) => ({
                    ...prev,
                    descripcion: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <Label>Precio</Label>
              <Input
                type="number"
                value={newServicio.precio}
                onChange={(e) =>
                  setNewServicio((prev) => ({
                    ...prev,
                    precio: Number(e.target.value),
                  }))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Tipo de Servicio</Label>
              <Select
                value={newServicio.tipoServicio.id.toString()}
                onValueChange={(value) =>
                  setNewServicio((prev) => ({
                    ...prev,
                    tipoServicio: { id: Number(value) },
                  }))
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
                value={newServicio.enabled ? "active" : "inactive"}
                onValueChange={(value) =>
                  setNewServicio((prev) => ({
                    ...prev,
                    enabled: value === "active",
                  }))
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

          <Button className="w-min mx-auto flex justify-center" onClick={handleSubmit}>
            Crear Servicio
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}