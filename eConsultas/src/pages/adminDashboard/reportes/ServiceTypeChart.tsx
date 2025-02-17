"use client"

import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Skeleton } from "@/components/ui/skeleton"
import { YearlyReportByServiceType } from "@/api/models/reporteModels"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ServiceTypeChartProps {
  data: YearlyReportByServiceType[]
  loading?: boolean
}

interface ProcessedData {
  period: string;
  [serviceType: string]: {
    paid: number;
    unpaid: number;
  } | string;
}

const ServiceTypeChart = ({ data, loading }: ServiceTypeChartProps) => {
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const serviceTypes = Array.from(new Set(data.map(item => item.serviceType)))
  const ALL_SERVICES_OPTION = 'all'

  const chartData = data.reduce((acc: ProcessedData[], curr) => {
    const existing = acc.find(item => item.period === curr.period)
    
    if (existing) {
      existing[curr.serviceType] = {
        paid: curr.paidAmount,
        unpaid: curr.unpaidAmount
      }
    } else {
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

  const handleSelection = (value: string) => {
    if (value === ALL_SERVICES_OPTION) {
      setSelectedServices([])
    } else {
      setSelectedServices(value.split(',').filter(v => v !== ALL_SERVICES_OPTION))
    }
  }


  const getServiceColor = (service: string) => {
    const hue = (serviceTypes.indexOf(service) * 137.508) % 360 
    return `hsl(${hue}, 70%, 50%)`
  }

  const visibleServices = selectedServices.length > 0 ? selectedServices : serviceTypes

  return (
    <div className="space-y-6">
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
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: getServiceColor(service) }}
                />
                {service}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <Skeleton className="w-full h-[400px]" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {visibleServices.map(service => (
            <div 
              key={service}
              className="border p-4 rounded-lg shadow-sm bg-white"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: getServiceColor(service) }}
                />
                {service}
              </h3>
              <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip 
                      content={({ payload }) => (
                        <div className="bg-white p-2 border rounded shadow-lg">
                          {payload?.map((entry, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: entry.color }}
                              />
                              <span>
                                {entry.name}: ${(entry.value as number)?.toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    />
                    <Bar 
                      dataKey={`${service}.paid`}
                      name="Pagado"
                      fill={getServiceColor(service)}
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey={`${service}.unpaid`}
                      name="Pendiente"
                      fill={`${getServiceColor(service)}80`}
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