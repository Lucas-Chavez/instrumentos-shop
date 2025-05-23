package com.example.instrumentos_shop_backend.service;

import com.example.instrumentos_shop_backend.model.Instrumento;
import com.example.instrumentos_shop_backend.model.Pedido;
import com.example.instrumentos_shop_backend.model.PedidoDetalle;
import com.example.instrumentos_shop_backend.repository.PedidoRepository;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Date;
import java.util.List;

@Service
public class ReporteExcelService {

    @Autowired
    private PedidoRepository pedidoRepository;

    public ByteArrayInputStream exportarReportePedidos(Date fechaDesde, Date fechaHasta) throws IOException {
        List<Pedido> pedidos = pedidoRepository.findByFechaPedidoBetween(fechaDesde, fechaHasta);

        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Pedidos");

            // Cabecera
            Row header = sheet.createRow(0);
            String[] columnas = {"Id Pedido" ,"Fecha Pedido", "Instrumento", "Marca", "Modelo", "Cantidad", "Precio", "Subtotal"};
            for (int i = 0; i < columnas.length; i++) {
                header.createCell(i).setCellValue(columnas[i]);
            }

            int rowNum = 1;
            for (Pedido pedido : pedidos) {
                for (PedidoDetalle detalle : pedido.getPedidoDetalles()) {
                    Row row = sheet.createRow(rowNum++);
                    Instrumento ins = detalle.getInstrumento();
                    row.createCell(0).setCellValue(pedido.getId());
                    row.createCell(1).setCellValue(pedido.getFechaPedido().toString());
                    row.createCell(2).setCellValue(ins.getInstrumento());
                    row.createCell(3).setCellValue(ins.getMarca());
                    row.createCell(4).setCellValue(ins.getModelo());
                    row.createCell(5).setCellValue(detalle.getCantidad());
                    row.createCell(6).setCellValue(ins.getPrecio());
                    row.createCell(7).setCellValue(detalle.getCantidad() * ins.getPrecio());
                }
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }
}
