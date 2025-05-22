package com.example.instrumentos_shop_backend.service;

import com.example.instrumentos_shop_backend.dto.PedidosPorMesDTO;
import com.example.instrumentos_shop_backend.model.Pedido;
import com.example.instrumentos_shop_backend.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Month;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

@Service
public class PedidoService {

    @Autowired
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

    public List<PedidosPorMesDTO> getPedidosPorMesYAnio() {




        return pedidoRepository.getPedidosPorMesYAnio().stream()
                .map(obj -> {
                    Integer mes = (Integer) obj[0];
                    Integer anio = (Integer) obj[1];
                    Long cantidad = (Long) obj[2];

                    String mesNombre = Month.of(mes).getDisplayName(TextStyle.SHORT, Locale.getDefault());
                    return new PedidosPorMesDTO(mesNombre + " " + anio, cantidad);
                })
                .toList();
    }
}