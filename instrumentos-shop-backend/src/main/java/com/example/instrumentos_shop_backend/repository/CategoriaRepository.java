package com.example.instrumentos_shop_backend.repository;

import com.example.instrumentos_shop_backend.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
}