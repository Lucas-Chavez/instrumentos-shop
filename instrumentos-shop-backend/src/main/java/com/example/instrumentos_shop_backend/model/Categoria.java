package com.example.instrumentos_shop_backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "categoria_instrumento")
@Data

public class Categoria {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String denominacion;
}