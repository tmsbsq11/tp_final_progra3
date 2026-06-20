package com.grupo3.oficio.controller.reservas;

import com.grupo3.oficio.model.reservas.Reserva;
import com.grupo3.oficio.model.reservas.ServicioReserva;
import com.grupo3.oficio.model.reservas.ServicioReservaDTO;
import com.grupo3.oficio.service.reservas.ServicioReservaService;
import com.grupo3.oficio.utils.enums.EstadoReserva;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/servicio_reservas")
@CrossOrigin("*")
public class ServicioReservaController {
    ServicioReservaService servicioReservaService;

    public ServicioReservaController(ServicioReservaService servicioReservaService) {
        this.servicioReservaService = servicioReservaService;
    }

    //los get deben ir de específico a general, sino saltan errores al hacer las requests
    @PreAuthorize("hasRol('TRABAJADOR')")
    @GetMapping("/recibidas/{estado}")
    public ResponseEntity<List<ServicioReserva>> verReservasRecibidasEstado(@PathVariable String estado, Authentication auth) {
        EstadoReserva estadoReserva = EstadoReserva.valueOf(estado);//tal vez pasar al service que se encargue por si tira exception
        return ResponseEntity.ok(servicioReservaService.mostrarReservasPropiasEstado(estadoReserva, auth.getName()));
    }

    @PreAuthorize("hasRol('TRABAJADOR')")
    @GetMapping("/recibidas")
    public ResponseEntity<List<ServicioReserva>> verReservasRecibidas(Authentication auth) {
        return ResponseEntity.ok(servicioReservaService.mostrarReservasPropias(auth.getName()));
    }

    @PreAuthorize("hasRol('CLIENTE')")
    @GetMapping("/enviadas/{estado}")
    public ResponseEntity<List<ServicioReserva>> verReservasEnviadasEstado(@PathVariable String estado) {
        EstadoReserva estadoReserva = EstadoReserva.valueOf(estado);
        return ResponseEntity.ok(servicioReservaService.mostrarReservasEnviadasEstado(estadoReserva));
    }

    @PreAuthorize("hasRol('CLIENTE')")
    @GetMapping("/enviadas")
    public ResponseEntity<List<ServicioReserva>> verReservasEnviadas() {
        return ResponseEntity.ok(servicioReservaService.mostrarReservasEnviadas());
    }

    @PreAuthorize("hasRol('ADMIN')")
    @GetMapping("/estado/{estado}")
    private ResponseEntity<List<ServicioReserva>> mostrarReservasPorEstado(@PathVariable String estado) {
        EstadoReserva estadoReserva = EstadoReserva.valueOf(estado.toUpperCase());//Puede tirar IllegalArgumentException
        return ResponseEntity.ok(servicioReservaService.mostrarPorEstado(estadoReserva));
    }

    @PreAuthorize("hasRol('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<Reserva> mostrarReservaPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(servicioReservaService.buscarReservaPorId(id));
    }

    @PreAuthorize("hasRol('ADMIN')")
    @GetMapping
    public ResponseEntity<?> mostrarTodasReservas() {
        if (servicioReservaService.mostrarTodasReservas().isEmpty()) {
            return ResponseEntity.ok("La lista de reservas esta vacia");
        }
        return ResponseEntity.ok(servicioReservaService.mostrarTodasReservas());
    }



    @PostMapping
    public ResponseEntity<?> registrarUnaReserva(@RequestBody ServicioReservaDTO servicioReservaDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(servicioReservaService.registrarUnaReserva(servicioReservaDTO));
    }

    @PreAuthorize("hasRol('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarUnaReserva(@PathVariable Integer id) {
        servicioReservaService.eliminarReserva(servicioReservaService.buscarReservaPorId(id));
        return ResponseEntity.ok("La reserva se elimino correctamente");
    }
    @PreAuthorize("hasRol('TRABAJADOR')")
    @PatchMapping("/aceptar/{id}")
    public ResponseEntity<ServicioReserva> aceptarReserva(@PathVariable Integer id){
        return ResponseEntity.ok(servicioReservaService.cambiarReservaEstado(id,EstadoReserva.APROBADO));
    }
    @PreAuthorize("hasRol('TRABAJADOR')")
    @PatchMapping("/rechazar/{id}")
    public ResponseEntity<ServicioReserva> rechazarReserva(@PathVariable Integer id){
        return ResponseEntity.ok(servicioReservaService.cambiarReservaEstado(id,EstadoReserva.RECHAZADO));
    }
}

