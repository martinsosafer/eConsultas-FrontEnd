import type React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Calendar,
  DollarSign,
  Settings,
  FileText,
  BarChart2,
} from "lucide-react";
import Button from "@/components/button";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import { dashboardApi } from "@/api/dashboard/superAdminVarietyReports";

export default function AdminDashboard() {
  const location = useLocation();
  const outletRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const { personaData } = useAuth();
  const navigate = useNavigate();

  const isSuperAdmin = personaData?.credenciales.roles.some(
    (role) => role.id === 3
  );
  const isAdmin = personaData?.credenciales.roles.some((role) => role.id === 1);
  isAdmin;

  const [pacientesTotales, setPacientesTotales] = useState<string>("0");
  const [turnosHoy, setTurnosHoy] = useState<string>("0");
  const [gananciasHoy, setGananciasHoy] = useState<string>("0");

  useEffect(() => {
    if (isSuperAdmin) {
      const fetchMetrics = async () => {
        const today = new Date().toISOString().split("T")[0];
        try {
          const totalPacientes = await dashboardApi.getTotalNumberOfPacientes();
          setPacientesTotales(totalPacientes);

          const totalConsultas =
            await dashboardApi.getNumberOfConsultasInOneDay(today);
          setTurnosHoy(totalConsultas);

          const ganancias = (
            await dashboardApi.getNumberOfGananciasInOneDay(today, today)
          ).toFixed(2);
          setGananciasHoy(ganancias);
        } catch (error) {
          console.error("Error fetching metrics:", error);
        }
      };
      fetchMetrics();
    }
  }, [isSuperAdmin]);

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
    <div className="p-4 sm:p-8 bg-background min-h-screen">
      <h1 className="text-2xl sm:text-4xl font-bold text-primary-dark mb-4 sm:mb-8">
        {isSuperAdmin ? "Super Admin Dashboard" : "Admin Dashboard"}
      </h1>

      {/* Main Metrics Card */}
      <div className="mx-auto mb-6 sm:mb-8 w-full max-w-screen-lg  ">
        <Card className="shadow-xl overflow-hidden">
          <div className="grid SMgrid-cols-1 sm:grid-cols-2">
            {/* Metrics Section */}
            <div className="p-4 sm:p-6 border-b sm:border-b-0 sm:border-r ">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl font-semibold flex items-center">
                  <BarChart2 className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
                  Métricas de la Aplicación
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[calc(100%-60px)]">
                {isSuperAdmin ? (
                  <div className="grid grid-rows-3 sm:grid-rows-2 sm:grid-cols-2 gap-4 sm:gap-6 w-full h-full">
                    <MetricCard
                      title="Pacientes Totales"
                      value={pacientesTotales}
                      icon={
                        <Users className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                      }
                    />
                    <MetricCard
                      title="Turnos hoy"
                      value={turnosHoy}
                      icon={
                        <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-secondary" />
                      }
                    />
                    <MetricCard
                      title="Dinero recaudado hoy"
                      value={`$${gananciasHoy}`}
                      icon={
                        <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-success" />
                      }
                      className="sm:col-span-2"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-48 sm:h-64">
                    <p className="text-sm sm:text-lg text-muted-foreground text-center">
                      Métricas disponibles solo para SuperAdmins... ¡Saludos!
                    </p>
                  </div>
                )}
              </CardContent>
            </div>

            {/* Financial Reports Section */}
            {isSuperAdmin && (
              <div className="p-4 sm:p-6 flex flex-col">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl font-semibold text-center">
                    Reportes Financieros
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between">
                  <p className="text-xs sm:text-sm text-gray-500 mb-4 text-center">
                    Genera informes detallados y revisa el estado financiero
                  </p>
                  <div className="mt-auto">
                    <Button
                      label="Acceder a reportes"
                      type="primary"
                      onClick={() => navigate("/dashboard-admin/reportes")}
                      className="w-full text-sm sm:text-base px-4 py-3 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary transition-all font-semibold"
                    />
                  </div>
                </CardContent>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-6 mt-6 sm:mt-8">
        <QuickActionCard
          title="Manejar Personal"
          description="Añadir, eliminar o actualizar personal"
          icon={<Users className="h-5 w-5 sm:h-6 sm:w-6" />}
          href="/dashboard-admin/manejar-personal"
          onClick={() => console.log("Tracking click event")}
        />
        <QuickActionCard
          title="Servicios"
          description="Ver todos los Servicios"
          icon={<Calendar className="h-5 w-5 sm:h-6 sm:w-6" />}
          href="/dashboard-admin/servicios"
        />
        <QuickActionCard
          title="Paquetes"
          description="Lista de los paquetes disponibles"
          icon={<FileText className="h-5 w-5 sm:h-6 sm:w-6" />}
          href="/dashboard-admin/paquetes"
        />
        <QuickActionCard
          title="Consultas"
          description="Listas de las próximas consultas"
          icon={<Settings className="h-5 w-5 sm:h-6 sm:w-6" />}
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
          className="origin-top mt-4 sm:mt-6"
          onAnimationStart={() => setIsAnimating(true)}
          onAnimationComplete={() => {
            setIsAnimating(false);
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
  className,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardContent className="flex items-center justify-between p-4 sm:p-5">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
            {title}
          </p>
          <p className="text-xl sm:text-2xl font-bold truncate">{value}</p>
        </div>
        <div className="ml-2 flex-shrink-0">{icon}</div>
      </CardContent>
    </Card>
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
      <CardContent className="p-4 sm:p-6 flex flex-col h-full">
        <div className="flex items-center mb-3 sm:mb-4">
          <div className="bg-primary-light p-2 rounded-full mr-3 sm:mr-4">
            {icon}
          </div>
          <h2 className="font-semibold text-sm sm:text-base">{title}</h2>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 flex-grow">
          {description}
        </p>
        <Button
          label="Acceso"
          type="primary"
          onClick={handleClick}
          className="text-sm sm:text-base cursor-pointer hover:bg-primary-dark"
          {...(href && { role: "link" })}
        />
      </CardContent>
    </Card>
  );
}
