import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Users,
  Calendar,
  DollarSign,
  Settings,
  FileText,
  BarChart2,
} from "lucide-react"
import Button from "@/components/button"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { useAuth } from "@/context/AuthProvider"
import { dashboardApi } from "@/api/dashboard/superAdminVarietyReports"

export default function AdminDashboard() {
  const location = useLocation()
  const outletRef = useRef<HTMLDivElement>(null)
  const isFirstRender = useRef(true)
  const [isAnimating, setIsAnimating] = useState(false)
  const { personaData } = useAuth()
  const navigate = useNavigate()

  const isSuperAdmin = personaData?.credenciales.roles.some(
    (role) => role.id === 3
  )
  const isAdmin = personaData?.credenciales.roles.some((role) => role.id === 1)
  isAdmin

  const [pacientesTotales, setPacientesTotales] = useState<string>("0")
  const [turnosHoy, setTurnosHoy] = useState<string>("0")
  const [gananciasHoy, setGananciasHoy] = useState<number>(0)

  useEffect(() => {
    if (isSuperAdmin) {
      const fetchMetrics = async () => {
        const today = new Date().toISOString().split("T")[0]
        try {
          const totalPacientes = await dashboardApi.getTotalNumberOfPacientes()
          setPacientesTotales(totalPacientes)

          const totalConsultas =
            await dashboardApi.getNumberOfConsultasInOneDay(today)
          setTurnosHoy(totalConsultas)

          const ganancias = await dashboardApi.getNumberOfGananciasInOneDay(
            today,
            today
          )
          setGananciasHoy(ganancias)
        } catch (error) {
          console.error("Error fetching metrics:", error)
        }
      }
      fetchMetrics()
    }
  }, [isSuperAdmin])

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    const scrollToOutlet = () => {
      requestAnimationFrame(() => {
        outletRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        })
      })
    }
    const timer = setTimeout(scrollToOutlet, 100)
    return () => clearTimeout(timer)
  }, [location.key])

  return (
    <div className="p-8 bg-background min-h-screen">
      <h1 className="text-4xl font-bold text-primary-dark mb-8">
        {isSuperAdmin ? "Super Admin Dashboard" : "Admin Dashboard"}
      </h1>

      <div className="mx-auto mb-8" style={{ width: "85vw", height: "50vh" }}>
        <Card className="h-full shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
            <div className="p-6">
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center">
                  <BarChart2 className="mr-2" /> Métricas de la Aplicación
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isSuperAdmin ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <MetricCard
                      title="Pacientes Totales"
                      value={pacientesTotales}
                      icon={<Users className="h-8 w-8 text-primary" />}
                    />
                    <MetricCard
                      title="Turnos para hoy"
                      value={turnosHoy}
                      icon={<Calendar className="h-8 w-8 text-secondary" />}
                    />
                    <MetricCard
                      title="Dinero recaudado de hoy"
                      value={`$${gananciasHoy}`}
                      icon={<DollarSign className="h-8 w-8 text-success" />}
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64">
                    <p className="text-lg text-muted-foreground">
                      Métricas disponibles solo para SuperAdmins... ¡Saludos!
                    </p>
                  </div>
                )}
              </CardContent>
            </div>
            {isSuperAdmin && (
              <div className="p-14">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold flex items-center justify-center w-full">
                    Reportes Financieros
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-4 text-center">
                    Genera informes detallados y revisa el estado financiero
                  </p>
                  <div className="flex justify-center">
                    <Button
                      label="Acceder a los reportes financieros"
                      type="primary"
                      onClick={() =>
                        navigate("/dashboard-admin/reportes")
                      }
                      className="bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary transition-all text-lg font-semibold px-6 py-4"
                    />
                  </div>
                </CardContent>
              </div>
            )}
          </div>
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
          title="Paquetes"
          description="Lista de los paquetes disponibles"
          icon={<FileText className="h-6 w-6" />}
          href="/dashboard-admin/paquetes"
        />
        <QuickActionCard
          title="Consultas"
          description="Listas de las próximas consultas"
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
            setIsAnimating(false)
            outletRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            })
          }}
        >
          <Outlet context={{ isAnimating }} />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function MetricCard({
  title,
  value,
  icon,
}: {
  title: string
  value: string
  icon: React.ReactNode
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
  )
}

function QuickActionCard({
  title,
  description,
  icon,
  href,
  onClick,
}: {
  title: string
  description: string
  icon: React.ReactNode
  href?: string
  onClick?: () => void
}) {
  const navigate = useNavigate()

  const handleClick = () => {
    onClick?.()
    if (href) {
      navigate(href)
    }
  }

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
  )
}
