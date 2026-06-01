package com.grupo3.oficio.controller;

import com.grupo3.oficio.model.Categoria;
import com.grupo3.oficio.service.CategoriaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
@CrossOrigin("*")
public class CategoriaController {
    CategoriaService categoriaServ;

    public CategoriaController(CategoriaService categoriaServ) {
        this.categoriaServ = categoriaServ;
    }
    @GetMapping
    public ResponseEntity<List<Categoria>> mostrarCategorias(){
        return ResponseEntity.ok(categoriaServ.listarCategorias());
    }
    @GetMapping("/{id}")
    public ResponseEntity<Categoria> mostrarCategoriaPorId(@PathVariable Integer id){
        return ResponseEntity.ok(categoriaServ.buscarPorId(id));
    }
    @PostMapping
    public ResponseEntity<Categoria> crearCategoria(@RequestBody Categoria categoria){
        return ResponseEntity.ok(categoriaServ.crearCategoria(categoria));
    }
    @PutMapping("/{id}")
    public ResponseEntity<Categoria> actualizarCategoria(@RequestBody Categoria categoria,@PathVariable Integer id){
        return ResponseEntity.ok(categoriaServ.actualizarCategoria(id,categoria));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarCategoria(@PathVariable Integer id){
        categoriaServ.eliminarCategoria(id);
        return ResponseEntity.ok("La categoria se elimino correctamente");
    }
}
