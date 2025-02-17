"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Skeleton } from "@/components/ui/skeleton"
import { YearlyReport, DetailedServiceReport } from "@/api/models/reporteModels"

interface FinancialChartProps {
  data: YearlyReport[] | DetailedServiceReport[]
  mode: 'general' | 'specific'
  loading?: boolean
}

interface ChartDataItem {
  name: string;
  pagado?: number;
  pendiente?: number;
  totalPagado?: number;
  totalPendiente?: number;
}

export default function FinancialChart({ 
  data,
  mode,
  loading
}: FinancialChartProps) {
  const chartData: ChartDataItem[] = mode === 'general' 
    ? (data as YearlyReport[]).map(d => ({
        name: d.period,
        pagado: d.paidAmount,
        pendiente: d.unpaidAmount
      }))
    : (data as DetailedServiceReport[]).map(d => ({
        name: new Date(d.fecha).toLocaleDateString(),
        totalPagado: d.pagado ? d.total : 0,
        totalPendiente: !d.pagado ? d.total : 0
      }))

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis />
          <Tooltip />
          
          {mode === 'general' ? (
            <>
              <Bar dataKey="pagado" name="Pagado" fill="#4CAF50" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pendiente" name="Pendiente" fill="#F44336" radius={[4, 4, 0, 0]} />
            </>
          ) : (
            <>
              <Bar 
                dataKey="totalPagado" 
                name="Pagado" 
                fill="#4CAF50"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="totalPendiente" 
                name="Pendiente" 
                fill="#F44336"
                radius={[4, 4, 0, 0]}
              />
            </>
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}