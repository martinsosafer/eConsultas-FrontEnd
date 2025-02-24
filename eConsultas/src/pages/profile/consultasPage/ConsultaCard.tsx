import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, Stethoscope, Package, DollarSign, MoreHorizontal, User, UserCheck } from "lucide-react";
import { Consulta } from "@/api/models/consultaModels";
import { useNavigate } from "react-router-dom";
import Button from "@/components/button";

interface ConsultaCardProps {
  consulta: Consulta;
  emailToImageMap: Record<string, string>;
  targetUserType: string;
  animateProps?: any;
  transition?: any;
}

export default function ConsultaCard({ 
  consulta, 
  emailToImageMap,
  targetUserType,
  animateProps, 
  transition 
}: ConsultaCardProps) {
  const navigate = useNavigate();
  
  const getImage = (email: string) => emailToImageMap[email] || "";
  
  const medicoImage = getImage(consulta.medico.credenciales.email);
  const pacienteImage = getImage(consulta.paciente.credenciales.email);

  return (
    <motion.div
      {...animateProps}
      transition={transition}
      className="bg-card rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-border/50"
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <Stethoscope className="text-primary w-5 h-5" />
        <h3 className="text-xl font-semibold">Atención médica en {consulta.medico.especialidad}</h3>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{new Date(consulta.fecha).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{consulta.horario}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-3">
          {consulta.idPaquete ? (
            <>
              <Package className="text-accent w-5 h-5" />
              <span className="text-sm">Paquete médico</span>
            </>
          ) : (
            <>
              <DollarSign className="text-secondary w-5 h-5" />
              <span className="text-sm">Servicio individual</span>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="w-4 h-4" />
            <span>Paciente</span>
          </div>
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={targetUserType === "PACIENTE" ? pacienteImage : medicoImage} alt="foto perfil" />
              <AvatarFallback className="bg-muted/50">
                {consulta.paciente.nombre[0]}
                {consulta.paciente.apellido[0]}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium">
              {consulta.paciente.nombre} {consulta.paciente.apellido}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <UserCheck className="w-4 h-4" />
            <span>Médico</span>
          </div>
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={targetUserType === "PACIENTE" ? medicoImage : pacienteImage} alt="foto perfil" />
              <AvatarFallback className="bg-muted/50">
                {consulta.medico.nombre[0]}
                {consulta.medico.apellido[0]}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium">
              {consulta.medico.nombre} {consulta.medico.apellido}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Badge
          variant={consulta.pagado ? "default" : "destructive"}
          className={`px-3 py-1 rounded-full text-sm ${
            consulta.pagado 
              ? "bg-green-600/20 text-green-600 hover:bg-green-600/30" 
              : "bg-red-600/20 text-red-600 hover:bg-red-600/30"
          }`}
        >
          {consulta.pagado ? `Pagado ($${(consulta.total).toFixed(2)})` : `Pendiente ($${(consulta.total).toFixed(2)})`}
        </Badge>

        <Button
          label="Detalles"
          type="secondary"
          icon={() => <MoreHorizontal className="w-5 h-5" />}
          onClick={() => navigate(`/consultas/${consulta.id}`)}
          className="px-4 py-2"
        />
      </div>
    </motion.div>
  );
}