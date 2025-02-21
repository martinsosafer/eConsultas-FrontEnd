//Parte del video de mi canal FrancarriYT comentada completa en mi video, los comentarios con complementación
"use client"

import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Skeleton } from "@/components/ui/skeleton"
import { YearlyReportByServiceType } from "@/api/models/reporteModels"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Definimos las propiedades del componente
interface ServiceTypeChartProps {
  data: YearlyReportByServiceType[] // Datos por tipo de servicio
  loading?: boolean // Estado de carga
}

// Estructura de los datos procesados para el gráfico
interface ProcessedData {
  period: string; // Periodo (fecha)
  [serviceType: string]: { // Dinámico: clave es el tipo de servicio
    paid: number; // Monto pagado
    unpaid: number; // Monto pendiente
  } | string;
}

// Componente para mostrar gráficos por tipo de servicio
const ServiceTypeChart = ({ data, loading }: ServiceTypeChartProps) => {
  const [selectedServices, setSelectedServices] = useState<string[]>([]) // Servicios seleccionados
  const serviceTypes = Array.from(new Set(data.map(item => item.serviceType))) // Tipos de servicios únicos
  const ALL_SERVICES_OPTION = 'all' // Opción para mostrar todos los servicios

  // Procesamos los datos para el gráfico
  const chartData = data.reduce((acc: ProcessedData[], curr) => {
    const existing = acc.find(item => item.period === curr.period) // Buscar si ya existe el periodo
    
    if (existing) {
      // Si existe, actualizamos los montos pagados y pendientes
      existing[curr.serviceType] = {
        paid: curr.paidAmount,
        unpaid: curr.unpaidAmount
      }
    } else {
      // Si no existe, creamos un nuevo registro para el periodo
      acc.push({
        period: curr.period,
        [curr.serviceType]: {
          paid: curr.paidAmount,
          unpaid: curr.unpaidAmount
        }
      })
    }
    return acc
  }, [])

  // Manejar la selección de servicios
  const handleSelection = (value: string) => {
    if (value === ALL_SERVICES_OPTION) {
      setSelectedServices([]) // Mostrar todos los servicios
    } else {
      setSelectedServices(value.split(',').filter(v => v !== ALL_SERVICES_OPTION)) // Filtrar servicios seleccionados
    }
  }

  // Función para generar colores únicos para cada servicio
  const getServiceColor = (service: string) => {
    const hue = (serviceTypes.indexOf(service) * 137.508) % 360 // Algoritmo para colores únicos
    return `hsl(${hue}, 70%, 50%)` // Color en formato HSL
  }

  // Servicios visibles (todos o los seleccionados)
  const visibleServices = selectedServices.length > 0 ? selectedServices : serviceTypes

  return (
    <div className="space-y-6">
      {/* Selector de servicios */}
      <div className="max-w-md">
        <Select 
          value={selectedServices.length === 0 ? ALL_SERVICES_OPTION : selectedServices.join(',')}
          onValueChange={handleSelection}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar servicios..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_SERVICES_OPTION}>Todos los servicios</SelectItem>
            {serviceTypes.map(service => (
              <SelectItem 
                key={service} 
                value={service}
                className="flex items-center gap-2"
              >
                {/* Indicador de color para el servicio */}
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: getServiceColor(service) }}
                />
                {service} {/* Nombre del servicio */}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Mostrar skeleton loading si los datos están cargando */}
      {loading ? (
        <Skeleton className="w-full h-[400px]" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gráficos para cada servicio visible */}
          {visibleServices.map(service => (
            <div 
              key={service}
              className="border p-4 rounded-lg shadow-sm bg-white"
            >
              {/* Título del servicio con su color */}
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: getServiceColor(service) }}
                />
                {service}
              </h3>
              {/* Gráfico de barras para el servicio */}
              <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" /> {/* Grid de fondo */}
                    <XAxis dataKey="period" /> {/* Eje X: periodos */}
                    <YAxis /> {/* Eje Y: montos */}
                    <Tooltip 
                      content={({ payload }) => (
                        <div className="bg-white p-2 border rounded shadow-lg">
                          {/* Detalles del tooltip */}
                          {payload?.map((entry, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: entry.color }}
                              />
                              <span>
                                {entry.name}: ${(entry.value as number)?.toFixed(2)} {/* Valor formateado */}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    />
                    {/* Barra de montos pagados */}
                    <Bar 
                      dataKey={`${service}.paid`}
                      name="Pagado"
                      fill={getServiceColor(service)} // Color del servicio
                      radius={[4, 4, 0, 0]} // Bordes redondeados
                    />
                    {/* Barra de montos pendientes */}
                    <Bar 
                      dataKey={`${service}.unpaid`}
                      name="Pendiente"
                      fill={`${getServiceColor(service)}80`} // Color con transparencia
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ServiceTypeChart