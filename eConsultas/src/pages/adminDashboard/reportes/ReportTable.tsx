"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { DetailedServiceReport } from "@/api/models/reporteModels"
import { Button } from "@/components/ui/button"
import { exportToCSV } from "@/api/misc/csvExporter"

export default function ReportTable({
    data,
    loading,
    className = ""
  }: {
    data: DetailedServiceReport[]
    loading?: boolean
    className?: string
  }) {
  return (
    <div className={className}>
      <div className="flex justify-end mb-4">
        <Button 
          variant="outline" 
          onClick={() => {
            const csvData = data.map(item => ({
              Fecha: new Date(item.fecha).toLocaleDateString(),
              Servicio: item.nombre,
              Descripción: item.descripcion,
              'Precio Base': item.precio,
              'Descuento Paquete': `${item.porcentajeDescuentoPaquete}%`,
              'Descuento Obra Social': `${item.porcentajeDescuentoObraSocial}%`,
              Total: item.total,
              Estado: item.pagado ? 'Pagado' : 'Pendiente'
            }))
            exportToCSV(csvData, `Reporte_Detallado_${new Date().toISOString().split('T')[0]}.csv`)
          }}
          disabled={!data.length}
        >
          Exportar CSV
        </Button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Servicio</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Precio Base</TableHead>
              <TableHead>Desc. Paquete</TableHead>
              <TableHead>Desc. Obra Social</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No se encontraron resultados
                </TableCell>
              </TableRow>
            ) : (
              data.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    {new Date(report.fecha).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{report.nombre}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {report.descripcion}
                  </TableCell>
                  <TableCell>${report.precio.toFixed(2)}</TableCell>
                  <TableCell>{report.porcentajeDescuentoPaquete}%</TableCell>
                  <TableCell>{report.porcentajeDescuentoObraSocial}%</TableCell>
                  <TableCell className="font-medium">
                    ${report.total.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      report.pagado 
                        ? "bg-green-100 text-green-800" 
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {report.pagado ? "Pagado" : "Pendiente"}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </div>
  )
}