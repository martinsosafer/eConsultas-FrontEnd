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

export const ComprobantesPage = () => {
  const { id } = useParams<{ id: string }>();
  const [consulta, setConsulta] = useState<Consulta | null>(null);
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [tipoComprobante, setTipoComprobante] = useState<"FACTURA" | "RECIBO">("FACTURA");
  const [archivoExistente, setArchivoExistente] = useState(false);
  const [loading, setLoading] = useState(true);
  const [generandoPDF, setGenerandoPDF] = useState(false);
  const [fileContent, setFileContent] = useState<Blob | null>(null);

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
          await fileManagerApi.getFileByUserAndFileTipo(
            pacienteResponse.credenciales.email,
            tipoArchivo
          );
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
        tipoArchivo,
        id!,
        pdfFile
      );

      setFileContent(pdfBlob);
      setArchivoExistente(true);

      toast.success(`${tipoComprobante} generada correctamente`);
    } catch (error) {
      toast.error(`No se pudo generar el ${tipoComprobante.toLowerCase()}`);
    } finally {
      setGenerandoPDF(false);
    }
  };

  const handleDownload = () => {
    if (!fileContent) return;
    const url = URL.createObjectURL(fileContent);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${tipoComprobante}-${id}.pdf`;
    link.click();
  };

  const handleImprimir = () => {
    if (!fileContent) return;
    const pdfUrl = URL.createObjectURL(fileContent);
    window.open(pdfUrl, "_blank");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-12 w-12 text-primary" />
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
              <div className="flex gap-4">
                <Button onClick={handleDownload} className="gap-2">
                  <Download size={18} />
                  Descargar
                </Button>
                <Button variant="outline" onClick={handleImprimir}>
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
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-card p-6 rounded-lg border border-border">
                {tipoComprobante === "FACTURA" ? (
                  <VistaPreviaFactura consulta={consulta} paciente={paciente!} />
                ) : (
                  <VistaPreviaRecibo consulta={consulta} paciente={paciente!} />
                )}
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

const VistaPreviaFactura = ({ consulta, paciente }: { consulta: ConsultaDTO; paciente: Paciente }) => (
  <div className="grid grid-cols-2 gap-4">
    <Dato label="Razón Social" value="Clínica Médica SA" />
    <Dato label="CUIT" value="30-12345678-9" />
    <Dato label="Fecha Consulta" value={consulta.fecha} />
    <Dato label="N° Comprobante" value={`FAC-${consulta.id}`} />
    <Dato label="Paciente" value={`${paciente.nombre} ${paciente.apellido}`} />
    <Dato label="Total" value={`$${consulta.total}`} />
  </div>
);

const VistaPreviaRecibo = ({ consulta, paciente }: { consulta: ConsultaDTO; paciente: Paciente }) => (
  <div className="grid grid-cols-2 gap-4">
    <Dato label="Fecha" value={consulta.fecha} />
    <Dato label="N° Recibo" value={`REC-${consulta.id}`} />
    <Dato label="Paciente" value={`${paciente.nombre} ${paciente.apellido}`} />
    <Dato label="Monto Total" value={`$${consulta.total}`} />
  </div>
);

const Dato = ({ label, value }: { label: string; value: string | number }) => (
  <div>
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="text-base font-medium">{value}</p>
  </div>
);