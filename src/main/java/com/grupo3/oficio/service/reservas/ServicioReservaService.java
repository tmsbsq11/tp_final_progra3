package com.grupo3.oficio.service.reservas;

import com.grupo3.oficio.model.reservas.Reserva;
import com.grupo3.oficio.model.reservas.ServicioReservaDTO;
import com.grupo3.oficio.model.reservas.ServicioReserva;
import com.grupo3.oficio.model.trabajos.Servicio;
import com.grupo3.oficio.model.users.Cliente;
import com.grupo3.oficio.model.users.Trabajador;
import com.grupo3.oficio.repository.reservas.ServicioReservaRepository;
import com.grupo3.oficio.service.users.ClienteService;
import com.grupo3.oficio.service.users.TrabajadorService;
import com.grupo3.oficio.utils.enums.EstadoReserva;
import com.grupo3.oficio.utils.exceps.FechaReservadaException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class ServicioReservaService {
    @Autowired
    ServicioReservaRepository reservaRepo;
    @Autowired
    ClienteService clienteService;
    @Autowired
    TrabajadorService trabajadorService;

    public ServicioReservaService(ServicioReservaRepository reservaRepo,ClienteService clienteService, TrabajadorService trabajadorService) {
        this.reservaRepo = reservaRepo;
        this.clienteService= clienteService;
        this.trabajadorService=trabajadorService;
    }

    public List<ServicioReserva> mostrarTodasReservas(){
        return reservaRepo.findAll();
    }

    public List<ServicioReserva> mostrarPorEstado(EstadoReserva estadoReserva){
        return reservaRepo.findAll().stream()
                .filter(reserva -> reserva.getEstadoReserva().equals(estadoReserva))
                .toList();
    }

    public ServicioReserva buscarReservaPorId(Integer id){
        return reservaRepo.findById(id)
                .orElseThrow(()->new NoSuchElementException("No se encontró la reserva con el id " + id));
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
        return reservaRepo.save(reserva);
    }

    public Optional<ServicioReserva> registrarUnaReserva(ServicioReservaDTO servicioReservaDTO){
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
        Trabajador trabajador = trabajadorService.buscarPorId(servicioReservaDTO.getIdTrabajador());

        LocalDateTime fechaReservada = servicioReservaDTO.getFechaReservada();

        if (fechaReservada.isBefore(servicioReservaDTO.getFechaInicio()) ||
                fechaReservada.isAfter(servicioReservaDTO.getFechaFin())) {

            throw new IllegalArgumentException(
                    "La fecha reservada debe estar entre inicio y fin"
            );
        }
//        if (reservaRepo.findByFechaReservadaAndEstadoReserva(
//                fechaReservada,
//                EstadoReserva.APROBADO
//        ).isPresent()) {
//            throw new FechaReservadaException(
//                    "La fecha en la que se quiso reservar un turno ya está reservada"
//            );
//        }
        boolean hayConflicto =
                reservaRepo
                        .existsByTrabajadorAndEstadoReservaAndInicioLessThanAndFinGreaterThan(
                                trabajador,
                                EstadoReserva.APROBADO,
                                servicioReservaDTO.getFechaFin(),
                                servicioReservaDTO.getFechaInicio()
                        );
        if (hayConflicto) {
            throw new FechaReservadaException(
                    "El trabajador ya tiene una reserva en ese horario");
        }

        ServicioReserva reserva = new ServicioReserva();
        reserva.setEstadoReserva(EstadoReserva.PENDIENTE);
        reserva.setFechaCreacion(LocalDateTime.now());
        reserva.setFechaReservada(fechaReservada);
        reserva.setCliente(cliente);
        reserva.setTrabajador(trabajador);

        return Optional.of(reservaRepo.save(reserva));
    }

    //Puede ser que haya que reemplazar con eliminado inteligente o simplemente cambiar estado a RECHAZADO
    public void eliminarReserva(ServicioReserva reserva){
        buscarReservaPorId(reserva.getId());
        reservaRepo.delete(reserva);
    }
}
