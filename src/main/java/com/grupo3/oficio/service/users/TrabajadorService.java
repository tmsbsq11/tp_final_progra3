package com.grupo3.oficio.service.users;

import com.grupo3.oficio.model.users.Trabajador;
import com.grupo3.oficio.model.users.TrabajadorEntradaDTO;
import com.grupo3.oficio.model.users.TrabajadorSalidaDTO;
import com.grupo3.oficio.repository.users.TrabajadorRepository;
import com.grupo3.oficio.utils.geo.GeocodingService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class TrabajadorService {
    private final TrabajadorRepository trabajadorRepository;

    @Autowired
    private GeocodingService geocodingService;

    public TrabajadorService(TrabajadorRepository trabajadorRepository) { this.trabajadorRepository = trabajadorRepository; }

    private TrabajadorSalidaDTO convertirATrabajadorSalidaDTO(Trabajador trabajador) {
        if (trabajador == null) return null;

        TrabajadorSalidaDTO dto = new TrabajadorSalidaDTO();
        dto.setId(trabajador.getId());
        dto.setCorreo(trabajador.getCorreo());
        dto.setUsername(trabajador.getUsername());
        dto.setIsActive(trabajador.getIsActive());
        dto.setNombre(trabajador.getNombre());
        dto.setApellido(trabajador.getApellido());
        dto.setDni(trabajador.getDni());
        dto.setDireccionFoto(trabajador.getDireccionFoto());
        dto.setFechaCreacion(trabajador.getFechaCreacion());
        dto.setRol(trabajador.getRol());
        dto.setPuntaje(trabajador.getPuntaje());
        dto.setDescripcion(trabajador.getDescripcion());
        dto.setMinutosMinimoEntreReservas(trabajador.getMinutosMinimoEntreReservas());
        dto.setLatitud(trabajador.getLatitud());
        dto.setLongitud(trabajador.getLongitud());

        return dto;
    }

    private Trabajador convertirATrabajadorEntidad(TrabajadorEntradaDTO dto) {
        if (dto == null) return null;

        Trabajador trabajador = new Trabajador();
        trabajador.setId(dto.getId());
        trabajador.setCorreo(dto.getCorreo());
        trabajador.setUsername(dto.getUsername());
        trabajador.setPassword(dto.getPassword()); // Importante para el registro/login
        trabajador.setIsActive(dto.getIsActive());
        trabajador.setNombre(dto.getNombre());
        trabajador.setApellido(dto.getApellido());
        trabajador.setDni(dto.getDni());
        trabajador.setDireccionFoto(dto.getDireccionFoto());
        trabajador.setFechaCreacion(dto.getFechaCreacion());
        trabajador.setRol(dto.getRol());
        trabajador.setPuntaje(dto.getPuntaje());
        trabajador.setDescripcion(dto.getDescripcion());
        trabajador.setMinutosMinimoEntreReservas(dto.getMinutosMinimoEntreReservas());
        trabajador.setLatitud(dto.getLatitud());
        trabajador.setLongitud(dto.getLongitud());

        return trabajador;
    }

    //CRUD
        //create
    public TrabajadorSalidaDTO crear(TrabajadorEntradaDTO dto) {
        //validaciones
        if (dto == null) {
            throw new IllegalArgumentException("El trabajador no puede ser nulo");
        }
            //credenciales
        if (dto.getCorreo() == null || dto.getCorreo().isBlank()) {
            throw new IllegalArgumentException("El correo es obligatorio");
        }
        if (!dto.getCorreo().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new IllegalArgumentException("El correo no tiene un formato válido");
        }
        if (dto.getUsername() == null || dto.getUsername().isBlank()) {
            throw new IllegalArgumentException("El username es obligatorio");
        }
        if (dto.getPassword() == null || dto.getPassword().length() < 8) {
            throw new IllegalArgumentException("La contraseña debe tener al menos 8 caracteres");
        }
        if (dto.getNombre() == null || dto.getNombre().isBlank()) {
            throw new IllegalArgumentException("El nombre es obligatorio");
        }
        if (dto.getApellido() == null || dto.getApellido().isBlank()) {
            throw new IllegalArgumentException("El apellido es obligatorio");
        }
        if (dto.getDni() == null || dto.getDni().isBlank()) {
            throw new IllegalArgumentException("El DNI es obligatorio");
        }
        if (!dto.getDni().matches("\\d{7,8}")) {
            throw new IllegalArgumentException("El DNI debe tener 7 u 8 dígitos");
        }
        if (dto.getMinutosMinimoEntreReservas() == null ) {
            throw new IllegalArgumentException("El minimo de tiempo entre reservas es obligatorio");
        }
        if (trabajadorRepository.existsByCorreo(dto.getCorreo())) {
            throw new IllegalArgumentException("Ya existe un usuario con ese correo");
        }
        if (trabajadorRepository.existsByUsername(dto.getUsername())) {
            throw new IllegalArgumentException("Ya existe un usuario con ese username");
        }
        if (trabajadorRepository.existsByDni(dto.getDni())) {
            throw new IllegalArgumentException("Ya existe un usuario con ese DNI");
        }

        Trabajador trabajador= this.convertirATrabajadorEntidad(dto);
        trabajador.setId(null);
        trabajador.setFechaCreacion(LocalDateTime.now());
        trabajador.setIsActive(true);
        trabajadorRepository.save(trabajador);
        return this.convertirATrabajadorSalidaDTO(trabajador);
    }

    //read
    public List<Trabajador> mostrarTodos(){ return trabajadorRepository.findAll(); }

    public Trabajador buscarPorId(Integer id) {
        return trabajadorRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("ERROR TrabajadorService/buscarPorId, NO " + id));
    }
    public Trabajador buscarPorEmail(String email) {
        return trabajadorRepository.findByCorreo(email)
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

        Trabajador trabajadorExistente = trabajadorRepository.findByCorreo(email)
                .orElseThrow(() -> new EntityNotFoundException(
                        "El cliente con email " + email + " no existe"
                ));

        //actualizar campos
        trabajadorExistente.setNombre(datos.getNombre());
        trabajadorExistente.setApellido(datos.getApellido());
        trabajadorExistente.setUsername(datos.getUsername());
        trabajadorExistente.setDni(datos.getDni());
        trabajadorExistente.setMinutosMinimoEntreReservas(datos.getMinutosMinimoEntreReservas());
            //COMPLETAR

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

    //METODOS GEOCODING
    public Trabajador actualizarUbicacion(Integer id, String direccion) {
        Trabajador trabajador = buscarPorId(id);
        double[] coords = geocodingService.obtenerCoordenadas(direccion);
        trabajador.setLatitud(coords[0]);
        trabajador.setLongitud(coords[1]);
        return trabajadorRepository.save(trabajador);
    }

    public List<TrabajadorSalidaDTO> buscarCercanos(Double latCliente, Double lonCliente, Double radioKm) {
        return trabajadorRepository.findAll().stream()
                .filter(t -> t.getLatitud() != null && t.getLongitud() != null)
                .filter(t -> calcularDistancia(latCliente, lonCliente,
                        t.getLatitud(), t.getLongitud()) <= radioKm)
                .map(this::convertirATrabajadorSalidaDTO)
                .toList();
    }

    private Double calcularDistancia(Double lat1, Double lon1, Double lat2, Double lon2) {
        final int R = 6321;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat/2) * Math.sin(dLat/2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon/2) * Math.sin(dLon/2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    }
}
