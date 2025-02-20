import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, Stethoscope, Package, DollarSign, MoreHorizontal } from "lucide-react";
import { Consulta } from "@/api/models/consultaModels";
import { personaApi } from "@/api/classes apis/personaApi";
import { useNavigate } from "react-router-dom";
import Button from "@/components/button";


interface ConsultaCardProps {
  consulta: Consulta;
  animateProps?: any;
  transition?: any;
}

export default function ConsultaCard({ consulta, animateProps, transition }: ConsultaCardProps) {
  const navigate = useNavigate();
  const [medicoImage, setMedicoImage] = React.useState("");
  const [pacienteImage, setPacienteImage] = React.useState("");

  React.useEffect(() => {
    const loadImages = async () => {
      try {
        const medicoImg = await personaApi.fetchProfilePicture(consulta.medico.credenciales.email);
        setMedicoImage(URL.createObjectURL(medicoImg));
        
        const pacienteImg = await personaApi.fetchProfilePicture(consulta.paciente.credenciales.email);
        setPacienteImage(URL.createObjectURL(pacienteImg));
      } catch (error) {
        console.error("Error loading images:", error);
      }
    };

    loadImages();
  }, []);

  return (
    <motion.div
      {...animateProps}
      transition={transition}
      className="bg-card rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <Stethoscope className="text-primary w-5 h-5" />
        <h3 className="text-xl font-semibold">{consulta.medico.especialidad}</h3>
      </div>

      <div className="flex gap-4 mb-4 text-muted-foreground">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>{new Date(consulta.fecha).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>{consulta.horario}</span>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src={pacienteImage} />
            <AvatarFallback>
              {consulta.paciente.nombre[0]}
              {consulta.paciente.apellido[0]}
            </AvatarFallback>
          </Avatar>
          <span>
            {consulta.paciente.nombre} {consulta.paciente.apellido}
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src={medicoImage} />
            <AvatarFallback>
              {consulta.medico.nombre[0]}
              {consulta.medico.apellido[0]}
            </AvatarFallback>
          </Avatar>
          <span>
            {consulta.medico.nombre} {consulta.medico.apellido}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {consulta.idPaquete ? (
            <>
              <Package className="text-accent w-5 h-5" />
              <span className="text-sm">Paquete</span>
            </>
          ) : (
            <>
              <DollarSign className="text-secondary w-5 h-5" />
              <span className="text-sm">Servicio Individual</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Badge
            variant={consulta.pagado ? "default" : "destructive"}
            className={`px-3 py-1 rounded-full ${
              consulta.pagado ? "bg-success hover:bg-success-dark text-white" : ""
            }`}
          >
            {consulta.pagado ? `Pagado ($${consulta.total})` : `Pendiente ($${consulta.total})`}
          </Badge>
          <Button
            label="Ver más"
            type="secondary"
            icon={() => <MoreHorizontal className="w-5 h-5" />}
            onClick={() => navigate(`/consultas/${consulta.id}`)}
          />
        </div>
      </div>
    </motion.div>
  );
}