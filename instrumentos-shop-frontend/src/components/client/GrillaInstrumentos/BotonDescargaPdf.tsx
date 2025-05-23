import React, { useState } from "react";
import styles from './grillaInstrumento.module.css';

interface Props {
  instrumentoId: number;
}

const BotonDescargaPdf: React.FC<Props> = ({ instrumentoId }) => {
  const [isLoading, setIsLoading] = useState(false);

  const descargarPDF = async () => {
    setIsLoading(true);
    
    try {
      console.log(`Descargando PDF para instrumento ID: ${instrumentoId}`);
      
      const response = await fetch(
        `http://localhost:8080/reportes/instrumento-pdf/${instrumentoId}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/pdf'
          }
        }
      );

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`Error al generar el PDF: ${response.status} - ${errorText}`);
      }

      const blob = await response.blob();
      console.log("Blob size:", blob.size, "Blob type:", blob.type);
      
      if (blob.size === 0) {
        throw new Error("El PDF generado está vacío");
      }

      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = `instrumento_${instrumentoId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log("PDF descargado exitosamente");
      
    } catch (error) {
      console.error("Error al descargar PDF:", error);
      alert(`Error al descargar PDF: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      type="button" 
      onClick={descargarPDF} 
      disabled={isLoading}
      className={`${styles.btnPdf} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isLoading ? 'Generando PDF...' : 'Descargar PDF'}
    </button>
  );
};

export default BotonDescargaPdf;