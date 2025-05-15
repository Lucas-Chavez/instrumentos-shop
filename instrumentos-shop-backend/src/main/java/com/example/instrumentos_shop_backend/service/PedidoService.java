package com.example.instrumentos_shop_backend.service;

import com.example.instrumentos_shop_backend.model.Pedido;
import com.example.instrumentos_shop_backend.repository.PedidoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;

    public PedidoService(PedidoRepository pedidoRepository) {
        this.pedidoRepository = pedidoRepository;
    }

    public List<Pedido> getAllPedidos() {
        return pedidoRepository.findAll();
    }

    public Optional<Pedido> getPedidoById(Long id) {
        return pedidoRepository.findById(id);
    }

    public Pedido savePedido(Pedido pedido) {
        return pedidoRepository.save(pedido);
    }

    public void deletePedido(Long id) {
        pedidoRepository.deleteById(id);
    }
}