package com.example.instrumentos_shop_backend.service;

import com.example.instrumentos_shop_backend.model.PedidoDetalle;
import com.example.instrumentos_shop_backend.repository.PedidoDetalleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PedidoDetalleService {

    private final PedidoDetalleRepository pedidoDetalleRepository;

    public PedidoDetalleService(PedidoDetalleRepository pedidoDetalleRepository) {
        this.pedidoDetalleRepository = pedidoDetalleRepository;
    }

    public List<PedidoDetalle> getAllPedidoDetalles() {
        return pedidoDetalleRepository.findAll();
    }

    public PedidoDetalle savePedidoDetalle(PedidoDetalle pedidoDetalle) {
        return pedidoDetalleRepository.save(pedidoDetalle);
    }

    public void deletePedidoDetalle(Long id) {
        pedidoDetalleRepository.deleteById(id);
    }
}