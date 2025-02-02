import React from "react";
import Profile from "./profile/profile";

const patientData = {
  apellido: "Fernandez",
  archivos: null,
  ciudad: null,
  codigoPostal: null,
  consultas: null,
  credenciales: {
    apellido: null,
    celular: "261540754000222111",
    celularVerificado: false,
    codigoDeLlamada: "+54",
    codigoDeVerificacion: 4162,
    email: "martinfernandez19022@yopmail.com",
    emailVerificado: false,
    enabled: true,
    fechaDeSolicitudDeCodigoDeVerificacion: null,
    id: "ca36fb26-cb8e-495d-a38c-018d5e831702",
    intentos: 0,
    nivelDeVerificacion: "SIN_VERIFICAR",
    nombre: null,
    persona: null,
    roles: [{}],
    tipoPersona: null,
    username: "martinfernandez19022@yopmail.com",
    vencimientoDeCodigoDeVerificacion: null,
    verificacion2Factores: false,
  },
  direccion: null,
  dni: "377375603122",
  especialidad: null,
  fechaNacimiento: "01/01/1973",
  id: "b76cbd62-c380-4e80-9457-dc15b1fd500c",
  nombre: "Martin",
  numeroExterior: null,
  obraSocial: false,
  pais: null,
  sueldo: 0,
  tipoPersona: "PACIENTE",
  turnos: null,
  verificado: false,
};
function ProfilePage() {
  return (
    <div>
      <Profile patient={patientData} />
    </div>
  );
}

export default ProfilePage;
