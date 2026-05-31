package com.grupo3.oficio.service;

import com.grupo3.oficio.model.reservas.Reserva;
import com.grupo3.oficio.model.reservas.ReservaDTO;
import com.grupo3.oficio.repository.ReservaRepository;
import com.grupo3.oficio.utils.enums.EstadoReserva;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ReservaService {
    ReservaRepository reservaRepo;

    public ReservaService(ReservaRepository reservaRepo) {
        this.reservaRepo = reservaRepo;
    }
    public List<Reserva> mostrarTodasReservas(){
        return reservaRepo.findAll();
    }
    public List<Reserva> mostrarPorEstado(EstadoReserva estadoReserva){
        return reservaRepo.findAll().stream().filter(reserva -> reserva.getEstadoReserva().equals(estadoReserva)).toList();
    }
    public Optional<Reserva> buscarReservaPorId(Integer id){
        return reservaRepo.findById(id);
    }
    public Optional<Reserva> registrarUnaReserva(ReservaDTO reservaDTO){
        Reserva reserva = new Reserva();
        reserva.setEstadoReserva(EstadoReserva.PENDIENTE); //Le asigno automaticamente que la reserva esta pendiente de confirmacion
        reserva.setFechaCreacion(LocalDateTime.now());//Le asigno automaticamente la fecha y hora actual
        //falta asignarle el cliente y el trabajador con los repositorios y verificar que no exista una reserva confirmada en la fecha y hora que se le asigno
    return Optional.of(reservaRepo.save(reserva));
    }
    public void eliminarReserva(Reserva reserva){
        reservaRepo.delete(reserva);
    }
}
