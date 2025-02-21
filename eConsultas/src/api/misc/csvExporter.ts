export const exportToCSV = (data: any[], filename: string) => {
  if (!data.length) return; // Si no hay datos, no hacemos nada

  // Convertir los datos a formato CSV
  const csvContent = [
    Object.keys(data[0]).join(','), // Encabezados (nombres de las columnas)
    ...data.map(item => 
      Object.values(item)
        .map(value => 
          typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value // Escapar comillas en strings
        )
        .join(',') // Unir valores con comas
    )
  ].join('\n'); // Unir filas con saltos de línea

  // Crear un archivo CSV
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' }); // Blob con el contenido CSV
  const link = document.createElement('a'); // Crear un enlace temporal
  const url = URL.createObjectURL(blob); // Generar una URL para el archivo

  // Configurar el enlace para descargar el archivo
  link.setAttribute('href', url);
  link.setAttribute('download', filename); // Nombre del archivo
  link.style.visibility = 'hidden'; // Ocultar el enlace
  document.body.appendChild(link); // Agregar el enlace al DOM
  link.click(); // Simular clic para iniciar la descarga
  document.body.removeChild(link); // Eliminar el enlace del DOM
};