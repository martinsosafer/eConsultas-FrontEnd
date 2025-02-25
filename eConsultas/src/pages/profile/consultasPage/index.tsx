import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Consulta } from "@/api/models/consultaModels";
import { consultaApi } from "@/api/classes apis/consultaApi";
import { medicoApi } from "@/api/classes apis/medicoApi";
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
  const [especialidades, setEspecialidades] = useState<string[]>([]);
  const [emailToImageMap, setEmailToImageMap] = useState<Record<string, string>>({});

  const [especialidadFilter, setEspecialidadFilter] = useState("");
  const [tipoFilter, setTipoFilter] = useState("");
  const [pagoFilter, setPagoFilter] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        // console.log(loading);
        loading;
        
        // Obtenemos datos del usuario objetivo
        const userData = username === personaData?.credenciales?.username
          ? personaData
          : await personaApi.getPersonaByUsername(username!);

        if (!userData) {
          navigate("/not-found");
          return;
        }

        setTargetUser(userData);

        // Verificamos permisos si no es el propio usuario!
        if (username !== personaData?.credenciales?.username) {
          const hasPermission = personaData?.credenciales.roles.some(r => [1, 3].includes(r.id));
          if (!hasPermission) {
            navigate("/unauthorized");
            return;
          }
        }

        const [consultasData, especialidadesData] = await Promise.all([
          consultaApi.getConsultasByPersonaEmail(userData.credenciales.email),
          medicoApi.getMedicoSpecialties()
        ]);

        setEspecialidades(especialidadesData);
        setConsultas(consultasData);
        setFilteredConsultas(consultasData);

        // Cargamos las imágenes de perfiles (Cree el cache jaja)
        const uniqueEmails = new Set<string>();
        const isPaciente = userData.tipoPersona === "PACIENTE";

        consultasData.forEach(consulta => {
          uniqueEmails.add(isPaciente 
            ? consulta.medico.credenciales.email 
            : consulta.paciente.credenciales.email
          );
        });

        const imageMap: Record<string, string> = {};
        await Promise.all(
          Array.from(uniqueEmails).map(async (email) => {
            try {
              const image = await personaApi.fetchProfilePicture(email);
              imageMap[email] = URL.createObjectURL(image);
            } catch (error) {
              console.error(`Error loading image for ${email}:`, error);
            }
          })
        );

        // Agregar imagen del usuario actual si no está en el mapa del caché
        if (userData.credenciales.email && !imageMap[userData.credenciales.email]) {
          try {
            const userImage = await personaApi.fetchProfilePicture(userData.credenciales.email);
            imageMap[userData.credenciales.email] = URL.createObjectURL(userImage);
          } catch (error) {
            console.error("Error loading user image:", error);
          }
        }

        setEmailToImageMap(imageMap);
      } catch (error) {
        console.error("Error loading data:", error);
        navigate("/error", { state: { error: "Error al cargar las consultas" } });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [username, isAuthenticated, personaData, navigate]);

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
  }, [especialidadFilter, tipoFilter, pagoFilter, consultas]);

  if (isLoading) {
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

  if (!targetUser) {
    return <div className="p-8 text-center">Usuario no encontrado</div>;
  }

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

        {targetUser.tipoPersona === "PACIENTE" && 
          username === personaData?.credenciales?.username && (
            <Button
              type="primary"
              label="Solicitar nueva consulta"
              onClick={() => setShowConsultaModal(true)}
            />
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Select onValueChange={setEspecialidadFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Especialidad" />
          </SelectTrigger>
          <SelectContent>
            {especialidades.map(e => (
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

      {filteredConsultas.length > 0 ? (
        <motion.div
          layout
          className="grid sm:grid-cols-3 grid-cols-1 gap-6"
        >
          {filteredConsultas.map((consulta, i) => (
            <ConsultaCard 
              key={consulta.id} 
              consulta={consulta}
              emailToImageMap={emailToImageMap}
              targetUserType={targetUser.tipoPersona}
              animateProps={{ initial: { opacity: 0 }, animate: { opacity: 1 }}}
              transition={{ delay: i * 0.1 }}
            />
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No se encontraron consultas
        </div>
      )}

      <PatientCreateConsultaModal
        open={showConsultaModal}
        onOpenChange={setShowConsultaModal}
        onCreated={async () => {
          try {
            const nuevasConsultas = await consultaApi.getConsultasByPersonaEmail(
              targetUser.credenciales.email
            );
            setConsultas(nuevasConsultas);
            setFilteredConsultas(nuevasConsultas);
          } catch (error) {
            console.error("Error al actualizar consultas:", error);
          }
        }}
      />
    </motion.div>
  );
}