import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Consulta } from "@/api/models/consultaModels";
import { consultaApi } from "@/api/classes apis/consultaApi";
import ConsultaCard from "./ConsultaCard.tsx";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Medico, Paciente } from "@/api/models/personaModels";
import { PatientCreateConsultaModal } from "@/components/home/PatientCreateConsultaModal";
import { personaApi } from "@/api/classes apis/personaApi";
import Button from "@/components/button.tsx";

export default function ConsultasPage() {
  const { username } = useParams();
  const { personaData, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [targetUser, setTargetUser] = useState<Medico | Paciente | null>(null);
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [filteredConsultas, setFilteredConsultas] = useState<Consulta[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConsultaModal, setShowConsultaModal] = useState(false);

  const [especialidadFilter, setEspecialidadFilter] = useState("");
  const [tipoFilter, setTipoFilter] = useState("");
  const [pagoFilter, setPagoFilter] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        let userData: Medico | Paciente;
        
        if (username === personaData?.credenciales?.username) {
          userData = personaData;
        } else {
          if (!personaData?.credenciales.roles.some(r => [1, 3].includes(r.id))) {
            navigate("/unauthorized");
            return;
          }
          userData = await personaApi.getPersonaByUsername(username!);
        }
        
        setTargetUser(userData);
        const consultasData = await consultaApi.getConsultasByPersonaEmail(username!);
        setConsultas(consultasData);
        setFilteredConsultas(consultasData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) loadData();
  }, [username, isAuthenticated]);

  useEffect(() => {
    let filtered = consultas;
    
    if (especialidadFilter) {
      filtered = filtered.filter(c => c.medico.especialidad === especialidadFilter);
    }
    
    if (tipoFilter) {
      filtered = filtered.filter(c => 
        tipoFilter === "paquete" ? c.idPaquete : c.idServicioMedico
      );
    }
    
    if (pagoFilter) {
      filtered = filtered.filter(c => c.pagado === (pagoFilter === "pagado"));
    }
    
    setFilteredConsultas(filtered);
  }, [especialidadFilter, tipoFilter, pagoFilter]);

  if (isLoading || loading) {
    return (
      <div className="p-8">
        <Skeleton className="h-12 w-1/4 mb-8" />
        <div className="grid grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!targetUser) return <div>Usuario no encontrado</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 bg-background min-h-screen"
    >
      <div className="flex justify-between items-center mb-8">
        <motion.h1 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-3xl font-bold text-primary-dark"
        >
          {targetUser.nombre} {targetUser.apellido}
          <Badge variant="outline" className="ml-4">
            {targetUser.tipoPersona}
          </Badge>
        </motion.h1>

        {targetUser.tipoPersona === "PACIENTE" && (
          <Button
            type="primary"
            label="Nueva Consulta"
            onClick={() => setShowConsultaModal(true)}
          />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Select onValueChange={setEspecialidadFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Especialidad" />
          </SelectTrigger>
          <SelectContent>
            {[...new Set(consultas.map(c => c.medico.especialidad))].map(e => (
              <SelectItem key={e} value={e}>{e}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={setTipoFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Tipo de servicio" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="servicio">Servicio Individual</SelectItem>
            <SelectItem value="paquete">Paquete</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={setPagoFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Estado de pago" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pagado">Pagado</SelectItem>
            <SelectItem value="no-pagado">No Pagado</SelectItem>
          </SelectContent>
        </Select>
      </div>


      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredConsultas.map((consulta, i) => (
          <ConsultaCard 
            key={consulta.id} 
            consulta={consulta}
            animateProps={{ initial: { opacity: 0 }, animate: { opacity: 1 } }}
            transition={{ delay: i * 0.1 }}
          />
        ))}
      </motion.div>

      <PatientCreateConsultaModal
        open={showConsultaModal}
        onOpenChange={setShowConsultaModal}
        onCreated={async () => {
          }}
      />
    </motion.div>
  );
}