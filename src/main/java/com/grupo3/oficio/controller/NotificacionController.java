package com.grupo3.oficio.controller;

import com.grupo3.oficio.model.CrearNotificacionDTO;
import com.grupo3.oficio.model.Notificacion;
import com.grupo3.oficio.model.NotificacionDTO;
import com.grupo3.oficio.service.NotificacionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notificaciones")
@CrossOrigin("*")
public class NotificacionController {
    NotificacionService notificacionService;

    public NotificacionController(NotificacionService notificacionService) {
        this.notificacionService = notificacionService;
    }
    @GetMapping("/{id}")
    ResponseEntity<Notificacion> mostrarNotificacionPorId(@PathVariable Integer id){
        return ResponseEntity.ok(notificacionService.mostrarNotificacionPorId(id));
    }
    @GetMapping
    ResponseEntity<List<Notificacion>> mostrarNotificaciones(){
        return ResponseEntity.ok(notificacionService.mostrarNotificaciones());
    }
    @PostMapping
    ResponseEntity<Notificacion> crearNotificacion(@RequestBody CrearNotificacionDTO crearNotificacionDTO){
        return ResponseEntity.ok(notificacionService.crearNotificacion(crearNotificacionDTO));
    }
    @PutMapping("/{id}")
    ResponseEntity<Notificacion> actualizarNotificacion(@RequestBody NotificacionDTO notificacionDTO,@PathVariable Integer id){
        return ResponseEntity.ok(notificacionService.actualizarNotificacion(notificacionDTO,id));
    }
    @DeleteMapping("/{id}")
    ResponseEntity<String> eliminarNotificacion(@PathVariable Integer id){
        notificacionService.eliminarNotificacion(id);
        return ResponseEntity.ok("La notificacion se elimino correctamente");
    }


}
