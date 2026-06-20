package com.grupo3.oficio.service.reservas;

import com.grupo3.oficio.model.CrearNotificacionDTO;
import com.grupo3.oficio.model.reservas.ServicioReservaDTO;
import com.grupo3.oficio.model.reservas.ServicioReserva;
import com.grupo3.oficio.model.trabajos.Servicio;
import com.grupo3.oficio.model.users.Cliente;
import com.grupo3.oficio.model.users.Trabajador;
import com.grupo3.oficio.repository.reservas.ServicioReservaRepository;
import com.grupo3.oficio.service.NotificacionService;
import com.grupo3.oficio.service.servicio.ServicioService;
import com.grupo3.oficio.service.users.ClienteService;
import com.grupo3.oficio.service.users.TrabajadorService;
import com.grupo3.oficio.utils.enums.EstadoReserva;
import com.grupo3.oficio.utils.enums.Rol;
import com.grupo3.oficio.utils.enums.TipoNotificacion;
import com.grupo3.oficio.utils.exceps.FechaReservadaException;
import com.grupo3.oficio.utils.exceps.UsuarioInactivoRuntimeException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class ServicioReservaService {

    private final ServicioReservaRepository reservaRepo;
    private final ClienteService clienteService;
    private final TrabajadorService trabajadorService;
    private final NotificacionService notificacionService;
    private final ServicioService servicioService;

    public ServicioReservaService(ServicioReservaRepository reservaRepo, ClienteService clienteService, TrabajadorService trabajadorService, NotificacionService notificacionService, ServicioService servicioService) {
        this.reservaRepo = reservaRepo;
        this.clienteService = clienteService;
        this.trabajadorService = trabajadorService;
        this.notificacionService = notificacionService;
        this.servicioService = servicioService;
    }

    public List<ServicioReserva> mostrarTodasReservas() {
        return reservaRepo.findAll();
    }

    public List<ServicioReserva> mostrarReservasPropias(String correo) {
        return reservaRepo.findByIdTrabajador(trabajadorService.buscarPorEmail(correo).getId());
    }

    public List<ServicioReserva> mostrarReservasEnviadas() {
        String correo = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
        return reservaRepo.findByIdCliente(clienteService.buscarPorEmail(correo).getId());
    }

    public List<ServicioReserva> mostrarPorEstado(EstadoReserva estadoReserva) {
        if (estadoReserva == null) {
            throw new IllegalArgumentException(
                    "El estado es obligatorio");
        }
        return reservaRepo.findAll().stream()
                .filter(reserva -> reserva.getEstadoReserva().equals(estadoReserva))
                .toList();
    }

    public List<ServicioReserva> mostrarReservasPropiasEstado(EstadoReserva estadoReserva, String correo) {
        if (estadoReserva == null) {
            throw new IllegalArgumentException(
                    "El estado es obligatorio");
        }
        return reservaRepo.findByIdTrabajador(trabajadorService.buscarPorEmail(correo).getId()).stream()
                .filter(reserva -> reserva.getEstadoReserva().equals(estadoReserva))
                .toList();
    }
    public List<ServicioReserva> mostrarReservasEnviadasEstado(EstadoReserva estadoReserva){
        String correo = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
        return reservaRepo.findByIdCliente(clienteService.buscarPorEmail(correo).getId()).stream().filter(reserva -> reserva.getEstadoReserva().equals(estadoReserva))
                .toList();
    }
    public ServicioReserva buscarReservaPorId(Integer id) {
        return reservaRepo.findById(id)
                .orElseThrow(() -> new NoSuchElementException("No se encontró la reserva con el id " + id));
    }

    public ServicioReserva cambiarReservaEstado(Integer id, EstadoReserva estadoNuevo) {
        if (id == null) {
            throw new IllegalArgumentException(
                    "El id de la reserva es obligatorio");
        }
        if (estadoNuevo == null) {
            throw new IllegalArgumentException(
                    "El nuevo estado es obligatorio");
        }

        ServicioReserva reserva = reservaRepo.findById(id)
                .orElseThrow(() -> new NoSuchElementException("No se encontró la reserva con id " + id));

        EstadoReserva estadoActual = reserva.getEstadoReserva();

        if (estadoActual == estadoNuevo) {
            throw new IllegalArgumentException(
                    "La reserva ya posee el estado " + estadoNuevo);
        }
        if (!reserva.getEstadoReserva().puedeCambiarA(estadoNuevo)) {
            throw new IllegalStateException(
                    "No se puede cambiar una reserva de "
                            + reserva.getEstadoReserva()
                            + " a "
                            + estadoNuevo);
        }

        reserva.setEstadoReserva(estadoNuevo);
        notificacionService.crearNotificacion(
                new CrearNotificacionDTO(
                        "CAMBIO DE ESTADO DE RESERVA",
                        "Tu reserva cambio al estado: " + reserva.getEstadoReserva(),
                        TipoNotificacion.RESERVA,
                        reserva.getCliente().getId(),
                        Rol.CLIENTE
                )
        );
        return reservaRepo.save(reserva);
    }

    public ServicioReservaDTO registrarUnaReserva(ServicioReservaDTO servicioReservaDTO) {
        //validaciones
        if (servicioReservaDTO == null) {
            throw new IllegalArgumentException("La reserva no puede ser nula");
        }
        if (servicioReservaDTO.getIdCliente() == null) {
            throw new IllegalArgumentException("El cliente es obligatorio");
        }
        if (servicioReservaDTO.getIdTrabajador() == null) {
            throw new IllegalArgumentException("El trabajador es obligatorio");
        }
        if (servicioReservaDTO.getFechaReservada() == null) {
            throw new IllegalArgumentException("La fecha reservada es obligatoria");
        }
        if (servicioReservaDTO.getFechaReservada().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException(
                    "No se puede reservar una fecha pasada"
            );
        }
        if (servicioReservaDTO.getFechaInicio() == null ||
                servicioReservaDTO.getFechaFin() == null) {

            throw new IllegalArgumentException(
                    "Debe indicar fecha de inicio y fin"
            );
        }
        if (!servicioReservaDTO.getFechaInicio()
                .isBefore(servicioReservaDTO.getFechaFin())) {

            throw new IllegalArgumentException(
                    "La fecha de inicio debe ser anterior a la fecha de fin"
            );
        }
        Cliente cliente = clienteService.buscarPorId(servicioReservaDTO.getIdCliente());

        if (reservaRepo.existsByClienteAndInicioLessThanAndFinGreaterThan(
                cliente,
                servicioReservaDTO.getFechaFin(),
                servicioReservaDTO.getFechaInicio())) {

            throw new IllegalArgumentException(
                    "Un cliente solo puede crear una reserva por franja horaria");
        }
        if (!cliente.getIsActive()) {
            throw new UsuarioInactivoRuntimeException("El cliente debe estar activo para realizar una reserva");
        }
        Trabajador trabajador = trabajadorService.buscarPorId(servicioReservaDTO.getIdTrabajador());
        if (!trabajador.getIsActive()) {
            throw new UsuarioInactivoRuntimeException("El trabajador debe estar activo para realizar una reserva");
        }
//        if (reservaRepo.existsByTrabajadorAndInicioLessThanAndFinGreaterThan(
//                trabajador,
//                servicioReservaDTO.getFechaFin(),
//                servicioReservaDTO.getFechaInicio())) {
//
//            throw new IllegalArgumentException(
//                    "Un trabajador solo puede recibir una reserva por franja horaria");
//        }
        Servicio servicio = servicioService.buscarPorId(servicioReservaDTO.getIdServicio());
        if (!servicio.getIsActive()) {
            throw new IllegalArgumentException("Servicio Inactivo"); //cambiar por excepc personalizada
        }

        LocalDateTime fechaReservada = servicioReservaDTO.getFechaReservada();

        if (fechaReservada.isBefore(servicioReservaDTO.getFechaInicio()) ||
                fechaReservada.isAfter(servicioReservaDTO.getFechaFin())) {

            throw new IllegalArgumentException(
                    "La fecha reservada debe estar entre inicio y fin"
            );
        }

        boolean hayConflicto =
                reservaRepo
                        .existsByTrabajadorAndEstadoReservaAndInicioLessThanAndFinGreaterThan(
                                trabajador,
                                EstadoReserva.APROBADO,
                                servicioReservaDTO.getFechaFin().plusMinutes(trabajador.getMinutosMinimoEntreReservas()),
                                servicioReservaDTO.getFechaInicio().minusMinutes(trabajador.getMinutosMinimoEntreReservas())
                        );
        if (hayConflicto) {
            throw new FechaReservadaException(
                    "El trabajador ya tiene una reserva en ese horario");
        }

        ServicioReserva reserva = new ServicioReserva();
        reserva.setEstadoReserva(EstadoReserva.PENDIENTE);
        servicioReservaDTO.setEstadoReserva(EstadoReserva.PENDIENTE);
        reserva.setFechaCreacion(LocalDateTime.now());
        servicioReservaDTO.setFechaCreacion(LocalDateTime.now());
        reserva.setFechaReservada(fechaReservada);
        reserva.setCliente(cliente);
        reserva.setTrabajador(trabajador);
        reserva.setInicio(servicioReservaDTO.getFechaInicio());
        reserva.setFin(servicioReservaDTO.getFechaFin());
        reserva.setServicio(servicio);
        ServicioReserva reservaGuardada = reservaRepo.save(reserva);
        notificacionService.crearNotificacion(
                new CrearNotificacionDTO(
                        "Nueva reserva",
                        "Has recibido una nueva reserva",
                        TipoNotificacion.RESERVA,
                        trabajador.getId(),
                        Rol.TRABAJADOR)
        );
        servicioReservaDTO.setId(reservaGuardada.getId()); // luego del save para poder obtener el id autogenerado
        return servicioReservaDTO;
    }

    //Puede ser que haya que reemplazar con eliminado inteligente o simplemente cambiar estado a RECHAZADO
    public void eliminarReserva(ServicioReserva reserva) {
        buscarReservaPorId(reserva.getId());
        reservaRepo.delete(reserva);
    }
}
