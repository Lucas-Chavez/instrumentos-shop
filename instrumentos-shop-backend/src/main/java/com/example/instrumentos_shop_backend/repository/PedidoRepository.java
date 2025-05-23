package com.example.instrumentos_shop_backend.repository;

import com.example.instrumentos_shop_backend.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    @Query("SELECT FUNCTION('MONTH', p.fechaPedido), FUNCTION('YEAR', p.fechaPedido), COUNT(p) " +
            "FROM Pedido p GROUP BY FUNCTION('YEAR', p.fechaPedido), FUNCTION('MONTH', p.fechaPedido) " +
            "ORDER BY FUNCTION('YEAR', p.fechaPedido), FUNCTION('MONTH', p.fechaPedido)")
    List<Object[]> getPedidosPorMesYAnio();


    List<Pedido> findByFechaPedidoBetween(Date fechaDesde, Date fechaHasta);

}