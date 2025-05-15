package com.example.instrumentos_shop_backend.repository;

import com.example.instrumentos_shop_backend.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {
}