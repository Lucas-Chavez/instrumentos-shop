package com.example.instrumentos_shop_backend.service;

import com.example.instrumentos_shop_backend.model.PreferenceRequestModel;
import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.preference.*;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Collections;

@Service
public class MercadoPagoService {

    private static final Logger logger = LoggerFactory.getLogger(MercadoPagoService.class);
    @Value("${mercadopago.access.token}")
    private String mercadoPagoAccessToken;

    @Value("${app.url.frontend}")
    private String appUrlFrontend;

    public String createPreference(PreferenceRequestModel preferenceRequestModel) {
        try {
            MercadoPagoConfig.setAccessToken(mercadoPagoAccessToken);

            PreferenceItemRequest item = PreferenceItemRequest.builder()
                    .title(preferenceRequestModel.getTitle())
                    .quantity(preferenceRequestModel.getQuantity())
                    .unitPrice(preferenceRequestModel.getPrice())
                    .build();

            PreferenceBackUrlsRequest backUrls = PreferenceBackUrlsRequest.builder()
                    .success("http://localhost:5173/success")
                    .failure("http://localhost:5173/failure")
                    .pending("http://localhost:5173/pending")
                    .build();

            logger.info("URL de retorno exitoso: {}", "http://localhost:5173/success" );

            PreferenceRequest preferenceRequestMP = PreferenceRequest.builder()
                    .items(Collections.singletonList(item))
                    .backUrls(backUrls)
                    .build();

            PreferenceClient client = new PreferenceClient();
            return client.create(preferenceRequestMP).getInitPoint();
        } catch (MPApiException e) {
            // Extraer detalles del error de la API de Mercado Pago
            logger.error("Error de API de Mercado Pago: Código de estado: {}, Mensaje: {}",
                    e.getApiResponse().getStatusCode(),
                    e.getApiResponse().getContent());

            // Registrar detalles adicionales si están disponibles
            if (e.getApiResponse().getContent() != null) {
                logger.error("Respuesta detallada: {}", e.getApiResponse().getContent());
            }

            throw new RuntimeException("Error en la API de Mercado Pago: " + e.getApiResponse().getStatusCode(), e);
        } catch (MPException e) {
            throw new RuntimeException("Error al crear preferencia de pago", e);
        }
        catch (Exception e) {
            // Registra el error con todos los detalles antes de relanzarlo
            logger.error("Error detallado de MercadoPago: ", e);
            throw new RuntimeException("Error en la API de Mercado Pago: " + e.getMessage(), e);
        }
    }
}