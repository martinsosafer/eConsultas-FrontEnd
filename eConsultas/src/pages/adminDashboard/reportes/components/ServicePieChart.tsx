//Parte del video de mi canal FrancarriYT comentada completa en mi video, los comentarios con complementación
"use client"
import { PieChart, Pie, Sector, ResponsiveContainer } from 'recharts'
import { YearlyReportByServiceType } from '@/api/models/reporteModels'
import { useState } from 'react'

// Definimos la estructura de los datos para el gráfico de torta
interface PieData {
  name: string; // Nombre del servicio
  value: number; // Valor total (pagado + pendiente)
  fill: string; // Color del sector
}

// Función para renderizar el sector activo con detalles (propiciado por la librería)
const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props
  const sin = Math.sin(-RADIAN * midAngle)
  const cos = Math.cos(-RADIAN * midAngle)
  const sx = cx + (outerRadius + 10) * cos
  const sy = cy + (outerRadius + 10) * sin
  const mx = cx + (outerRadius + 30) * cos
  const my = cy + (outerRadius + 30) * sin
  const ex = mx + (cos >= 0 ? 1 : -1) * 22
  const ey = my
  const textAnchor = cos >= 0 ? 'start' : 'end'

  return (
    <g>
      {/* Nombre del servicio en el centro del sector activo */}
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      {/* Sector principal */}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      {/* Sector exterior para el efecto de resaltado */}
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      {/* Línea y punto que conectan el sector con los detalles */}
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      {/* Valor monetario del sector */}
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`$${value.toFixed(2)}`}</text>
      {/* Porcentaje del sector */}
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  )
}

// Componente principal del gráfico de torta
export default function ServicePieChart({ data }: { data: YearlyReportByServiceType[] }) {
  const [activeIndex, setActiveIndex] = useState(0) // Índice del sector activo
  const serviceTypes = Array.from(new Set(data.map(item => item.serviceType))) // Tipos de servicios únicos

  // Función para generar colores consistentes basados en el nombre del servicio
  const getServiceColor = (service: string) => {
    const hue = (serviceTypes.indexOf(service) * 137.508) % 360 // Algoritmo para colores únicos
    return `hsl(${hue}, 70%, 50%)` // Color en formato HSL
  }

  // Procesamos los datos para el gráfico de torta
  const processedData = data.reduce((acc: PieData[], curr) => {
    const existing = acc.find(item => item.name === curr.serviceType)
    const total = curr.paidAmount + curr.unpaidAmount // Sumamos pagado y pendiente
    
    // Si ya existe el servicio, sumamos el valor; si no, lo agregamos
    existing ? existing.value += total : acc.push({ 
      name: curr.serviceType, 
      value: total,
      fill: getServiceColor(curr.serviceType) // Asignamos un color único
    })
    return acc
  }, [])

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          activeIndex={activeIndex} // Sector activo
          activeShape={renderActiveShape} // Forma personalizada para el sector activo
          data={processedData} // Datos procesados
          cx="50%" // Centro horizontal
          cy="50%" // Centro vertical
          innerRadius={150} // Radio interno (para un gráfico de dona)
          outerRadius={200} // Radio externo
          dataKey="value" // Clave de los valores
          onMouseEnter={(_, index) => setActiveIndex(index)} // Cambiar sector activo al pasar el mouse
        >
          {/* Renderizamos cada sector con su color correspondiente */}
          {processedData.map((entry, index) => (
            <Sector
              key={`sector-${index}`}
              fill={entry.fill} // Color del sector
            />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  )
}