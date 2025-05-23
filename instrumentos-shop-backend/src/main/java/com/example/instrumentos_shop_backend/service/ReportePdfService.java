package com.example.instrumentos_shop_backend.service;

import com.example.instrumentos_shop_backend.model.Instrumento;
import com.example.instrumentos_shop_backend.repository.InstrumentoRepository;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.text.DecimalFormat;

@Service
public class ReportePdfService {

    @Autowired
    private InstrumentoRepository instrumentoRepository;

    public ByteArrayInputStream exportarInstrumentoPDF(Long idInstrumento) throws Exception {
        Instrumento instrumento = instrumentoRepository.findById(idInstrumento)
                .orElseThrow(() -> new RuntimeException("Instrumento no encontrado"));

        Document document = new Document(PageSize.A4, 40, 40, 60, 60);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Definir fuentes y colores
            Font titleFont = new Font(Font.HELVETICA, 24, Font.BOLD);
            Font subtitleFont = new Font(Font.HELVETICA, 18, Font.BOLD);
            Font priceFont = new Font(Font.HELVETICA, 22, Font.BOLD);
            Font labelFont = new Font(Font.HELVETICA, 12, Font.BOLD);
            Font bodyFont = new Font(Font.HELVETICA, 12);
            Font smallFont = new Font(Font.HELVETICA, 10);
            Font vendidosFont = new Font(Font.HELVETICA, 11, Font.NORMAL, Color.GRAY);

            DecimalFormat df = new DecimalFormat("#,##0");

            // Crear tabla principal con dos columnas
            PdfPTable mainTable = new PdfPTable(2);
            mainTable.setWidthPercentage(100);
            mainTable.setWidths(new float[]{1.2f, 1f}); // Proporción columnas

            // COLUMNA IZQUIERDA - IMAGEN
            PdfPCell leftCell = new PdfPCell();
            leftCell.setBorder(Rectangle.NO_BORDER);
            leftCell.setPadding(20);
            leftCell.setVerticalAlignment(Element.ALIGN_MIDDLE);

            try {
                if (instrumento.getImagen() != null && !instrumento.getImagen().isEmpty()) {
                    String imagePath = "src/main/resources/static/img/" + instrumento.getImagen();
                    File imageFile = new File(imagePath);

                    if (imageFile.exists()) {
                        Image img = Image.getInstance(imagePath);
                        img.scaleToFit(250, 250);
                        img.setAlignment(Image.ALIGN_CENTER);
                        leftCell.addElement(img);
                    } else {
                        // Placeholder si no hay imagen
                        Paragraph noImage = new Paragraph("Imagen no disponible", bodyFont);
                        noImage.setAlignment(Element.ALIGN_CENTER);
                        leftCell.addElement(noImage);
                    }
                }
            } catch (Exception e) {
                Paragraph noImage = new Paragraph("Imagen no disponible", bodyFont);
                noImage.setAlignment(Element.ALIGN_CENTER);
                leftCell.addElement(noImage);
            }

            // COLUMNA DERECHA - INFORMACIÓN
            PdfPCell rightCell = new PdfPCell();
            rightCell.setBorder(Rectangle.NO_BORDER);
            rightCell.setPadding(20);
            rightCell.setVerticalAlignment(Element.ALIGN_TOP);

            // Cantidad vendidos (pequeño, arriba)
            if (instrumento.getCantidadVendida() != null && instrumento.getCantidadVendida() > 0) {
                Paragraph vendidos = new Paragraph(instrumento.getCantidadVendida() + " vendidos", vendidosFont);
                vendidos.setSpacingAfter(8);
                rightCell.addElement(vendidos);
            }

            // Título del instrumento
            String tituloCompleto = "";
            if (instrumento.getInstrumento() != null) {
                tituloCompleto = instrumento.getInstrumento();
            }
            if (instrumento.getMarca() != null) {
                tituloCompleto += "\nInstrumento Musical\n" + instrumento.getMarca();
            }
            if (instrumento.getModelo() != null) {
                tituloCompleto += " " + instrumento.getModelo();
            }

            Paragraph titulo = new Paragraph(tituloCompleto, subtitleFont);
            titulo.setSpacingAfter(20);
            rightCell.addElement(titulo);

            // Precio
            if (instrumento.getPrecio() != null) {
                Paragraph precio = new Paragraph("$ " + df.format(instrumento.getPrecio()), priceFont);
                precio.setSpacingAfter(15);
                rightCell.addElement(precio);
            }

            // Marca y Modelo (en formato compacto)
            if (instrumento.getMarca() != null || instrumento.getModelo() != null) {
                String marcaModelo = "";
                if (instrumento.getMarca() != null) {
                    marcaModelo = "Marca: " + instrumento.getMarca();
                }
                if (instrumento.getModelo() != null) {
                    if (!marcaModelo.isEmpty()) marcaModelo += "\n";
                    marcaModelo += "Modelo: " + instrumento.getModelo();
                }
                Paragraph marcaModeloPar = new Paragraph(marcaModelo, bodyFont);
                marcaModeloPar.setSpacingAfter(15);
                rightCell.addElement(marcaModeloPar);
            }

            // Costo de envío
            if (instrumento.getCostoEnvio() != null) {
                String costoEnvioValue = instrumento.getCostoEnvio().trim();
                String costoEnvioText;

                // Verificar si es envío gratis (puede ser "0", "0.0", "gratis", etc.)
                if (costoEnvioValue.equals("0") ||
                        costoEnvioValue.equals("0.0") ||
                        costoEnvioValue.equalsIgnoreCase("gratis") ||
                        costoEnvioValue.equalsIgnoreCase("envío gratis") ||
                        costoEnvioValue.isEmpty()) {

                    costoEnvioText = "🚚 Envío gratis";
                    Font envioGratisFont = new Font(Font.HELVETICA, 12, Font.NORMAL, Color.GREEN);
                    Paragraph costoEnvio = new Paragraph(costoEnvioText, envioGratisFont);
                    costoEnvio.setSpacingAfter(20);
                    rightCell.addElement(costoEnvio);
                } else {
                    // Intentar convertir a número para formatear, si no es posible mostrar como texto
                    try {
                        double costoNumerico = Double.parseDouble(costoEnvioValue);
                        costoEnvioText = "Costo Envío: $" + df.format(costoNumerico);
                    } catch (NumberFormatException e) {
                        costoEnvioText = "Costo Envío: " + costoEnvioValue;
                    }

                    Paragraph costoEnvio = new Paragraph(costoEnvioText, bodyFont);
                    costoEnvio.setSpacingAfter(20);
                    rightCell.addElement(costoEnvio);
                }
            }

            mainTable.addCell(leftCell);
            mainTable.addCell(rightCell);
            document.add(mainTable);

            // Descripción (ancho completo, abajo)
            if (instrumento.getDescripcion() != null && !instrumento.getDescripcion().isEmpty()) {
                document.add(new Paragraph(" ")); // Espacio

                Paragraph descTitulo = new Paragraph("Descripción:", labelFont);
                descTitulo.setSpacingAfter(8);
                document.add(descTitulo);

                Paragraph descripcion = new Paragraph(instrumento.getDescripcion(), bodyFont);
                descripcion.setAlignment(Element.ALIGN_JUSTIFIED);
                descripcion.setSpacingAfter(10);
                document.add(descripcion);
            }

            // Footer con información adicional
            document.add(new Paragraph(" ")); // Espacio

            // Línea separadora
            PdfPTable separatorTable = new PdfPTable(1);
            separatorTable.setWidthPercentage(100);
            PdfPCell separatorCell = new PdfPCell();
            separatorCell.setBorder(Rectangle.TOP);
            separatorCell.setBorderColor(Color.LIGHT_GRAY);
            separatorCell.setFixedHeight(1);
            separatorTable.addCell(separatorCell);
            document.add(separatorTable);

            document.add(new Paragraph(" "));

            // Información adicional
            Paragraph footer = new Paragraph("ID del Instrumento: " + instrumento.getId(), smallFont);
            footer.setAlignment(Element.ALIGN_CENTER);
            footer.getFont().setColor(Color.GRAY);
            document.add(footer);

        } finally {
            if (document.isOpen()) {
                document.close();
            }
        }

        return new ByteArrayInputStream(out.toByteArray());
    }
}