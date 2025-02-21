export interface YearlyReport {
  period: string;         
  paidAmount: number;     
  unpaidAmount: number;   
  salaryExpenses: number; 
  totalPaid: number;      
  totalUnpaid: number;    
}
  

  export interface YearlyReportByServiceType extends YearlyReport {
    serviceType: string;    
  }
  
  export interface DetailedServiceReport {
    id: number;
    fecha: string;
    nombre: string;
    descripcion: string;
    precio: number;
    porcentajeDescuentoPaquete: number;
    porcentajeDescuentoObraSocial: number;
    total: number;
    pacienteEmail?: string;  
    pagado?: boolean;        
  }