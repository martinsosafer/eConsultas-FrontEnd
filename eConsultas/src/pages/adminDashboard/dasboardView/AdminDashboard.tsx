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
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function AdminDashboard() {
  const location = useLocation();
  const outletRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);
  const [isAnimating, setIsAnimating] = useState(false);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }


    const scrollToOutlet = () => {
      requestAnimationFrame(() => {
        outletRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      });
    };

    const timer = setTimeout(scrollToOutlet, 100);

    return () => clearTimeout(timer);
  }, [location.key]);

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
          title="Servicios"
          description="Ver todos los Servicios"
          icon={<Calendar className="h-6 w-6" />}
          href="/dashboard-admin/servicios"
        />
        <QuickActionCard
          title="Paquetes "
          description="Lista de los paquetes disponibles"
          icon={<FileText className="h-6 w-6" />}
          href="/dashboard-admin/paquetes"
        />
        <QuickActionCard
          title="Consultas "
          description="Listas de las proximas consultas "
          icon={<Settings className="h-6 w-6" />}
          href="/dashboard-admin/consultas"
        />
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.key}
          ref={outletRef}
          initial={{ opacity: 0, y: -20, scaleY: 0.5 }}
          animate={{
            opacity: 1,
            y: 0,
            scaleY: 1,
            transition: { duration: 0.3, ease: "easeInOut" },
          }}
          exit={{
            opacity: 0,
            y: -20,
            scaleY: 0.5,
            transition: { duration: 0.2, ease: "easeInOut" },
          }}
          className="origin-top"
          onAnimationStart={() => setIsAnimating(true)}
          onAnimationComplete={() => {
            setIsAnimating(false);
            // Smooth scroll after animation
            outletRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }}
        >
          <Outlet context={{ isAnimating }} />
        </motion.div>
      </AnimatePresence>
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

  const handleClick = () => {
    onClick?.();
    if (href) {
      navigate(href);
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
            role: "link",
            className: "cursor-pointer hover:bg-primary-dark",
          })}
        />
      </CardContent>
    </Card>
  );
}
