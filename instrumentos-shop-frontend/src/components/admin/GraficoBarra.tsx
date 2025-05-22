import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";

type PedidosPorMesDTO = {
  mesAnio: string;
  cantidad: number;
};

const GraficoBarras: React.FC = () => {
  const [data, setData] = useState<(string | number)[][]>([["Mes/Año", "Pedidos"]]);

  useEffect(() => {
    fetch("http://localhost:8080/api/graficos/pedidos-por-mes")
  .then((res) => res.json())
  .then((json) => {
    console.log("Respuesta backend:", json); // 👈 Ver qué llega
    const chartData: (string | number)[][] = [["Mes/Año", "Pedidos"]];
    json.forEach((item: { mesAnio: string | number; cantidad: any; }) => {
      chartData.push([item.mesAnio, Number(item.cantidad)]);
    });
    console.log("Data para Google Charts:", chartData); // 👈 Verificar formato
    setData(chartData);
  });

  }, []);

  return (
    <Chart
      chartType="ColumnChart"
      width="100%"
      height="400px"
      data={data}
      options={{
        title: "Pedidos por Mes/Año",
        hAxis: { title: "Mes/Año" },
        vAxis: { title: "Cantidad de Pedidos" },
        legend: "none",
      }}
    />
  );
};

export default GraficoBarras;




