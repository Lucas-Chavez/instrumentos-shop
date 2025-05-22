package com.example.instrumentos_shop_backend.repository;

import com.example.instrumentos_shop_backend.model.PedidoDetalle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PedidoDetalleRepository extends JpaRepository<PedidoDetalle, Long> {

    @Query("SELECT pd.instrumento.instrumento, SUM(pd.cantidad) " +
            "FROM PedidoDetalle pd GROUP BY pd.instrumento.instrumento")
    List<Object[]> getCantidadPedidosPorInstrumento();
}