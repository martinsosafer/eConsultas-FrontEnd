import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import { Consulta } from "@/api/models/consultaModels";
import { Paciente } from "@/api/models/personaModels";
import { fileManagerApi } from "@/api/classes apis/fileManagerApi";
import { consultaApi } from "@/api/classes apis/consultaApi";
import { personaApi } from "@/api/classes apis/personaApi";
import { PdfFactura } from "./PdfFactura";
import { PdfRecibo } from "./PdfRecibo";
import { Loader2, Download, Printer, CheckCircle } from "lucide-react";
import ButtonWithCooldown from "@/components/buttonWithCooldown";
import { sendFileToUserEmail } from "@/api/misc/templateMail";

export const ComprobantesPage = () => {
  const { id } = useParams<{ id: string }>();
  const [consulta, setConsulta] = useState<Consulta>();
  const [paciente, setPaciente] = useState<Paciente>();
  const [tipoComprobante, setTipoComprobante] = useState<"FACTURA" | "RECIBO">("FACTURA");
  const [archivoExistente, setArchivoExistente] = useState(false);
  const [loading, setLoading] = useState(true);
  const [generandoPDF, setGenerandoPDF] = useState(false);
  const [enviandoEmail, setEnviandoEmail] = useState(false);
  const [fileContent, setFileContent] = useState<string | null>(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const consultaResponse = await consultaApi.getConsultaByConsultaId(Number(id!));
        setConsulta(consultaResponse);
        
        const pacienteResponse = await personaApi.getPersonaByUsername(
          consultaResponse.paciente.credenciales.email
        );
        setPaciente(pacienteResponse as Paciente);
        
        const tipoArchivo = `${tipoComprobante}-${id}`;
        try {
          const blob = await fileManagerApi.getFileByUserAndFileTipo(
            pacienteResponse.credenciales.email,
            tipoArchivo
          );
          setFileContent(URL.createObjectURL(blob));
          setArchivoExistente(true);
        } catch {
          setArchivoExistente(false);
        }
      } catch (error) {
        toast.error("No se pudo cargar la consulta");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [id, tipoComprobante]);

  const handleGenerarComprobante = async () => {
    if (!consulta || !paciente) return;
    if (!consulta.pagado) return;

    setGenerandoPDF(true);
    try {
      const pdfBlob = tipoComprobante === "FACTURA"
        ? await PdfFactura.generar({ consulta, paciente })
        : await PdfRecibo.generar({ consulta, paciente });

      const tipoArchivo = `${tipoComprobante}-${id}`;
      const pdfFile = new File([pdfBlob], `${tipoArchivo}.pdf`, {
        type: "application/pdf",
      });

      await fileManagerApi.uploadOrUpdateFileOfUserAndConnectWithConsulta(
        paciente.credenciales.email,
        tipoComprobante,
        id!,
        pdfFile
      );

      setFileContent(URL.createObjectURL(pdfBlob));
      setArchivoExistente(true);

      setEnviandoEmail(true);
      const fechaActual = new Date().toISOString().slice(0, 19).replace('T', ' ');
      
      try {
        await sendFileToUserEmail(
          paciente.credenciales.email,
          fechaActual,
          pdfFile
        );
        toast.success("Correo enviado con éxito al paciente");
      } catch (error: any) {
        if (error.response?.status === 415) {
          toast.success("Correo considerado como enviado con éxito (error 415 manejado).");
        } else {
          throw error; // Relanza el error si no es un 415
        }
      }
    } catch (error) {
      toast.error(`Error al procesar el ${tipoComprobante.toLowerCase()}`);
    } finally {
      setGenerandoPDF(false);
      setEnviandoEmail(false);
    }
  };

  const handleDownload = () => {
    if (!fileContent) return;
    const link = document.createElement("a");
    link.href = fileContent;
    link.download = `${tipoComprobante}-${id}.pdf`;
    link.click();
  };

  const handleImprimir = () => {
    if (!fileContent) return;
    window.open(fileContent, "_blank");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-12 w-12 text-primary" />
      </div>
    );
  }

  if (!consulta?.pagado) {
    return (
      <div className="p-6 bg-background min-h-screen flex flex-col items-center justify-center">
        <div className="max-w-md text-center space-y-4">
          <div className="text-red-600 bg-red-100 p-4 rounded-lg border border-red-200">
            <p className="font-semibold">La consulta debe estar pagada para generar comprobantes</p>
          </div>
          <Button 
            onClick={() => window.location.href = `/consultas/pay/${id}`}
            className="bg-primary hover:bg-primary-hover text-white"
          >
            Ir a página de pago
          </Button>
        </div>
      </div>
    );
  }



  return (
    <div className="p-6 bg-background min-h-screen">
      <Tabs
        value={tipoComprobante}
        onValueChange={(value) => setTipoComprobante(value as "FACTURA" | "RECIBO")}
      >
        <TabsList className="grid w-full grid-cols-2 max-w-xs mb-6">
          <TabsTrigger value="FACTURA">Factura</TabsTrigger>
          <TabsTrigger value="RECIBO">Recibo</TabsTrigger>
        </TabsList>

        <TabsContent value={tipoComprobante}>
          {archivoExistente ? (
            <div className="space-y-6">
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <embed
                  src={fileContent || ''}
                  type="application/pdf"
                  className="w-full h-[600px]"
                />
              </div>

              <div className="flex gap-4">
                <Button onClick={handleDownload} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                  <Download size={18} />
                  Descargar
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleImprimir}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Printer size={18} />
                  Imprimir
                </Button>
              </div>

              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle size={18} />
                <span>
                  {tipoComprobante} vinculada a {paciente?.nombre}
                </span>
              </div>

              {enviandoEmail && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Loader2 className="animate-spin" size={18} />
                  <span>Enviando {tipoComprobante.toLowerCase()} al email del paciente...</span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-card p-6 rounded-lg border border-border">
                {consulta && paciente && (tipoComprobante === "FACTURA" ? (
                  <VistaPreviaFactura consulta={consulta} paciente={paciente} />
                ) : (
                  <VistaPreviaRecibo consulta={consulta} paciente={paciente} />
                ))}
              </div>

              <ButtonWithCooldown
                label={generandoPDF ? "Generando..." : `Generar ${tipoComprobante}`}
                onClick={handleGenerarComprobante}
                disabled={generandoPDF}
                className="w-full"
                cooldownDuration={10}
              />
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <Toaster theme="system" />
    </div>

  );
  
};

const VistaPreviaFactura = ({ consulta, paciente }: { consulta: Consulta; paciente: Paciente }) => (
  <div className="grid grid-cols-2 gap-4">
    <Dato label="Razón Social" value="Clínica Médica SA" />
    <Dato label="CUIT" value="30-12345678-9" />
    <Dato label="Fecha Consulta" value={consulta.fecha} />
    <Dato label="N° Comprobante" value={`FAC-${consulta.id}`} />
    <Dato label="Paciente" value={`${paciente.nombre} ${paciente.apellido}`} />
    <Dato label="Total" value={`$${consulta.total.toFixed(2)}`} />
  </div>
);

const VistaPreviaRecibo = ({ consulta, paciente }: { consulta: Consulta; paciente: Paciente }) => (
  <div className="grid grid-cols-2 gap-4">
    <Dato label="Fecha" value={consulta.fecha} />
    <Dato label="N° Recibo" value={`REC-${consulta.id}`} />
    <Dato label="Paciente" value={`${paciente.nombre} ${paciente.apellido}`} />
    <Dato label="Monto Total" value={`$${consulta.total.toFixed(2)}`} />
  </div>
);

const Dato = ({ label, value }: { label: string; value: string | number }) => (
  <div>
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="text-base font-medium">{value}</p>
  </div>
);