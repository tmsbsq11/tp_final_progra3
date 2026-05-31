package com.grupo3.oficio.controller.users;

import com.grupo3.oficio.model.users.Trabajador;
import com.grupo3.oficio.service.users.TrabajadorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/trabajadores")
@CrossOrigin("*")
public class TrabajadorController {
    private TrabajadorService trabajadorService;

    public TrabajadorController(TrabajadorService trabajadorService) { this.trabajadorService = trabajadorService; }

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

    @PostMapping
    public ResponseEntity<Trabajador> crear(@RequestBody Trabajador trabajador) {
        try {
            Trabajador nuevo = trabajadorService.crear(trabajador);
            return ResponseEntity.ok(nuevo);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Trabajador> actualizar(@PathVariable Integer id, @RequestBody Trabajador trabajador) {
        try {
            Trabajador actualizado = trabajadorService.actualizar(id, trabajador);
            return ResponseEntity.ok(actualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

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
