package com.example.instrumentos_shop_backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString

@Builder

public class PedidoDetalle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "idInstrumento", nullable = false)
    private  Instrumento instrumento;


    private Integer cantidad;
}
