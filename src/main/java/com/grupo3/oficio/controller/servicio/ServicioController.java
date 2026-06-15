package com.grupo3.oficio.controller.servicio;

import com.grupo3.oficio.model.trabajos.Servicio;
import com.grupo3.oficio.model.trabajos.ServicioDTO;
import com.grupo3.oficio.service.servicio.ServicioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/servicios")
public class ServicioController {

    private final ServicioService servicioService;

    public ServicioController(ServicioService servicioService) {
        this.servicioService = servicioService;
    }

    @GetMapping
    public ResponseEntity<List<Servicio>> listarTodos() {
        return ResponseEntity.ok(servicioService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Servicio> buscarPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(servicioService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<Servicio> crearServicio(@RequestBody ServicioDTO dto) {
        Servicio creado = servicioService.crearServicio(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Servicio> editarServicio(@PathVariable Integer id,
                                                   @RequestBody ServicioDTO dto) {
        return ResponseEntity.ok(servicioService.editarServicio(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> desactivarServicio(@PathVariable Integer id) {
        servicioService.desactivarServicio(id);
        return ResponseEntity.noContent().build();
    }
}
