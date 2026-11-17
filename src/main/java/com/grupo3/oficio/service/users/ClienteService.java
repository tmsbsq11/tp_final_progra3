package com.grupo3.oficio.service.users;

import com.grupo3.oficio.model.users.Cliente;
import com.grupo3.oficio.model.users.ClienteEntradaDTO;
import com.grupo3.oficio.model.users.ClienteSalidaDTO;
import com.grupo3.oficio.repository.users.ClienteRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import com.grupo3.oficio.repository.users.UserRepository;
import com.grupo3.oficio.utils.enums.Rol;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class ClienteService {
    private final ClienteRepository clienteRepository;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public ClienteService(ClienteRepository clienteRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.clienteRepository = clienteRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    private ClienteSalidaDTO convertirAClienteSalidaDTO(Cliente cliente) {
        if (cliente == null) return null;

        ClienteSalidaDTO dto = new ClienteSalidaDTO();
        dto.setId(cliente.getId());
        dto.setCorreo(cliente.getCorreo());
        dto.setUsername(cliente.getUsername());
        dto.setIsActive(cliente.getIsActive());
        dto.setNombre(cliente.getNombre());
        dto.setApellido(cliente.getApellido());
        dto.setDni(cliente.getDni());
        dto.setDireccionFoto(cliente.getDireccionFoto());
        dto.setFechaCreacion(cliente.getFechaCreacion());
        dto.setRol(cliente.getRol());
        dto.setPuntaje(cliente.getPuntaje());
        dto.setDescripcion(cliente.getDescripcion());

        return dto;
    }

    private Cliente convertirAClienteEntidad(ClienteEntradaDTO dto) {
        if (dto == null) return null;

        Cliente cliente = new Cliente();
        cliente.setId(dto.getId());
        cliente.setCorreo(dto.getCorreo());
        cliente.setUsername(dto.getUsername());
        cliente.setPassword(dto.getPassword());
        cliente.setIsActive(dto.getIsActive());
        cliente.setNombre(dto.getNombre());
        cliente.setApellido(dto.getApellido());
        cliente.setDni(dto.getDni());
        cliente.setDireccionFoto(dto.getDireccionFoto());
        cliente.setFechaCreacion(dto.getFechaCreacion());
        cliente.setRol(dto.getRol());
        cliente.setPuntaje(dto.getPuntaje());
        cliente.setDescripcion(dto.getDescripcion());

        return cliente;
    }



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
        if (userRepository.findByCorreo(cliente.getCorreo()).isPresent()) {
            throw new IllegalArgumentException("Ya existe un usuario con ese correo");
        }
        if (clienteRepository.existsByUsername(cliente.getUsername())) {
            throw new IllegalArgumentException("Ya existe un cliente con ese username");
        }
        if (clienteRepository.existsByDni(cliente.getDni())) {
            throw new IllegalArgumentException("Ya existe un cliente con ese DNI");
        }

        cliente.setId(null);
        cliente.setFechaCreacion(LocalDateTime.now());
        cliente.setPassword(passwordEncoder.encode(cliente.getPassword())); // para que pueda iniciar sesion
        cliente.setRol(Rol.CLIENTE);
        cliente.setIsActive(true);

        return clienteRepository.save(cliente);
    }

        //read
    public List<Cliente> mostrarTodos(){ return clienteRepository.findAll(); }

    public Cliente buscarPorId(Integer id) {
        return clienteRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("ERROR ClienteService/buscarPorId, NO " + id));
    }
    public Cliente buscarPorEmail(String email) {
        return clienteRepository.findByCorreo(email)
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

        Cliente clienteExistente = clienteRepository.findByCorreo(email)
                .orElseThrow(() -> new EntityNotFoundException(
                        "El cliente con email " + email + " no existe"
                ));

        //actualizar campos
        clienteExistente.setNombre(datos.getNombre());
        clienteExistente.setApellido(datos.getApellido());
        clienteExistente.setUsername(datos.getUsername());
        clienteExistente.setDni(datos.getDni());
        clienteExistente.setDescripcion(datos.getDescripcion());
        //password solo si querés permitir cambio
        if (datos.getPassword() != null && !datos.getPassword().isBlank()) {
            clienteExistente.setPassword(datos.getPassword());
        }

        return clienteRepository.save(clienteExistente);
    }

    // Modificación hecha por el admin. solo toca los campos editables (no reemplaza la entidad)
    public Cliente actualizarDatos(Integer id, Cliente datos) {
        if (datos == null) {
            throw new IllegalArgumentException("El cliente no puede ser nulo");
        }
        if (datos.getCorreo() == null || !datos.getCorreo().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new IllegalArgumentException("El correo no tiene un formato válido");
        }
        if (datos.getNombre() == null || datos.getNombre().isBlank()) {
            throw new IllegalArgumentException("El nombre es obligatorio");
        }
        if (datos.getApellido() == null || datos.getApellido().isBlank()) {
            throw new IllegalArgumentException("El apellido es obligatorio");
        }
        if (datos.getDni() == null || !datos.getDni().matches("\\d{7,8}")) {
            throw new IllegalArgumentException("DNI inválido");
        }
        Cliente existente = clienteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("El cliente con ID " + id + " no existe"));

        // solo controla la repeticion si el dato cambio
        if (!datos.getCorreo().equals(existente.getCorreo())
                && userRepository.findByCorreo(datos.getCorreo()).isPresent()) {
            throw new IllegalArgumentException("Ya existe un usuario con ese correo");
        }
        if (!datos.getDni().equals(existente.getDni()) && clienteRepository.existsByDni(datos.getDni())) {
            throw new IllegalArgumentException("Ya existe un cliente con ese DNI");
        }

        existente.setCorreo(datos.getCorreo());
        existente.setUsername(datos.getCorreo()); // username ya no se usa, queda igual al correo
        existente.setNombre(datos.getNombre());
        existente.setApellido(datos.getApellido());
        existente.setDni(datos.getDni());
        existente.setDescripcion(datos.getDescripcion());
        // la contraseña es opcional, si viene vacía no se cambia
        if (datos.getPassword() != null && !datos.getPassword().isBlank()) {
            if (datos.getPassword().length() < 8) {
                throw new IllegalArgumentException("La contraseña debe tener al menos 8 caracteres");
            }
            existente.setPassword(passwordEncoder.encode(datos.getPassword()));
        }
        return clienteRepository.save(existente);
    }

    // la cuenta queda inactiva y no puede iniciar sesión ni reservar (Es la logica de la baja)
    public void desactivar(Integer id) {
        Cliente cliente = buscarPorId(id);
        cliente.setIsActive(false);
        clienteRepository.save(cliente);
    }

    public void reactivar(Integer id) {
        Cliente cliente = buscarPorId(id);
        cliente.setIsActive(true);
        clienteRepository.save(cliente);
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
