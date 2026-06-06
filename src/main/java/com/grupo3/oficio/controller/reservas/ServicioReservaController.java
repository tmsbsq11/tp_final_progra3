package com.grupo3.oficio.controller.reservas;

import com.grupo3.oficio.model.reservas.Reserva;
import com.grupo3.oficio.model.reservas.ServicioReservaDTO;
import com.grupo3.oficio.service.reservas.ServicioReservaService;
import com.grupo3.oficio.utils.enums.EstadoReserva;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/servicio_reservas")
@CrossOrigin("*")
public class ServicioReservaController {
    ServicioReservaService servicioReservaService;

    public ServicioReservaController(ServicioReservaService servicioReservaService) {
        this.servicioReservaService = servicioReservaService;
    }

    //los get deben ir de específico a general, sino saltan errores al hacer las requests
    @GetMapping("/estado/{estado}")
    private ResponseEntity<?> mostrarReservasPorEstado(@PathVariable String estado){
        EstadoReserva estadoReserva= EstadoReserva.valueOf(estado.toUpperCase());//Puede tirar IllegalArgumentException
        return ResponseEntity.ok(servicioReservaService.mostrarPorEstado(estadoReserva));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reserva> mostrarReservaPorId(@PathVariable Integer id){
        return ResponseEntity.ok(servicioReservaService.buscarReservaPorId(id));
    }

    @GetMapping
    public ResponseEntity<?> mostrarTodasReservas(){
        if(servicioReservaService.mostrarTodasReservas().isEmpty()){
            return ResponseEntity.ok("La lista de reservas esta vacia");
        }
        return ResponseEntity.ok(servicioReservaService.mostrarTodasReservas());
    }

    @PostMapping
    public ResponseEntity<?> registrarUnaReserva(@RequestBody ServicioReservaDTO servicioReservaDTO){
        return ResponseEntity.of(servicioReservaService.registrarUnaReserva(servicioReservaDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarUnaReserva(@PathVariable Integer id){
        servicioReservaService.eliminarReserva(servicioReservaService.buscarReservaPorId(id));
        return ResponseEntity.ok("La reserva se elimino correctamente");
    }
}
