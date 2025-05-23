package com.example.instrumentos_shop_backend.controller;

import com.example.instrumentos_shop_backend.service.ReportePdfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;

@RestController
@RequestMapping("/reportes")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class ReportePdfController {

    @Autowired
    private ReportePdfService reportePdfService;

    @GetMapping("/instrumento-pdf/{id}")
    public ResponseEntity<InputStreamResource> exportarInstrumentoPDF(@PathVariable Long id) {
        try {
            ByteArrayInputStream pdf = reportePdfService.exportarInstrumentoPDF(id);

            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=instrumento_" + id + ".pdf");
            headers.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_PDF_VALUE);

            return ResponseEntity.ok()
                    .headers(headers)
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(new InputStreamResource(pdf));

        } catch (Exception e) {
            System.err.println("Error al generar PDF: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}