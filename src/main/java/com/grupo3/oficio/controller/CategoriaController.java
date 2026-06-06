package com.grupo3.oficio.controller;

import com.grupo3.oficio.model.Categoria;
import com.grupo3.oficio.service.CategoriaService;
import com.grupo3.oficio.utils.exceps.SinNombreException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/categorias")
@CrossOrigin("*")
public class CategoriaController {
    CategoriaService categoriaServ;

    public CategoriaController(CategoriaService categoriaServ) {
        this.categoriaServ = categoriaServ;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Categoria> mostrarCategoriaPorId(@PathVariable Integer id){
        try {
            return ResponseEntity.ok(categoriaServ.buscarPorId(id));
        }catch (NoSuchElementException e){
            return ResponseEntity.badRequest().build();
        }
    }
    @GetMapping
    public ResponseEntity<List<Categoria>> mostrarCategorias(){
        return ResponseEntity.ok(categoriaServ.listarCategorias());
    }

    @PostMapping
    public ResponseEntity<Categoria> crearCategoria(@RequestBody Categoria categoria){
        return ResponseEntity.ok(categoriaServ.crearCategoria(categoria));
    }
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarCategoria(@RequestBody Categoria categoria,@PathVariable Integer id){
        try {
            return ResponseEntity.ok(categoriaServ.actualizarCategoria(id, categoria));
        }catch (SinNombreException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarCategoria(@PathVariable Integer id){
        categoriaServ.eliminarCategoria(id);
        return ResponseEntity.ok("La categoria se elimino correctamente");
    }
}
