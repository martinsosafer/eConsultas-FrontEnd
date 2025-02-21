import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, Stethoscope, Package, User, UserCheck, FileText } from "lucide-react";
import { Consulta } from "@/api/models/consultaModels";
import { consultaApi } from "@/api/classes apis/consultaApi";
import { personaApi } from "@/api/classes apis/personaApi";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function ConsultaDetailPage() {
  const { id } = useParams();
  const { personaData, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [consulta, setConsulta] = useState<Consulta | null>(null);
  const [loading, setLoading] = useState(true);
  const [medicoImage, setMedicoImage] = useState("");
  const [pacienteImage, setPacienteImage] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!id) {
          navigate("/not-found");
          return;
        }

        const consultaData = await consultaApi.getConsultaByConsultaId(Number(id));
        
        // Verificamos los permisos
        const isOwner = [consultaData.paciente.credenciales.email, consultaData.medico.credenciales.email]
          .includes(personaData?.credenciales.email);
        
        const isAdmin = personaData?.credenciales.roles.some(r => [1, 3].includes(r.id));
        
        if (!isOwner && !isAdmin) {
          navigate("/unauthorized");
          return;
        }

        setConsulta(consultaData);

        // Cargamos imágenes
        const [medicoImg, pacienteImg] = await Promise.all([
          personaApi.fetchProfilePicture(consultaData.medico.credenciales.email),
          personaApi.fetchProfilePicture(consultaData.paciente.credenciales.email)
        ]);

        setMedicoImage(URL.createObjectURL(medicoImg));
        setPacienteImage(URL.createObjectURL(pacienteImg));
      } catch (error) {
        console.error("Error loading consulta:", error);
        navigate("/error");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) loadData();
  }, [id, isAuthenticated, navigate, personaData]);

  if (loading) {
    return (
      <div className="p-8">
        <Skeleton className="h-12 w-1/4 mb-8" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!consulta) {
    return <div className="p-8 text-center">Consulta no encontrada</div>;
  }

  const isPaquete = !!consulta.idPaquete;

  const handleProfileClick = (email: string) => {
    navigate(`/profile/${email}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 bg-background min-h-screen"
    >
      <div className="max-w-6xl mx-auto">
        {/* Nuestro header */}
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-primary-dark">
              Detalles de la consulta
            </h1>
            <Badge variant="outline" className="mt-2 text-lg">
              {isPaquete ? "Paquete médico" : "Servicio individual"}
            </Badge>
          </div>

          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Badge
              variant={consulta.pagado ? "default" : "destructive"}
              className={cn(
                "px-4 py-2 text-sm",
                consulta.pagado 
                  ? "bg-green-600/20 text-green-600 hover:bg-green-600/30" 
                  : "bg-red-600/20 text-red-600 hover:bg-red-600/30"
              )}
            >
              {consulta.pagado ? `Pagado ($${consulta.total})` : `Pendiente ($${consulta.total})`}
            </Badge>
          </div>
        </motion.div>

        {/* Información básica */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card p-6 rounded-xl shadow-sm border border-border/50"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <Calendar className="text-primary w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold">Fecha y hora</h3>
            </div>
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <p>{new Date(consulta.fecha).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <p>{consulta.horario}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card p-6 rounded-xl shadow-sm border border-border/50"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <Stethoscope className="text-primary w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold">Especialidad</h3>
            </div>
            <p className="text-muted-foreground">{consulta.medico.especialidad}</p>
          </motion.div>
        </div>

        {/* Participantes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-card p-6 rounded-xl shadow-sm border border-border/50"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <User className="text-primary w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold">Paciente</h3>
            </div>
            <div className="flex items-center gap-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={pacienteImage} alt="Foto perfil paciente" />
                <AvatarFallback>
                  {consulta.paciente.nombre[0]}
                  {consulta.paciente.apellido[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <p 
                  className="font-medium hover:text-primary transition-colors cursor-pointer"
                  onClick={() => handleProfileClick(consulta.paciente.credenciales.email)}
                >
                  {consulta.paciente.nombre} {consulta.paciente.apellido}
                </p>
                <p className="text-sm text-muted-foreground">
                  {consulta.paciente.credenciales.email}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-card p-6 rounded-xl shadow-sm border border-border/50"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <UserCheck className="text-primary w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold">Médico</h3>
            </div>
            <div className="flex items-center gap-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={medicoImage} alt="Foto perfil médico"/>
                <AvatarFallback>
                  {consulta.medico.nombre[0]}
                  {consulta.medico.apellido[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <p 
                  className="font-medium hover:text-primary transition-colors cursor-pointer"
                  onClick={() => handleProfileClick(consulta.medico.credenciales.email)}
                >
                  {consulta.medico.nombre} {consulta.medico.apellido}
                </p>
                <p className="text-sm text-muted-foreground">
                  {consulta.medico.credenciales.email}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Servicios contratados */}
        {consulta.serviciosContratados && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="bg-card p-6 rounded-xl shadow-sm border border-border/50 mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <Package className="text-primary w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold">
                {isPaquete ? "Servicios contratados" : "Servicio contratado"}
              </h3>
            </div>

            <div className="space-y-4">
              {consulta.serviciosContratados.map((servicio) => (
                <div key={servicio.id} className="p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <h4 className="font-medium">{servicio.nombre}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{servicio.descripcion}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Precio base</p>
                      <p>${servicio.precio}</p>
                    </div>
                    <div>
                      <p className="font-medium">Descuento paquete</p>
                      <p>{servicio.porcentajeDescuentoPaquete * 100}%</p>
                    </div>
                    <div>
                      <p className="font-medium">Descuento obra social</p>
                      <p>{servicio.porcentajeDescuentoObraSocial * 100}%</p>
                    </div>
                    <div>
                      <p className="font-medium">Total</p>
                      <p>${servicio.total}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}