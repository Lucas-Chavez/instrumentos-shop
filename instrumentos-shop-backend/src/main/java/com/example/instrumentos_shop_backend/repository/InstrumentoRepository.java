package com.example.instrumentos_shop_backend.repository;

import com.example.instrumentos_shop_backend.model.Instrumento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InstrumentoRepository extends JpaRepository<Instrumento, Long> {
    List<Instrumento> findByIdCategoria(Long idCategoria);
}
