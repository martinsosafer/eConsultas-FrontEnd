import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { consultaDashboardApi } from "@/api/dashboard/consultaDashboardApi";
import { Consulta } from "@/api/models/consultaModels";
import { DollarSign, Calendar, Clock, User, Stethoscope, Package, Crosshair } from "lucide-react";
import { consultaApi } from "@/api/classes apis/consultaApi";
import ButtonWithCooldown from "@/components/buttonWithCooldown";

interface PaymentButtonProps {
  onClick: () => void;
  disabled: boolean;
}

const PaymentButton = ({ onClick, disabled }: PaymentButtonProps) => {
  return (
    <ButtonWithCooldown
      label="Confirmar Pago"
      type="primary"
      cooldownDuration={5}
      onClick={onClick}
      disabled={disabled}
      className="mt-4 px-8 py-4 text-lg"
    />
  );
};

export const PayConsulta = () => {

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [consulta, setConsulta] = useState<Consulta | null>(null);
    const [loading, setLoading] = useState(true);

  
  
    useEffect(() => {

  
  
      const fetchConsulta = async () => {
        try {
          if (!id) {
            toast.error("ID de consulta inválido");
            navigate("/consultas");
            return;
          }
          
          const data = await consultaApi.getConsultaByConsultaId(Number(id));
          setConsulta(data);
        } catch (error) {
          toast.error("Error cargando consulta");
          console.error("Error:", error);
          navigate("/consultas");
        } finally {
          setLoading(false);
        }
      };
  
      fetchConsulta();
    }, [id, navigate]);

  const handlePayment = async () => {
    if (!consulta) return;

    try {
      await consultaDashboardApi.updateConsulta(consulta.id, { pagado: true });
      toast.success("Pago registrado exitosamente!");
      setTimeout(() => navigate(`/consultas/comprobantes/${consulta.id}`), 2000);
    } catch (error) {
      toast.error("Error al registrar el pago");
      console.error("Error:", error);
    }
  };

  if (loading) return <div className="text-center p-8">Cargando...</div>;
  if (!consulta) return <div className="text-center p-8">Consulta no encontrada</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2">
        <DollarSign className="text-green-600" size={30} />
        Registrar Pago de Consulta
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <DetailItem icon={Calendar} label="Fecha" value={consulta.fecha} />
        <DetailItem icon={Clock} label="Horario" value={consulta.horario} />
        <DetailItem 
          icon={User} 
          label="Paciente" 
          value={`${consulta.paciente.nombre} ${consulta.paciente.apellido}`} 
        />
        <DetailItem 
          icon={Stethoscope} 
          label="Médico" 
          value={`${consulta.medico.nombre} ${consulta.medico.apellido}`} 
        />
        <DetailItem
          icon={Package}
          label="Tipo"
          value={consulta.idPaquete ? "Paquete" : "Servicio Individual"}
        />
        <DetailItem
          icon={Crosshair}
          label="ID de Referencia"
          value={consulta.idPaquete || consulta.idServicioMedico || "N/A"}
        />
      </div>

      <div className="bg-blue-50 p-6 rounded-lg mb-8">
        <div className="flex justify-between items-center">
          <span className="text-2xl font-semibold text-gray-700">Total a Pagar:</span>
          <span className="text-3xl font-bold text-green-600">
            ${consulta.total.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="flex justify-center">
        <PaymentButton 
          onClick={handlePayment} 
          disabled={consulta.pagado}
        />
      </div>

      {consulta.pagado && (
        <div className="mt-4 text-center text-red-500 font-medium">
          Esta consulta ya fue pagada anteriormente
        </div>
      )}
    </div>
  );
};

interface DetailItemProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  value: string | number;
}

const DetailItem = ({ icon: Icon, label, value }: DetailItemProps) => (
  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
    <Icon className="text-blue-600 mr-4" width={24} height={24} />
    <div>
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-lg font-medium text-gray-800">{value}</div>
    </div>
  </div>
);