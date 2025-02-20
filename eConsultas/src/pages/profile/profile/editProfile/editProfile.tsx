"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Button from "@/components/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { personaApi } from "@/api/classes apis/personaApi";
import { toast } from "sonner";
import { Medico, Persona } from "@/api/models/personaModels";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/context/AuthProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { extractErrorMessage } from "@/api/misc/errorHandler";

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

  const isAdmin = personaData?.credenciales.roles?.some(
    (r) => r.id === 1 || r.id === 3
  );
  const isEditingSelf = username === personaData?.credenciales.username;
  const canEdit = isEditingSelf || isAdmin;
  const isMedico = userData.credenciales?.tipoPersona === "MEDICO";
  const canEditMedicalInfo = isAdmin && !isEditingSelf;

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        if (!username) {
          toast.error("Username no proporcionado");
          navigate("/profile", { replace: true });
          return;
        }

        if (!personaData) return;

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
        const errorMessage = extractErrorMessage(error);
        toast.error("Error cargando datos del usuario: " + errorMessage);
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [username, personaData, canEdit, navigate]);

  const handleFieldChange = (field: keyof Persona, value: string) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCredencialChange = (
    field: keyof Persona["credenciales"],
    value: string
  ) => {
    setUserData((prev) => ({
      ...prev,
      credenciales: { ...prev.credenciales!, [field]: value },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalData || !canEdit) return;

    setIsSubmitting(true);
    try {
      const changes = getChangedFields(originalData, userData);
      const targetUsername = isEditingSelf ? personaData.credenciales.username : username;

      const updated = await personaApi.updatePersona(targetUsername!, changes);
      setOriginalData(updated);
      localStorage.setItem("personaData", JSON.stringify(updated));
      toast.success("¡Cambios guardados exitosamente!");
      setCooldown(true);
      setTimeout(() => setCooldown(false), 5000);
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      toast.error("Error al guardar los cambios: " + errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getChangedFields = (original: Persona, current: Partial<Persona>) => {
    const changes: Partial<Persona> = {};
    const editableFields: (keyof Persona)[] = [
      "pais", "ciudad", "direccion", "numeroExterior", 
      "codigoPostal", "dni", "nombre", "apellido", "fechaNacimiento"
    ];

    editableFields.forEach((field) => {
      if (current[field] !== undefined && current[field] !== original[field]) {
        changes[field] = current[field];
      }
    });

    if (isAdmin) {
      ["sueldo", "especialidad"].forEach((field) => {
        const key = field as keyof Medico;
        if (current[key] !== undefined && current[key] !== (original as Medico)[key]) {
          (changes as Medico)[key] = current[key] as never;
        }
      });
    }

    ["email", "username", "codigoDeLlamada", "celular"].forEach((field) => {
      const key = field as keyof Persona["credenciales"];
      if (current.credenciales?.[key] !== original.credenciales[key]) {
        changes.credenciales = { ...changes.credenciales, [key]: current.credenciales?.[key] };
      }
    });

    return changes;
  };

  const handleImageUpload = async (file: File) => {
    try {
      if (!file.type.startsWith('image/')) {
        toast.error("Solo se permiten archivos de imagen (JPEG, PNG)");
        return;
      }

      await personaApi.uploadProfilePicture({
        file,
        identifier: userData.credenciales?.email || username!,
        tipo: "PROFILE_PICTURE",
      });

      const blob = await personaApi.fetchProfilePicture(userData.credenciales?.email || username!);
      setProfileImage(URL.createObjectURL(blob));
      toast.success("¡Imagen actualizada correctamente!");
    } catch (error) {
      toast.error("Error subiendo imagen");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-b from-primary-lightest/10 to-white min-h-screen">
      <Toaster richColors />
      <Card className="border-2 border-primary-light shadow-xl rounded-xl">
        <CardHeader className="bg-primary/5 py-8">
          <div className="flex flex-col items-center space-y-6">
            {isEditingSelf && (
              <div
                className="relative group cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                {loading ? (
                  <Skeleton className="w-32 h-32 rounded-full" />
                ) : (
                  <>
                    <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                      {profileImage ? (
                        <AvatarImage src={profileImage} className="object-cover" />
                      ) : (
                        <AvatarFallback className="text-3xl bg-primary text-white font-bold">
                          {userData.nombre?.[0]}
                          {userData.apellido?.[0]}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </div>
                  </>
                )}
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/jpeg, image/png"
              onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
            />
            <CardTitle className="text-3xl font-bold text-primary-dark">
              {loading ? (
                <Skeleton className="h-8 w-64 mx-auto" />
              ) : (
                `Editar Perfil de ${userData.nombre}`
              )}
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-primary-dark border-l-4 border-primary pl-3">Información Personal</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {["nombre", "apellido", "dni", "fechaNacimiento"].map((field, i) => (
                  <div key={field} className="space-y-2">
                    <Label className="text-primary-dark">
                      {["Nombre", "Apellido", "DNI", "Fecha Nacimiento"][i]}
                    </Label>
                    {loading ? (
                      <Skeleton className="h-10 w-full" />
                    ) : (
                      <Input
                        value={userData[field as keyof typeof userData]?.toString() || ""}
                        onChange={(e) => handleFieldChange(field as keyof Persona, e.target.value)}
                        type={field === "fechaNacimiento" ? "date" : "text"}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-primary-dark border-l-4 border-primary pl-3">Datos de Contacto</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {["email", "username", "codigoDeLlamada", "celular"].map((field, i) => (
                  <div key={field} className="space-y-2">
                    <Label className="text-primary-dark">
                      {["Email", "Username", "Código Llamada", "Celular"][i]}
                    </Label>
                    {loading ? (
                      <Skeleton className="h-10 w-full" />
                    ) : field === "codigoDeLlamada" ? (
                      <Select
                        value={userData.credenciales?.codigoDeLlamada}
                        onValueChange={(value) => handleCredencialChange("codigoDeLlamada", value)}
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
                        value={userData.credenciales?.[field as keyof typeof userData.credenciales]?.toString() || ""}
                        onChange={(e) => handleCredencialChange(field as keyof Persona["credenciales"], e.target.value)}
                        type={field === "email" ? "email" : "text"}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-primary-dark border-l-4 border-primary pl-3">Dirección</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {["pais", "ciudad", "codigoPostal", "direccion", "numeroExterior"].map((field, i) => (
                  <div key={field} className="space-y-2">
                    <Label className="text-primary-dark">
                      {["País", "Ciudad", "Código Postal", "Dirección", "Número Exterior"][i]}
                    </Label>
                    {loading ? (
                      <Skeleton className="h-10 w-full" />
                    ) : (
                      <Input
                        value={userData[field as keyof typeof userData]?.toString() || ""}
                        onChange={(e) => handleFieldChange(field as keyof Persona, e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {userData.tipoPersona === "MEDICO" && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-accent-dark border-l-4 border-accent pl-3">Información Médica</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {["especialidad", "sueldo"].map((field) => (
                    <div key={field} className="space-y-2">
                      <Label className="text-accent-dark">
                        {field === "especialidad" ? "Especialidad" : "Sueldo (MXN)"}
                      </Label>
                      {loading ? (
                        <Skeleton className="h-10 w-full" />
                      ) : (
                        <Input
                          value={(userData as Medico)[field as keyof Medico]?.toString() || ""}
                          onChange={(e) => handleFieldChange(field as keyof Persona, e.target.value)}
                          type={field === "sueldo" ? "number" : "text"}
                          disabled={isMedico || !canEditMedicalInfo}
                          className="disabled:opacity-75 disabled:cursor-not-allowed"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <CardFooter className="flex justify-end gap-4 pt-8">
              {loading ? (
                <>
                  <Skeleton className="h-10 w-24 rounded-lg" />
                  <Skeleton className="h-10 w-36 rounded-lg" />
                </>
              ) : (
                <>
                  <Button
                    type="secondary"
                    label="Cancelar"
                    onClick={() => navigate(-1)}
                    className="px-6 py-3 rounded-lg hover:bg-primary-lightest transition-colors"
                  />
                  <Button
                    type="primary"
                    label={isSubmitting ? "Guardando..." : cooldown ? "Espere" : "Guardar Cambios"}
                    disabled={isSubmitting || cooldown}
                    className="px-6 py-3 rounded-lg bg-primary hover:bg-primary-dark transition-all"
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

export default EditProfile;