import React, { useState } from "react";

const BotonDescargaExcel: React.FC = () => {
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const descargarExcel = async () => {
    if (!fechaDesde || !fechaHasta) {
      alert("Debe ingresar ambas fechas.");
      return;
    }

    setIsLoading(true);
    
    try {
      console.log("Iniciando descarga...");
      
      const response = await fetch(
        `http://localhost:8080/reportes/pedidos-excel?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          }
        }
      );

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`Error al generar el Excel: ${response.status} - ${errorText}`);
      }

      const blob = await response.blob();
      console.log("Blob size:", blob.size);
      
      if (blob.size === 0) {
        throw new Error("El archivo generado está vacío");
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `pedidos_${fechaDesde}_${fechaHasta}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log("Descarga completada exitosamente");
      
    } catch (error) {
      console.error("Error al descargar Excel:", error);
      alert(`Error al descargar Excel: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-4 items-end flex-wrap">
      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium">Fecha desde:</label>
        <input 
          type="date" 
          value={fechaDesde} 
          onChange={(e) => setFechaDesde(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        />
      </div>
      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium">Fecha hasta:</label>
        <input 
          type="date" 
          value={fechaHasta} 
          onChange={(e) => setFechaHasta(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        />
      </div>
      <button
        onClick={descargarExcel}
        disabled={isLoading}
        className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Generando...' : 'Descargar Excel'}
      </button>
    </div>
    
  );
};

export default BotonDescargaExcel;