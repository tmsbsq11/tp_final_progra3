package com.grupo3.oficio.service;

import com.grupo3.oficio.model.Categoria;
import com.grupo3.oficio.repository.CategoriaRepository;
import com.grupo3.oficio.utils.exceps.SinNombreException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
@Service
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
        if(categoriaRepo.existByNombreIgnoreCase(categoria.getNombre())){
            throw new IllegalArgumentException("No se puede repetir el nombre de una categoria");
        }
        if(categoria.getNombre().isBlank()) {
            throw new SinNombreException("Se intento crear una categoria sin nombre");
        }
        if(categoria.getIsActive()==null){
            throw new IllegalArgumentException("Debe especificar si la categoria esta activa");
        }
        if (categoria.getNeedsCertification()==null){
            throw new IllegalArgumentException("Debe especificar si la categoria necesita ser validada");
        }
        categoria.setId(null);
        return categoriaRepo.save(categoria);

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
