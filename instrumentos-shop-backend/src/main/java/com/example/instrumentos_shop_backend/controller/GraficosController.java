package com.example.instrumentos_shop_backend.controller;

import com.example.instrumentos_shop_backend.dto.PedidosPorInstrumentoDTO;
import com.example.instrumentos_shop_backend.dto.PedidosPorMesDTO;
import com.example.instrumentos_shop_backend.service.PedidoService;
import com.example.instrumentos_shop_backend.service.PedidoDetalleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/graficos")
public class GraficosController {

    @Autowired
    private PedidoService pedidoService;

    @Autowired
    private PedidoDetalleService pedidoDetalleService;

    @GetMapping("/pedidos-por-mes")
    public List<PedidosPorMesDTO> getPedidosPorMes() {
        return pedidoService.getPedidosPorMesYAnio();
    }

    @GetMapping("/pedidos-por-instrumento")
    public List<PedidosPorInstrumentoDTO> getPedidosPorInstrumento() {
        return pedidoDetalleService.getPedidosPorInstrumento(); // ✅ Uso correcto de la instancia
    }


}
