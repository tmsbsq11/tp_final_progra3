package com.grupo3.oficio.service.servicio;

import com.grupo3.oficio.model.Categoria;
import com.grupo3.oficio.model.CrearNotificacionDTO;
import com.grupo3.oficio.model.trabajos.Servicio;
import com.grupo3.oficio.model.trabajos.ServicioDTO;
import com.grupo3.oficio.model.users.Trabajador;
import com.grupo3.oficio.repository.servicio.ServicioRepository;
import com.grupo3.oficio.service.CategoriaService;
import com.grupo3.oficio.service.NotificacionService;
import com.grupo3.oficio.service.users.TrabajadorService;
import com.grupo3.oficio.utils.enums.Rol;
import com.grupo3.oficio.utils.enums.TipoNotificacion;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class ServicioService {
    private final CategoriaService categoriaService;
    private final TrabajadorService trabajadorService;
    private final ServicioRepository servicioRepository;
    private final NotificacionService notificacionService;

    public ServicioService(ServicioRepository servicioRepository, CategoriaService categoriaService, TrabajadorService trabajadorService, NotificacionService notificacionService) {
        this.servicioRepository = servicioRepository;
        this.categoriaService = categoriaService;
        this.trabajadorService = trabajadorService;
        this.notificacionService = notificacionService;
    }

    public List<Servicio> listarTodos() {
        return servicioRepository.findAll();
    }

    public Servicio buscarPorId(Integer id) {
        if (id == null) {
            throw new IllegalArgumentException("El id del servicio es obligatorio");
        }
        return servicioRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("No se encontró el servicio con id " + id));
    }

    public Servicio crearServicio(ServicioDTO dto) {
        if (dto == null) {
            throw new IllegalArgumentException("El servicio no puede ser nulo");
        }
        if (dto.getTitulo() == null || dto.getTitulo().isBlank()) {
            throw new IllegalArgumentException("El título es obligatorio");
        }
        if (dto.getPrecioEstimadoPorHora() == null || dto.getPrecioEstimadoPorHora() <= 0) {
            throw new IllegalArgumentException("El precio estimado por hora debe ser mayor a 0");
        }
        if (dto.getMinTiempo() == null || dto.getMinTiempo() <= 0) {
            throw new IllegalArgumentException("El tiempo mínimo debe ser mayor a 0");
        }

        Categoria categoria = categoriaService.buscarPorId(dto.getIdCategoria());
        Trabajador trabajador = trabajadorService.buscarPorId(dto.getIdTrabajador());

        Servicio servicio = new Servicio();
        servicio.setTitulo(dto.getTitulo());
        servicio.setDescripcion(dto.getDescripcion());
        servicio.setCategoria(categoria);
        servicio.setTrabajador(trabajador);
        servicio.setPrecioEstimadoPorHora(dto.getPrecioEstimadoPorHora());
        servicio.setMinTiempo(dto.getMinTiempo());
        servicio.setIsActive(true);
        servicio.setIsApproved(!Boolean.TRUE.equals(categoria.getNeedsCertification()));

        return servicioRepository.save(servicio);
    }

    public Servicio editarServicio(Integer id, ServicioDTO dto) {
        if (dto == null) {
            throw new IllegalArgumentException("Los datos del servicio no pueden ser nulos");
        }
        if (dto.getTitulo() == null || dto.getTitulo().isBlank()) {
            throw new IllegalArgumentException("El título es obligatorio");
        }
        if (dto.getPrecioEstimadoPorHora() == null || dto.getPrecioEstimadoPorHora() <= 0) {
            throw new IllegalArgumentException("El precio estimado por hora debe ser mayor a 0");
        }
        if (dto.getMinTiempo() == null || dto.getMinTiempo() <= 0) {
            throw new IllegalArgumentException("El tiempo mínimo debe ser mayor a 0");
        }

        Categoria categoria = categoriaService.buscarPorId(dto.getIdCategoria());
        Trabajador trabajador = trabajadorService.buscarPorId(dto.getIdTrabajador());

        Servicio servicio = buscarPorId(id);
        servicio.setTitulo(dto.getTitulo());
        servicio.setDescripcion(dto.getDescripcion());
        servicio.setCategoria(categoria);
        servicio.setTrabajador(trabajador);
        servicio.setPrecioEstimadoPorHora(dto.getPrecioEstimadoPorHora());
        servicio.setMinTiempo(dto.getMinTiempo());

        return servicioRepository.save(servicio);
    }


    public void desactivarServicio(Integer id) {
        Servicio servicio = buscarPorId(id);
        if (Boolean.FALSE.equals(servicio.getIsActive())) {
            throw new IllegalStateException("El servicio ya se encuentra desactivado");
        }
        servicio.setIsActive(false);
        servicioRepository.save(servicio);
    }

    public void activarServicio(Integer id) {
        Servicio servicio = buscarPorId(id);
        if (Boolean.TRUE.equals(servicio.getIsActive())) {
            throw new IllegalStateException("El servicio ya se encuentra activo");
        }
        servicio.setIsActive(true);
        servicioRepository.save(servicio);
    }
    public Servicio validarServicio(Integer id){
        Servicio servicio = buscarPorId(id);
        if(Boolean.TRUE.equals(servicio.getIsApproved())){
            throw new IllegalStateException("El servicio ya se encuentra aprobado");
        }
        if(Boolean.FALSE.equals(servicio.getCategoria().getNeedsCertification())){
            throw new IllegalStateException("Los sevicios de este tipo no necesitan aprobacion");
        }
        servicio.setIsApproved(true);
        notificacionService.crearNotificacion(
                new CrearNotificacionDTO(
                        "Servicio aprobado",
                        "Tu servicio \"" + servicio.getTitulo() + "\" fue aprobado",
                        TipoNotificacion.VALIDACION,
                        servicio.getTrabajador().getId(),
                        Rol.TRABAJADOR
                )
        );
        return servicioRepository.save(servicio);
    }
    public Servicio invalidarServicio(Integer id){
        Servicio servicio = buscarPorId(id);
        if(Boolean.FALSE.equals(servicio.getIsApproved())){
            throw new IllegalStateException("El servicio ya se encuentra desaprobado");
        }
        if(Boolean.FALSE.equals(servicio.getCategoria().getNeedsCertification())){
            throw new IllegalStateException("Los sevicios de este tipo no necesitan aprobacion");
        }
        servicio.setIsApproved(false);
        notificacionService.crearNotificacion(
                new CrearNotificacionDTO(
                        "Servicio aprobado",
                        "Tu servicio \"" + servicio.getTitulo() + "\" fue desabilitado",
                        TipoNotificacion.VALIDACION,
                        servicio.getTrabajador().getId(),
                        Rol.TRABAJADOR
                )
        );
        return servicioRepository.save(servicio);
    }
}
