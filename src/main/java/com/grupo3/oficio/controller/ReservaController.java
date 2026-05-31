package com.grupo3.oficio.controller;

import com.grupo3.oficio.model.reservas.Reserva;
import com.grupo3.oficio.model.reservas.ReservaDTO;
import com.grupo3.oficio.service.ReservaService;
import com.grupo3.oficio.utils.enums.EstadoReserva;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/reservas")
public class ReservaController {
    ReservaService reservaService;

    public ReservaController(ReservaService reservaService) {
        this.reservaService = reservaService;
    }
    @GetMapping
    public ResponseEntity<?> mostrarTodasReservas(){
        if(reservaService.mostrarTodasReservas().isEmpty()){
            return ResponseEntity.ok("La lista de reservas esta vacia");
        }
        return ResponseEntity.ok(reservaService.mostrarTodasReservas());
    }
    @GetMapping("/{id}")
    public ResponseEntity<Reserva> mostrarReservaPorId(@PathVariable Integer id){
        return ResponseEntity.ok(reservaService.buscarReservaPorId(id).orElseThrow(()->new NoSuchElementException("No se encontro la reserva con el id ingresado")));
    }
    @GetMapping("/estado/{estado}")
    private ResponseEntity<?> mostrarReservasPorEstado(@PathVariable String estado){
        EstadoReserva estadoReserva= EstadoReserva.valueOf(estado.toUpperCase());
        return ResponseEntity.ok(reservaService.mostrarPorEstado(estadoReserva));
    }
    @PostMapping
    public ResponseEntity<?> registrarUnaReserva(@RequestBody ReservaDTO reservaDTO){
        return ResponseEntity.of(reservaService.registrarUnaReserva(reservaDTO));
    }
}
