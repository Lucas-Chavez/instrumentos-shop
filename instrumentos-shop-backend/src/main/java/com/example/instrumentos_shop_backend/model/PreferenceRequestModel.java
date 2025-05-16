package com.example.instrumentos_shop_backend.model;

import java.math.BigDecimal;
import lombok.Data;

@Data
public class PreferenceRequestModel {
    private String title;
    private BigDecimal price;
    private Integer quantity;
    private String description;
}