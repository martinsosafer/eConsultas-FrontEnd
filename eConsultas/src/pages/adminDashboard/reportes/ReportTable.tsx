//Parte del video de mi canal FrancarriYT comentada completa en mi video, los comentarios con complementación
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

/**
 * Componente para mostrar una tabla de reportes detallados.
 * 
 * @param {Object} props - Propiedades del componente.
 * @param {DetailedServiceReport[]} props.data - Datos de los reportes.
 * @param {boolean} [props.loading] - Estado de carga.
 * @param {string} [props.className] - Clases adicionales para personalización.
 * @returns {JSX.Element} - Tabla de reportes con opción de exportar a CSV.
 */
export default function ReportTable({
    data,
    loading,
    className = ""
  }: {
    data: DetailedServiceReport[] // Datos de los reportes
    loading?: boolean // Estado de carga
    className?: string // Clases adicionales para personalización
  }) {
  return (
    <div className={className}>
      {/* Botón para exportar a CSV */}
      <div className="flex justify-end mb-4">
        <Button 
          variant="outline" 
          onClick={() => {
            // Mapear los datos para exportar a CSV
            const csvData = data.map(item => ({
              Fecha: new Date(item.fecha).toLocaleDateString(), // Fecha formateada
              Servicio: item.nombre, // Nombre del servicio
              Descripción: item.descripcion, // Descripción del servicio
              'Precio Base': item.precio, // Precio base
              'Descuento Paquete': `${item.porcentajeDescuentoPaquete}%`, // Descuento por paquete
              'Descuento Obra Social': `${item.porcentajeDescuentoObraSocial}%`, // Descuento por obra social
              Total: item.total, // Total del servicio
              Estado: item.pagado ? 'Pagado' : 'Pendiente' // Estado de pago
            }))
            // Exportar los datos a un archivo CSV
            exportToCSV(csvData, `Reporte_Detallado_${new Date().toISOString().split('T')[0]}.csv`)
          }}
          disabled={!data.length} // Deshabilitar si no hay datos
        >
          Exportar CSV
        </Button>
      </div>

      {/* Mostrar skeleton loading mientras se cargan los datos */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" /> // Placeholder para filas de la tabla
          ))}
        </div>
      ) : (
        <Table>
          {/* Encabezado de la tabla */}
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
          
          {/* Cuerpo de la tabla */}
          <TableBody>
            {data.length === 0 ? (
              // Mensaje si no hay datos
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No se encontraron resultados
                </TableCell>
              </TableRow>
            ) : (
              // Mostrar filas con los datos de los reportes
              data.map((report) => (
                <TableRow key={`${report.id}-${report.pagado}`}> {/* Clave única */}
                  <TableCell>
                    {new Date(report.fecha).toLocaleDateString()} {/* Fecha formateada */}
                  </TableCell>
                  <TableCell>{report.nombre}</TableCell> {/* Nombre del servicio */}
                  <TableCell className="max-w-[200px] truncate">
                    {report.descripcion} {/* Descripción truncada si es muy larga */}
                  </TableCell>
                  <TableCell>${report.precio.toFixed(2)}</TableCell> {/* Precio base */}
                  <TableCell>{report.porcentajeDescuentoPaquete}%</TableCell> {/* Descuento por paquete */}
                  <TableCell>{report.porcentajeDescuentoObraSocial}%</TableCell> {/* Descuento por obra social */}
                  <TableCell className="font-medium">
                    ${report.total.toFixed(2)} {/* Total formateado */}
                  </TableCell>
                  <TableCell>
                    {/* Estado de pago con colores según el estado */}
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      report.pagado 
                        ? "bg-green-100 text-green-800" // Verde si está pagado
                        : "bg-yellow-100 text-yellow-800" // Amarillo si está pendiente
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