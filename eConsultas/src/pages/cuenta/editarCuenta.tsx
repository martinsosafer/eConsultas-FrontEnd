import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import Button from "@/components/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const EditarCuenta = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState({
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
    sueldo: "",
    especialidad: "",
    profileImage: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      const mockData = {
        pais: "México",
        ciudad: "Ciudad de México",
        direccion: "Calle Falsa 123",
        numeroExterior: "321",
        codigoPostal: "06500",
        tipoPersona: "MÉDICO",
        dni: "XAXX010101HDFXYZ00",
        credenciales: {
          email: "usuario@ejemplo.com",
          username: "dr_ejemplo",
          codigoDeLlamada: "+52",
          celular: "5512345678",
        },
        nombre: "Juan",
        apellido: "Pérez",
        fechaNacimiento: "1990-01-01",
        sueldo: "25000",
        especialidad: "Cardiología",
        profileImage: "https://via.placeholder.com/150"
      };
      setUserData(mockData);
    };
    fetchData();
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos actualizados:", userData);
  };

  const handleProfileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setUserData({ ...userData, profileImage: imageUrl });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-b from-primary-lightest to-white min-h-screen">
      <Card className="border-none shadow-xl rounded-2xl overflow-hidden">
        <CardHeader className="bg-primary-dark text-white pb-4">
          <CardTitle className="text-3xl font-bold font-mono text-center tracking-wide">
            ✏️ Editar Perfil
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Sección Foto de Perfil Mejorada */}
            <div className="flex flex-col items-center space-y-4">
              <label className="relative group cursor-pointer transition-transform hover:scale-105">
                <input
                  type="file"
                  onChange={handleProfileChange}
                  className="hidden"
                  accept="image/*"
                />
                <div className="relative">
                  <img 
                    src={userData.profileImage} 
                    alt="Profile" 
                    className="w-32 h-32 rounded-full border-4 border-primary-light object-cover shadow-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-sm font-medium animate-pulse">
                      📤 Subir foto
                    </span>
                  </div>
                </div>
              </label>
            </div>

            {/* Sección Información Personal con Rol */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-primary-dark border-b-2 border-primary-light pb-2">
                Información Personal
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-primary-dark">Nombre</Label>
                  <Input
                    value={userData.nombre}
                    onChange={(e) => setUserData({...userData, nombre: e.target.value})}
                    className="border-primary-light focus:ring-2 focus:ring-primary"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-primary-dark">Apellido</Label>
                  <Input
                    value={userData.apellido}
                    onChange={(e) => setUserData({...userData, apellido: e.target.value})}
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
                    value={userData.dni}
                    onChange={(e) => setUserData({...userData, dni: e.target.value})}
                    className="border-primary-light focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-primary-dark">Fecha de Nacimiento</Label>
                  <Input
                    type="date"
                    value={userData.fechaNacimiento}
                    onChange={(e) => setUserData({...userData, fechaNacimiento: e.target.value})}
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
                    value={userData.credenciales.email}
                    onChange={(e) => setUserData({
                      ...userData,
                      credenciales: {...userData.credenciales, email: e.target.value}
                    })}
                    className="border-primary-light focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-primary-dark">Username</Label>
                  <Input
                    value={userData.credenciales.username}
                    onChange={(e) => setUserData({
                      ...userData,
                      credenciales: {...userData.credenciales, username: e.target.value}
                    })}
                    className="border-primary-light focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-primary-dark">Código de Llamada</Label>
                  <Select
                    value={userData.credenciales.codigoDeLlamada}
                    onValueChange={(value) => setUserData({
                      ...userData,
                      credenciales: {...userData.credenciales, codigoDeLlamada: value}
                    })}
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
                    value={userData.credenciales.celular}
                    onChange={(e) => setUserData({
                      ...userData,
                      credenciales: {...userData.credenciales, celular: e.target.value}
                    })}
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
                    value={userData.pais}
                    onChange={(e) => setUserData({...userData, pais: e.target.value})}
                    className="border-primary-light focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-primary-dark">Ciudad</Label>
                  <Input
                    value={userData.ciudad}
                    onChange={(e) => setUserData({...userData, ciudad: e.target.value})}
                    className="border-primary-light focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-primary-dark">Código Postal</Label>
                  <Input
                    value={userData.codigoPostal}
                    onChange={(e) => setUserData({...userData, codigoPostal: e.target.value})}
                    className="border-primary-light focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-primary-dark">Dirección</Label>
                  <Input
                    value={userData.direccion}
                    onChange={(e) => setUserData({...userData, direccion: e.target.value})}
                    className="border-primary-light focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-primary-dark">Número Exterior</Label>
                  <Input
                    value={userData.numeroExterior}
                    onChange={(e) => setUserData({...userData, numeroExterior: e.target.value})}
                    className="border-primary-light focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Sección Médica */}
            {userData.tipoPersona === "MÉDICO" && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-accent-dark border-b-2 border-accent-light pb-2">
                  Información Médica
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-accent-dark">Especialidad</Label>
                    <Input
                      value={userData.especialidad}
                      onChange={(e) => setUserData({...userData, especialidad: e.target.value})}
                      className="border-accent-light focus:ring-2 focus:ring-accent"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-accent-dark">Sueldo (MXN)</Label>
                    <Input
                      type="number"
                      value={userData.sueldo}
                      onChange={(e) => setUserData({...userData, sueldo: e.target.value})}
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
                onClick={() => window.history.back()}
                className="px-8 py-3 hover:shadow-lg"
              />
              <Button
                type="primary"
                label="Guardar Cambios"
                className="bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary-darker px-8 py-3 text-white shadow-md hover:shadow-lg transition-all"
              />
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditarCuenta;