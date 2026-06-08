package com.grupo3.oficio.service.users;

import com.grupo3.oficio.model.users.Trabajador;
import com.grupo3.oficio.repository.users.TrabajadorRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class TrabajadorService {
    private TrabajadorRepository trabajadorRepository;

    public TrabajadorService(TrabajadorRepository trabajadorRepository) { this.trabajadorRepository = trabajadorRepository; }

    //CRUD
        //create
    public Trabajador crear(Trabajador trabajador) {
        //validaciones
        if (trabajador == null) {
            throw new IllegalArgumentException("El trabajador no puede ser nulo");
        }
            //credenciales
        if (trabajador.getCorreo() == null || trabajador.getCorreo().isBlank()) {
            throw new IllegalArgumentException("El correo es obligatorio");
        }
        if (!trabajador.getCorreo().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new IllegalArgumentException("El correo no tiene un formato válido");
        }
        if (trabajador.getUsername() == null || trabajador.getUsername().isBlank()) {
            throw new IllegalArgumentException("El username es obligatorio");
        }
        if (trabajador.getPassword() == null || trabajador.getPassword().length() < 8) {
            throw new IllegalArgumentException("La contraseña debe tener al menos 8 caracteres");
        }
        if (trabajador.getNombre() == null || trabajador.getNombre().isBlank()) {
            throw new IllegalArgumentException("El nombre es obligatorio");
        }
        if (trabajador.getApellido() == null || trabajador.getApellido().isBlank()) {
            throw new IllegalArgumentException("El apellido es obligatorio");
        }
        if (trabajador.getDni() == null || trabajador.getDni().isBlank()) {
            throw new IllegalArgumentException("El DNI es obligatorio");
        }
        if (!trabajador.getDni().matches("\\d{7,8}")) {
            throw new IllegalArgumentException("El DNI debe tener 7 u 8 dígitos");
        }
        if (trabajadorRepository.existsByCorreo(trabajador.getCorreo())) {
            throw new IllegalArgumentException("Ya existe un usuario con ese correo");
        }
        if (trabajadorRepository.existsByUsername(trabajador.getUsername())) {
            throw new IllegalArgumentException("Ya existe un usuario con ese username");
        }
        if (trabajadorRepository.existsByDni(trabajador.getDni())) {
            throw new IllegalArgumentException("Ya existe un usuario con ese DNI");
        }

        trabajador.setId(null);
        trabajador.setFechaCreacion(LocalDateTime.now());
        trabajador.setIsActive(true);

        return trabajadorRepository.save(trabajador);
    }

    //read
    public List<Trabajador> mostrarTodos(){ return trabajadorRepository.findAll(); }

    public Trabajador buscarPorId(Integer id) {
        return trabajadorRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("ERROR TrabajadorService/buscarPorId, NO " + id));
    }

    //update
    public Trabajador actualizar(Integer id, Trabajador trabajador) {
        //validaciones
        if (trabajador == null) {
            throw new IllegalArgumentException("El trabajador no puede ser nulo");
        }
            //credenciales
        if (trabajador.getCorreo() == null || trabajador.getCorreo().isBlank()) {
            throw new IllegalArgumentException("El correo es obligatorio");
        }
        if (!trabajador.getCorreo().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new IllegalArgumentException("El correo no tiene un formato válido");
        }
        if (trabajador.getUsername() == null || trabajador.getUsername().isBlank()) {
            throw new IllegalArgumentException("El username es obligatorio");
        }
        if (trabajador.getPassword() == null || trabajador.getPassword().length() < 8) {
            throw new IllegalArgumentException("La contraseña debe tener al menos 8 caracteres");
        }
            //datos
        if (trabajador.getNombre() == null || trabajador.getNombre().isBlank()) {
            throw new IllegalArgumentException("El nombre es obligatorio");
        }
        if (trabajador.getApellido() == null || trabajador.getApellido().isBlank()) {
            throw new IllegalArgumentException("El apellido es obligatorio");
        }
        if (trabajador.getDni() == null || trabajador.getDni().isBlank()) {
            throw new IllegalArgumentException("El DNI es obligatorio");
        }
        if (!trabajador.getDni().matches("\\d{7,8}")) {
            throw new IllegalArgumentException("El DNI debe tener 7 u 8 dígitos");
        }

        trabajador.setId(id);
        trabajadorRepository.save(trabajador);

        return trabajador;
    }

    //delete
    public void borrar(Integer id) {
        trabajadorRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("ERROR TrabajadorService/borrar, NO " + id));
        if (id == null) {
            throw new NullPointerException("ERROR TrabajadorService/borrar, ID nulo");
        }

        trabajadorRepository.deleteById(id);
    }
}
