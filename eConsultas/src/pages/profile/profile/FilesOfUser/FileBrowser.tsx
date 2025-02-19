"use client";

import { useEffect, useState } from "react";
import { FilePathModel } from "@/api/classes apis/fileManagerApi";
import { fileManagerApi } from "@/api/classes apis/fileManagerApi";
import { consultaApi } from "@/api/classes apis/consultaApi";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast, Toaster } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Download, Printer, Mail } from "lucide-react";
import { Consulta } from "@/api/models/consultaModels";

export const FilesBrowser = ({ email }: { email: string }) => {
  const [files, setFiles] = useState<FilePathModel[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<FilePathModel[]>([]);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [fileTypes, setFileTypes] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<FilePathModel | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [renderedNames, setRenderedNames] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const [filesResponse, typesResponse] = await Promise.all([
          fileManagerApi.getAllFilesPathsOfUser(email),
          fileManagerApi.getTipoDeArchivos()
        ]);
        
        const filteredFiles = filesResponse.filter(f => 
          f.name !== "PROFILE_PICTURE" && 
          !f.type.includes("profile-picture")
        );
        
        const filteredTypes = typesResponse.filter(t => t !== "PROFILE_PICTURE");
        
        setFileTypes(filteredTypes);
        setFiles(filteredFiles);
        setFilteredFiles(filteredFiles);

        const names: Record<string, string> = {};
        for (const file of filteredFiles) {
          names[file.id] = await renderFileName(file.name);
        }
        setRenderedNames(names);
      } catch (error) {
        toast.error("Error cargando archivos");
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [email]);

  useEffect(() => {
    if (selectedType === "all") {
      setFilteredFiles(files);
    } else {
      setFilteredFiles(files.filter(f => f.name.split('-')[0] === selectedType));
    }
  }, [selectedType, files]);

  const handleFileClick = async (file: FilePathModel) => {
    try {
      setSelectedFile(file);
      const blob = await fileManagerApi.getFileByFileId(file.id);
      const url = URL.createObjectURL(blob);
      setFileContent(url);
    } catch (error) {
      toast.error("Error cargando archivo");
    }
  };

  const renderFileName = async (fileName: string): Promise<string> => {
    const [type, id] = fileName.split('-');
    if (!id || !["RECIBO", "FACTURA"].includes(type)) return fileName;

    try {
      const consulta: Consulta = await consultaApi.getConsultaByConsultaId(Number(id));
      return `${type} de consulta con Dr. ${consulta.medico.nombre} ${consulta.medico.apellido}`;
    } catch (error) {
      return `${type}-${id}`;
    }
  };

  const handleDownload = () => {
    if (!fileContent || !selectedFile) return;
    
    const link = document.createElement('a');
    link.href = fileContent;
    link.download = selectedFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const printContent = (contentUrl: string) => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Imprimir documento</title>
            <style>
              body { margin: 0; }
              img, pdf-viewer { max-width: 100% !important; }
            </style>
          </head>
          <body>
            ${selectedFile?.type.startsWith('image/') 
              ? `<img src="${contentUrl}" style="max-width: 100%;" />` 
              : `<embed src="${contentUrl}" type="application/pdf" width="100%" height="100%" />`
            }
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="p-6 h-full flex flex-col gap-4">
      <Toaster position="top-right" />
      
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Archivos de paciente</h1>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los tipos</SelectItem>
            {fileTypes.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ScrollArea className="h-[calc(100vh-180px)] pr-4">
        <div className="space-y-2">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-[72px] w-full rounded-lg" />
            ))
          ) : filteredFiles.map((file) => (
            <FileItem 
              key={file.id}
              file={file}
              onClick={handleFileClick}
              renderName={renderedNames[file.id] || file.name}
            />
          ))}
        </div>
      </ScrollArea>

      <Dialog open={!!selectedFile} onOpenChange={() => setSelectedFile(null)}>
        <DialogContent className="max-w-[80vw] h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="truncate">{selectedFile?.name}</DialogTitle>
          </DialogHeader>
          
          {fileContent && selectedFile && (
            <>
              <ScrollArea className="flex-1 border rounded-md p-4 bg-gray-50">
                {selectedFile.type.startsWith('image/') ? (
                  <img 
                    src={fileContent} 
                    className="max-w-full mx-auto shadow-lg rounded-lg"
                    alt="Vista previa del archivo" 
                  />
                ) : (
                  <embed 
                    src={fileContent} 
                    type={selectedFile.type}
                    className="w-full h-full min-h-[500px] bg-white shadow-lg rounded-lg"
                    title="Vista previa del documento"
                  />
                )}
              </ScrollArea>
              
              <div className="flex gap-4 justify-end mt-4">
                <Button 
                  onClick={handleDownload} 
                  className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Download size={18} />
                  Descargar
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => printContent(fileContent)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Printer size={18} />
                  Imprimir
                </Button>
                <Button 
                  variant="outline" 
                  className="border-purple-600 text-purple-600 hover:bg-purple-50"
                >
                  <Mail size={18} />
                  Reenviar
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const FileItem = ({ file, onClick, renderName }: { 
  file: FilePathModel, 
  onClick: (file: FilePathModel) => void,
  renderName: string
}) => {
  const [fechaConsulta, setFechaConsulta] = useState<string | null>(null);
  const [type] = file.name.split('-');

  useEffect(() => {
    const fetchFecha = async () => {
      const [tipo, id] = file.name.split('-');
      if (id && ["RECIBO", "FACTURA"].includes(tipo)) {
        try {
          const consulta: Consulta = await consultaApi.getConsultaByConsultaId(Number(id));
          setFechaConsulta(consulta.fecha); // Usando fecha formateada del modelo
        } catch (error) {
          setFechaConsulta(null);
        }
      }
    };
    
    fetchFecha();
  }, [file.name]);

  return (
    <div
      className="p-4 border rounded-lg cursor-pointer hover:bg-accent transition-colors hover:shadow-md group"
      onClick={() => onClick(file)}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium group-hover:text-blue-600 transition-colors">
            {renderName}
          </h3>
          <div className="flex items-center gap-2 mt-2">
            <Badge 
              variant="outline" 
              className={cn("transition-colors", {
                'border-green-500 text-green-700 bg-green-50': type === 'RECIBO',
                'border-blue-500 text-blue-700 bg-blue-50': type === 'FACTURA',
                'border-red-500 text-red-700 bg-red-50': file.type === 'application/pdf',
                'border-gray-500 text-gray-700 bg-gray-50': !['RECIBO', 'FACTURA'].includes(type) && 
                  file.type !== 'application/pdf'
              })}
            >
              {file.type.split('/')[1].toUpperCase()}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {(file.size / 1024).toFixed(1)} KB
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>🕒</span>
          {fechaConsulta || "Fecha no disponible"}
        </div>
      </div>
    </div>
  );
};