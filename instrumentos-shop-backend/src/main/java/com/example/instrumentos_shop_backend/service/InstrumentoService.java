package com.example.instrumentos_shop_backend.service;

import com.example.instrumentos_shop_backend.model.Instrumento;
import com.example.instrumentos_shop_backend.repository.InstrumentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class InstrumentoService {
    @Autowired
    private InstrumentoRepository instrumentoRepository;

    public List<Instrumento> getAllInstrumentos() {
        return instrumentoRepository.findAll();
    }

    public List<Instrumento> getInstrumentosByCategoria(Long idCategoria) {
        return instrumentoRepository.findByIdCategoria(idCategoria);
    }

    public Instrumento getInstrumentoById(Long id) {
        return instrumentoRepository.findById(id).orElse(null);
    }

    public Instrumento saveInstrumento(Instrumento instrumento) {
        return instrumentoRepository.save(instrumento);
    }

    public void deleteInstrumento(Long id) {
        instrumentoRepository.deleteById(id);
    }
}
