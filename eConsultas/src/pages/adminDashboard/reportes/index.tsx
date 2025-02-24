//Parte del video de mi canal FrancarriYT comentada completa en mi video, los comentarios con complementación
"use client"

import { useState, useEffect } from "react"
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card"
import { DatePickerWithRange } from "@/components/ui/date-picker-range"
import { PersonaSelectorCard } from "@/components/classes components/persona/PersonaSelectorCard"
import { PersonaSelectionSlider } from "@/components/classes components/persona/PersonaSelectionSlider"
import { Button } from "@/components/ui/button"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { servicioApi } from "@/api/classes apis/servicioApi"
import { reportesApi } from "@/api/dashboard/reporteDashboardApi"
import { YearlyReport, DetailedServiceReport, YearlyReportByServiceType } from "@/api/models/reporteModels"
import { useAuth } from "@/context/AuthProvider"
import ReportTable from "./ReportTable"
import { Paciente } from "@/api/models/personaModels"
import { TipoServicio } from "@/api/models/servicioModels"
import { toast } from "sonner"
import { DateRange } from "react-day-picker"
import { Loader2 } from "lucide-react"
import ServiceTypeChart from "./ServiceTypeChart"
import { exportToCSV } from "@/api/misc/csvExporter"
import ServicePieChart from "./components/ServicePieChart"
import AdvancedBarChart from "./components/AdvancedBarChart"

// Componente principal para la gestión de reportes
export default function ReportesManagement() {
  const { personaData } = useAuth() // Datos del usuario autenticado
  const [generalData, setGeneralData] = useState<YearlyReport[]>([]) // Datos generales anuales
  const [specificData, setSpecificData] = useState<DetailedServiceReport[]>([]) // Datos específicos de búsqueda
  const [serviceTypeData, setServiceTypeData] = useState<YearlyReportByServiceType[]>([]) // Datos por tipo de servicio
  const [filters, setFilters] = useState({
    dateRange: undefined as DateRange | undefined, // Rango de fechas seleccionado
    patient: undefined as Paciente | undefined, // Paciente seleccionado
    serviceType: undefined as string | undefined // Tipo de servicio seleccionado
  })
  const [loading, setLoading] = useState({
    general: true, // Estado de carga para datos generales
    specific: false, // Estado de carga para búsqueda específica
    serviceType: true // Estado de carga para datos por tipo de servicio
  })
  const [serviceTypes, setServiceTypes] = useState<TipoServicio[]>([]) // Lista de tipos de servicio
  serviceTypes
  const [patientSelectorOpen, setPatientSelectorOpen] = useState(false) // Estado del selector de pacientes
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'paid' | 'unpaid'>('all') // Filtro de estado de pago

  // Verificar si el usuario es Super Admin
  const isSuperAdmin = personaData?.credenciales?.roles?.some(r => r.id === 3)
  if (!isSuperAdmin) return <div className="p-6 text-red-500">Acceso restringido a Super Admin</div>

  // Cargar datos iniciales al montar el componente
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [generalReport, tiposServicio, serviceTypeReport] = await Promise.all([
          reportesApi.getReportesByYear(2025), // Obtener reporte anual
          servicioApi.getAllTiposServicio(), // Obtener tipos de servicio
          reportesApi.getReporteByYearAndTipo(2025) // Obtener reporte por tipo de servicio
        ])
        setGeneralData(generalReport)
        setServiceTypes(tiposServicio)
        setServiceTypeData(serviceTypeReport)
        setLoading(prev => ({
          ...prev,
          general: false,
          serviceType: false
        }))
      } catch (error) {
        toast.error("Error inicializando datos")
        setLoading(prev => ({
          ...prev,
          general: false,
          serviceType: false
        }))
      }
    }
    loadInitialData()
  }, [])

  // Ejecutar búsqueda específica con los filtros seleccionados
  const executeSpecificSearch = async () => {
    if (!validateFilters()) return // Validar filtros antes de ejecutar
    
    setLoading(prev => ({...prev, specific: true}))
    try {
      const baseParams = {
        fechaInicio: filters.dateRange?.from?.toISOString().split('T')[0], // Fecha de inicio
        fechaFin: filters.dateRange?.to?.toISOString().split('T')[0], // Fecha de fin
        pacienteEmail: filters.patient?.credenciales.email, // Email del paciente
        tipoServicio: filters.serviceType // Tipo de servicio
      }
  
      // Obtener resultados pagados y no pagados
      const [paidResults, unpaidResults] = await Promise.all([
        reportesApi.getReportesByManyParams({ ...baseParams, pagado: true }),
        reportesApi.getReportesByManyParams({ ...baseParams, pagado: false })
      ])
  
      // Combinar y ordenar resultados por fecha
      const combinedResults = [
        ...paidResults.map(item => ({ ...item, pagado: true })),
        ...unpaidResults.map(item => ({ ...item, pagado: false }))
      ].sort((a, b) => 
        new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
      )
  
      setSpecificData(combinedResults)
    } catch (error) {
      toast.error("Error en búsqueda específica")
    } finally {
      setLoading(prev => ({...prev, specific: false}))
    }
  }

  // Validar que el rango de fechas sea correcto
  const validateFilters = () => {
    if (filters.dateRange?.from && filters.dateRange?.to && 
        filters.dateRange.from > filters.dateRange.to) {
      toast.error("Rango de fechas inválido")
      return false
    }
    return true
  }

  // Filtrar datos específicos según el estado de pago
  const filteredSpecificData = specificData.filter(item => {
    if (paymentFilter === 'all') return true
    return paymentFilter === 'paid' ? item.pagado : !item.pagado
  })

  // Calcular totales generales
  const totals = {
    totalPaid: generalData.reduce((acc, curr) => acc + curr.paidAmount, 0), // Total pagado
    totalUnpaid: generalData.reduce((acc, curr) => acc + curr.unpaidAmount, 0), // Total pendiente
    totalSalaries: generalData.reduce((acc, curr) => acc + curr.salaryExpenses, 0), // Total gastos en sueldos
    netProfit: generalData.reduce((acc, curr) => acc + (curr.paidAmount  - curr.salaryExpenses), 0) // Ganancia neta
  };

  return (
    <div className="p-6 space-y-8">
      {/* Sección Reporte Anual */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Reporte General 2025</h2>
          <Button 
            variant="outline"
            onClick={() => {
              const data = generalData.map(item => ({
                Periodo: item.period,
                Pagado: item.paidAmount,
                Pendiente: item.unpaidAmount,
                'Gastos Sueldos': item.salaryExpenses,
                Total: item.paidAmount + item.unpaidAmount
              }))
              exportToCSV(data, `Reporte_General_${new Date().toISOString().split('T')[0]}.csv`) // Exportar a CSV
            }}
            disabled={!generalData.length}
          >
            Exportar CSV
          </Button>
        </div>

        {/* Tarjetas de resumen */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <SummaryCard 
            title="Ganancias Brutas" 
            value={totals.totalPaid} 
            variant="success"
          />
          <SummaryCard 
            title="Total Pendiente" 
            value={totals.totalUnpaid} 
            variant="danger"
          />
          <SummaryCard 
            title="Gastos en Sueldos" 
            value={totals.totalSalaries} 
            variant="info"
          />
          <SummaryCard 
            title="Ganancias Netas" 
            value={totals.netProfit} 
            variant={totals.netProfit >= 0 ? "success" : "danger"}
            description="Pagado - Gastos"
          />
        </div>

        {/* Gráfico de barras avanzado */}
        <div className="pt-4">
          <AdvancedBarChart 
            data={generalData} 
            showSalaries={true}
          />
        </div>
      </section>

      {/* Gráfico de Torta */}
      <section className="space-y-6 border-t pt-8">
        <h3 className="text-2xl font-bold">Distribución por Tipo de Servicio</h3>
        <div className="h-[500px]">
          <ServicePieChart data={serviceTypeData} />
        </div>
      </section>

      {/* Gráficos de Servicios */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-bold">Detalle por Tipo de Servicio</h3>
          <Button 
            variant="outline"
            onClick={() => {
              const data = serviceTypeData.map(item => ({
                Periodo: item.period,
                'Tipo Servicio': item.serviceType,
                Pagado: item.paidAmount,
                Pendiente: item.unpaidAmount,
                Total: item.paidAmount + item.unpaidAmount
              }))
              exportToCSV(data, `Distribucion_Tipo_Servicio_${new Date().toISOString().split('T')[0]}.csv`) // Exportar a CSV
            }}
            disabled={!serviceTypeData.length}
          >
            Exportar CSV
          </Button>
        </div>
        <ServiceTypeChart data={serviceTypeData} loading={loading.serviceType} />
      </section>

      {/* Búsqueda Avanzada */}
      <section className="space-y-6 border-t pt-8">
        <h3 className="text-2xl font-bold">Búsqueda Avanzada</h3>
        
        {/* Filtros de búsqueda */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <DatePickerWithRange
            onDateChange={(range) => setFilters(prev => ({...prev, dateRange: range}))} // Seleccionar rango de fechas
            className="col-span-2"
          />
          
          <PersonaSelectorCard
            tipoPersona="PACIENTE"
            selectedPersona={filters.patient}
            onSelect={() => setPatientSelectorOpen(true)} // Abrir selector de pacientes
            onRemove={() => setFilters(prev => ({...prev, patient: undefined}))} // Eliminar paciente seleccionado
          />

          <Select
            value={paymentFilter}
            onValueChange={(value: 'all' | 'paid' | 'unpaid') => setPaymentFilter(value)} // Seleccionar estado de pago
          >
            <SelectTrigger>
              <SelectValue placeholder="Estado de Pago" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="paid">Pagado</SelectItem>
              <SelectItem value="unpaid">Pendiente</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Selector de pacientes */}
        {patientSelectorOpen && (
          <PersonaSelectionSlider
            open={patientSelectorOpen}
            onOpenChange={setPatientSelectorOpen}
            onSelect={(patient) => setFilters(prev => ({
              ...prev,
              patient: patient as Paciente
            }))}
            tipoPersona="PACIENTE"
          />
        )}

        {/* Botones de limpiar filtros y ejecutar búsqueda */}
        <div className="flex gap-4 justify-end">
          <Button 
            variant="outline" 
            onClick={() => {
              setFilters({
                dateRange: undefined,
                patient: undefined,
                serviceType: undefined
              })
              setPaymentFilter('all')
            }}
          >
            Limpiar Filtros
          </Button>
          
          <Button 
            onClick={executeSpecificSearch}
            disabled={loading.specific}
          >
            {loading.specific ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Ejecutar Búsqueda
          </Button>
        </div>

        {/* Resultados de búsqueda */}
        {filteredSpecificData.length > 0 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="text-xl font-semibold">Resultados de Búsqueda</h4>
              <Button 
                variant="outline"
                onClick={() => {
                  const data = filteredSpecificData.map(item => ({
                    Fecha: new Date(item.fecha).toLocaleDateString(),
                    Servicio: item.nombre,
                    Descripción: item.descripcion,
                    'Precio Base': item.precio,
                    'Descuento Paquete': `${item.porcentajeDescuentoPaquete}%`,
                    'Descuento Obra Social': `${item.porcentajeDescuentoObraSocial}%`,
                    Total: item.total,
                    Estado: item.pagado ? 'Pagado' : 'Pendiente'
                  }))
                  exportToCSV(data, `Busqueda_Avanzada_${new Date().toISOString().split('T')[0]}.csv`) // Exportar a CSV
                }}
              >
                Exportar CSV
              </Button>
            </div>
            
            {/* Gráfico de barras avanzado para resultados filtrados */}
            <div className="pt-4">
              <AdvancedBarChart 
                data={filteredSpecificData.map(item => ({
                  period: new Date(item.fecha).toISOString(),
                  paidAmount: item.pagado ? item.total : 0,
                  unpaidAmount: !item.pagado ? item.total : 0,
                  salaryExpenses: 0,
                  totalPaid: 0,
                  totalUnpaid: 0
                }))} 
                showSalaries={false}
              />
            </div>
            
            {/* Tabla de resultados */}
            <ReportTable 
              data={filteredSpecificData}
              loading={loading.specific}
            />
          </div>
        )}
      </section>
    </div>
  )
}

// Componente para mostrar tarjetas de resumen
const SummaryCard = ({
  title,
  value,
  variant = 'default',
  description
}: {
  title: string
  value: number
  variant?: 'success' | 'danger' | 'info' | 'default'
  description?: string
}) => {
  const colorClasses = {
    success: 'text-green-600',
    danger: 'text-red-600',
    info: 'text-blue-600',
    default: 'text-foreground'
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${colorClasses[variant]}`}>
          ${value.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
        </div>
      </CardContent>
    </Card>
  )
}