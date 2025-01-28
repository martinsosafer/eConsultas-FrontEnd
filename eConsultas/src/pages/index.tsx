import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Calendar, Stethoscope, ClipboardList, BadgeDollarSign, Package } from "lucide-react";
import Button from "../components/button";

const Home = () => {
  const [esMedico, setEsMedico] = useState(false);

  useEffect(() => {
    // Función para verificar la cookie
    const checkCookie = () => {
      const cookies = document.cookie.split(';');
      const medicoCookie = cookies.find(cookie => 
        cookie.trim().startsWith('esMédico=')
      );
      
      setEsMedico(!!medicoCookie);
    };

    checkCookie();
  }, []);

  const medicalServices = [
    { name: "Consulta General", icon: <Calendar className="w-6 h-6" /> },
    { name: "Especialidades", icon: <Stethoscope className="w-6 h-6" /> },
    { name: "Exámenes Médicos", icon: <ClipboardList className="w-6 h-6" /> },
    { name: "Paquetes", icon: <Package className="w-6 h-6" /> }
  ];

  const stats = [
    { title: "Consultas Hoy", value: "24", type: "primary" },
    { title: "Pacientes Nuevos", value: "15", type: "accent" },
    { title: "Servicios Activos", value: "38", type: "secondary" }
  ];

  return (
    <div className="prose max-w-none">
      {/* Hero Section */}
      <div className="bg-primary-dark rounded-xl p-8 mb-8 text-white">
        <h1 className="text-4xl font-bold mb-4">Bienvenido a eConsultas</h1>
        <p className="text-xl mb-6">Cuidamos de ti y tu familia con medicina de excelencia</p>
        <div className="flex gap-4">
          <Button label="Agendar Cita" type="primary" onClick={() => {}} />
          <Button label="Ver Servicios" type="secondary-accent" onClick={() => {}} />
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        {medicalServices.map((service, index) => (
          <Card key={index} className="hover:border-primary transition-all">
            <CardHeader>
              <div className="bg-primary-light p-2 rounded-full w-max text-primary-dark">
                {service.icon}
              </div>
              <CardTitle className="mt-4">{service.name}</CardTitle>
            </CardHeader>
            <CardFooter>
              <Button label="Ver detalles" type="secondary" onClick={() => {}} fit />
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Stats Section */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className={`border-${stat.type} bg-${stat.type}-light`}>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{stat.title}</h3>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <BadgeDollarSign className={`w-12 h-12 text-${stat.type}-dark`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Acceso diferenciado */}
      <div className="grid md:grid-cols-2 gap-6">
        {esMedico ? (
          <Card className="bg-secondary-light border-secondary">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Panel Médico</h3>
              <Button label="Acceder al Panel" type="secondary" onClick={() => {}} />
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-primary-light border-primary">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Portal de Pacientes</h3>
              <Button label="Acceder a Mi Historial" type="primary" onClick={() => {}} />
            </CardContent>
          </Card>
        )}

        <Card className="bg-accent-light border-accent">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">
              {esMedico ? "Mis Próximas Consultas" : "Solicitar Información"}
            </h3>
            <Button 
              label={esMedico ? "Ver Agenda" : "Contactarnos"} 
              type="accent" 
              onClick={() => {}} 
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;