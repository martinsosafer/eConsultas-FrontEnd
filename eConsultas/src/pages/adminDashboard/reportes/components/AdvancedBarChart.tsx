//Parte del video de mi canal FrancarriYT comentada completa en mi video, los comentarios con complementación
"use client"
// Importaciones estratégicas: Separamos componentes de Recharts y lógica de React
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush } from 'recharts'
import { YearlyReport } from '@/api/models/reporteModels'
import { useState, useEffect } from 'react'

// Función de ordenamiento inteligente: Maneja tanto strings como objetos Date
const sortData = (data: YearlyReport[]) => {
  return [...data].sort((a, b) => {
    // Función de parseo universal para diferentes formatos de fecha
    const parseDate = (period: string | Date) => {
      if (typeof period === 'string') {
        // Convertimos formato 'YYYY-MM' a timestamp
        const [year, month] = period.split('-').map(Number)
        return new Date(year, month - 1).getTime()
      }
      return period.getTime() // Si ya es Date, tomamos directamente el timestamp
    }
    return parseDate(a.period) - parseDate(b.period) // Ordenamiento cronológico
  })
}

// Formateador de ticks adaptable: Maneja múltiples formatos de fecha
const monthTickFormatter = (tick: string | Date) => {
  let date: Date
  if (typeof tick === 'string') {
    // Caso común: fechas en formato string desde la API
    const [year, month] = tick.split('-').map(Number)
    date = new Date(year, month - 1)
  } else {
    // Backup para objetos Date directos
    date = new Date(tick)
  }
  // Formato localizado para mejor experiencia de usuario
  return date.toLocaleString('es-ES', { month: 'short' })
}

// Componente personalizado para ticks de trimestres
const renderQuarterTick = (tickProps: any) => {
  const { x, y, payload } = tickProps
  let date: Date
  
  // Doble validación para tipos de datos
  if (typeof payload.value === 'string') {
    const [year, month] = payload.value.split('-').map(Number)
    date = new Date(year, month - 1)
  } else {
    date = new Date(payload.value)
  }
  
  // Lógica de cálculo de trimestres
  const monthIndex = date.getMonth()
  const quarterNo = Math.floor(monthIndex / 3) + 1
  
  // Renderizado condicional para evitar saturación visual
  if (monthIndex % 3 === 0) {
    return <text x={x} y={y - 4} textAnchor="middle">{`Q${quarterNo}`}</text>
  }
  return null
}

// Componente principal con gestión de estado optimizada
export default function AdvancedBarChart({ data, showSalaries }: { 
  data: YearlyReport[]
  showSalaries: boolean
}) {
  // Estado local para datos ordenados y rango de visualización
  const [sortedData, setSortedData] = useState<YearlyReport[]>([])
  const [brushIndex, setBrushIndex] = useState({ start: 0, end: 12 })

  // Efecto para procesamiento inicial de datos
  useEffect(() => {
    const orderedData = sortData(data)
    setSortedData(orderedData)
    
    // Configuración inicial del rango visible (últimos 6 meses)
    const initialStart = Math.max(0, orderedData.length - 6)
    const initialEnd = orderedData.length - 1
    setBrushIndex({ start: initialStart - 6, end: initialEnd })
  }, [data])

  // Manejador de cambio en el brush (selección de rango)
  const handleBrushChange = ({ startIndex, endIndex }: { startIndex?: number; endIndex?: number }) => {
    if (startIndex !== undefined && endIndex !== undefined) {
      setBrushIndex({ start: startIndex, end: endIndex })
    }
  }

  // Datos filtrados según selección del usuario
  const filteredData = sortedData.slice(brushIndex.start, brushIndex.end + 1)

  return (
    <div className="flex flex-col gap-4">
      {/* Gráfico principal con diseño responsive */}
      <div style={{ height: 360 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={filteredData}
            margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            {/* Eje X principal con formateador de meses */}
            <XAxis 
              dataKey="period" 
              tickFormatter={monthTickFormatter}
            />
            {/* Eje X secundario para trimestres */}
            <XAxis
              dataKey="period"
              axisLine={false}
              tickLine={false}
              interval={0}
              tick={renderQuarterTick}
              height={1}
              xAxisId="quarter"
            />
            <YAxis />
            {/* Tooltip con formateo monetario profesional */}
            <Tooltip 
              formatter={(value: number) => new Intl.NumberFormat('es-AR', {
                style: 'currency',
                currency: 'ARS'
              }).format(value)}
            />
            <Legend />
            {/* Barras interactivas con diseño consistente */}
            <Bar 
              dataKey="paidAmount" 
              name="Pagado" 
              fill="#4CAF50" 
              radius={[4, 4, 0, 0]} 
            />
            <Bar 
              dataKey="unpaidAmount" 
              name="Pendiente" 
              fill="#F44336" 
              radius={[4, 4, 0, 0]} 
            />
            {/* Barra condicional para gastos */}
            {showSalaries && (
              <Bar 
                dataKey="salaryExpenses" 
                name="Gastos Sueldos" 
                fill="#2196F3"
                radius={[4, 4, 0, 0]} 
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Selector de rango temporal (brush) */}
      <div style={{ height: 40, marginTop: 10 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sortedData}>
            <Brush 
              dataKey="period" 
              height={30} 
              stroke="#8884d8"
              startIndex={brushIndex.start}
              endIndex={brushIndex.end}
              onChange={handleBrushChange}
              style={{ backgroundColor: '#f8fafc' }}
              tickFormatter={monthTickFormatter}
              alwaysShowText={true}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}