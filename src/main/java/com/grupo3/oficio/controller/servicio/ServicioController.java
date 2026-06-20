package com.grupo3.oficio.controller.servicio;

import com.grupo3.oficio.model.trabajos.Servicio;
import com.grupo3.oficio.model.trabajos.ServicioDTO;
import com.grupo3.oficio.service.servicio.ServicioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/servicios")
public class ServicioController {

    private final ServicioService servicioService;

    public ServicioController(ServicioService servicioService) {
        this.servicioService = servicioService;
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Servicio>> buscarConFiltros(
            @RequestParam(required = false) Integer idCategoria,
            @RequestParam(required = false) String busqueda,
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lng,
            @RequestParam(required = false) Double radioKm) {
        return ResponseEntity.ok(servicioService.buscarConFiltros(idCategoria, busqueda, lat, lng, radioKm));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Servicio> buscarPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(servicioService.buscarPorId(id));
    }

    @GetMapping
    public ResponseEntity<List<Servicio>> listarTodos() {
        return ResponseEntity.ok(servicioService.listarTodos());
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

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/activar/{id}")
    public ResponseEntity<Void> activarServicio(@PathVariable Integer id) {
        servicioService.activarServicio(id);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/validar/{id}")
    public ResponseEntity<Servicio> validarServicio(@PathVariable Integer id){
        return ResponseEntity.ok(servicioService.validarServicio(id));
    }



    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/invalidar/{id}")
    public ResponseEntity<Servicio> invalidarServicio(@PathVariable Integer id){
        return ResponseEntity.ok(servicioService.invalidarServicio(id));
    }

    @PreAuthorize("hasRole('ADMIN')")//permitir que lo haga el trabajador tmb?
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> desactivarServicio(@PathVariable Integer id) {
        servicioService.desactivarServicio(id);
        return ResponseEntity.noContent().build();
    }
}
