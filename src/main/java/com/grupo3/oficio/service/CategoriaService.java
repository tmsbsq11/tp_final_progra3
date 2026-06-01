package com.grupo3.oficio.service;

import com.grupo3.oficio.model.Categoria;
import com.grupo3.oficio.repository.CategoriaRepository;
import com.grupo3.oficio.utils.exceps.SinNombreException;

import java.util.List;
import java.util.NoSuchElementException;

public class CategoriaService {
    CategoriaRepository categoriaRepo;

    public CategoriaService(CategoriaRepository categoriaRepo) {
        this.categoriaRepo = categoriaRepo;
    }
    //CRUD
    //read
    public List<Categoria> listarCategorias(){
        return categoriaRepo.findAll();
    }
    public Categoria buscarPorId(Integer id){
        return categoriaRepo.findById(id).orElseThrow(()->new NoSuchElementException("No se encontro el id de la categoria"));
    }
    //create
    public Categoria crearCategoria(Categoria categoria){
        categoria.setId(null);
        if(!categoria.getNombre().isBlank()) {
            //settear los booleans?
            return categoriaRepo.save(categoria);
        }
        throw new SinNombreException("Se intento crear una categoria sin nombre");
    }
    //update
    public Categoria actualizarCategoria(Integer id,Categoria categoria){
        categoria.setId(id);
        return categoriaRepo.save(categoria);
    }
    //delete
    public void eliminarCategoria(Integer id){
        Categoria categoria=buscarPorId(id);
        categoriaRepo.delete(categoria);
    }
}
