package com.example.instrumentos_shop_backend.controller;

import com.example.instrumentos_shop_backend.service.ReporteExcelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Date;

@RestController
@RequestMapping("/reportes")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class ReporteExcelController {

    @Autowired
    private ReporteExcelService reporteExcelService;

    @GetMapping("/pedidos-excel")
    public ResponseEntity<InputStreamResource> exportarPedidosExcel(
            @RequestParam("fechaDesde") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date fechaDesde,
            @RequestParam("fechaHasta") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date fechaHasta) throws IOException {

        ByteArrayInputStream excel = reporteExcelService.exportarReportePedidos(fechaDesde, fechaHasta);

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=pedidos.xlsx");
        headers.add(HttpHeaders.CONTENT_TYPE, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

        return ResponseEntity.ok()
                .headers(headers)
                .body(new InputStreamResource(excel));
    }
}