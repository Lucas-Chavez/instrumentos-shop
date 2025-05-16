package com.example.instrumentos_shop_backend.controller;

import com.example.instrumentos_shop_backend.model.PreferenceRequestModel;
import com.example.instrumentos_shop_backend.service.MercadoPagoService;
// import com.mercadopago.net.HttpStatus; //
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "*")
public class PaymentController {

    private static final Logger logger = LoggerFactory.getLogger(PaymentController.class);
    private final MercadoPagoService mercadoPagoService;

    @Autowired
    public PaymentController(MercadoPagoService mercadoPagoService) {
        this.mercadoPagoService = mercadoPagoService;
    }

    @PostMapping("/create-preference")
    public ResponseEntity<?> createPreference(@RequestBody PreferenceRequestModel preferenceRequestModel) {
        try {
            String checkoutUrl = mercadoPagoService.createPreference(preferenceRequestModel);
            return ResponseEntity.ok(checkoutUrl);
        } catch (Exception e) {
            logger.error("Error al crear preferencia de pago: " + e.getMessage(), e);
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al procesar el pago: " + e.getMessage());
        }
    }
}