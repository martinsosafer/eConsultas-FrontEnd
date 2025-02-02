import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  UserIcon as IconUser,
  MailIcon as IconMail,
  PhoneIcon as IconPhone,
  ShieldIcon as IconShield,
} from "lucide-react";
import type React from "react";

export default function Profile({ patient }: { patient: any }) {
  return (
    <Card className="max-w-4xl mx-auto bg-card shadow-lg rounded-2xl overflow-hidden mt-6">
      <div className="bg-gradient-to-r from-primary to-secondary h-48"></div>
      <CardHeader className="relative text-center pb-0 pt-32">
        {" "}
        {/* Increased padding-top */}
        <Avatar className="w-40 h-40 mx-auto border-4 border-white rounded-full absolute -top-20 inset-x-0">
          {" "}
          {/* Adjusted positioning */}
          <AvatarImage
            src="/placeholder.svg"
            alt={`${patient.nombre} ${patient.apellido}`}
            className="rounded-full"
          />
          <AvatarFallback className="text-5xl bg-primary text-white rounded-full">
            {`${patient.nombre?.[0]}${patient.apellido?.[0]}`}
          </AvatarFallback>
        </Avatar>
        <CardTitle className="text-3xl font-bold text-primary-dark ">
          {" "}
          {patient.nombre} {patient.apellido}
        </CardTitle>
        <Badge
          variant="outline"
          className="mt-2 text-sm px-3 py-1 rounded-full flex justify-center items-center w-full"
        >
          {patient.tipoPersona}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-8 mt-6">
        <section className="bg-background rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-secondary-dark mb-4 flex items-center">
            <IconUser className="mr-2" /> Informacion basica
          </h3>
          <Separator className="mb-4" />
          <div className="grid grid-cols-2 gap-6">
            <InfoItem label="DNI" value={patient.dni} />
            <InfoItem
              label="Fecha de nacimiento "
              value={patient.fechaNacimiento}
            />

            <InfoItem
              label="Obra Social"
              value={patient.obraSocial ? "Yes" : "No"}
            />
          </div>
        </section>

        <section className="bg-background rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-secondary-dark mb-4 flex items-center">
            <IconMail className="mr-2" /> Informacion de Contacto
          </h3>
          <Separator className="mb-4" />
          <div className="grid grid-cols-2 gap-6">
            <InfoItem
              label="Email"
              value={patient.credenciales.email}
              icon={<IconMail className="text-primary" />}
            />
            <InfoItem
              label="Telefono"
              value={`${patient.credenciales.codigoDeLlamada} ${patient.credenciales.celular}`}
              icon={<IconPhone className="text-primary" />}
            />
          </div>
        </section>

        <section className="bg-background rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-secondary-dark mb-4 flex items-center">
            <IconShield className="mr-2" /> Informacion adicional
          </h3>
          <Separator className="mb-4" />
          <div className="grid grid-cols-2 gap-6">
            <InfoItem label="Username" value={patient.credenciales.username} />
            <InfoItem
              label="Verification Level"
              value={patient.credenciales.nivelDeVerificacion}
            />
            <InfoItem
              label="Verificacion de 2 pasos "
              value={patient.credenciales.verificacion2Factores ? "Yes" : "No"}
            />
          </div>
        </section>
      </CardContent>
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
  return (
    <div className="flex items-start">
      {icon && <div className="mr-3 mt-1">{icon}</div>}
      <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-base font-semibold text-foreground">
          {value || "N/A"}
        </p>
      </div>
    </div>
  );
}
