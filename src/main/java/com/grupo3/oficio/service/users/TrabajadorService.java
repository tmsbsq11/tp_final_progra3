package com.grupo3.oficio.service.users;

import com.grupo3.oficio.model.users.Trabajador;
import com.grupo3.oficio.repository.users.TrabajadorRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class TrabajadorService {
    private final TrabajadorRepository trabajadorRepository;

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
        if (trabajador.getMinutosMinimoEntreReservas() == null ) {
            throw new IllegalArgumentException("El minimo de tiempo entre reservas es obligatorio");
        }
//        if(){
//
//        }
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
    public Trabajador buscarPorEmail(String email) {
        return trabajadorRepository.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("No existe"));
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
        if (!trabajadorRepository.existsById(id)) {
            throw new EntityNotFoundException("El trabajador con ID " + id + " no existe");
        }
        if(trabajador.getMinutosMinimoEntreReservas()==null){
            throw new IllegalArgumentException(("El trabajador debe tener asignados los minutos minimos entre reservas"));
        }

        trabajador.setId(id);
        trabajadorRepository.save(trabajador);

        return trabajador;
    }
    public Trabajador actualizarPerfil(String email, Trabajador datos) {

        Trabajador trabajadorExistente = trabajadorRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException(
                        "El cliente con email " + email + " no existe"
                ));

        //actualizar campos
        trabajadorExistente.setNombre(datos.getNombre());
        trabajadorExistente.setApellido(datos.getApellido());
        trabajadorExistente.setUsername(datos.getUsername());
        trabajadorExistente.setDni(datos.getDni());

        //password solo si querés permitir cambio
        if (datos.getPassword() != null && !datos.getPassword().isBlank()) {
            trabajadorExistente.setPassword(datos.getPassword());
        }

        return trabajadorRepository.save(trabajadorExistente);
    }

    //delete
    public void borrar(Integer id) {
        if (id == null) {
            throw new NullPointerException("ERROR TrabajadorService/borrar, ID nulo");
        }
        if (!trabajadorRepository.existsById(id)) {
            throw new EntityNotFoundException("El trabajador con ID " + id + " no existe");
        }

        trabajadorRepository.deleteById(id);
    }
}
