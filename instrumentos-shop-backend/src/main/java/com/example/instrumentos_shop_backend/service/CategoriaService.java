package com.example.instrumentos_shop_backend.service;

import com.example.instrumentos_shop_backend.model.Categoria;
import com.example.instrumentos_shop_backend.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoriaService {
    @Autowired
    private CategoriaRepository categoriaRepository;

    public List<Categoria> getAllCategorias() {
        return categoriaRepository.findAll();
    }

    public Categoria getCategoriaById(Long id) {
        return categoriaRepository.findById(id).orElse(null);
    }
}