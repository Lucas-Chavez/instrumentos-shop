package com.example.instrumentos_shop_backend.controller;

import com.example.instrumentos_shop_backend.model.PedidoDetalle;
import com.example.instrumentos_shop_backend.service.PedidoDetalleService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedido-detalles")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class PedidoDetalleController {

    private final PedidoDetalleService pedidoDetalleService;

    public PedidoDetalleController(PedidoDetalleService pedidoDetalleService) {
        this.pedidoDetalleService = pedidoDetalleService;
    }

    @GetMapping
    public List<PedidoDetalle> getTodos() {
        return pedidoDetalleService.getAllPedidoDetalles();
    }

    @PostMapping
    public PedidoDetalle createPedidoDetalle(@RequestBody PedidoDetalle pedidoDetalle) {
        return pedidoDetalleService.savePedidoDetalle(pedidoDetalle);
    }

    @DeleteMapping("/{id}")
    public void deletePedidoDetalle(@PathVariable Long id) {
        pedidoDetalleService.deletePedidoDetalle(id);
    }
}