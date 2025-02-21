//Parte del video de mi canal FrancarriYT comentada completa en mi video, los comentarios con complementación
"use client";
import { YearlyReport } from '@/api/models/reporteModels';
import AdvancedBarChart from './AdvancedBarChart';
import { exportToCSV } from "@/api/misc/csvExporter";

// Componente para mostrar el reporte anual
export default function YearlyReportSection({ 
    data, 
    year
  }: { 
    data: YearlyReport[]; // Datos del reporte anual
    year: number; // Año del reporte
    totals: { // Totales calculados
      totalPaid: number; // Total pagado
      totalUnpaid: number; // Total pendiente
      totalSalaries: number; // Total gastos en sueldos
      netProfit: number; // Ganancia neta
    };
    loading: boolean; // Estado de carga
  }) {
  return (
    <section className="space-y-6">
      {/* Encabezado con el año y botón de exportación */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Reporte General {year}</h2>
        <button 
          onClick={() => exportToCSV(data, `Reporte_General_${year}.csv`)} // Exportar a CSV
          className="btn btn-outline"
        >
          Exportar CSV
        </button>
      </div>
      
      {/* Gráfico de barras avanzado */}
      <AdvancedBarChart data={data} showSalaries={false} />
    </section>
  );
}