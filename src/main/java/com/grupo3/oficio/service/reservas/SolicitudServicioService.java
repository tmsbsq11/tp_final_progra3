package com.grupo3.oficio.service.reservas;

import com.grupo3.oficio.model.reservas.Reserva;
import com.grupo3.oficio.model.reservas.SolicitudServicio;
import com.grupo3.oficio.model.reservas.SolicitudServicioDTO;
import com.grupo3.oficio.model.users.Cliente;
import com.grupo3.oficio.model.users.Trabajador;
import com.grupo3.oficio.repository.reservas.SolicitudServicioRepository;
import com.grupo3.oficio.service.users.ClienteService;
import com.grupo3.oficio.service.users.TrabajadorService;
import com.grupo3.oficio.utils.enums.EstadoReserva;
import com.grupo3.oficio.utils.exceps.FechaReservadaException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class SolicitudServicioService { //SolicitudServiciosService
    SolicitudServicioRepository reservaRepo;
    ClienteService clienteService;
    TrabajadorService trabajadorService;

    public SolicitudServicioService(SolicitudServicioRepository reservaRepo) {
        this.reservaRepo = reservaRepo;
    }
    public List<Reserva> mostrarTodasReservas(){
        return reservaRepo.findAll();
    }
    public List<Reserva> mostrarPorEstado(EstadoReserva estadoReserva){
        return reservaRepo.findAll().stream().filter(reserva -> reserva.getEstadoReserva().equals(estadoReserva)).toList();
    }
    public Reserva buscarReservaPorId(Integer id){
        return reservaRepo.findById(id).orElseThrow(()->new NoSuchElementException("No se encontro la reserva con el id ingresado"));
    }
    public Reserva registrarUnaReserva(SolicitudServicioDTO solicitudServicioDTO){
        SolicitudServicio solicitud = new SolicitudServicio();
        solicitud.setEstadoSolicitud(EstadoReserva.PENDIENTE); //Le asigno automaticamente que la reserva esta pendiente de confirmacion
        reserva.setFechaCreacion(LocalDateTime.now());//Le asigno automaticamente la fecha y hora actual
        Cliente cliente =clienteService.buscarPorId(solicitudServicioDTO.getIdCliente());
        Trabajador trabajador = trabajadorService.buscarPorId(solicitudServicioDTO.getIdTrabajador());
        reserva.setCliente(cliente);
        reserva.setTrabajador(trabajador);
        if(reservaRepo.findByFechaReservadaAndEstadoReserva(reserva.getFechaReservada(),EstadoReserva.APROBADO).isPresent()){
            throw new FechaReservadaException("La fecha en la que se quiso reservar un turno ya esta reservada");
        }
        reserva.setFechaReservada(solicitudServicioDTO.getFechaReservada());
        //falta asignarle el cliente y el trabajador con los repositorios y verificar que no exista una reserva confirmada en la fecha y hora que se le asigno
    return reservaRepo.save(reserva);
    }
    //Puede ser que haya que reemplazar con eliminado inteligente o simplemente cambiar estado a RECHAZADO
    public void eliminarReserva(Reserva reserva){
        buscarReservaPorId(reserva.getId());
        reservaRepo.delete(reserva);
    }
}
