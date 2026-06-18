package com.grupo3.oficio.service.users;

import com.grupo3.oficio.model.users.Cliente;
import com.grupo3.oficio.repository.users.ClienteRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class ClienteService {
    private final ClienteRepository clienteRepository;

    public ClienteService(ClienteRepository clienteRepository) { this.clienteRepository = clienteRepository; }

    //CRUD
        //create
    public Cliente crear(Cliente cliente) {
        //validaciones
        if (cliente == null) {
            throw new IllegalArgumentException("El cliente no puede ser nulo");
        }
        if (cliente.getCorreo() == null || cliente.getCorreo().isBlank()) {
            throw new IllegalArgumentException("El correo es obligatorio");
        }
        if (cliente.getUsername() == null || cliente.getUsername().isBlank()) {
            throw new IllegalArgumentException("El username es obligatorio");
        }
        if (cliente.getPassword() == null || cliente.getPassword().length() < 8) {
            throw new IllegalArgumentException("La contraseña debe tener al menos 8 caracteres");
        }
        if (cliente.getNombre() == null || cliente.getNombre().isBlank()) {
            throw new IllegalArgumentException("El nombre es obligatorio");
        }
        if (cliente.getApellido() == null || cliente.getApellido().isBlank()) {
            throw new IllegalArgumentException("El apellido es obligatorio");
        }
        if (cliente.getDni() == null || !cliente.getDni().matches("\\d{7,8}")) {
            throw new IllegalArgumentException("DNI inválido");
        }
        if (clienteRepository.existsByCorreo(cliente.getCorreo())) {
            throw new IllegalArgumentException("Ya existe un cliente con ese correo");
        }
        if (clienteRepository.existsByUsername(cliente.getUsername())) {
            throw new IllegalArgumentException("Ya existe un cliente con ese username");
        }
        if (clienteRepository.existsByDni(cliente.getDni())) {
            throw new IllegalArgumentException("Ya existe un cliente con ese DNI");
        }

        cliente.setId(null);
        cliente.setFechaCreacion(LocalDateTime.now());

        return clienteRepository.save(cliente);
    }

        //read
    public List<Cliente> mostrarTodos(){ return clienteRepository.findAll(); }

    public Cliente buscarPorId(Integer id) {
        return clienteRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("ERROR ClienteService/buscarPorId, NO " + id));
    }
    public Cliente buscarPorEmail(String email) {
        return clienteRepository.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("No existe"));
    }
        //update
    public Cliente actualizar(Integer id, Cliente cliente) {
        //validaciones
        if (cliente == null) {
            throw new IllegalArgumentException("El cliente no puede ser nulo");
        }
        if (cliente.getCorreo() == null || cliente.getCorreo().isBlank()) {
            throw new IllegalArgumentException("El correo es obligatorio");
        }
        if (cliente.getUsername() == null || cliente.getUsername().isBlank()) {
            throw new IllegalArgumentException("El username es obligatorio");
        }
        if (cliente.getPassword() == null || cliente.getPassword().length() < 8) {
            throw new IllegalArgumentException("La contraseña debe tener al menos 8 caracteres");
        }
        if (cliente.getNombre() == null || cliente.getNombre().isBlank()) {
            throw new IllegalArgumentException("El nombre es obligatorio");
        }
        if (cliente.getApellido() == null || cliente.getApellido().isBlank()) {
            throw new IllegalArgumentException("El apellido es obligatorio");
        }
        if (cliente.getDni() == null || !cliente.getDni().matches("\\d{7,8}")) {
            throw new IllegalArgumentException("DNI inválido");
        }
        if (!clienteRepository.existsById(id)) {
            throw new EntityNotFoundException("El cliente con ID " + id + " no existe");
        }

        cliente.setId(id);
        clienteRepository.save(cliente);

        return cliente;
    }
    public Cliente actualizarPerfil(String email, Cliente datos) {

        Cliente clienteExistente = clienteRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException(
                        "El cliente con email " + email + " no existe"
                ));

        //actualizar campos
        clienteExistente.setNombre(datos.getNombre());
        clienteExistente.setApellido(datos.getApellido());
        clienteExistente.setUsername(datos.getUsername());
        clienteExistente.setDni(datos.getDni());

        //password solo si querés permitir cambio
        if (datos.getPassword() != null && !datos.getPassword().isBlank()) {
            clienteExistente.setPassword(datos.getPassword());
        }

        return clienteRepository.save(clienteExistente);
    }

        //delete
    public void borrar(Integer id) {
        if (id == null) {
            throw new NullPointerException("ERROR ClienteService/borrar, ID nulo");
        }
        if (!clienteRepository.existsById(id)) {
            throw new EntityNotFoundException("El cliente con ID " + id + " no existe");
        }

        clienteRepository.deleteById(id);
    }
}
