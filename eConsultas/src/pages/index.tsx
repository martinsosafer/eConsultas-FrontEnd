import { useAuth } from "@/context/AuthProvider";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Stethoscope,
  ClipboardList,
  BadgeDollarSign,
  Package,
} from "lucide-react";
import Button from "../components/button";
import HeroBlock from "@/components/home/HeroBlock";
import { PatientCreateConsultaModal } from "@/components/home/PatientCreateConsultaModal";
import { useState } from "react";
import { Navigate } from "react-router-dom";

const Home = () => {
  const { personaData, isAuthenticated, isLoading } = useAuth();
  const [showConsultaModal, setShowConsultaModal] = useState(false);
  // Si está cargando, muestra un mensaje de carga
  if (isLoading) {
    return <div>Loading authentication state...</div>;
  }
  console.log("PERSONADATA", personaData);
  // Si no está autenticado o no es Super Admin, muestra el Home
  const isSuperAdmin =
    isAuthenticated &&
    personaData?.credenciales?.roles?.some(
      (role) => role.nombre === "ROLE_SUPER_ADMIN"
    );

  if (isSuperAdmin) return <Navigate to="/dashboard-admin" replace />;
  const esMedico = personaData?.tipoPersona === "MEDICO";
  const esPaciente = personaData?.tipoPersona === "PACIENTE";

  const medicalServices = [
    {
      name: "Consulta Medica",
      icon: <Stethoscope className="w-6 h-6" />,
      action: () => setShowConsultaModal(true),
    },

    { name: "Exámenes Médicos", icon: <ClipboardList className="w-6 h-6" /> },
    { name: "Paquetes", icon: <Package className="w-6 h-6" /> },
  ];

  const stats = [
    { title: "Consultas Hoy", value: "24", type: "primary" },
    { title: "Pacientes Nuevos", value: "15", type: "accent" },
    { title: "Servicios Activos", value: "38", type: "secondary" },
  ];

  return (
    <div className="prose max-w-none">
      <HeroBlock
        TipoDePersona={personaData?.tipoPersona || ""}
        nombre={personaData?.nombre}
        apellido={personaData?.apellido}
      />

      {/* Conditional Sections */}
      {esPaciente ? (
        <div className="grid grid-cols-3 gap-6 mb-8">
          {medicalServices.map((service, index) => (
            <Card
              key={index}
              className="flex flex-col hover:border-primary transition-all"
            >
              <div className="flex flex-col sm:flex-row">
                <CardHeader className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="bg-primary/10 p-2 rounded-full w-max text-primary">
                    {service.icon}
                  </div>
                  <CardTitle>{service.name}</CardTitle>
                </CardHeader>
              </div>
              <CardContent className="flex-grow" />
              <CardFooter>
                <Button
                  label="Ver detalles"
                  type="secondary"
                  onClick={service.action}
                  fit
                />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : esMedico ? (
        <div className="grid grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className={`border-${stat.type} bg-${stat.type}-light`}
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{stat.title}</h3>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <BadgeDollarSign
                    className={`w-12 h-12 text-${stat.type}-dark`}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}

      {/* Differentiated Access - Updated Section */}
      <div className="grid :grid-cols-2 gap-6">
        {esMedico ? (
          <>
            <Card className="bg-primary-light border-primary">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">
                  Portal de Pacientes
                </h3>
                <Button
                  label="Gestionar Pacientes"
                  type="primary"
                  onClick={() => {}}
                />
              </CardContent>
            </Card>

            {/* Show this card only for medics */}
            <Card className="bg-accent-light border-accent">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">
                  Mis Próximas Consultas
                </h3>
                <Button label="Ver Agenda" type="accent" onClick={() => {}} />
              </CardContent>
            </Card>
          </>
        ) : (
          <Card className="bg-secondary-light border-secondary">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Panel Médico</h3>
              <Button
                label="Acceder al Panel"
                type="primary"
                onClick={() => {}}
              />
            </CardContent>
          </Card>
        )}
      </div>
      <PatientCreateConsultaModal
        open={showConsultaModal}
        onOpenChange={setShowConsultaModal}
        onCreated={async () => {
          // Refresh any necessary data here
        }}
      />
    </div>
  );
};

export default Home;
