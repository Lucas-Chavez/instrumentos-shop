package com.example.instrumentos_shop_backend.controller;

import com.example.instrumentos_shop_backend.model.Pedido;
import com.example.instrumentos_shop_backend.service.PedidoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @GetMapping
    public List<Pedido> getTodos() {
        return pedidoService.getAllPedidos();
    }

    @GetMapping("/{id}")
    public Pedido getPorId(@PathVariable Long id) {
        return pedidoService.getPedidoById(id).orElse(null);
    }

    @PostMapping
    public Pedido createPedido(@RequestBody Pedido pedido) {
        return pedidoService.savePedido(pedido);
    }

    @PutMapping("/{id}")
    public Pedido updatePedido(@PathVariable Long id, @RequestBody Pedido pedido) {
        pedido.setId(id);
        return pedidoService.savePedido(pedido);
    }

    @DeleteMapping("/{id}")
    public void deletePedido(@PathVariable Long id) {
        pedidoService.deletePedido(id);
    }
}