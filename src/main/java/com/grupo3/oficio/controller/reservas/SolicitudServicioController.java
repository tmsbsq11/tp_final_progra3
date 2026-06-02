package com.grupo3.oficio.controller.reservas;

import com.grupo3.oficio.model.reservas.Reserva;
import com.grupo3.oficio.model.reservas.SolicitudServicioDTO;
import com.grupo3.oficio.service.reservas.SolicitudServicioService;
import com.grupo3.oficio.utils.enums.EstadoReserva;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reservas")
@CrossOrigin("*")
public class SolicitudServicioController {
    SolicitudServicioService solicitudServicioService;

    public SolicitudServicioController(SolicitudServicioService solicitudServicioService) {
        this.solicitudServicioService = solicitudServicioService;
    }

    //los get deben ir de específico a general, sino saltan errores al hacer las requests
    @GetMapping("/estado/{estado}")
    private ResponseEntity<?> mostrarReservasPorEstado(@PathVariable String estado){
        EstadoReserva estadoReserva= EstadoReserva.valueOf(estado.toUpperCase());
        return ResponseEntity.ok(solicitudServicioService.mostrarPorEstado(estadoReserva));
    }
    @GetMapping("/{id}")
    public ResponseEntity<Reserva> mostrarReservaPorId(@PathVariable Integer id){ //cambiar objecto a devolver
        return ResponseEntity.ok(solicitudServicioService.buscarReservaPorId(id));
    }
    @GetMapping
    public ResponseEntity<?> mostrarTodasReservas(){
        if(solicitudServicioService.mostrarTodasReservas().isEmpty()){
            return ResponseEntity.ok("La lista de reservas esta vacia");
        }
        return ResponseEntity.ok(solicitudServicioService.mostrarTodasReservas());
    }
    @PostMapping
    public ResponseEntity<?> registrarUnaReserva(@RequestBody SolicitudServicioDTO solicitudServicioDTO){
        return ResponseEntity.ok(solicitudServicioService.registrarUnaReserva(solicitudServicioDTO));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarUnaReserva(@PathVariable Integer id){
        solicitudServicioService.eliminarReserva(solicitudServicioService.buscarReservaPorId(id));
        return ResponseEntity.ok("La reserva se elimino correctamente");
    }
}
