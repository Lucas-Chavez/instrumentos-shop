package com.example.instrumentos_shop_backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

@Builder

public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private Date fechaPedido;
    private Double totalPedido;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "idPedido")
    private List<PedidoDetalle> pedidoDetalles;
}
