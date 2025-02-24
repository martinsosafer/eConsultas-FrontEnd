import { useAuth } from "@/context/AuthProvider";
import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Stethoscope, Syringe, Box, LayoutDashboard } from "lucide-react";
import Button from "../components/button";
import HeroBlock from "@/components/home/HeroBlock";
import { PatientCreateConsultaModal } from "@/components/home/PatientCreateConsultaModal";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { MedicosModal } from "./homeDialogs/MedicosModal";
import { ServiciosModal } from "./homeDialogs/ServicioModal";
import { PaquetesModal } from "./homeDialogs/PaqueteModal";

const Home = () => {
  const navigate = useNavigate();
  const { personaData, isAuthenticated, isLoading } = useAuth();
  const [showConsultaModal, setShowConsultaModal] = useState(false);
  const [showDoctorsModal, setShowDoctorsModal] = useState(false);
  const [showServicesModal, setShowServicesModal] = useState(false);
  const [showPackagesModal, setShowPackagesModal] = useState(false);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-background">Cargando estado de autenticación...</div>;

  const isSuperAdmin = isAuthenticated &&
    personaData?.credenciales?.roles?.some(role => role.nombre === "ROLE_SUPER_ADMIN");
  
  const isAdmin = isAuthenticated &&
    personaData?.credenciales?.roles?.some(role => role.nombre === "ROLE_ADMIN");

  if (isSuperAdmin) return <Navigate to="/dashboard-admin" replace />;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen relative bg-background">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160550-2173dba999ef')] bg-cover bg-center bg-fixed" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/40 via-primary/30 to-transparent" />
        
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8 text-center">
          <div className="max-w-4xl w-full bg-background/90 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/10 transform hover:scale-[1.01] transition-transform duration-300">
            <img 
              src="../public/logo.png" 
              alt="eConsultas Logo"
              className="w-48 h-48 mb-8 rounded-full shadow-2xl border-4 border-white mx-auto animate-fade-in"
            />
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-slide-up">
              eConsultas
            </h1>
            <p className="text-xl text-muted-foreground mb-8 animate-slide-up delay-100">
              Conectamos pacientes con los mejores especialistas médicos.
            </p>
            
            <div className="flex justify-center gap-4 flex-wrap animate-slide-up delay-200">
              <Button
                label="Iniciar Sesión"
                type="primary"
                className="px-8 py-4 text-lg bg-black backdrop-blur-sm hover:shadow-glow transition-all"
                onClick={() => navigate('/login')}
              />
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </div>
    );
  }

  const esMedico = personaData?.tipoPersona === "MEDICO";

  const medicalServices = [
    ...(!esMedico ? [{
      name: "Consulta Médica",
      icon: <Stethoscope className="w-6 h-6" />,
      action: () => setShowConsultaModal(true),
    }] : []),
    { 
      name: "Servicios Médicos", 
      icon: <Syringe className="w-6 h-6" />,
      action: () => setShowServicesModal(true)
    },
    { 
      name: "Paquetes", 
      icon: <Box className="w-6 h-6" />,
      action: () => setShowPackagesModal(true)
    },
    { 
      name: "Especialistas", 
      icon: <Stethoscope className="w-6 h-6" />,
      action: () => setShowDoctorsModal(true)
    },
    ...(isAdmin ? [{
      name: "Dashboard Admin",
      icon: <LayoutDashboard className="w-6 h-6" />,
      action: () => navigate('/dashboard-admin'),
    }] : [])
  ];

  return (
    <div className="prose max-w-none px-4 lg:px-8 bg-background">
      <HeroBlock
        TipoDePersona={personaData?.tipoPersona || ""}
        nombre={personaData?.nombre}
        apellido={personaData?.apellido}
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {medicalServices.map((service, index) => (
          <Card key={index} className="hover:border-primary transition-all group transform hover:-translate-y-1 duration-300 bg-gradient-to-b from-background to-background/70">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full text-primary transition-colors group-hover:bg-primary/20 shadow-inner">
                {service.icon}
              </div>
              <CardTitle className="text-lg font-semibold">{service.name}</CardTitle>
            </CardHeader>
            <CardFooter>
              <Button
                label={service.name === "Dashboard Admin" ? "Acceder" : "Ver detalles"}
                type="secondary"
                onClick={service.action}
                className="w-full hover:shadow-glow"
              />
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-10 relative rounded-2xl overflow-hidden shadow-2xl max-h-[200px] bg-gradient-to-br from-primary/10 to-secondary/10 border border-white/10">
        <div className="absolute inset-0 bg-[url('/medical-banner.jpg')] bg-cover bg-center bg-fixed" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/60 to-secondary/60" />
        
        <div className="relative z-0 p-6 flex flex-col items-center justify-center h-15 text-center">
          <div className="max-w-4xl backdrop-blur-sm rounded-xl p-8">
            <h2 className="text-5xl font-bold text-white mb-6 drop-shadow-lg">Medicina de Excelencia</h2>
            <p className="text-xl text-white/90 mb-8 font-light max-w-2xl mx-auto">
              ¡Los mejores profesionales de salud del país!
            </p>
            <div className="flex gap-4 justify-center flex-wrap">

            </div>
          </div>
        </div>
      </div>

      {/* Modales */}
      {!esMedico && (
        <PatientCreateConsultaModal
          open={showConsultaModal}
          onOpenChange={setShowConsultaModal}
          onCreated={async () => {
            // Refresh any necessary data here
          }}
        />
      )}
      
      <MedicosModal
        open={showDoctorsModal}
        onOpenChange={setShowDoctorsModal}
      />
      
      <ServiciosModal
        open={showServicesModal}
        onOpenChange={setShowServicesModal}
      />
      
      <PaquetesModal
        open={showPackagesModal}
        onOpenChange={setShowPackagesModal}
      />
    </div>
  );
};

export default Home;