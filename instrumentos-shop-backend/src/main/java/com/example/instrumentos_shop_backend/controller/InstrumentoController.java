package com.example.instrumentos_shop_backend.controller;

import com.example.instrumentos_shop_backend.model.Instrumento;
import com.example.instrumentos_shop_backend.service.InstrumentoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/instrumentos")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class InstrumentoController {
    private final InstrumentoService instrumentoService;

    // Constructor injection en lugar de @Autowired
    public InstrumentoController(InstrumentoService instrumentoService) {
        this.instrumentoService = instrumentoService;
    }

    // GET /api/instrumentos
    @GetMapping
    public List<Instrumento> getTodos() {
        return instrumentoService.getAllInstrumentos();
    }

    // GET /api/instrumentos/categoria/{idCategoria}
    @GetMapping("/categoria/{idCategoria}")
    public List<Instrumento> getInstrumentosByCategoria(@PathVariable Long idCategoria) {
        return instrumentoService.getInstrumentosByCategoria(idCategoria);
    }

    // GET /api/instrumentos/{id}
    @GetMapping("/{id}")
    public Instrumento getPorId(@PathVariable Long id) {
        return instrumentoService.getInstrumentoById(id);
    }

    // POST /api/instrumentos
    @PostMapping
    public Instrumento createInstrumento(@RequestBody Instrumento instrumento) {
        return instrumentoService.saveInstrumento(instrumento);
    }

    // PUT /api/instrumentos/{id}
    @PutMapping("/{id}")
    public Instrumento updateInstrumento(@PathVariable Long id, @RequestBody Instrumento instrumento) {
        instrumento.setId(id);
        return instrumentoService.saveInstrumento(instrumento);
    }

    // DELETE /api/instrumentos/{id}
    @DeleteMapping("/{id}")
    public void deleteInstrumento(@PathVariable Long id) {
        instrumentoService.deleteInstrumento(id);
    }
}