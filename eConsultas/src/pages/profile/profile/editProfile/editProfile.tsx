import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Button from "@/components/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { personaApi } from "@/api/personaApi";
import { toast } from "sonner";
import { Medico, Paciente, Persona } from "@/api/models/personaModels";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/context/AuthProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const EditProfile = () => {
  const { username: encodedUsername } = useParams<{ username: string }>();
  const username = encodedUsername ? decodeURIComponent(encodedUsername) : null;
  const navigate = useNavigate();
  const { personaData } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [originalData, setOriginalData] = useState<Persona | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
  });

  // Verificar permisos
  const isAdmin = personaData?.credenciales.roles?.some(r => r.id === 1 || r.id === 3);
  const isEditingSelf = username === personaData?.credenciales.username;
  const canEdit = isEditingSelf || isAdmin;

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        if (!username) {
          toast.error("Username no proporcionado");
          navigate("/profile", { replace: true });
          return;
        }

        if (!personaData) {
          console.log("Esperando datos de autenticación...");
          return;
        }

        if (!canEdit) {
          toast.error("No tienes permisos para editar este perfil");
          navigate(`/profile/${encodeURIComponent(username)}`, { replace: true });
          return;
        }

        const data = await personaApi.getPersonaByUsername(username);
        setOriginalData(data);
        setUserData(data);
        
        try {
          const blob = await personaApi.fetchProfilePicture(data.credenciales.email);
          setProfileImage(URL.createObjectURL(blob));
        } catch (error) {
          console.error("Error cargando imagen de perfil:", error);
        }

      } catch (error) {
        toast.error("Error cargando datos del usuario");
        console.error("Error loading user data:", error);
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [username, personaData, canEdit, navigate]);

  const handleFieldChange = (field: keyof Persona, value: string) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  };

  const handleCredencialChange = (field: keyof Persona['credenciales'], value: string) => {
    setUserData(prev => ({
      ...prev,
      credenciales: { ...prev.credenciales!, [field]: value }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalData || !canEdit) return;

    setIsSubmitting(true);
    try {
      const changes = getChangedFields(originalData, userData);
      console.log("Cambios a enviar:", changes);
      
      const targetUsername = isEditingSelf ? personaData.credenciales.username : username;

      const updated = await personaApi.updatePersona(targetUsername!, changes);
      
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
    const changes: Partial<Persona> = {};
    
    const editableFields: (keyof Persona)[] = [
      'pais', 'ciudad', 'direccion', 'numeroExterior', 
      'codigoPostal', 'dni', 'nombre', 'apellido', 'fechaNacimiento'
    ];

    const adminFields: (keyof Medico)[] = ['sueldo', 'especialidad'];

    editableFields.forEach(field => {
      if (current[field] !== undefined && current[field] !== original[field]) {
        changes[field] = current[field];
      }
    });

    if (isAdmin) {
      adminFields.forEach(field => {
        if (current[field] !== undefined && current[field] !== (original as Medico)[field]) {
          (changes as Medico)[field] = current[field] as never;
        }
      });
    }

    const credencialFields: (keyof Persona['credenciales'])[] = ['email', 'username', 'codigoDeLlamada', 'celular'];
    credencialFields.forEach(field => {
      if (current.credenciales?.[field] !== original.credenciales[field]) {
        changes.credenciales = changes.credenciales || {};
        changes.credenciales[field] = current.credenciales?.[field];
      }
    });

    return changes;
  };

  const handleImageUpload = async (file: File) => {
    try {
      await personaApi.uploadProfilePicture({
        file,
        identifier: userData.credenciales?.email || username!,
        tipo: 'PROFILE_PICTURE'
      });
      
      const blob = await personaApi.fetchProfilePicture(userData.credenciales?.email || username!);
      setProfileImage(URL.createObjectURL(blob));
      toast.success("¡Imagen actualizada correctamente!");
    } catch (error) {
      toast.error("Error subiendo imagen");
      console.error("Upload error:", error);
    }
  };


  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-b from-primary-lightest to-white min-h-screen">
      <Toaster richColors />
      <Card className="border-none shadow-xl rounded-2xl overflow-hidden">
        <CardHeader className="bg-primary-dark text-white pb-4">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}>
              {loading ? (
                <Skeleton className="w-32 h-32 rounded-full" />
              ) : (
                <Avatar className="w-32 h-32 border-4 border-white">
                  {profileImage ? (
                    <AvatarImage src={profileImage} />
                  ) : (
                    <AvatarFallback className="text-3xl bg-primary text-white">
                      {userData.nombre?.[0]}{userData.apellido?.[0]}
                    </AvatarFallback>
                  )}
                </Avatar>
              )}
              {!loading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                  <EditIcon className="w-8 h-8 text-white" />
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
            />
            <CardTitle className="text-3xl font-bold font-mono text-center tracking-wide">
              {loading ? (
                <Skeleton className="h-8 w-64 mx-auto" />
              ) : (
                `✏️ Editar Perfil de ${userData.nombre}`
              )}
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-primary-dark border-b-2 border-primary-light pb-2">
                Información Personal
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div className="space-y-2" key={i}>
                    {loading ? (
                      <>
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                      </>
                    ) : (
                      <>
                        <Label className="text-primary-dark">
                          {i === 0 ? 'Nombre' : i === 1 ? 'Apellido' : i === 2 ? 'DNI' : 'Fecha Nacimiento'}
                        </Label>
                        <Input
                          value={
                            i === 0 ? userData.nombre || "" :
                            i === 1 ? userData.apellido || "" :
                            i === 2 ? userData.dni || "" :
                            userData.fechaNacimiento || ""
                          }
                          onChange={(e) => handleFieldChange(
                            i === 0 ? 'nombre' :
                            i === 1 ? 'apellido' :
                            i === 2 ? 'dni' : 'fechaNacimiento', 
                            e.target.value
                          )}
                          type={i === 3 ? "date" : "text"}
                        />
                      </>
                    )}
                  </div>
                ))}
                
                <div className="space-y-2">
                  <Label className="text-primary-dark">Rol</Label>
                  {loading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <div className="flex items-center h-10 px-3 border border-primary-light rounded-md bg-gray-50">
                      <span className="font-bold text-primary-dark">
                        {userData.tipoPersona}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-primary-dark border-b-2 border-primary-light pb-2">
                Datos de Contacto
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div className="space-y-2" key={i}>
                    {loading ? (
                      <>
                        <Skeleton className="h-4 w-24" />
                        {i === 2 ? (
                          <Skeleton className="h-10 w-full" />
                        ) : (
                          <Skeleton className="h-10 w-full" />
                        )}
                      </>
                    ) : (
                      <>
                        <Label className="text-primary-dark">
                          {i === 0 ? 'Email' : i === 1 ? 'Username' : i === 2 ? 'Código Llamada' : 'Celular'}
                        </Label>
                        {i === 2 ? (
                          <Select
                            value={userData.credenciales?.codigoDeLlamada || "+52"}
                            onValueChange={(value) => handleCredencialChange('codigoDeLlamada', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Código" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="+52">🇲🇽 +52</SelectItem>
                              <SelectItem value="+1">🇺🇸 +1</SelectItem>
                              <SelectItem value="+34">🇪🇸 +34</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input
                            value={
                              i === 0 ? userData.credenciales?.email || "" :
                              i === 1 ? userData.credenciales?.username || "" :
                              userData.credenciales?.celular || ""
                            }
                            onChange={(e) => handleCredencialChange(
                              i === 0 ? 'email' :
                              i === 1 ? 'username' : 'celular', 
                              e.target.value
                            )}
                            type={i === 0 ? "email" : "text"}
                          />
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-primary-dark border-b-2 border-primary-light pb-2">
                Dirección
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(5)].map((_, i) => (
                  <div className="space-y-2" key={i}>
                    {loading ? (
                      <>
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                      </>
                    ) : (
                      <>
                        <Label className="text-primary-dark">
                          {i === 0 ? 'País' : 
                           i === 1 ? 'Ciudad' : 
                           i === 2 ? 'Código Postal' : 
                           i === 3 ? 'Dirección' : 'Número Exterior'}
                        </Label>
                        <Input
                          value={
                            i === 0 ? userData.pais || "" :
                            i === 1 ? userData.ciudad || "" :
                            i === 2 ? userData.codigoPostal || "" :
                            i === 3 ? userData.direccion || "" :
                            userData.numeroExterior || ""
                          }
                          onChange={(e) => handleFieldChange(
                            i === 0 ? 'pais' :
                            i === 1 ? 'ciudad' :
                            i === 2 ? 'codigoPostal' :
                            i === 3 ? 'direccion' : 'numeroExterior', 
                            e.target.value
                          )}
                        />
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="space-y-6">
                <Skeleton className="h-8 w-64" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(2)].map((_, i) => (
                    <div className="space-y-2" key={i}>
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              userData.tipoPersona === "MEDICO" && (
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
                        disabled={!isAdmin}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-accent-dark">Sueldo (MXN)</Label>
                      <Input
                        type="number"
                        value={(userData as Medico).sueldo || ""}
                        onChange={(e) => handleFieldChange('sueldo', e.target.value)}
                        disabled={!isAdmin}
                      />
                    </div>
                  </div>
                </div>
              )
            )}

            <CardFooter className="flex justify-end gap-4 pt-8">
              {loading ? (
                <>
                  <Skeleton className="h-10 w-24" />
                  <Skeleton className="h-10 w-36" />
                </>
              ) : (
                <>
                  <Button
                    type="secondary"
                    label="Cancelar"
                    onClick={() => navigate(-1)}
                    className="px-8 py-3"
                  />
                  <Button
                    type="primary"
                    label={isSubmitting ? "Guardando..." : cooldown ? "Espere 5 segundos" : "Guardar Cambios"}
                    disabled={isSubmitting || cooldown}
                    className="px-8 py-3"
                  />
                </>
              )}
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
const EditIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);

export default EditProfile;