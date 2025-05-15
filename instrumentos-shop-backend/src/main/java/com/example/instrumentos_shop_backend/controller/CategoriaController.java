package com.example.instrumentos_shop_backend.controller;

import com.example.instrumentos_shop_backend.model.Categoria;
import com.example.instrumentos_shop_backend.service.CategoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class CategoriaController {
    @Autowired
    private CategoriaService categoriaService;

    @GetMapping
    public List<Categoria> getAllCategorias() {
        return categoriaService.getAllCategorias();
    }

    @GetMapping("/{id}")
    public Categoria getCategoriaById(@PathVariable Long id) {
        return categoriaService.getCategoriaById(id);
    }
}