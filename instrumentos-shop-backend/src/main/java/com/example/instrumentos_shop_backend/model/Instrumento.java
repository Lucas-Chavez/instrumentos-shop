package com.example.instrumentos_shop_backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@ToString
@AllArgsConstructor

@Builder

public class Instrumento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String instrumento;
    private String marca;
    private String modelo;
    private String imagen;
    private Double precio;
    private String costoEnvio;
    private Integer cantidadVendida;


    @Column(length = 1000) // para que no se corte la descripción si es larga
    private String descripcion;


    @Column(name = "idCategoria")
    private Long idCategoria;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "idCategoria", insertable = false, updatable = false)
    private Categoria categoria;

}
