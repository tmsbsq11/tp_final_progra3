package com.grupo3.oficio.controller.users;

import com.grupo3.oficio.model.users.Trabajador;
import com.grupo3.oficio.model.users.TrabajadorEntradaDTO;
import com.grupo3.oficio.model.users.TrabajadorSalidaDTO;
import com.grupo3.oficio.service.users.TrabajadorService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/trabajadores")
@CrossOrigin("*")
public class TrabajadorController {
    private final TrabajadorService trabajadorService;

    public TrabajadorController(TrabajadorService trabajadorService) { this.trabajadorService = trabajadorService; }


    @GetMapping("/cercanos")
    public ResponseEntity<List<TrabajadorSalidaDTO>> buscarCercanos(
            @RequestParam Double latitud, @RequestParam Double longitud,
            @RequestParam(defaultValue = "10") Double radioKm) {
        return ResponseEntity.ok(trabajadorService.buscarCercanos(latitud, longitud, radioKm));
    }

    @GetMapping("{id}")
    public ResponseEntity<Trabajador> buscarPorId(@PathVariable Integer id) {
        try {
            Trabajador trabajador = trabajadorService.buscarPorId(id);
            return ResponseEntity.ok(trabajador);
        } catch (NoSuchElementException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<Trabajador>> mostrarTodos() {
        try {
            List<Trabajador> lista = trabajadorService.mostrarTodos();
            return ResponseEntity.ok(lista);
        } catch (NoSuchElementException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/perfil")
    public ResponseEntity<Trabajador> miPerfil(Authentication auth) {
        return ResponseEntity.ok(
                trabajadorService.buscarPorEmail(auth.getName())
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<TrabajadorSalidaDTO> crear(@RequestBody TrabajadorEntradaDTO trabajador) {
        TrabajadorSalidaDTO nuevo = trabajadorService.crear(trabajador);
        return ResponseEntity.ok(nuevo);
    }

    //cambiar a put
    @PutMapping("/perfil")
    public ResponseEntity<Trabajador> actualizarPerfil(Authentication auth,@RequestBody Trabajador trabajador) {
        String email = auth.getName(); //manejo de errors con global
        return ResponseEntity.ok(
                trabajadorService.actualizarPerfil(email,trabajador)
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Trabajador> actualizar(@PathVariable Integer id, @RequestBody Trabajador trabajador) {
        try {
            Trabajador actualizado = trabajadorService.actualizar(id, trabajador);
            return ResponseEntity.ok(actualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PreAuthorize("hasRole('TRABAJADOR')")
    @PutMapping("/{id}/ubicacion")
    public ResponseEntity<Trabajador> actualizarUbicacion(Authentication auth, @PathVariable Integer id, @RequestParam String direccion) {
        String email = auth.getName(); //manejo de errors con global
        return ResponseEntity.ok(
            trabajadorService.actualizarUbicacion(id, direccion)
        );
    }


    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> borrar(@PathVariable Integer id) {
        try {
            trabajadorService.borrar(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
