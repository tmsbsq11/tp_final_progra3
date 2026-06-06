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
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class ServicioReservaService {
    ServicioReservaRepository reservaRepo;
    ClienteService clienteService;
    TrabajadorService trabajadorService;

    public ServicioReservaService(ServicioReservaRepository reservaRepo) {
        this.reservaRepo = reservaRepo;
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
                .orElseThrow(()->new NoSuchElementException("ERROR: No se encontro la reserva con el id " + id + " ingresado"));
    }

    public Optional<ServicioReserva> registrarUnaReserva(ServicioReservaDTO servicioReservaDTO){
        Cliente cliente = clienteService.buscarPorId(servicioReservaDTO.getIdCliente());
        Trabajador trabajador = trabajadorService.buscarPorId(servicioReservaDTO.getIdTrabajador());

        LocalDateTime fechaReservada = servicioReservaDTO.getFechaReservada();

        if (reservaRepo.findByFechaReservadaAndEstadoReserva(
                fechaReservada, //HAY QUE VALIDAR SI ESTA DENTRO DE inicio Y fin
                EstadoReserva.APROBADO
        ).isPresent()) {
            throw new FechaReservadaException(
                    "La fecha en la que se quiso reservar un turno ya está reservada"
            );
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
