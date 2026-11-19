package com.grupo3.oficio.controller;

import com.grupo3.oficio.model.CrearNotificacionDTO;
import com.grupo3.oficio.model.Notificacion;
import com.grupo3.oficio.model.NotificacionDTO;
import com.grupo3.oficio.service.NotificacionService;
import com.grupo3.oficio.utils.auth.JwtService;
import com.grupo3.oficio.utils.enums.Rol;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notificaciones")
@CrossOrigin("*")
public class NotificacionController {
    NotificacionService notificacionService;
    JwtService jwtService;

    public NotificacionController(NotificacionService notificacionService,JwtService jwtService) {
        this.notificacionService = notificacionService;
        this.jwtService = jwtService;
    }
    @GetMapping("/{id}")
    ResponseEntity<Notificacion> mostrarNotificacionPorId(@PathVariable Integer id){
        return ResponseEntity.ok(notificacionService.mostrarNotificacionPorId(id));
    }
    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public ResponseEntity<List<Notificacion>> mostrarNotificaciones(
            @RequestHeader("Authorization") String authorization
    ) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Token inválido");
        }
        String token = authorization.substring(7);

        Integer idDestino = jwtService.extraerId(token);
        Rol rol = Rol.valueOf(jwtService.extraerRol(token));

        return ResponseEntity.ok(
                notificacionService.mostrarNotificaciones(idDestino, rol)
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    ResponseEntity<Notificacion> crearNotificacion(@RequestBody CrearNotificacionDTO crearNotificacionDTO){
        return ResponseEntity.ok(notificacionService.crearNotificacion(crearNotificacionDTO));
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    ResponseEntity<Notificacion> actualizarNotificacion(@RequestBody NotificacionDTO notificacionDTO,@PathVariable Integer id){
        return ResponseEntity.ok(notificacionService.actualizarNotificacion(notificacionDTO,id));
    }
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    ResponseEntity<String> eliminarNotificacion(@PathVariable Integer id){
        notificacionService.eliminarNotificacion(id);
        return ResponseEntity.ok("La notificacion se elimino correctamente");
    }


}
