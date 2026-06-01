package com.grupo3.oficio.controller.reservas;

import com.grupo3.oficio.model.reservas.Reserva;
import com.grupo3.oficio.model.reservas.ReservaDTO;
import com.grupo3.oficio.service.reservas.ReservaService;
import com.grupo3.oficio.utils.enums.EstadoReserva;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reservas")
@CrossOrigin("*")
public class ReservaController {
    ReservaService reservaService;

    public ReservaController(ReservaService reservaService) {
        this.reservaService = reservaService;
    }

    //los get deben ir de específico a general, sino saltan errores al hacer las requests
    @GetMapping("/estado/{estado}")
    private ResponseEntity<?> mostrarReservasPorEstado(@PathVariable String estado){
        EstadoReserva estadoReserva= EstadoReserva.valueOf(estado.toUpperCase());
        return ResponseEntity.ok(reservaService.mostrarPorEstado(estadoReserva));
    }
    @GetMapping("/{id}")
    public ResponseEntity<Reserva> mostrarReservaPorId(@PathVariable Integer id){
        return ResponseEntity.ok(reservaService.buscarReservaPorId(id));
    }
    @GetMapping
    public ResponseEntity<?> mostrarTodasReservas(){
        if(reservaService.mostrarTodasReservas().isEmpty()){
            return ResponseEntity.ok("La lista de reservas esta vacia");
        }
        return ResponseEntity.ok(reservaService.mostrarTodasReservas());
    }
    @PostMapping
    public ResponseEntity<?> registrarUnaReserva(@RequestBody ReservaDTO reservaDTO){
        return ResponseEntity.of(reservaService.registrarUnaReserva(reservaDTO));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarUnaReserva(@PathVariable Integer id){
        reservaService.eliminarReserva(reservaService.buscarReservaPorId(id));
        return ResponseEntity.ok("La reserva se elimino correctamente");
    }
}
