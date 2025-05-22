import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";

type PedidosPorInstrumentoDTO = {
  instrumento: string;
  cantidad: number;
};

const GraficoTorta: React.FC = () => {
  const [data, setData] = useState<(string | number)[][]>([["Instrumento", "Cantidad"]]);

  useEffect(() => {
    fetch("http://localhost:8080/api/graficos/pedidos-por-instrumento")
      .then((res) => res.json())
      .then((json: PedidosPorInstrumentoDTO[]) => {
        const chartData: (string | number)[][] = [["Instrumento", "Cantidad"]];
        json.forEach((item) => {
        chartData.push([item.instrumento, Number(item.cantidad)]); // 👈 Nos aseguramos de que sea numérico
        });
        if (chartData.length === 1) {
            console.warn("No hay datos para mostrar en el gráfico de torta.");
        }
        setData(chartData);

      });
  }, []);

  return (
    <Chart
      chartType="PieChart"
      width="100%"
      height="400px"
      data={data}
      options={{
        title: "Pedidos por Instrumento",
        is3D: true,
      }}
    />
  );
};

export default GraficoTorta;
