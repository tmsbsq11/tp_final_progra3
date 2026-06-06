package com.grupo3.oficio.controller;

import com.grupo3.oficio.model.resenias.Resenia;
import com.grupo3.oficio.model.resenias.ReseniaDTO;
import com.grupo3.oficio.service.ReseniaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resenias")
@CrossOrigin("*")
public class ReseniaController {
    ReseniaService reseniaServ;

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

    @PostMapping
    public ResponseEntity<Resenia> crearResenia(@RequestBody ReseniaDTO reseniaDTO){
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
