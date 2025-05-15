package com.example.instrumentos_shop_backend.config;

import com.example.instrumentos_shop_backend.model.Categoria;
import com.example.instrumentos_shop_backend.model.Instrumento;
import com.example.instrumentos_shop_backend.model.Usuario;
import com.example.instrumentos_shop_backend.repository.CategoriaRepository;
import com.example.instrumentos_shop_backend.repository.InstrumentoRepository;
import com.example.instrumentos_shop_backend.repository.UsuarioRepository;
import com.example.instrumentos_shop_backend.security.HashSecurity;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private InstrumentoRepository instrumentoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (instrumentoRepository.count() == 0 && categoriaRepository.count() == 0 && usuarioRepository.count() == 0) {
            ObjectMapper mapper = new ObjectMapper();
            mapper.registerModule(new JavaTimeModule());

            try {
                ClassPathResource resource = new ClassPathResource("data/instrumentos.json");
                InputStream is = resource.getInputStream();

                if (is == null) {
                    System.err.println("No se pudo encontrar el archivo JSON en la ruta especificada");
                    return;
                }

                JsonNode rootNode = mapper.readTree(is);

                // Cargar categorías
                for (JsonNode categoriaNode : rootNode.get("categorias")) {
                    Categoria categoria = new Categoria();
                    categoria.setDenominacion(categoriaNode.get("denominacion").asText());
                    categoriaRepository.save(categoria);
                }

                // Cargar instrumentos
                for (JsonNode instrumentoNode : rootNode.get("instrumentos")) {
                    Instrumento instrumento = Instrumento.builder()
                            .instrumento(instrumentoNode.get("instrumento").asText())
                            .marca(instrumentoNode.get("marca").asText())
                            .modelo(instrumentoNode.get("modelo").asText())
                            .imagen(instrumentoNode.get("imagen").asText())
                            .precio(instrumentoNode.get("precio").asDouble())
                            .costoEnvio(instrumentoNode.get("costoEnvio").asText())
                            .cantidadVendida(instrumentoNode.get("cantidadVendida").asInt())
                            .descripcion(instrumentoNode.get("descripcion").asText())
                            .idCategoria(instrumentoNode.get("idCategoria").asLong())
                            .build();

                    instrumentoRepository.save(instrumento);
                }

                // Cargar usuarios
                for (JsonNode usuarioNode : rootNode.get("usuarios")) {
                    Usuario usuario = Usuario.builder()
                            .nombreUsuario(usuarioNode.get("nombreUsuario").asText())
                            .clave(HashSecurity.SHA1(usuarioNode.get("clave").asText()))
                            .rol(usuarioNode.get("rol").asText())
                            .build();

                    usuarioRepository.save(usuario);
                }

                System.out.println("Carga de datos completada exitosamente");

            } catch (Exception e) {
                System.err.println("Error al cargar los datos: " + e.getMessage());
                e.printStackTrace();
            }
        } else {
            System.out.println("Los datos ya estaban cargados previamente.");
        }
    }
}