package com.example.instrumentos_shop_backend.service;

import com.example.instrumentos_shop_backend.model.Usuario;
import com.example.instrumentos_shop_backend.repository.UsuarioRepository;
import com.example.instrumentos_shop_backend.security.HashSecurity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    private static final List<String> ROLES_VALIDOS = List.of("Admin", "Operador", "Visor");

    public List<Usuario> obtenerTodos() {
        return usuarioRepository.findAll();
    }

    public Optional<Usuario> obtenerPorId(Long id) {
        return usuarioRepository.findById(id);
    }

    public Usuario guardarUsuario(Usuario usuario) {
        validarRol(usuario.getRol());
        usuario.setClave(HashSecurity.SHA1(usuario.getClave()));
        return usuarioRepository.save(usuario);
    }

    public Usuario actualizarUsuario(Long id, Usuario usuarioActualizado) {
        return usuarioRepository.findById(id).map(usuario -> {
            validarRol(usuarioActualizado.getRol());
            usuario.setNombreUsuario(usuarioActualizado.getNombreUsuario());
            usuario.setClave(HashSecurity.SHA1(usuarioActualizado.getClave()));
            usuario.setRol(usuarioActualizado.getRol());
            return usuarioRepository.save(usuario);
        }).orElse(null);
    }

    public void eliminarUsuario(Long id) {
        usuarioRepository.deleteById(id);
    }

    private void validarRol(String rol) {
        if (!ROLES_VALIDOS.contains(rol)) {
            throw new IllegalArgumentException("Rol inválido: " + rol);
        }
    }

    public Usuario login(String nombreUsuario, String clave) {
        return usuarioRepository.findByNombreUsuario(nombreUsuario)
                .filter(usuario -> usuario.getClave().equals(HashSecurity.SHA1(clave)))
                .orElseThrow(() -> new IllegalArgumentException("Credenciales inválidas"));
    }

}