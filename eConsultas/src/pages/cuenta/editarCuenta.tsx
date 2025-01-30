import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import Button from "@/components/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { personaApi } from "@/api/personaApi";
import { toast } from "sonner";
import { Medico, Paciente, Persona } from "@/api/models/models";
import { Toaster } from "@/components/ui/sonner";

const EditarCuenta = () => {
  const { email: routeEmail } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [originalData, setOriginalData] = useState<Persona | null>(null);
  
  const [userData, setUserData] = useState<Partial<Persona>>({
    pais: "",
    ciudad: "",
    direccion: "",
    numeroExterior: "",
    codigoPostal: "",
    tipoPersona: "PACIENTE",
    dni: "",
    credenciales: {
      email: "",
      username: "",
      codigoDeLlamada: "+52",
      celular: "",
    },
    nombre: "",
    apellido: "",
    fechaNacimiento: "",
    archivos: [],
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const persona = await personaApi.getPersona();
        if (persona) {
          setOriginalData(persona);
          setUserData({
            ...persona,
            credenciales: { ...persona.credenciales },
            // archivos: persona.archivos, // Comentado por ahora pq no está implementada la funcionalidad
          });
        }
      } catch (error) {
        toast.error("Error cargando datos del usuario");
        console.error("Error loading persona data:", error);
      }
    };

    const userDTO = JSON.parse(localStorage.getItem("UserDTO") || "{}");
    if (!userDTO?.correo) {
      toast.error("Debe iniciar sesión primero");
      navigate("/login");
      return;
    }

    if (routeEmail && routeEmail !== userDTO.correo) {
      toast.warning("No tienes permiso para editar este perfil");
      navigate("/no-autorizado");
      return;
    }

    loadData();
  }, [routeEmail, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cooldown || !originalData) return;

    setIsSubmitting(true);
    try {
      const changes = getChangedFields(originalData, userData);
      console.log("Cambios a enviar:", changes);
      
      const email = JSON.parse(localStorage.getItem("UserDTO") || "{}").correo;
      const updated = await personaApi.updatePersona(email, changes);
      
      setOriginalData(updated);
      localStorage.setItem("personaData", JSON.stringify(updated));
      toast.success("¡Cambios guardados exitosamente!");
      setCooldown(true);
      setTimeout(() => setCooldown(false), 5000);
    } catch (error) {
      toast.error("Error al guardar los cambios");
      console.error("Error en actualización:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getChangedFields = (original: Persona, current: Partial<Persona>) => {
    const changes: Record<string, any> = {};
    
    // Comparar campos principales
    const mainFields: (keyof Persona)[] = [
      'pais', 'ciudad', 'direccion', 'numeroExterior', 
      'codigoPostal', 'dni', 'nombre', 'apellido', 'fechaNacimiento'
    ];

    mainFields.forEach(field => {
      if (current[field] !== undefined && current[field] !== original[field]) {
        changes[field] = current[field];
      }
    });

    // Campos específicos de Médico
    if (original.credenciales.tipoPersona === "MEDICO") {
      const medicoFields: (keyof Medico)[] = ['sueldo', 'especialidad'];
      medicoFields.forEach(field => {
        if (current[field] !== undefined && current[field] !== (original as Medico)[field]) {
          changes[field] = current[field];
        }
      });
    }

    // Campos de credenciales
    const credencialFields: (keyof Persona['credenciales'])[] = [
      'email', 'username', 'codigoDeLlamada', 'celular'
    ];

    credencialFields.forEach(field => {
      const originalValue = original.credenciales[field];
      const currentValue = current.credenciales?.[field];
      if (currentValue !== undefined && currentValue !== originalValue) {
        if (!changes.credenciales) changes.credenciales = {};
        changes.credenciales[field] = currentValue;
      }
    });

    return changes;
  };

  const handleFieldChange = (field: keyof Persona, value: string) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  };

  const handleCredencialChange = (field: keyof Persona['credenciales'], value: string) => {
    setUserData(prev => ({
      ...prev,
      credenciales: { ...prev.credenciales!, [field]: value }
    }));
  };

  if (!userData) return <div>Cargando...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-b from-primary-lightest to-white min-h-screen">
      <Toaster richColors />
      <Card className="border-none shadow-xl rounded-2xl overflow-hidden">
        <CardHeader className="bg-primary-dark text-white pb-4">
          <CardTitle className="text-3xl font-bold font-mono text-center tracking-wide">
            ✏️ Editar Perfil
          </CardTitle>
        </CardHeader>

        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Sección Información Personal */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-primary-dark border-b-2 border-primary-light pb-2">
                Información Personal
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-primary-dark">Nombre</Label>
                  <Input
                    value={userData.nombre || ""}
                    onChange={(e) => handleFieldChange('nombre', e.target.value)}
                    className="border-primary-light focus:ring-2 focus:ring-primary"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-primary-dark">Apellido</Label>
                  <Input
                    value={userData.apellido || ""}
                    onChange={(e) => handleFieldChange('apellido', e.target.value)}
                    className="border-primary-light focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-primary-dark">Rol</Label>
                  <div className="flex items-center h-10 px-3 border border-primary-light rounded-md bg-gray-50">
                    <span className="font-bold text-primary-dark">
                      {userData.tipoPersona}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-primary-dark">DNI</Label>
                  <Input
                    value={userData.dni || ""}
                    onChange={(e) => handleFieldChange('dni', e.target.value)}
                    className="border-primary-light focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-primary-dark">Fecha de Nacimiento</Label>
                  <Input
                    type="date"
                    value={userData.fechaNacimiento || ""}
                    onChange={(e) => handleFieldChange('fechaNacimiento', e.target.value)}
                    className="border-primary-light focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Sección Contacto */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-primary-dark border-b-2 border-primary-light pb-2">
                Datos de Contacto
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-primary-dark">Email</Label>
                  <Input
                    type="email"
                    value={userData.credenciales?.email || ""}
                    onChange={(e) => handleCredencialChange('email', e.target.value)}
                    className="border-primary-light focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-primary-dark">Username</Label>
                  <Input
                    value={userData.credenciales?.username || ""}
                    onChange={(e) => handleCredencialChange('username', e.target.value)}
                    className="border-primary-light focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-primary-dark">Código de Llamada</Label>
                  <Select
                    value={userData.credenciales?.codigoDeLlamada || "+52"}
                    onValueChange={(value) => handleCredencialChange('codigoDeLlamada', value)}
                  >
                    <SelectTrigger className="border-primary-light focus:ring-2 focus:ring-primary">
                      <SelectValue placeholder="Código" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="+52">🇲🇽 +52</SelectItem>
                      <SelectItem value="+1">🇺🇸 +1</SelectItem>
                      <SelectItem value="+34">🇪🇸 +34</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-primary-dark">Celular</Label>
                  <Input
                    value={userData.credenciales?.celular || ""}
                    onChange={(e) => handleCredencialChange('celular', e.target.value)}
                    className="border-primary-light focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Sección Dirección */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-primary-dark border-b-2 border-primary-light pb-2">
                Dirección
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-primary-dark">País</Label>
                  <Input
                    value={userData.pais || ""}
                    onChange={(e) => handleFieldChange('pais', e.target.value)}
                    className="border-primary-light focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-primary-dark">Ciudad</Label>
                  <Input
                    value={userData.ciudad || ""}
                    onChange={(e) => handleFieldChange('ciudad', e.target.value)}
                    className="border-primary-light focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-primary-dark">Código Postal</Label>
                  <Input
                    value={userData.codigoPostal || ""}
                    onChange={(e) => handleFieldChange('codigoPostal', e.target.value)}
                    className="border-primary-light focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-primary-dark">Dirección</Label>
                  <Input
                    value={userData.direccion || ""}
                    onChange={(e) => handleFieldChange('direccion', e.target.value)}
                    className="border-primary-light focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-primary-dark">Número Exterior</Label>
                  <Input
                    value={userData.numeroExterior || ""}
                    onChange={(e) => handleFieldChange('numeroExterior', e.target.value)}
                    className="border-primary-light focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Sección Médica */}
            {userData.tipoPersona === "MEDICO" && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-accent-dark border-b-2 border-accent-light pb-2">
                  Información Médica
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-accent-dark">Especialidad</Label>
                    <Input
                      value={(userData as Medico).especialidad || ""}
                      onChange={(e) => handleFieldChange('especialidad', e.target.value)}
                      className="border-accent-light focus:ring-2 focus:ring-accent"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-accent-dark">Sueldo (MXN)</Label>
                    <Input
                      type="number"
                      value={(userData as Medico).sueldo || ""}
                      onChange={(e) => handleFieldChange('sueldo', e.target.value)}
                      className="border-accent-light focus:ring-2 focus:ring-accent"
                    />
                  </div>
                </div>
              </div>
            )}

            <CardFooter className="flex justify-end gap-4 pt-8">
              <Button
                type="secondary"
                label="Cancelar"
                onClick={() => navigate(-1)}
                className="px-8 py-3 hover:shadow-lg"
              />
              <Button
                type="primary"
                label={isSubmitting ? "Guardando..." : cooldown ? "Espere 5 segundos" : "Guardar Cambios"}
                disabled={isSubmitting || cooldown}
                className="bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary-darker px-8 py-3 text-white shadow-md hover:shadow-lg transition-all disabled:opacity-75"
              />
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditarCuenta;