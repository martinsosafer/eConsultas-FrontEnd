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
import FinancialChart from "./FinancialChart"
import ReportTable from "./ReportTable"
import { Paciente } from "@/api/models/personaModels"
import { TipoServicio } from "@/api/models/servicioModels"
import { toast } from "sonner"
import { DateRange } from "react-day-picker"
import { Loader2, Table } from "lucide-react"
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import ServiceTypeChart from "./ServiceTypeChart"
import { exportToCSV } from "@/api/misc/csvExporter"

export default function ReportesManagement() {
  const { personaData } = useAuth()
  const [generalData, setGeneralData] = useState<YearlyReport[]>([])
  const [specificData, setSpecificData] = useState<DetailedServiceReport[]>([])
  const [serviceTypeData, setServiceTypeData] = useState<YearlyReportByServiceType[]>([])
  const [filters, setFilters] = useState({
    dateRange: undefined as DateRange | undefined,
    patient: undefined as Paciente | undefined,
    serviceType: undefined as string | undefined
  })
  const [loading, setLoading] = useState({
    general: true,
    specific: false,
    serviceType: true
  })
  const [serviceTypes, setServiceTypes] = useState<TipoServicio[]>([])
  const [patientSelectorOpen, setPatientSelectorOpen] = useState(false)
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'paid' | 'unpaid'>('all')

  const isSuperAdmin = personaData?.credenciales?.roles?.some(r => r.id === 3)
  if (!isSuperAdmin) return <div className="p-6 text-red-500">Acceso restringido a Super Admin</div>

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [generalReport, tiposServicio, serviceTypeReport] = await Promise.all([
          reportesApi.getReportesByYear(2025),
          servicioApi.getAllTiposServicio(),
          reportesApi.getReporteByYearAndTipo(2025)
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

  const executeSpecificSearch = async () => {
    if (!validateFilters()) return
    
    setLoading(prev => ({...prev, specific: true}))
    try {
      const baseParams = {
        fechaInicio: filters.dateRange?.from?.toISOString().split('T')[0],
        fechaFin: filters.dateRange?.to?.toISOString().split('T')[0],
        pacienteEmail: filters.patient?.credenciales.email,
        tipoServicio: filters.serviceType
      }

      const [paidResults, unpaidResults] = await Promise.all([
        reportesApi.getReportesByManyParams({ ...baseParams, pagado: true }),
        reportesApi.getReportesByManyParams({ ...baseParams, pagado: false })
      ])

      const combinedResults = [
        ...paidResults.map(item => ({ ...item, pagado: true })),
        ...unpaidResults.map(item => ({ ...item, pagado: false }))
      ]

      setSpecificData(combinedResults)
    } catch (error) {
      toast.error("Error en búsqueda específica")
    } finally {
      setLoading(prev => ({...prev, specific: false}))
    }
  }

  const validateFilters = () => {
    if (filters.dateRange?.from && filters.dateRange?.to && 
        filters.dateRange.from > filters.dateRange.to) {
      toast.error("Rango de fechas inválido")
      return false
    }
    return true
  }

  const filteredSpecificData = specificData.filter(item => {
    if (paymentFilter === 'all') return true
    return paymentFilter === 'paid' ? item.pagado : !item.pagado
  })

  const totals = {
    totalPaid: generalData.reduce((acc, curr) => acc + curr.paidAmount, 0),
    totalUnpaid: generalData.reduce((acc, curr) => acc + curr.unpaidAmount, 0),
    netProfit: generalData.reduce((acc, curr) => acc + (curr.paidAmount - curr.unpaidAmount), 0)
  }

  return (
    <div className="p-6 space-y-8">
      {/* Sección General */}
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
                Total: item.paidAmount + item.unpaidAmount
              }))
              exportToCSV(data, `Reporte_General_${new Date().toISOString().split('T')[0]}.csv`)
            }}
            disabled={!generalData.length}
          >
            Exportar CSV
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            title="Ganancias Netas" 
            value={totals.netProfit} 
            variant={totals.netProfit >= 0 ? "success" : "danger"}
            description="Pagado - Pendiente"
          />
        </div>

        <FinancialChart 
          data={generalData}
          loading={loading.general}
          mode="general"
        />

        <YearlyReportTable 
          data={generalData}
          loading={loading.general}
        />
      </section>

      {/* Reporte por Tipo de Servicio */}
      <section className="space-y-6 border-t pt-8">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-bold">Distribución por Tipo de Servicio</h3>
          <Button 
            variant="outline"
            onClick={() => {
              const data = serviceTypeData.map(item => ({
                Periodo: item.period,
                'Tipo de Servicio': item.serviceType,
                Pagado: item.paidAmount,
                Pendiente: item.unpaidAmount,
                Total: item.paidAmount + item.unpaidAmount
              }))
              exportToCSV(data, `Distribucion_Tipo_Servicio_${new Date().toISOString().split('T')[0]}.csv`)
            }}
            disabled={!serviceTypeData.length}
          >
            Exportar CSV
          </Button>
        </div>
        <ServiceTypeChart 
          data={serviceTypeData}
          loading={loading.serviceType}
        />
      </section>

      {/* Búsqueda Específica */}
      <section className="space-y-6 border-t pt-8">
        <h3 className="text-2xl font-bold">Búsqueda Avanzada</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <DatePickerWithRange
            onDateChange={(range) => setFilters(prev => ({...prev, dateRange: range}))}
            className="col-span-2"
          />
          
          <PersonaSelectorCard
            tipoPersona="PACIENTE"
            selectedPersona={filters.patient}
            onSelect={() => setPatientSelectorOpen(true)}
            onRemove={() => setFilters(prev => ({...prev, patient: undefined}))}
          />

          <Select
            value={filters.serviceType || "all"}
            onValueChange={(value) => setFilters(prev => ({
              ...prev,
              serviceType: value !== "all" ? value : undefined
            }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tipo de Servicio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {serviceTypes.map(type => (
                <SelectItem key={type.id} value={type.nombre}>
                  {type.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={paymentFilter}
            onValueChange={(value: 'all' | 'paid' | 'unpaid') => setPaymentFilter(value)}
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
                  exportToCSV(data, `Busqueda_Avanzada_${new Date().toISOString().split('T')[0]}.csv`)
                }}
              >
                Exportar CSV
              </Button>
            </div>
            <FinancialChart 
              data={filteredSpecificData}
              loading={loading.specific}
              mode="specific"
            />
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

const SummaryCard = ({
  title,
  value,
  variant = 'default',
  description
}: {
  title: string
  value: number
  variant?: 'success' | 'danger' | 'default'
  description?: string
}) => {
  const colorClasses = {
    success: 'text-green-600',
    danger: 'text-red-600',
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

const YearlyReportTable = ({ data, loading }: { data: YearlyReport[], loading?: boolean }) => (
  <div className="border rounded-md">
    <Table>
      <TableHeader className="bg-muted/50">
        <TableRow>
          <TableHead>Periodo</TableHead>
          <TableHead className="text-right">Pagado</TableHead>
          <TableHead className="text-right">Pendiente</TableHead>
          <TableHead className="text-right">Total</TableHead>
        </TableRow>
      </TableHeader>
      
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={4} className="h-24 text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin" />
            </TableCell>
          </TableRow>
        ) : data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="h-24 text-center">
              No hay datos disponibles
            </TableCell>
          </TableRow>
        ) : (
          data.map((report, index) => (
            <TableRow key={index}>
              <TableCell>{report.period}</TableCell>
              <TableCell className="text-right text-green-600">
                ${report.paidAmount.toFixed(2)}
              </TableCell>
              <TableCell className="text-right text-red-600">
                ${report.unpaidAmount.toFixed(2)}
              </TableCell>
              <TableCell className="text-right font-bold">
                ${(report.paidAmount + report.unpaidAmount).toFixed(2)}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  </div>
)

const ServiceTypeReportTable = ({ data, loading }: { data: YearlyReportByServiceType[], loading?: boolean }) => (
  <div className="border rounded-md">
    <Table>
      <TableHeader className="bg-muted/50">
        <TableRow>
          <TableHead>Periodo</TableHead>
          <TableHead>Tipo de Servicio</TableHead>
          <TableHead className="text-right">Pagado</TableHead>
          <TableHead className="text-right">Pendiente</TableHead>
          <TableHead className="text-right">Total</TableHead>
        </TableRow>
      </TableHeader>
      
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={5} className="h-24 text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin" />
            </TableCell>
          </TableRow>
        ) : data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="h-24 text-center">
              No hay datos disponibles
            </TableCell>
          </TableRow>
        ) : (
          data.map((report, index) => (
            <TableRow key={index}>
              <TableCell>{report.period}</TableCell>
              <TableCell>{report.serviceType}</TableCell>
              <TableCell className="text-right text-green-600">
                ${report.paidAmount.toFixed(2)}
              </TableCell>
              <TableCell className="text-right text-red-600">
                ${report.unpaidAmount.toFixed(2)}
              </TableCell>
              <TableCell className="text-right font-bold">
                ${(report.paidAmount + report.unpaidAmount).toFixed(2)}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  </div>
)