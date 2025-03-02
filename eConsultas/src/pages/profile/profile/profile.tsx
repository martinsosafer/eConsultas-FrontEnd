import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  UserIcon as IconUser,
  MailIcon as IconMail,
  PhoneIcon as IconPhone,
  HomeIcon as IconHome,
  EditIcon as IconEdit,
  FolderIcon as IconFolder,
  CalendarIcon as IconCalendar,
  ClockIcon as IconClock,
  CopyIcon as IconCopy,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Paciente, Medico } from "@/api/models/personaModels";
import { useEffect, useState } from "react";
import { personaApi } from "@/api/classes apis/personaApi";
import { extractErrorMessage } from "@/api/misc/errorHandler";
import { useAuth } from "@/context/AuthProvider";
import { MedicalScheduleModal } from "./seeProfileMedicalSchedule"; 

export default function Profile({ patient }: { patient: Medico | Paciente }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(true);
  const { personaData } = useAuth();
  const navigate = useNavigate();
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false); 

  const isOwnProfile = personaData?.credenciales.email === patient.credenciales?.email;

  useEffect(() => {
    const loadProfilePicture = async () => {
      try {
        if (patient.credenciales?.email) {
          const blob = await personaApi.fetchProfilePicture(
            patient.credenciales.email
          );
          const url = URL.createObjectURL(blob);
          setImageUrl(url);
        }
      } catch (error) {
        const errorMessage = extractErrorMessage(error);
        console.error("Profile picture error:", errorMessage);
      } finally {
        setLoadingImage(false);
      }
    };

    loadProfilePicture();

    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [patient.credenciales?.email]);

  return (
    <Card className="max-w-4xl mx-auto bg-card shadow-lg rounded-2xl overflow-hidden mt-6">
      <div className="bg-gradient-to-r from-primary to-secondary h-48"></div>
      <CardHeader className="relative text-center pb-0 pt-32">
        <div className="flex justify-center items-center gap-4">
          <Avatar className="w-40 h-40 mx-auto border-4 border-white rounded-full absolute -top-20 inset-x-0">
            {!loadingImage && imageUrl && (
              <AvatarImage
                src={imageUrl}
                alt={`${patient.nombre} ${patient.apellido}`}
                className="rounded-full"
              />
            )}
            <AvatarFallback className="text-5xl bg-primary text-white rounded-full">
              {loadingImage ? (
                <div className="animate-pulse bg-gray-300 w-full h-full rounded-full" />
              ) : (
                `${patient.nombre?.[0]}${patient.apellido?.[0]}`
              )}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-3xl font-bold text-primary-dark">
              {patient.nombre} {patient.apellido}
              {isOwnProfile && (
                <Link
                  to={`edit`}
                  className="ml-4 inline-block hover:text-primary transition-colors"
                >
                  <IconEdit className="w-6 h-6" />
                </Link>
              )}
            </CardTitle>
            <Badge
              variant="outline"
              className="mt-2 text-sm px-3 py-1 rounded-full flex justify-center items-center w-full"
            >
              {patient.tipoPersona}
            </Badge>

            <div className="flex flex-col gap-4 mt-4">
              <Link
                to={`files`}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 transform duration-300"
              >
                <IconFolder className="w-5 h-5" />
                <span className="font-semibold">Ver archivos</span>
              </Link>

              <button
                onClick={() => navigate(`/profile/${patient.credenciales.email}/consultas`)}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 transform duration-300"
              >
                <IconCalendar className="w-5 h-5" />
                <span className="font-semibold">Ver consultas</span>
              </button>

              {patient?.tipoPersona === "MEDICO" && (
                <button
                  onClick={() => setIsScheduleModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 transform duration-300"
                >
                  <IconClock className="w-5 h-5" />
                  <span className="font-semibold">Ver horario</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-8 mt-6">
        <section className="bg-background rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-secondary-dark mb-4 flex items-center">
            <IconHome className="mr-2" /> Dirección
          </h3>
          <Separator className="mb-4" />
          <div className="grid grid-cols-2 gap-6">
            <InfoItem label="País" value={patient.pais} />
            <InfoItem label="Ciudad" value={patient.ciudad} />
            <InfoItem label="Código Postal" value={patient.codigoPostal} />
            <InfoItem
              label="Dirección"
              value={`${patient.direccion} ${
                patient.numeroExterior ?? ""
              }`.trim()}
            />
          </div>
        </section>

        <section className="bg-background rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-secondary-dark mb-4 flex items-center">
            <IconPhone className="mr-2" /> Contacto
          </h3>
          <Separator className="mb-4" />
          <div className="grid sm:grid-cols-2 gap-6 grid-row">
            <InfoItem
              label="Teléfono"
              value={`${patient.credenciales.codigoDeLlamada} ${patient.credenciales.celular}`}
              icon={<IconPhone className="text-primary" />}
            />
            <InfoItem
              label="Email"
              value={patient.credenciales.email}
              icon={<IconMail className="text-primary" />}
            />
          </div>
        </section>

        <section className="bg-background rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-secondary-dark mb-4 flex items-center">
            <IconUser className="mr-2" /> Información Personal
          </h3>
          <Separator className="mb-4" />
          <div className="grid grid-cols-2 gap-6">
            <InfoItem label="DNI" value={patient.dni} />
            <InfoItem
              label="Fecha de Nacimiento"
              value={patient.fechaNacimiento}
            />
            {patient.tipoPersona === "PACIENTE" && (
              <InfoItem
                label="Obra social"
                value={patient.obraSocial ? "Sí" : "No"}
              />
            )}
            {patient.tipoPersona === "MEDICO" && (
              <InfoItem label="Especialidad" value={patient.especialidad} />
            )}
          </div>
        </section>
      </CardContent>

      {isScheduleModalOpen && (
        <MedicalScheduleModal
          medicoEmail={patient.credenciales.email}
          onClose={() => setIsScheduleModalOpen(false)}
        />
      )}
    </Card>
  );
}

function InfoItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number | null;
  icon?: React.ReactNode;
}) {
  const handleCopy = () => {
    if (typeof value === 'string') {
      navigator.clipboard.writeText(value);
    }
  };

  const isTruncatable = typeof value === 'string' && value.length > 25;
  const displayedValue = isTruncatable ? `${value.substring(0, 25)}...` : value;

  return (
    <div className="flex items-start">
      {icon && <div className="mr-3 mt-1">{icon}</div>}
      <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className="text-base font-semibold text-foreground flex items-center gap-1">
          {value ? (
            <>
              {displayedValue}
              {isTruncatable && (
                <button
                  onClick={handleCopy}
                  className="text-primary hover:text-primary-dark transition-colors"
                  title="Copiar"
                >
                  <IconCopy className="w-4 h-4" />
                </button>
              )}
            </>
          ) : (
            "N/A"
          )}
        </div>
      </div>
    </div>
  );
}