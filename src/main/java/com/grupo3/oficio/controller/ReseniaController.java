package com.grupo3.oficio.controller;

import com.grupo3.oficio.model.resenias.CrearReseniaDTO;
import com.grupo3.oficio.model.resenias.Resenia;
import com.grupo3.oficio.model.resenias.ReseniaDTO;
import com.grupo3.oficio.service.ReseniaService;
import com.grupo3.oficio.service.users.TrabajadorService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resenias")
@CrossOrigin("*")
public class ReseniaController {
    ReseniaService reseniaServ;
    TrabajadorService trabajadorService;

    public ReseniaController(ReseniaService reseniaServ, TrabajadorService trabajadorService) {
        this.reseniaServ = reseniaServ;
        this.trabajadorService = trabajadorService;
    }

    public ReseniaController(ReseniaService reseniaServ) {
        this.reseniaServ = reseniaServ;
    }
    @GetMapping("/{id}")
    public ResponseEntity<Resenia> buscarReseniaPorId(@PathVariable Integer id){
        return ResponseEntity.ok(reseniaServ.buscarPorId(id));
    }
    @GetMapping
    public ResponseEntity<List<Resenia>> listarResenias(){
        return ResponseEntity.ok(reseniaServ.mostrarResenias());
    }
    @GetMapping("/cliente/{id}")
    public ResponseEntity<List<Resenia>> verReseniasACliente(@PathVariable Integer id){
        return ResponseEntity.ok(reseniaServ.mostrarReseniaACliente(id));
    }
    @GetMapping("/trabajador/{id}")
    public ResponseEntity<List<Resenia>> verReseniasATrabajador(@PathVariable Integer id){
        return ResponseEntity.ok(reseniaServ.mostrarReseniaATrabajador(id));
    }
    @GetMapping("/propias")
    public ResponseEntity<List<Resenia>> verReseniasPropias(Authentication auth){
        return ResponseEntity.ok(reseniaServ.mostrarReseniaATrabajador(trabajadorService.buscarPorEmail(auth.getName()).getId()));
    }
    @PostMapping
    public ResponseEntity<Resenia> crearResenia(@RequestBody CrearReseniaDTO reseniaDTO){
        return ResponseEntity.ok(reseniaServ.crearResenia(reseniaDTO));
    }
    @PutMapping("/{id}")
    public ResponseEntity<Resenia> actualizarResenia(@RequestBody ReseniaDTO reseniaDTO,@PathVariable Integer id){
        return ResponseEntity.ok(reseniaServ.actualizarResenia(reseniaDTO,id));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminarResenia(@PathVariable Integer id){
        reseniaServ.eliminarResenia(id);
        return ResponseEntity.ok("La resenia se elimino correctamente");
    }
}
