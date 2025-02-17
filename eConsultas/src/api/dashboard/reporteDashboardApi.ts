import { api } from '../axios';
import Cookies from 'js-cookie';
import {
  YearlyReport,
  YearlyReportByServiceType,
  DetailedServiceReport
} from '../models/reporteModels';


interface ReportParams {
  fechaInicio?: string;
  fechaFin?: string;
  pacienteEmail?: string;
  pagado?: boolean;
}

export const reportesApi = {

  async getReportesByYear(year: number): Promise<YearlyReport[]> {
    try {
      const response = await api.get(`/consultas/reportes/reporte-por-anio/${year}`, {
        headers: {
          'Accept': '*/*',
          'Authorization': `Bearer ${Cookies.get('access_token')}`
        }
      });
      return response.data.map(([period, paid, unpaid]: [string, number, number]) => ({
        period,
        paidAmount: paid,
        unpaidAmount: unpaid,
        totalPaid: 0,  
        totalUnpaid: 0 
      }));
    } catch (error) {
      console.error('Error fetching yearly report:', error);
      throw error;
    }
  },

  async getReporteByYearAndTipo(year: number): Promise<YearlyReportByServiceType[]> {
    try {
      const response = await api.get(`/consultas/reportes/reporte-por-anio-por-tipo/${year}`, {
        headers: {
          'Accept': '*/*',
          'Authorization': `Bearer ${Cookies.get('access_token')}`
        }
      });
      
      return response.data.map(([period, serviceType, paid, unpaid]: [string, string, number, number]) => ({
        period,
        serviceType,
        paidAmount: paid,
        unpaidAmount: unpaid,
        totalPaid: 0,
        totalUnpaid: 0
      }));
    } catch (error) {
      console.error('Error fetching yearly report by service type:', error);
      throw error;
    }
  },

  async getReportesByManyParams(params: ReportParams): Promise<DetailedServiceReport[]> {

    try {
        console.log(params)
      const queryParams = new URLSearchParams();
      if (params.fechaInicio) queryParams.append('fechaInicio', params.fechaInicio);
      if (params.fechaFin) queryParams.append('fechaFin', params.fechaFin);
      if (params.pacienteEmail) queryParams.append('pacienteEmail', params.pacienteEmail);
      if (params.pagado !== undefined) queryParams.append('pagado', params.pagado.toString());

      const response = await api.get(
        `/consultas/reportes/reporte-servicios-contratados-por-rango-fechas?${queryParams}`,
        {
          headers: {
            'Accept': '*/*',
            'Authorization': `Bearer ${Cookies.get('access_token')}`
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching detailed report:', error);
      throw error;
    }
  }
};