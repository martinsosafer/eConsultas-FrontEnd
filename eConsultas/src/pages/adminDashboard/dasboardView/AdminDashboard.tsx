import type React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Users,
  Calendar,
  Activity,
  DollarSign,
  Bell,
  Settings,
  FileText,
  BarChart2,
} from "lucide-react";
import Button from "@/components/button";
import { Outlet, useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="p-8 bg-background min-h-screen">
      <h1 className="text-4xl font-bold text-primary-dark mb-8">
        Super Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Pacientes Totales"
          value="1,234"
          icon={<Users className="h-8 w-8 text-primary" />}
        />
        <MetricCard
          title="Turnos para hoy "
          value="42"
          icon={<Calendar className="h-8 w-8 text-secondary" />}
        />
        <MetricCard
          title="Personal Activo"
          value="56"
          icon={<Activity className="h-8 w-8 text-accent" />}
        />
        <MetricCard
          title="Ganancias (mensuales)"
          value="$125,000"
          icon={<DollarSign className="h-8 w-8 text-success" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center">
              <BarChart2 className="mr-2" /> Rendimiento de Clinica
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Placeholder for a chart component */}
            <div className="bg-muted h-64 rounded-lg flex items-center justify-center">
              placeholder de metricas
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center">
              <Bell className="mr-2" /> Notificaciones Recientes (no se si
              llegamos a implementar esto)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <NotificationItem
                title="Pacientes nuevo registrado"
                description="John Doe se ha registrado como paciente "
                time="hace 2 horas"
              />
              <NotificationItem
                title="Turno cancelado"
                description="Sarah Smith cancelo su turno para el jueves 5 de febrero a las 12:45hs"
                time="hace 4 horas "
              />
              <NotificationItem
                title="Reunion con el personal de trabajo"
                description="Reunion mensual con el equipo a las 9"
                time="Ayer"
              />
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        <QuickActionCard
          title="Manejar Personal"
          description="Añadir, eliminar o actualizar personal"
          icon={<Users className="h-6 w-6" />}
          href="/dashboard-admin/manejar-personal"
          onClick={() => console.log("Tracking click event")}
        />
        <QuickActionCard
          title="Manejar Turnos"
          description="Mirar y modificar seccion de turnos "
          icon={<Calendar className="h-6 w-6" />}
        />
        <QuickActionCard
          title="Reportes Financieros "
          description="Generar y ver reportes financieros "
          icon={<FileText className="h-6 w-6" />}
        />
        <QuickActionCard
          title="Configurar secciones de sistema "
          description="Configurar secciones de sistemas"
          icon={<Settings className="h-6 w-6" />}
        />
      </div>
      <Outlet />
    </div>
  );
}

function MetricCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        {icon}
      </CardContent>
    </Card>
  );
}

function NotificationItem({
  title,
  description,
  time,
}: {
  title: string;
  description: string;
  time: string;
}) {
  return (
    <li className="border-b border-border pb-2">
      <h4 className="font-semibold text-sm">{title}</h4>
      <p className="text-sm text-muted-foreground">{description}</p>
      <p className="text-xs text-muted-foreground mt-1">{time}</p>
    </li>
  );
}

function QuickActionCard({
  title,
  description,
  icon,
  href,
  onClick,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
}) {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    onClick?.();

    if (href) {
      navigate(href); // REPLACE window.location.href WITH THIS
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex items-center mb-4">
          <div className="bg-primary-light p-2 rounded-full mr-4">{icon}</div>
          <h3 className="font-semibold">{title}</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4 flex-grow">
          {description}
        </p>

        <Button
          label="Acceso"
          type="primary"
          onClick={handleClick}
          {...(href && {
            // Add ARIA role for accessibility
            role: "link",
            // Style the button as a link while keeping button appearance
            className: "cursor-pointer hover:bg-primary-dark",
          })}
        />
      </CardContent>
    </Card>
  );
}
